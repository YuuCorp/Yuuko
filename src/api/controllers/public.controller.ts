import path from "node:path";
import fs from "node:fs";
import { Elysia, t } from "elysia";

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
