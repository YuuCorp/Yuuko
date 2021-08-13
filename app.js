const Client = require("./Structures/Client.js");
const config = require("./config.json");
const client = new Client();

client.start();

client.on("messageCreate", (message) => {
  
});
