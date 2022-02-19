# AniSuggest
**\* This is prerelease software, the current release does not represent the final quality of the product.**
<p align="center">
    <a href="https://www.codacy.com?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=TibixDev/AniSuggest&amp;utm_campaign=Badge_Grade" alt="Codacy Code Quality">
        <img src="https://app.codacy.com/project/badge/Grade/21b43885505b44a08784ad868babbd10" /></a>
    <a href="https://github.com/TibixDev/AniSuggest/blob/main/LICENSE" alt="MIT License Badge">
        <img src="https://img.shields.io/badge/license-MIT-brightgreen" /></a>
    <a href="https://github.com/TibixDev/AniSuggest/">
        <img src="https://img.shields.io/github/commit-activity/m/tibixdev/anisuggest" alt="Commit Activity"/></a>
    <a href="https://discord.gg/WK3C4a5P">
        <img src="https://img.shields.io/discord/884525603628388372?label=Discord"></a>
        <img src="https://img.shields.io/tokei/lines/github/TibixDev/AniSuggest" alt="Lines Of Code">
       <img src="https://img.shields.io/david/tibixdev/anisuggest" alt="Dependency Status">
</p>

<img src="https://i.imgur.com/FGkMOoa.png" align="right"
     alt="AniList Logo" width="120" height="120">
    

AniSuggest is a free and open source Discord bot that integrates with the AniList API, providing the users with useful commands for viewing anime, manga, getting recommendations, viewing AniList users profiles without opening a browser tab, and many more.

## Invite our bot
[**Click here**](https://discord.com/api/oauth2/authorize?client_id=875171984953200641&permissions=8&scope=bot)

## Installation
### Simple Installation
1. Clone the repository
2. Run `yarn`
3. Edit the file called `.env.local` and change the `TOKEN` in it
4. Run `yarn start`

### PM2 Container Installation (Linux)
1. Make sure `TRUSTED_USERS` includes your Discord ID in `.env`, so you can update the bot if needed.
2. Do the same as in **Simple Installation**, except instead of running `yarn start`, run `sh start.sh`.
3. You can update the bot by running the `update` command.  (Rebooting will be included in the future)  

## Configuration
* You can change the default bot prefix (`!!`) by overriding the `PREFIX` parameter in `.env`.
* You can disable certain commands by changing their `.js` prefix, or by deleting the command file entirely. Beware though, some commands like `anime` and `manga` are hooked into by other commands, so deleting hookable commands will also cause those to break.

## Contribution
Feel free to create pull requests for any improvements you feel like making, but only do so if they have to do with the core idea of the bot, and they implement/fix actual functionality. In your pull request you should ideally describe what you changed, and why changed it.

## Legal
Licensed under the MIT license:
```text
Copyright 2021 AniSuggest Developers

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.