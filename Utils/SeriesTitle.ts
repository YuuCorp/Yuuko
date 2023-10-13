import type { Media } from "./types";

export function SeriesTitle(media: Media | undefined) {
  if (!media) return "Unknown";
  return media.title?.english || media.title?.romaji || media.title?.native || "Unknown";
}
