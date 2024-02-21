import { mwTrustedUser } from "../Middleware/TrustedUser"
import { spawn, execSync } from "child_process"
import { SlashCommandBuilder } from "discord.js"
import { sqlite } from "../Database"
import fs from "fs"
import path from "path"
import type { Command } from "../Structures"

const name = 'update'
const description = 'Checks for the latest update, and restarts the bot if any are found. (Trusted users only)'

export default {
  name,
  description,
  commandType: "Internal",
  middlewares: [mwTrustedUser],
  withBuilder: new SlashCommandBuilder().setName(name).setDescription(description),

  run: async ({ interaction, client }): Promise<void> => {
    if(!interaction.isCommand()) return;
    try {
      if (process.env.TRUSTED_USERS.includes(interaction.user.id) /* && process.env.NODE_ENV === "production" */) {
        const updateMessage = await interaction.reply({ content: 'Updating...', fetchReply: true })
        const editMessage = async (content: string) => {
          await interaction.editReply(`\`\`\`sh\n${content}\`\`\``)
        }

        const update = spawn('sh', ['update.sh'])
        let updateLogs = ''

        let rateLimitCurrent = 0
        const rateLimitMax = 4
        const updateInterval = setInterval(() => {
          if (rateLimitCurrent < rateLimitMax) {
            console.log(`Sending update logs ${rateLimitCurrent}/${rateLimitMax}`)
            editMessage(updateLogs)
            rateLimitCurrent++
          }
          else {
            clearInterval(updateInterval)
          }
        }, 500)
        update.stdout.on('data', (data) => {
          console.log(data.toString())
          updateLogs += data
        })
        update.stderr.on('data', (data) => {
          console.log(data.toString())
          updateLogs += `STDERR: ${data}`
        })
        update.on('close', async (code) => {
          console.log(`Procedures completed with code ${code}, restarting...`)
          updateLogs += `Procedures completed with code ${code}, restarting...  `
          if (updateInterval)
            clearInterval(updateInterval)
          await editMessage(updateLogs)
          // await interaction.deferEdit();

          // Make a temporary file that stores the ID of the message sent, and the channel ID it was sent in
          // This is so that the bot can react to the message after restarting
          if (!fs.existsSync(path.join(__dirname, '../Local')))
            fs.mkdirSync(path.join(__dirname, '../Local'))

          const tempFile = path.join(__dirname, '../Local/updatemsg.json')
          sqlite.close();
          fs.writeFileSync(tempFile, JSON.stringify(updateMessage))
          // execSync('git rev-parse --short HEAD > commit.hash', { encoding: 'utf-8' });
          execSync('pm2 restart "Yuuko Production"', { encoding: 'utf-8' })
        })
      }
    }
    catch (error) {
      console.error(error)
    }
  },
} satisfies Command