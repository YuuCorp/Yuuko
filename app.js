require("dotenv-flow").config();
require("./Checks/Run.js");

const Client = require("#Structures/Client.js");
const client = new Client();

client.start();