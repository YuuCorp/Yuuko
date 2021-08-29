const reactionMenu = async (message, pages, emojis = [':rewind:', ':fast_forward:'], timeout = 60000) => {
    let page = 0; 
    let msgChannel = message.channel
    if (!message && !message.channel) throw new Error('Channel is inaccessible.');
    if (!pages) throw new Error('Pages are not given.');
    if (emojis.length !== 2) throw new Error('Need two emojis.');

    const mainPage = await msgChannel.send({embeds: [pages[page].setFooter(`[ Page ${page + 1} / ${pages.length} ]`).setTimestamp()]}).catch((err) => { throw new TypeError(err)})
    for (const emoji of emojis) await mainPage.react(emoji)

    const reactionCollector = mainPage.createReactionCollector(
        (reaction, user) => emojis.includes(reaction.emoji.name) && !user.bot,
        { time: timeout }
    );
    reactionCollector.on('collect', reaction => {
        reaction.users.remove(message.author);
        switch (reaction.emoji.name) {
            case emojis[0]:
                page = page > 0 ? --page : pages.length - 1;
                break;
            case emojis[1]:
                page = page + 0 < pages.length ? ++page : 0;
                break;
            default:
                break;
        }
        mainPage.edit({embeds: [pages[page].setFooter(`[ Page ${page + 1} / ${pages.length} ]`).setTimestamp()]});
    });
    reactionCollector.on('end', () => {
        if (!mainPage.deleted) {
            mainPage.reactions.removeAll()
        }
    });
    return mainPage;
};
module.exports = reactionMenu;