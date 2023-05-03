/**
 * Returns the footer string.
 * @param [headers=null] Optional HTTP headers to get the ratelimit values.
 * @returns {Object} The footer object.
 */
module.exports = (headers = null) => {
    const footerString = headers
        ? `Yuuko Beta (${headers["x-ratelimit-remaining"] + "/" + headers["x-ratelimit-limit"]})}`
        : `Yuuko Beta`
    return { text: footerString }
}