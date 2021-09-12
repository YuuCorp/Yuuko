/**
 * Returns the fotter string.
 * @param {AxiosResponse} [response=null] The Axios response to get the ratelimit values.
 * @returns {String} The footer string.
 */
module.exports = (response = null) => {
    return response
        ? `AniSuggest v0.1 Beta (${response.headers["x-ratelimit-remaining"] + "/" + response.headers["x-ratelimit-limit"]}) | ${new Date().getHours() + ':' + new Date().getMinutes()}` 
        : `AniSuggest v0.1 Beta | ${new Date().getHours() + ':' + new Date().getMinutes()}`
}