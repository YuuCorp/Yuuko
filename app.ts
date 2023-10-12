require("dotenv-flow").config();
require("./Checks/Run.ts");

import { Client } from "./Structures/Client";
const client = new Client();

client.start();
