# Rebaptize

A [Raycast](https://raycast.com) extension for bulk renaming and organizing files. Every function is available as its own Raycast command — assign aliases and hotkeys to the ones you use most.

## Commands Overview

Rebaptize has three tiers of commands:

1. **Full UI commands** — forms with configuration, preview, and confirm
2. **Preset shortcuts** — jump straight to a specific rename mode (still shows a form)
3. **Instant commands** — no UI, runs immediately against the current Finder folder with undo support

All commands auto-detect the current Finder folder. No need to manually pick a folder if Finder is open.

---

## Full UI Commands

### Rebaptize Files

The main command. Pick a preset, configure options, preview all renames, then confirm.

| Preset | Example Output |
|---|---|
| TV Show | `Breaking Bad S01E01.mkv` |
| Anime | `[SubsPlease] Jujutsu Kaisen - 01 [1080p].mkv` |
| Movie | `Interstellar 2014 1080p.mkv` |
| Sequential | `Vacation-001.jpg` |
| Date-Based | `Trip-2026-03-30_14-30-00-001.jpg` |
| Change Case | `MY SHOW NAME.mkv` / `my show name.mkv` / `My Show Name.mkv` |
| Swap Delimiter | `My.Show.S01E01` → `My Show S01E01` |
| Auto Enumerate | `001.jpg`, `002.jpg`, `003.jpg` (by name, date created, or date modified) |
| Change Extension | `*.jpeg` → `*.jpg` |
| Find & Replace | Plain text or regex on filenames |

**Smart detection:** Analyzes files in the folder and auto-suggests the best preset, auto-fills show names, season numbers, etc.

**Word separator:** Choose space, dot, underscore, dash, or a custom delimiter for TV Show and Movie presets.

**Suffix:** Optionally add text after `S01E01` (e.g. `1080p`, `PROPER`).

### Smart Organize Episodes

Auto-detect episode numbers from filenames and organize into season folders. Designed for bulk-downloaded anime and TV shows.

**Parses:** `S01E01`, `1x01`, `[SubsPlease] Name - 01`, `Episode 01`, `Ep01`, `001.mkv`, `01 - Title.mkv`, `Show.Name.E01`

**Season splitting:**
- Uses season info from filenames if present (`S01E01`)
- Otherwise splits by configurable episodes-per-season
- Optionally fetches real data from TheTVDB

**Customizable templates** for folder names (`Season {season}`) and filenames (`{show}.S{season}E{episode}`).

### Smart Find & Replace

Multi-rule find and replace with regex capture groups, file filters, and case sensitivity toggles. Up to 3 rules applied in sequence.

### Sort Files by Date

Organize files into subfolders by creation date — by day, month, or year. Move or copy.

### Sort Photos by Location

Organize photos into subfolders by GPS data from EXIF metadata (city, state, or country). Uses OpenStreetMap — no API key required.

---

## Preset Shortcuts

Each preset is also available as its own command for quick access:

| Command | Mode |
|---|---|
| Rename as TV Show | TV Show (S01E01) |
| Rename as Anime | Anime ([Group] Name - 01) |
| Rename as Movie | Movie (Name Year Quality) |
| Rename Sequentially | Sequential (Prefix-001) |
| Rename by Date | Date-based rename |
| Change Filename Case | UPPERCASE / lowercase / Title Case / Sentence case |
| Swap Filename Delimiter | Replace one delimiter with another |
| Auto Enumerate Files | Number files sequentially |
| Change File Extension | Bulk change extensions |

---

## Instant Commands

These run immediately with **no UI** — just execute against the current Finder folder. A success toast appears with an **Undo** action (`⌘Z`) to reverse the rename.

### Case

| Command | Effect |
|---|---|
| Uppercase All Filenames | `my show` → `MY SHOW` |
| Lowercase All Filenames | `MY SHOW` → `my show` |
| Title Case All Filenames | `my show name` → `My Show Name` |
| Sentence Case All Filenames | `my SHOW name` → `My show name` |

### Delimiters

| Command | Effect |
|---|---|
| Replace Dots with Spaces | `My.Show.S01E01` → `My Show S01E01` |
| Replace Spaces with Dots | `My Show` → `My.Show` |
| Replace Underscores with Spaces | `my_file` → `my file` |
| Replace Spaces with Underscores | `my file` → `my_file` |
| Replace Dashes with Spaces | `my-file` → `my file` |
| Replace Spaces with Dashes | `my file` → `my-file` |

### Utility

| Command | Effect |
|---|---|
| Collapse Multiple Spaces | `my  show   name` → `my show name` |
| Enumerate Files by Name | Alphabetical order → `001.ext`, `002.ext` |
| Enumerate Files by Date Created | Oldest first → `001.ext`, `002.ext` |
| **Undo Last Rename** | Reverts the last instant command (within 5 minutes) |

---

## TheTVDB Integration (Optional)

The **Smart Organize Episodes** command can optionally use [TheTVDB](https://thetvdb.com) to automatically fetch season and episode data.

To enable:
1. Create an account at [thetvdb.com](https://thetvdb.com) and get a free API key from your [dashboard](https://www.thetvdb.com/dashboard/account/apikey)
2. Open Raycast Preferences → Extensions → Rebaptize
3. Paste your API key in the **TheTVDB API Key** field

Without a key, the extension still works — it uses manual episodes-per-season splitting.

## Tips

- **Aliases:** Open Raycast → search for any command → `⌘K` → Configure Command → set an Alias (e.g. `uc` for Uppercase All)
- **Hotkeys:** Same menu — assign a global hotkey to any command
- **Undo:** After any instant command, run **"Undo Last Rename"** to revert. Works within 5 minutes. Assign it an alias like `undo` for quick access.
- **Finder:** All commands auto-detect the Finder folder. Just have Finder open to the right folder before running a command.

## Requirements

- macOS
