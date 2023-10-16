import type { MediaTitle } from '../GraphQL/types'

export function SeriesTitle(media: MediaTitle | undefined) {
  if (!media)
    return 'Unknown'
  return media.english || media.romaji || media.native || 'Unknown'
}
