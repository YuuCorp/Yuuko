/**
 * Returns the fotter string.
 * @param {AxiosResponse} [response=null] The Axios response to get the ratelimit values.
 * @returns {String} The footer string.
 */
module.exports = (response = null) => {
    return response
        ? `AniSuggest v0.1 Dev (${response.headers["x-ratelimit-remaining"] + "/" + response.headers["x-ratelimit-limit"]}) | ${new Date().getHours() + ':' + new Date().getMinutes()}` 
        : `AniSuggest v0.1 Dev | ${new Date().getHours() + ':' + new Date().getMinutes()}`
}