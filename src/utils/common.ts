import type { MediaTitle } from '#graphQL/types'

/**
 * Picks the best title to display from an AniList MediaTitle, in order of
 * preference: userPreferred → english → romaji → native.
 * @example SeriesTitle({ english: "Attack on Titan", romaji: "Shingeki no Kyojin" }) // => "Attack on Titan"
 */
export function SeriesTitle(media: MediaTitle | null | undefined) {
  if (!media)
    return 'Unknown'
  return media.userPreferred || media.english || media.romaji || media.native || 'Unknown'
}

/**
 * Normalizes a search query into the cache-key form: uppercase, single
 * underscores between words.
 * @example normalize("attack ON   TiTan") // => "ATTACK_ON_TITAN"
 */
export function normalize(query: string) {
  return query.toUpperCase().split(/\s+/).join("_");
}

/**
 * Strips the extension from a filename.
 * @example removeExtension("anime.ts") // => "anime"
 */
export function removeExtension(fileName: string, extension = '.ts') {
  return fileName.slice(0, fileName.indexOf(extension))
}
