import { stat } from "fs/promises";
import { extname, join } from "path";

export type RenameMode = "tv-show" | "anime" | "movie" | "sequential" | "date" | "find-replace";

export interface RenameOptions {
  mode: RenameMode;
  // TV show mode
  showName?: string;
  season?: number;
  startEpisode?: number;
  // Anime mode
  animeName?: string;
  animeSeason?: number;
  startAnimeEpisode?: number;
  group?: string;
  quality?: string;
  // Movie mode
  movieName?: string;
  year?: string;
  movieQuality?: string;
  // Sequential mode
  prefix?: string;
  startNumber?: number;
  zeroPad?: number;
  separator?: string;
  // Date mode
  dateFormat?: "YYYY-MM-DD" | "DD-MM-YYYY" | "MM-DD-YYYY";
  datePrefix?: string;
  // Word delimiter (space, dot, underscore, dash, or custom)
  wordDelimiter?: string;
  // Suffix after SxxExx (e.g. "1080p", "PROPER")
  suffix?: string;
  // Find & Replace mode
  find?: string;
  replace?: string;
  useRegex?: boolean;
}

export interface RenamePreview {
  original: string;
  renamed: string;
}

function padNumber(n: number, width: number): string {
  return String(n).padStart(width, "0");
}

function formatDate(date: Date, format: string): string {
  const y = date.getFullYear().toString();
  const m = padNumber(date.getMonth() + 1, 2);
  const d = padNumber(date.getDate(), 2);
  const hh = padNumber(date.getHours(), 2);
  const mm = padNumber(date.getMinutes(), 2);
  const ss = padNumber(date.getSeconds(), 2);

  switch (format) {
    case "DD-MM-YYYY":
      return `${d}-${m}-${y}_${hh}-${mm}-${ss}`;
    case "MM-DD-YYYY":
      return `${m}-${d}-${y}_${hh}-${mm}-${ss}`;
    case "YYYY-MM-DD":
    default:
      return `${y}-${m}-${d}_${hh}-${mm}-${ss}`;
  }
}

// TV Show: Breaking Bad S01E01 1080p.mkv (delimiter & suffix configurable)
export function generateTvShowName(fileName: string, showName: string, season: number, episode: number, delimiter = " ", suffix = ""): string {
  const ext = extname(fileName);
  const sanitized = showName.replace(/\s+/g, delimiter);
  const suffixPart = suffix ? `${delimiter}${suffix}` : "";
  return `${sanitized}${delimiter}S${padNumber(season, 2)}E${padNumber(episode, 2)}${suffixPart}${ext}`;
}

// Anime: [SubGroup] Anime Name - 01 [1080p].mkv
export function generateAnimeName(
  fileName: string,
  animeName: string,
  episode: number,
  group: string,
  quality: string,
): string {
  const ext = extname(fileName);
  const groupTag = group ? `[${group}] ` : "";
  const qualityTag = quality ? ` [${quality}]` : "";
  return `${groupTag}${animeName} - ${padNumber(episode, 2)}${qualityTag}${ext}`;
}

// Movie: Movie Name 2026 1080p.mkv (delimiter configurable)
export function generateMovieName(fileName: string, movieName: string, year: string, quality: string, delimiter = " "): string {
  const ext = extname(fileName);
  const sanitized = movieName.replace(/\s+/g, delimiter);
  const parts = [sanitized];
  if (year) parts.push(year);
  if (quality) parts.push(quality);
  return parts.join(delimiter) + ext;
}

// Sequential: Prefix-001.ext
export function generateSequentialName(
  fileName: string,
  prefix: string,
  number: number,
  zeroPad: number,
  separator: string,
): string {
  const ext = extname(fileName);
  return `${prefix}${separator}${padNumber(number, zeroPad)}${ext}`;
}

// Date: Prefix-2026-03-30_14-30-00-001.ext
export async function generateDateName(
  filePath: string,
  fileName: string,
  dateFormat: string,
  prefix: string,
  index: number,
): Promise<string> {
  const ext = extname(fileName);
  try {
    const stats = await stat(filePath);
    const date = stats.birthtime.getTime() > 0 ? stats.birthtime : stats.mtime;
    const dateStr = formatDate(date, dateFormat);
    const prefixStr = prefix ? `${prefix}-` : "";
    return `${prefixStr}${dateStr}-${padNumber(index + 1, 3)}${ext}`;
  } catch {
    const prefixStr = prefix ? `${prefix}-` : "";
    return `${prefixStr}unknown-${padNumber(index + 1, 3)}${ext}`;
  }
}

// Find & Replace on the filename (preserves extension)
export function generateFindReplaceName(fileName: string, find: string, replace: string, useRegex: boolean): string {
  const ext = extname(fileName);
  const nameWithoutExt = fileName.slice(0, fileName.length - ext.length);

  let newName: string;
  if (useRegex) {
    try {
      const regex = new RegExp(find, "g");
      newName = nameWithoutExt.replace(regex, replace);
    } catch {
      newName = nameWithoutExt; // invalid regex, no change
    }
  } else {
    newName = nameWithoutExt.split(find).join(replace);
  }

  return newName + ext;
}

export async function generatePreviews(
  folderPath: string,
  files: string[],
  options: RenameOptions,
): Promise<RenamePreview[]> {
  const previews: RenamePreview[] = [];

  for (let i = 0; i < files.length; i++) {
    const fileName = files[i];
    let renamed: string;

    switch (options.mode) {
      case "tv-show":
        renamed = generateTvShowName(
          fileName,
          options.showName || "Show",
          options.season ?? 1,
          (options.startEpisode ?? 1) + i,
          options.wordDelimiter ?? " ",
          options.suffix ?? "",
        );
        break;
      case "anime":
        renamed = generateAnimeName(
          fileName,
          options.animeName || "Anime",
          (options.startAnimeEpisode ?? 1) + i,
          options.group ?? "",
          options.quality ?? "",
        );
        break;
      case "movie":
        renamed = generateMovieName(fileName, options.movieName || "Movie", options.year ?? "", options.movieQuality ?? "", options.wordDelimiter ?? " ");
        break;
      case "sequential":
        renamed = generateSequentialName(
          fileName,
          options.prefix || "file",
          (options.startNumber ?? 1) + i,
          options.zeroPad ?? 3,
          options.separator ?? "-",
        );
        break;
      case "date":
        renamed = await generateDateName(
          join(folderPath, fileName),
          fileName,
          options.dateFormat ?? "YYYY-MM-DD",
          options.datePrefix ?? "",
          i,
        );
        break;
      case "find-replace":
        renamed = generateFindReplaceName(
          fileName,
          options.find ?? "",
          options.replace ?? "",
          options.useRegex ?? false,
        );
        break;
    }

    previews.push({ original: fileName, renamed });
  }

  return previews;
}
