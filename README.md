# Rebaptize

A [Raycast](https://raycast.com) extension for bulk renaming, smart episode organizing, and sorting files by date or location.

## Commands

### Rebaptize Files

Bulk rename files in a folder using presets. Works with any file type.

| Preset | Example Output |
|---|---|
| TV Show | `Breaking.Bad.S01E01.mkv` |
| Anime | `[SubsPlease] Jujutsu Kaisen - 01 [1080p].mkv` |
| Movie | `Interstellar.2014.1080p.mkv` |
| Sequential | `Vacation-001.jpg` |
| Date-Based | `Trip-2026-03-30_14-30-00-001.jpg` |
| Find & Replace | `My.Old.Name.txt → My.New.Name.txt` |

### Smart Organize Episodes

Auto-detect episode numbers from filenames and organize into season folders with proper naming. Designed for bulk-downloaded anime and TV shows.

**Smart detection** parses episode numbers from many formats:
- `S01E01`, `1x01` — standard TV
- `[SubsPlease] Show Name - 01 [1080p]` — anime fansub
- `Episode 01`, `Ep01`, `EP01` — verbose
- `001.mkv`, `01 - Title.mkv` — bare numbers
- `Show.Name.E01` — partial

**Season splitting:**
- If filenames already contain season info (`S01E01`), it's used directly
- Otherwise, flat episode numbers (1, 2, ... 50) are split by configurable episodes-per-season
- With a **TMDB API key**, season/episode data is fetched automatically from The Movie Database — no manual config needed

**Customizable templates:**
- Folder: `Season {season}`, `{show} - Season {season}`, etc.
- File: `{show}.S{season}E{episode}`, `{show} - {season}x{episode}`, etc.

### Sort Files by Date

Organize files into subfolders by creation date.

| Granularity | Example Folder |
|---|---|
| Day | `2026-03-30/` |
| Month | `2026-03/` |
| Year | `2026/` |

Choose to move or copy files.

### Sort Photos by Location

Organize photos into subfolders based on GPS data in EXIF metadata. Uses OpenStreetMap for reverse geocoding — no API key required.

| Granularity | Example Folder |
|---|---|
| City | `Lisbon/`, `Tokyo/` |
| State / Region | `California/`, `Bavaria/` |
| Country | `Portugal/`, `Japan/` |

Supported formats: JPEG, TIFF, HEIC, DNG, and various RAW formats.

## TMDB Integration (Optional)

The **Smart Organize Episodes** command can optionally use [TMDB](https://www.themoviedb.org/) to automatically fetch season and episode data for any TV show or anime.

To enable:
1. Get a free API key at [themoviedb.org](https://www.themoviedb.org/settings/api)
2. Open Raycast Preferences → Extensions → Rebaptize
3. Paste your API key in the **TMDB API Key** field

Without a key, the extension still works — it just uses manual episodes-per-season splitting.

## Requirements

- macOS
