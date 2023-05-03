module.exports = (media) => {
    return media.title?.english || media.title?.romaji || media.title?.native || "Unknown";
}