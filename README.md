# Rebaptize

A [Raycast](https://raycast.com) extension for bulk renaming and organizing files. 28 commands covering everything from one-click case conversion to smart TV show episode organization with TheTVDB metadata.

Every function is available as its own Raycast command — assign aliases and hotkeys to the ones you use most.

All commands auto-detect the current Finder folder. No need to manually pick a folder if Finder is open.

---

## Table of Contents

- [Full UI Commands](#full-ui-commands)
  - [Rebaptize Files](#rebaptize-files)
  - [Smart Organize Episodes](#smart-organize-episodes)
  - [Smart Find & Replace](#smart-find--replace)
  - [Sort Files by Date](#sort-files-by-date)
  - [Sort Photos by Location](#sort-photos-by-location)
- [Preset Shortcuts](#preset-shortcuts)
- [Instant Commands](#instant-commands)
- [TheTVDB Integration](#thetvdb-integration)
- [Tips](#tips)
- [Requirements](#requirements)

---

## Full UI Commands

### Rebaptize Files

The main command. Select a folder, pick a rename preset, configure options, preview every rename, then confirm. Smart detection analyzes the files and auto-fills fields like show name, season, and suggested mode.

#### TV Show

Rename files into the standard `S01E01` format.

```
Before:                                          After:
breaking.bad.s01e01.720p.BluRay.x264-DEMAND.mkv  Breaking Bad S01E01.mkv
breaking.bad.s01e02.720p.BluRay.x264-DEMAND.mkv  Breaking Bad S01E02.mkv
Breaking.Bad.S01E03.HDTV.XviD-LOL.avi            Breaking Bad S01E03.avi
```

Options: show name, season number, start episode, word separator (space/dot/underscore/dash/custom), optional suffix after S01E01 (e.g. `1080p`, `PROPER`).

#### Anime

Rename into the fansub convention with optional sub group and quality tags.

```
Before:                             After:
001.mkv                             [SubsPlease] Demon Slayer - 01 [1080p].mkv
002.mkv                             [SubsPlease] Demon Slayer - 02 [1080p].mkv
003.mkv                             [SubsPlease] Demon Slayer - 03 [1080p].mkv
```

Options: anime name, start episode, sub group, quality tag.

#### Movie

Rename into the standard movie format.

```
Before:                                    After:
Interstellar 2014 1080p BluRay.mkv         Interstellar 2014 1080p.mkv
The_Dark_Knight_2008_720p.mp4              Interstellar 2014 1080p.mp4
inception.2010.brrip.x264.mkv             Interstellar 2014 1080p.mkv
```

Options: movie name, year, quality, word separator.

#### Sequential

Rename files with a prefix and incrementing number.

```
Before:              After:
IMG_0001.jpg         Beach-Trip-001.jpg
IMG_0002.jpg         Beach-Trip-002.jpg
DSC_3345.jpg         Beach-Trip-003.jpg
photo (1).jpg        Beach-Trip-004.jpg
```

Options: prefix, start number, zero-padding width, separator (dash/underscore/dot/space).

#### Date-Based

Rename files using their creation date.

```
Before:              After:
IMG_0001.jpg         Lisbon-2025-01-15_09-00-00-001.jpg
IMG_0002.jpg         Lisbon-2025-01-15_14-00-00-002.jpg
IMG_0003.jpg         Lisbon-2025-02-20_08-00-00-003.jpg
```

Options: date format (YYYY-MM-DD / DD-MM-YYYY / MM-DD-YYYY), optional prefix.

#### Change Case

Convert filename casing. Automatically collapses double/triple spaces into single spaces.

```
Title Case:     my show name.mkv         → My Show Name.mkv
UPPERCASE:      my show name.mkv         → MY SHOW NAME.mkv
lowercase:      My Show Name.mkv         → my show name.mkv
Sentence case:  MY SHOW NAME.mkv         → My show name.mkv
```

#### Swap Delimiter

Replace one delimiter character with another across all filenames.

```
Dots to spaces:         My.Show.S01E01.720p.mkv     → My Show S01E01 720p.mkv
Spaces to underscores:  My Show S01E01.mkv           → My_Show_S01E01.mkv
Underscores to dashes:  my_vacation_photo_01.jpg     → my-vacation-photo-01.jpg
```

#### Auto Enumerate

Number files sequentially. Choose the sort order to control which file gets which number.

```
By name:           photo-a.jpg → 001.jpg, photo-b.jpg → 002.jpg, photo-c.jpg → 003.jpg
By date created:   (oldest first) → 001.jpg, 002.jpg, 003.jpg
By date modified:  (oldest first) → 001.jpg, 002.jpg, 003.jpg
By file size:      (smallest first) → 001.jpg, 002.jpg, 003.jpg
By name length:    (shortest first) → 001.jpg, 002.jpg, 003.jpg
```

Options: prefix (optional), start number, zero-padding, separator, sort order.

#### Change Extension

Bulk convert file extensions. Optionally filter by current extension.

```
All .jpeg to .jpg:     photo1.jpeg → photo1.jpg,  photo2.jpeg → photo2.jpg
All .txt to .md:       notes.txt → notes.md,  readme.txt → readme.md
All files to .bak:     report.docx → report.bak,  data.csv → data.bak
```

Options: from extension (optional filter), new extension.

#### Find & Replace

Plain text or regex find and replace on filenames. Extension preserved by default.

```
Remove quality tags:   My.Show.S01E01.720p.BluRay.x264-GROUP.mkv → My.Show.S01E01.mkv
Swap word order:       John.Smith.Resume.pdf → Smith.John.Resume.pdf  (regex: (\w+)\.(\w+) → $2.$1)
```

Options: find pattern, replace text, regex toggle.

---

### Smart Organize Episodes

Point this at a folder of bulk-downloaded episodes and it figures everything out. Auto-detects episode numbers from filenames, splits into seasons, creates season folders, and renames with proper formatting.

```
Before (flat folder):
001.mkv
002.mkv
...
026.mkv

After (with episodes-per-season = 13):
Season 01/
  Demon.Slayer.S01E01.mkv
  Demon.Slayer.S01E02.mkv
  ...
  Demon.Slayer.S01E13.mkv
Season 02/
  Demon.Slayer.S02E01.mkv
  ...
  Demon.Slayer.S02E13.mkv
```

**Supported filename formats:**

| Format | Example |
|---|---|
| Standard TV | `S01E01`, `s01e01`, `1x01` |
| Anime fansub | `[SubsPlease] Show Name - 01 [1080p]` |
| Verbose | `Episode 01`, `Ep01`, `EP01` |
| Bare numbers | `001.mkv`, `01 - Title.mkv` |
| Partial | `Show.Name.E01` |
| Trailing | `ShowName_01.mkv` |

**Season detection:**
- If filenames already contain season info (`S01E01`), it's used directly
- Otherwise, set episodes-per-season manually (e.g. 12 for anime, 22 for US TV)
- Or enable TheTVDB to fetch the real breakdown automatically

**Customizable templates:**
- Folder: `Season {season}`, `{show} - Season {season}`, etc.
- File: `{show}.S{season}E{episode}`, `{show} - {season}x{episode}`, etc.

---

### Smart Find & Replace

A dedicated multi-rule find and replace tool. More powerful than the basic Find & Replace preset.

```
Before:
My.Show.S01E01.720p.BluRay.x264-GROUP.mkv
My.Show.S01E02.720p.BluRay.x264-GROUP.mkv
My.Show.S01E03.1080p.HDTV.x264-FLEET.mkv
My Show S01E04 PROPER 720p WEB-DL.mkv
totally unrelated document.pdf

Rule 1 (regex): \.720p\.BluRay.*?-\w+  →  (empty)
Rule 2 (regex): [ _.]  →  .
Rule 3 (regex): \.1080p.*$  →  (empty)
File filter:    *.mkv

After:
My.Show.S01E01.mkv
My.Show.S01E02.mkv
My.Show.S01E03.mkv
My.Show.S01E04.mkv
totally unrelated document.pdf  (untouched — filtered out)
```

Features:
- Up to 3 rules applied in sequence
- Regex with capture groups (`$1`, `$2`)
- File filter with glob patterns (`*.mkv`, `*.{mkv,mp4}`, `photo_*`)
- Case sensitivity toggle per rule
- Option to include file extension in the replacement scope

---

### Sort Files by Date

Organize files into subfolders by creation date. Works with any file type.

```
Before (flat folder):
IMG_0001.jpg  (created Jan 15)
IMG_0002.jpg  (created Jan 15)
IMG_0003.jpg  (created Feb 20)
IMG_0004.jpg  (created Feb 20)
IMG_0005.jpg  (created Mar 10)

After (grouped by month):
2025-01/
  IMG_0001.jpg
  IMG_0002.jpg
2025-02/
  IMG_0003.jpg
  IMG_0004.jpg
2025-03/
  IMG_0005.jpg
```

Granularity: day (`2025-01-15/`), month (`2025-01/`), or year (`2025/`). Choose to move or copy files.

---

### Sort Photos by Location

Organize photos into subfolders based on GPS data embedded in EXIF metadata. Uses OpenStreetMap Nominatim for reverse geocoding — no API key required.

```
Before (flat folder):
IMG_1001.jpg  (GPS: 38.7223° N, 9.1393° W)
IMG_1002.jpg  (GPS: 38.7223° N, 9.1393° W)
IMG_1003.jpg  (GPS: 35.6762° N, 139.6503° E)
IMG_1004.jpg  (no GPS data)

After (grouped by city):
Lisbon/
  IMG_1001.jpg
  IMG_1002.jpg
Tokyo/
  IMG_1003.jpg
No Location Data/
  IMG_1004.jpg  (stays in original folder)
```

Granularity: city, state/region, or country. Choose to move or copy. Supported formats: JPEG, TIFF, HEIC, DNG, CR2, NEF, ARW, ORF, RW2.

---

## Preset Shortcuts

Each rename mode is also available as a standalone command that opens directly to that preset. Useful for assigning aliases — e.g. set `tv` as alias for "Rename as TV Show".

| Command | Preset |
|---|---|
| Rename as TV Show | `Show Name S01E01.ext` |
| Rename as Anime | `[Group] Name - 01 [Quality].ext` |
| Rename as Movie | `Name Year Quality.ext` |
| Rename Sequentially | `Prefix-001.ext` |
| Rename by Date | `Prefix-2025-01-15_09-00-00-001.ext` |
| Change Filename Case | UPPERCASE / lowercase / Title Case / Sentence case |
| Swap Filename Delimiter | Replace any delimiter with another |
| Auto Enumerate Files | Number files by name, date, size, or name length |
| Change File Extension | `.jpeg` → `.jpg`, `.txt` → `.md`, etc. |

---

## Instant Commands

Zero-UI commands that execute immediately against the current Finder folder. No forms, no previews, no clicks. Run the command and files are renamed.

After running any instant command, use **"Undo Last Rename"** to revert. Works within 5 minutes of execution.

### Case Conversion

| Command | Before | After |
|---|---|---|
| **Uppercase All Filenames** | `my vacation photo.jpg` | `MY VACATION PHOTO.jpg` |
| **Lowercase All Filenames** | `My Vacation PHOTO.jpg` | `my vacation photo.jpg` |
| **Title Case All Filenames** | `my vacation photo.jpg` | `My Vacation Photo.jpg` |
| **Sentence Case All Filenames** | `MY VACATION PHOTO.jpg` | `My vacation photo.jpg` |

All case commands also collapse multiple spaces into single spaces.

### Delimiter Conversion

| Command | Before | After |
|---|---|---|
| **Replace Dots with Spaces** | `My.Show.S01E01.720p.mkv` | `My Show S01E01 720p.mkv` |
| **Replace Spaces with Dots** | `My Show S01E01.mkv` | `My.Show.S01E01.mkv` |
| **Replace Underscores with Spaces** | `my_vacation_photo.jpg` | `my vacation photo.jpg` |
| **Replace Spaces with Underscores** | `my vacation photo.jpg` | `my_vacation_photo.jpg` |
| **Replace Dashes with Spaces** | `my-vacation-photo.jpg` | `my vacation photo.jpg` |
| **Replace Spaces with Dashes** | `my vacation photo.jpg` | `my-vacation-photo.jpg` |

### Utility

| Command | Before | After |
|---|---|---|
| **Collapse Multiple Spaces** | `my   show  name.mkv` | `my show name.mkv` |
| **Enumerate Files by Name** | `photo-a.jpg`, `photo-b.jpg`, `photo-c.jpg` | `001.jpg`, `002.jpg`, `003.jpg` |
| **Enumerate Files by Date Created** | (sorted oldest to newest) | `001.jpg`, `002.jpg`, `003.jpg` |

### Undo

| Command | Description |
|---|---|
| **Undo Last Rename** | Reverts the last instant command. Available for 5 minutes after execution. Single use — cannot undo twice. |

---

## TheTVDB Integration

The **Smart Organize Episodes** command can optionally use [TheTVDB](https://thetvdb.com) to fetch real season and episode data for any TV show or anime. This means you don't need to manually set episodes-per-season — it knows that Breaking Bad Season 1 has 7 episodes and Season 5 has 16.

**Setup:**
1. Create a free account at [thetvdb.com](https://thetvdb.com)
2. Get an API key from your [dashboard](https://www.thetvdb.com/dashboard/account/apikey)
3. Open Raycast Preferences → Extensions → Rebaptize → paste the key

Without a key, everything still works — you just set the episodes-per-season count manually.

---

## Tips

- **Aliases** — Open Raycast → search for any command → `⌘K` → Configure Command → set an Alias. Examples: `tv` for Rename as TV Show, `uc` for Uppercase All, `undo` for Undo Last Rename.
- **Hotkeys** — Same menu. Assign a global keyboard shortcut to any command.
- **Finder** — All commands auto-detect the current Finder folder. Just navigate to the right folder in Finder before invoking a command.
- **Smart detection** — Rebaptize Files and Smart Organize analyze the files on launch and auto-fill fields: show name from common filename prefix, season numbers from `SxxExx` patterns, and suggested preset based on file contents.
- **Undo** — After any instant command, run "Undo Last Rename" within 5 minutes to revert. Only the most recent instant action can be undone.
- **File filter** — Smart Find & Replace supports glob patterns like `*.mkv`, `*.{jpg,png}`, `photo_*` to target specific files in a mixed folder.

---

## All Commands

### Full UI (5)

| # | Command | Description |
|---|---|---|
| 1 | Rebaptize Files | Main command with all presets |
| 2 | Smart Organize Episodes | Auto-detect episodes, sort into season folders |
| 3 | Sort Files by Date | Organize into date-named folders |
| 4 | Sort Photos by Location | Organize by EXIF GPS data |
| 5 | Smart Find & Replace | Multi-rule regex find & replace |

### Preset Shortcuts (9)

| # | Command | Description |
|---|---|---|
| 6 | Rename as TV Show | Direct to TV Show preset |
| 7 | Rename as Anime | Direct to Anime preset |
| 8 | Rename as Movie | Direct to Movie preset |
| 9 | Rename Sequentially | Direct to Sequential preset |
| 10 | Rename by Date | Direct to Date-Based preset |
| 11 | Change Filename Case | Direct to Change Case preset |
| 12 | Swap Filename Delimiter | Direct to Swap Delimiter preset |
| 13 | Auto Enumerate Files | Direct to Auto Enumerate preset |
| 14 | Change File Extension | Direct to Change Extension preset |

### Instant (14)

| # | Command | Description |
|---|---|---|
| 15 | Uppercase All Filenames | `my file` → `MY FILE` |
| 16 | Lowercase All Filenames | `MY FILE` → `my file` |
| 17 | Title Case All Filenames | `my file` → `My File` |
| 18 | Sentence Case All Filenames | `MY FILE` → `My file` |
| 19 | Replace Dots with Spaces | `a.b.c` → `a b c` |
| 20 | Replace Spaces with Dots | `a b c` → `a.b.c` |
| 21 | Replace Underscores with Spaces | `a_b_c` → `a b c` |
| 22 | Replace Spaces with Underscores | `a b c` → `a_b_c` |
| 23 | Replace Dashes with Spaces | `a-b-c` → `a b c` |
| 24 | Replace Spaces with Dashes | `a b c` → `a-b-c` |
| 25 | Collapse Multiple Spaces | `a  b   c` → `a b c` |
| 26 | Enumerate Files by Name | Alphabetical → `001`, `002`, `003` |
| 27 | Enumerate Files by Date Created | Oldest first → `001`, `002`, `003` |
| 28 | Undo Last Rename | Revert last instant command (5 min window) |

---

## Requirements

- macOS
