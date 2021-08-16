module.exports = (response = null) => {
    return response
        ? `AniSuggest v0.1 Dev (${response.headers["x-ratelimit-remaining"] + "/" + response.headers["x-ratelimit-limit"]}) | ${new Date().getHours() + ':' + new Date().getMinutes()}` 
        : `AniSuggest v0.1 Dev | ${new Date().getHours() + ':' + new Date().getMinutes()}`
}