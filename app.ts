import { Client } from "./Structures/Client";

import dotenvFlow from "dotenv-flow";
dotenvFlow.config();

await import("./Checks/Run");

const client = new Client();

client.start();
