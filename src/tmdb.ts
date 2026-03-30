import { getPreferenceValues } from "@raycast/api";

interface Preferences {
  tmdbApiKey?: string;
}

interface TmdbSearchResult {
  id: number;
  name: string;
  first_air_date?: string;
  overview?: string;
}

interface TmdbSeason {
  season_number: number;
  episode_count: number;
  name: string;
}

interface TmdbEpisode {
  episode_number: number;
  season_number: number;
  name: string;
}

export interface ShowInfo {
  id: number;
  name: string;
  firstAirDate: string;
  seasons: SeasonInfo[];
}

export interface SeasonInfo {
  seasonNumber: number;
  episodeCount: number;
  name: string;
}

export interface EpisodeInfo {
  episodeNumber: number;
  seasonNumber: number;
  name: string;
}

const TMDB_BASE = "https://api.themoviedb.org/3";

function getApiKey(): string | null {
  try {
    const prefs = getPreferenceValues<Preferences>();
    return prefs.tmdbApiKey?.trim() || null;
  } catch {
    return null;
  }
}

export function hasTmdbKey(): boolean {
  return getApiKey() !== null;
}

async function tmdbFetch<T>(path: string, params: Record<string, string> = {}): Promise<T> {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error("TMDB API key not configured");

  const url = new URL(`${TMDB_BASE}${path}`);
  url.searchParams.set("api_key", apiKey);
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, v);
  }

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`TMDB API error: ${response.status} ${response.statusText}`);
  }
  return response.json() as Promise<T>;
}

/**
 * Search for a TV show by name.
 */
export async function searchShow(query: string): Promise<ShowInfo[]> {
  const data = await tmdbFetch<{ results: TmdbSearchResult[] }>("/search/tv", { query });

  const results: ShowInfo[] = [];
  for (const r of data.results.slice(0, 5)) {
    results.push({
      id: r.id,
      name: r.name,
      firstAirDate: r.first_air_date || "",
      seasons: [],
    });
  }
  return results;
}

/**
 * Get detailed info about a show including season breakdown.
 */
export async function getShowDetails(showId: number): Promise<ShowInfo> {
  const data = await tmdbFetch<{
    id: number;
    name: string;
    first_air_date?: string;
    seasons: TmdbSeason[];
  }>(`/tv/${showId}`);

  return {
    id: data.id,
    name: data.name,
    firstAirDate: data.first_air_date || "",
    seasons: data.seasons
      .filter((s) => s.season_number > 0) // exclude specials (season 0)
      .map((s) => ({
        seasonNumber: s.season_number,
        episodeCount: s.episode_count,
        name: s.name,
      })),
  };
}

/**
 * Get episodes for a specific season.
 */
export async function getSeasonEpisodes(showId: number, seasonNumber: number): Promise<EpisodeInfo[]> {
  const data = await tmdbFetch<{ episodes: TmdbEpisode[] }>(`/tv/${showId}/season/${seasonNumber}`);

  return data.episodes.map((e) => ({
    episodeNumber: e.episode_number,
    seasonNumber: e.season_number,
    name: e.name,
  }));
}

/**
 * Build a full episode map for a show: absolute episode number -> { season, episode }.
 * For example, if season 1 has 12 episodes and season 2 has 12, absolute ep 13 = S02E01.
 */
export async function buildEpisodeMap(
  showId: number,
): Promise<Map<number, { season: number; episode: number; name: string }>> {
  const show = await getShowDetails(showId);
  const map = new Map<number, { season: number; episode: number; name: string }>();

  let absoluteEp = 1;
  for (const season of show.seasons) {
    const episodes = await getSeasonEpisodes(showId, season.seasonNumber);
    for (const ep of episodes) {
      map.set(absoluteEp, {
        season: ep.seasonNumber,
        episode: ep.episodeNumber,
        name: ep.name,
      });
      absoluteEp++;
    }
  }

  return map;
}
