import type { MediaTitle } from '#graphQL/types'

export function SeriesTitle(media: MediaTitle | null | undefined) {
  if (!media)
    return 'Unknown'
  return media.userPreferred || media.english || media.romaji || media.native || 'Unknown'
}

/**
 * @example normalize("attack ON   TiTan") => "ATTACK_ON_TITAN"
 */
export function normalize(query: string) {
  return query.toUpperCase().split(/\s+/).join("_");
}

export function removeExtension(fileName: string, extension = '.ts') {
  return fileName.slice(0, fileName.indexOf(extension))
}
