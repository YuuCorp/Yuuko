import path from "node:path";
import fs from "node:fs";
import { Elysia, t } from "elysia";
import { rsaEncryption } from "#utils/rsaEncryption";
import { graphQLRequest } from "#utils/graphQLRequest";
import { db } from "#database/db";
import { anilistUser } from "#database/models";
import { eq } from "drizzle-orm";

const srcFolder = path.join(import.meta.dir, "..", "..");

export const publicController = new Elysia({
    prefix: "/public",
    name: "api:public",
})
    .get(
        "/rsa",
        async ({ set }) => {
            set.headers["content-type"] = "text/plain";
            set.status = 200;
            return fs.readFileSync(path.join(srcFolder, "RSA", "id_rsa.pub"), "utf-8");
        },
        { response: t.String(), }
    )
    .post(
        "/register",
        async ({ body, set, headers }) => {
            set.status = 400;
            const discordId = headers.authorization;
            const encryptedToken = body.token;
            if (encryptedToken.length < 1000) return { message: "Invalid token" };
            const decryptedToken = await rsaEncryption(encryptedToken, false);
            const { Viewer: data } = (await graphQLRequest("Viewer", {}, decryptedToken)).data;
            if (!data) return { message: "Invalid token" };
            const existingUser = (await db.select().from(anilistUser).where(eq(anilistUser.discordId, discordId)).limit(1))[0];
            if (existingUser) return { message: "User already registered" };
            await db.insert(anilistUser).values({ discordId, anilistToken: encryptedToken, anilistId: data.id });

            console.log(`Registered ${discordId} as ${data.name}`);
            set.status = 201;
            return { message: `Registered as ${data.name}!` };
        },
        {
            response: t.Object({ message: t.String() }),
            body: t.Object({ token: t.String() }),
            headers: t.Object({ authorization: t.String() })
        }
    )
