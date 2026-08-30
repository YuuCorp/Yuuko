import fs from "node:fs";
import { Elysia, t } from "elysia";
import { RSA } from "#utils/rsaEncryption";
import { graphQLRequest } from "#utils/graphQLRequest";
import { srcPath } from "#utils/paths";
import { db } from "#database/db";
import { aniListUser } from "#database/models";
import { eq } from "drizzle-orm";
import { logger } from "#src/utils/logger";

export const publicController = new Elysia({
    prefix: "/public",
    name: "api:public",
})
    .get(
        "/rsa",
        async ({ set }) => {
            set.headers["content-type"] = "text/plain";
            set.status = 200;
            return fs.readFileSync(srcPath("RSA", "id_rsa.pub"), "utf-8");
        },
        {
            response: { 200: t.String({ description: "PEM-encoded public key string" }) }, detail: {
                summary: "Get Public RSA Key",
                description: "Retrieves the public RSA key used for client-side token encryption.",
                tags: ["Public"]
            }
        }
    )
    .post(
        "/register",
        async ({ body, set, headers }) => {
            const discordId = headers.authorization;
            const encryptedToken = body.token;

            if (encryptedToken.length < 1000) {
                set.status = 400;
                return { message: "Invalid token" }
            };

            const rsa = new RSA();
            const decryptedToken = await rsa.decrypt(encryptedToken);
            const { Viewer: data } = (await graphQLRequest("Viewer", {}, decryptedToken)).data;

            if (!data) {
                set.status = 400;
                return { message: "Invalid token" };
            }

            const existingUser = (await db.select().from(aniListUser).where(eq(aniListUser.discordId, discordId)).limit(1))[0];
            if (existingUser) return { message: "User already registered" };
            await db.insert(aniListUser).values({ discordId, aniListToken: encryptedToken, aniListId: data.id });

            logger.debug(`Registered ${discordId} as ${data.name}`);
            set.status = 201;
            return { message: `Registered as ${data.name}!` };
        },
        {
            body: t.Object({ token: t.String({ description: "RSA-encrypted AniList JWT" }) }),
            headers: t.Object({ authorization: t.String({ description: "Discord User ID" }) }),
            detail: {
                summary: "Register AniList Account",
                description: "Decrypts the provided AniList token, checks registration status, and creates a user entry linked to the discord user ID.",
                tags: ["Public"]
            },
            response: {
                201: t.Object({ message: t.String() }),
                400: t.Object({ message: t.String() }),
            },
        }
    )
