import type { Client } from "#Structures/index.js";
import { Elysia } from "elysia";
import { api } from "./controllers/*";

export async function start_API (client: Client) {
    const port = process.env.PORT!;
    
    new Elysia()
    .use(api)
    .listen(port);
    
    client.log(`API is open on port ${port}`)
}