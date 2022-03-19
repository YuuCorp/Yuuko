const CacheModel = require("#Models/Cache.js");
// Might be required later for validation
const CacheTypes = require("./CacheTypes.js");
const { Op } = require("sequelize");

async function lookup(type, keyword) {
    console.log(`[Caching] Looking up "${type}" cache entry (Query: ${keyword})`);

    // We just find the cache based on the keyword and type
    const cacheEntry = await CacheModel.findOne({
        where: {
            type: type,
            // Contains keyword
            keywords: { [Op.like]: `%${keyword}%` } 
        }
    });
    return cacheEntry ? JSON.parse(cacheEntry.data) : null;
}

async function store(type, id, keyword, data) {
    console.log(`[Caching] Storing "${type}" cache entry (ID: ${id} | Keyword: ${keyword})`);

    // First check if the cache with this cacheID already exists
    // if so, we just concat the new keyword to it.
    const cacheEntry = await CacheModel.findOne({ where: { type: type, cacheID: id } });
    if (cacheEntry) {
        cacheEntry.keywords = cacheEntry.keywords.concat("," + keyword);
        cacheEntry.data = JSON.stringify(data);
        await cacheEntry.save();
    // If not, we create a new cache entry
    } else {
        await CacheModel.create({
            type: type,
            cacheID: id,
            keywords: keyword,
            data: JSON.stringify(data)
        });
    }
}

module.exports = { lookup, store };