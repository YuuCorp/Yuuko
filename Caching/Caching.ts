import { Op } from "sequelize";
import { CacheModel } from "../Database/Models/Cache";
import type { CacheTypes } from "./CacheTypes";

async function lookup(type: typeof CacheTypes, keyword: string) {
  console.log(`[Caching] Looking up "${type}" cache entry (Query: ${keyword})`);

  // We just find the cache based on the keyword and type
  const cacheEntry = await CacheModel.findOne({
    where: {
      type,
      // Contains keyword
      keywords: { [Op.like]: `%${keyword}%` },
    },
  });
  return cacheEntry ? JSON.parse(cacheEntry.data) : null;
}

async function store(type: typeof CacheTypes, id: number, keyword: string, data: any) {
  console.log(`[Caching] Storing "${type}" cache entry (ID: ${id} | Keyword: ${keyword})`);

  // First check if the cache with this cacheID already exists
  // if so, we just concat the new keyword to it.
  const cacheEntry = await CacheModel.findOne({ where: { type, cacheID: id } });
  if (cacheEntry) {
    cacheEntry.keywords = cacheEntry.keywords.concat(`,${keyword}`);
    cacheEntry.data = JSON.stringify(data);
    await cacheEntry.save();
    // If not, we create a new cache entry
  } else {
    await CacheModel.create({
      type,
      cacheID: id,
      keywords: keyword,
      data: JSON.stringify(data),
    });
  }
}

module.exports = { lookup, store };
