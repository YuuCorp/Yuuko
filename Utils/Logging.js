const fs = require('fs');
const path = require('path');

module.exports = (command, interaction) => {
    try {
        const logPath = path.join(__dirname, "../Logging/logs.txt");
        const currentDate = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
        if (!fs.existsSync(path.join(__dirname, "../Logging" || !fs.existsSync(logPath)))) {
            fs.mkdirSync(path.join(__dirname, "../Logging"));
            fs.writeFileSync(logPath, 'Initiating log!');
        }
        const subcommand = interaction.options.getSubcommand(false);
        const log = fs.readFileSync(logPath, 'utf8').toString() + "\n" + `${currentDate}: ${interaction.user.username}#${interaction.user.discriminator} ran command: ${command.name}${subcommand ? " " + subcommand : ""}`;
        fs.writeFileSync(logPath, log, 'utf8');
    } catch (e) {
        console.log(e);
    }
};