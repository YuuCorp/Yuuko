/**
 * Returns the fotter string.
 * @param {AxiosResponse} [response=null] The Axios response to get the ratelimit values.
 * @returns {String} The footer string.
 */
module.exports = (response = null) => {
    const footerString = response
        ? `AniSuggest Beta (${response.headers["x-ratelimit-remaining"] + "/" + response.headers["x-ratelimit-limit"]}) | ${new Date().getHours() + ':' + new Date().getMinutes()}` 
        : `AniSuggest Beta | ${new Date().getHours() + ':' + new Date().getMinutes()}`
    return { text: footerString }
}