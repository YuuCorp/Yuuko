/**
 * Local-only helper to link an AniList account to a Discord ID without going
 * through the auth.yuuko.dev OAuth flow.
 *
 * Usage:
 *   bun local:link <discordId>
 *
 * Requires the following in .env.local (register a personal AniList client at
 * https://anilist.co/settings/developer with a localhost redirect URL):
 *   ANILIST_CLIENT_ID
 *   ANILIST_CLIENT_SECRET
 *   ANILIST_REDIRECT_URI   (must match the URL registered with AniList exactly)
 *
 * The script spins up a tiny HTTP server at the redirect URI, opens your
 * browser to AniList's authorize page, waits for the callback, exchanges the
 * code for a token, validates it, RSA-encrypts it, and writes the row to the
 * local SQLite db.
 */

import { spawn } from "node:child_process";
import dotenvFlow from "dotenv-flow";
import { eq } from "drizzle-orm";
import { db } from "#database/db";
import { anilistUser } from "#database/models";
import { RSA } from "#utils/rsaEncryption";
import { graphQLRequest } from "#utils/graphQLRequest";

dotenvFlow.config({ silent: true });

const [, , discordId] = process.argv;
if (!discordId) {
  console.error("Usage: bun local:link <discordId>");
  process.exit(1);
}

const clientId = process.env.ANILIST_CLIENT_ID;
const clientSecret = process.env.ANILIST_CLIENT_SECRET;
const redirectUri = process.env.ANILIST_REDIRECT_URI;
if (!clientId || !clientSecret || !redirectUri) {
  console.error("Missing ANILIST_CLIENT_ID / ANILIST_CLIENT_SECRET / ANILIST_REDIRECT_URI in .env.local");
  process.exit(1);
}

const redirectUrl = new URL(redirectUri);
const port = Number(redirectUrl.port || (redirectUrl.protocol === "https:" ? 443 : 80));
const callbackPath = redirectUrl.pathname || "/";

const state = crypto.randomUUID();
const authorizeUrl =
  `https://anilist.co/api/v2/oauth/authorize?client_id=${encodeURIComponent(clientId)}` +
  `&redirect_uri=${encodeURIComponent(redirectUri)}` +
  `&response_type=code&state=${state}`;

// Wait for AniList to redirect back, then resolve with the auth code.
const code = await new Promise<string>((resolve, reject) => {
  const server = Bun.serve({
    port,
    hostname: redirectUrl.hostname,
    fetch(req) {
      const url = new URL(req.url);
      if (url.pathname !== callbackPath) {
        return new Response("Not found", { status: 404 });
      }

      const returnedState = url.searchParams.get("state");
      const returnedCode = url.searchParams.get("code");
      const error = url.searchParams.get("error");

      if (error) {
        reject(new Error(`AniList returned error: ${error}`));
        return new Response(`Error: ${error}. You can close this tab.`, { status: 400 });
      }
      if (returnedState !== state) {
        reject(new Error("State mismatch — possible CSRF, aborting"));
        return new Response("State mismatch", { status: 400 });
      }
      if (!returnedCode) {
        reject(new Error("No code in callback"));
        return new Response("Missing code", { status: 400 });
      }

      // Resolve after the response is sent so the server isn't torn down mid-write.
      queueMicrotask(() => {
        resolve(returnedCode);
        server.stop();
      });
      return new Response("Linked! You can close this tab.", { status: 200 });
    },
  });

  console.log(`Listening on ${redirectUri}`);
  console.log(`Opening browser to AniList authorize page...`);
  console.log(`If it doesn't open, visit:\n  ${authorizeUrl}\n`);

  // Best-effort browser open.
  const opener = process.platform === "darwin" ? "open" : process.platform === "win32" ? "start" : "xdg-open";
  spawn(opener, [authorizeUrl], { detached: true, stdio: "ignore" }).unref();
});

// Exchange the code for an access token.
const tokenRes = await fetch("https://anilist.co/api/v2/oauth/token", {
  method: "POST",
  headers: { "Content-Type": "application/json", Accept: "application/json" },
  body: JSON.stringify({
    grant_type: "authorization_code",
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUri,
    code,
  }),
});

if (!tokenRes.ok) {
  console.error(`Token exchange failed: ${tokenRes.status} ${await tokenRes.text()}`);
  process.exit(1);
}

const { access_token: token } = (await tokenRes.json()) as { access_token: string };
if (!token) {
  console.error("No access_token in AniList's response");
  process.exit(1);
}

await RSA.loadKeys();
const rsa = new RSA();

// Sanity-check by hitting Viewer (mirrors what /api/v1/public/register does).
const { data } = await graphQLRequest("Viewer", {}, token);
if (!data?.Viewer) {
  console.error("Token rejected by AniList Viewer query");
  process.exit(1);
}

const { id: anilistId, name } = data.Viewer;
const encryptedToken = await rsa.encrypt(token);

const existing = (await db.select().from(anilistUser).where(eq(anilistUser.discordId, discordId)).limit(1))[0];
if (existing) {
  await db
    .update(anilistUser)
    .set({ anilistToken: encryptedToken, anilistId })
    .where(eq(anilistUser.discordId, discordId));
  console.log(`Updated link: discord ${discordId} ↔ anilist ${name} (${anilistId})`);
} else {
  await db.insert(anilistUser).values({ discordId, anilistToken: encryptedToken, anilistId });
  console.log(`Linked: discord ${discordId} ↔ anilist ${name} (${anilistId})`);
}

process.exit(0);
