# Discordv13-pagination

*this was forked from the discord.js-pagination page (https://github.com/saanuregh/discord.js-pagination) but edited to fit another emoji and discord.js v13*

```js
//example

const reactionMenu = require("discordv13-pagination")

    const embed = new MessageEmbed() .setAuthor("embed 1")
    const embed2 = new MessageEmbed() .setAuthor("embed 1")
    const embed3 = new MessageEmbed() .setAuthor("embed 1")
    const pages = [embed, embed2, embed3]

    reactionMenu(message, pages) // auto sends into current channel (if you want to change this just edit the "let msgChannel message.channel" in the main file!)
```