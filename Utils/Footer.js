/**
 * Returns the fotter string.
 * @param [headers=null] Optional HTTP headers to get the ratelimit values.
 * @returns {Object} The footer object.
 */
module.exports = (headers = null) => {
    console.log(headers);
    const footerString = headers
        ? `AniSuggest Beta (${headers["x-ratelimit-remaining"] + "/" + headers["x-ratelimit-limit"]}) | ${new Date().getHours() + ':' + new Date().getMinutes()}` 
        : `AniSuggest Beta | ${new Date().getHours() + ':' + new Date().getMinutes()}`
    return { text: footerString }
}