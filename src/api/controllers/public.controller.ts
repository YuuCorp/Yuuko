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
            const discordId = body.discordId;
            const encryptedToken = headers.Authorization;
            if (encryptedToken.length < 1000) throw new Error("Invalid token");
            const decryptedToken = await rsaEncryption(encryptedToken, false);
            const { Viewer: data } = (await graphQLRequest("Viewer", {}, decryptedToken)).data;
            if (!data) throw new Error("Invalid token");
            console.log(data);
            const existingUser = (await db.select().from(anilistUser).where(eq(anilistUser.discordId, discordId)).limit(1))[0];
            if (existingUser) throw new Error("User already registered");
            await db.insert(anilistUser).values({ discordId, anilistToken: encryptedToken, anilistId: data.id });

            set.status = 201;
            return { message: `Registered as ${data.name}!` };
        },
        {
            response: t.Object({ message: t.String() }),
            body: t.Object({ discordId: t.String() }),
            headers: t.Object({ Authorization: t.String() })
        }
    )
