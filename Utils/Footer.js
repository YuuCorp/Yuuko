/**
 * Get a formatted HH:MM time
 */
function formattedTime() {
    let hours = new Date().getHours();
    let mins = new Date().getMinutes();
    hours = hours < 10 ? `0${hours}` : hours;
    mins = mins < 10 ? `0${mins}` : mins;
    return `${hours}:${mins}`;
}

/**
 * Returns the footer string.
 * @param [headers=null] Optional HTTP headers to get the ratelimit values.
 * @returns {Object} The footer object.
 */
module.exports = (headers = null) => {
    const footerString = headers
        ? `Yuuko Beta (${headers["x-ratelimit-remaining"] + "/" + headers["x-ratelimit-limit"]}) | ${formattedTime()}`
        : `Yuuko Beta | ${formattedTime()}`
    return { text: footerString }
}