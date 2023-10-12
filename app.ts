require("dotenv-flow").config();
require("../Checks/Run.js");

import { Client } from "./Structures/Client";
const client = new Client();

client.start();