import { Media } from "./types";

export const SeriesTitle = (media: Media) => {
  return media.title?.english || media.title?.romaji || media.title?.native || "Unknown";
};
