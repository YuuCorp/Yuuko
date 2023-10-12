import type { Media } from "./types";

export function SeriesTitle(media: Media) {
  return media.title?.english || media.title?.romaji || media.title?.native || "Unknown";
}
