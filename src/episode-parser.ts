import { extname } from "path";

export interface ParsedEpisode {
  fileName: string;
  episodeNumber: number;
  seasonNumber: number | null; // null = could not determine
  showName: string | null; // extracted from filename if possible
}

/**
 * Patterns tried in order of specificity.
 * Each returns { episode, season?, showName? } or null.
 */
const PATTERNS: {
  name: string;
  regex: RegExp;
  extract: (match: RegExpMatchArray, fileName: string) => { episode: number; season: number | null; showName: string | null };
}[] = [
  // S01E01, s01e01, S1E5
  {
    name: "SxxExx",
    regex: /^(.*?)[.\s_-]*[Ss](\d{1,2})[Ee](\d{1,3})/,
    extract: (m) => ({
      episode: parseInt(m[3]),
      season: parseInt(m[2]),
      showName: cleanShowName(m[1]),
    }),
  },
  // 1x01, 01x05
  {
    name: "1x01",
    regex: /^(.*?)[.\s_-]*(\d{1,2})x(\d{2,3})/i,
    extract: (m) => ({
      episode: parseInt(m[3]),
      season: parseInt(m[2]),
      showName: cleanShowName(m[1]),
    }),
  },
  // [SubGroup] Show Name - 01 [1080p] (anime style)
  {
    name: "anime-bracket",
    regex: /^\[.*?\]\s*(.*?)\s*-\s*(\d{2,4})\b/,
    extract: (m) => ({
      episode: parseInt(m[2]),
      season: null,
      showName: m[1].trim() || null,
    }),
  },
  // Show.Name.E01 or Show Name - E01
  {
    name: "E-only",
    regex: /^(.*?)[.\s_-]*[Ee](\d{1,3})\b/,
    extract: (m) => ({
      episode: parseInt(m[2]),
      season: null,
      showName: cleanShowName(m[1]),
    }),
  },
  // Episode 01, Episode 1
  {
    name: "episode-word",
    regex: /^(.*?)[.\s_-]*(?:Episode|Ep\.?|EP)\s*(\d{1,4})\b/i,
    extract: (m) => ({
      episode: parseInt(m[2]),
      season: null,
      showName: cleanShowName(m[1]),
    }),
  },
  // Show Name - 001 (bare number after separator)
  {
    name: "bare-after-separator",
    regex: /^(.*?)\s*[-–]\s*(\d{1,4})\s*(?:\[.*?\])*\s*$/,
    extract: (m) => ({
      episode: parseInt(m[2]),
      season: null,
      showName: cleanShowName(m[1]),
    }),
  },
  // Pure numeric: 001.mkv, 01.mp4 (entire filename minus extension is a number)
  {
    name: "pure-number",
    regex: /^(\d{1,4})$/,
    extract: (m) => ({
      episode: parseInt(m[1]),
      season: null,
      showName: null,
    }),
  },
  // Starts with number: 01 - Title.mkv, 001 Something.mkv
  {
    name: "leading-number",
    regex: /^(\d{1,4})\s*[.\s_-]+/,
    extract: (m) => ({
      episode: parseInt(m[1]),
      season: null,
      showName: null,
    }),
  },
  // Ends with number: Something_01.mkv
  {
    name: "trailing-number",
    regex: /[_.\s-](\d{1,4})$/,
    extract: (m) => ({
      episode: parseInt(m[1]),
      season: null,
      showName: null,
    }),
  },
];

function cleanShowName(raw: string): string | null {
  if (!raw) return null;
  const cleaned = raw
    .replace(/[._]/g, " ")
    .replace(/\s+/g, " ")
    .replace(/^\[.*?\]\s*/, "") // remove leading [group]
    .trim();
  return cleaned || null;
}

/**
 * Try to extract episode info from a filename.
 */
export function parseEpisode(fileName: string): ParsedEpisode | null {
  const ext = extname(fileName);
  const nameWithoutExt = fileName.slice(0, fileName.length - ext.length);

  for (const pattern of PATTERNS) {
    const match = nameWithoutExt.match(pattern.regex);
    if (match) {
      const result = pattern.extract(match, nameWithoutExt);
      return {
        fileName,
        episodeNumber: result.episode,
        seasonNumber: result.season,
        showName: result.showName,
      };
    }
  }

  return null;
}

/**
 * Given a flat list of episode numbers (e.g. 1-50), figure out seasons.
 * episodesPerSeason = how many episodes per season.
 * Returns a map of episode number -> { season, episodeInSeason }.
 */
export function assignSeasons(
  episodes: number[],
  episodesPerSeason: number,
): Map<number, { season: number; episodeInSeason: number }> {
  const sorted = [...episodes].sort((a, b) => a - b);
  const result = new Map<number, { season: number; episodeInSeason: number }>();

  for (const ep of sorted) {
    const season = Math.ceil(ep / episodesPerSeason);
    const episodeInSeason = ((ep - 1) % episodesPerSeason) + 1;
    result.set(ep, { season, episodeInSeason });
  }

  return result;
}
