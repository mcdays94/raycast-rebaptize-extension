# Rebaptize

Bulk rename and organize files directly from Raycast. 30 commands covering everything from instant one-shot case conversion to smart TV show episode organization with TheTVDB metadata.

Every function is its own Raycast command — assign aliases and hotkeys to the ones you use most. All commands auto-detect the current Finder folder.

## Getting Started

1. Install from the Raycast Store
2. Open a Finder window to the folder you want to rename
3. Open Raycast and search for any Rebaptize command

No additional setup required. To enable TheTVDB metadata lookup for Smart Organize Episodes, add your free API key in Raycast Preferences (see [TheTVDB Integration](#thetvdb-integration-optional)).

## Commands

### Rebaptize Files

The main command. Select a rename preset, configure options, preview every rename, then confirm.

**TV Show** — Rename into `S01E01` format with configurable word separator and optional suffix.

```
Before                                           After
breaking.bad.s01e01.720p.BluRay.x264-DEMAND.mkv  Breaking Bad S01E01.mkv
breaking.bad.s01e02.720p.BluRay.x264-DEMAND.mkv  Breaking Bad S01E02.mkv
Breaking.Bad.S01E03.HDTV.XviD-LOL.avi            Breaking Bad S01E03.avi
```

**Anime** — Fansub convention with optional sub group and quality tags.

```
Before       After
001.mkv      [SubsPlease] Demon Slayer - 01 [1080p].mkv
002.mkv      [SubsPlease] Demon Slayer - 02 [1080p].mkv
003.mkv      [SubsPlease] Demon Slayer - 03 [1080p].mkv
```

**Movie** — Standard movie format with year and quality.

```
Before                              After
Interstellar 2014 1080p BluRay.mkv  Interstellar 2014 1080p.mkv
The_Dark_Knight_2008_720p.mp4       Interstellar 2014 1080p.mp4
```

**Sequential** — Prefix with incrementing number.

```
Before           After
IMG_0001.jpg     Beach-Trip-001.jpg
IMG_0002.jpg     Beach-Trip-002.jpg
DSC_3345.jpg     Beach-Trip-003.jpg
```

**Date-Based** — Rename using creation date.

```
Before           After
IMG_0001.jpg     Lisbon-2025-01-15_09-00-00-001.jpg
IMG_0002.jpg     Lisbon-2025-01-15_14-00-00-002.jpg
```

**Change Case** — UPPERCASE, lowercase, Title Case, or Sentence case. Collapses multiple spaces automatically.

```
Title Case:     my show name.mkv         →  My Show Name.mkv
UPPERCASE:      my show name.mkv         →  MY SHOW NAME.mkv
lowercase:      My Show Name.mkv         →  my show name.mkv
Sentence case:  MY SHOW NAME.mkv         →  My show name.mkv
```

**Swap Delimiter** — Replace one delimiter with another.

```
Dots to spaces:          My.Show.S01E01.720p.mkv   →  My Show S01E01 720p.mkv
Spaces to underscores:   My Show S01E01.mkv         →  My_Show_S01E01.mkv
```

**Auto Enumerate** — Number files sequentially. Sort by name, date created, date modified, file size, or name length.

```
By name:          photo-a.jpg → 001.jpg, photo-b.jpg → 002.jpg
By date created:  (oldest first) → 001.jpg, 002.jpg, 003.jpg
```

**Change Extension** — Bulk convert file extensions with optional source filter.

```
*.jpeg → *.jpg
*.txt  → *.md
```

**Find & Replace** — Plain text or regex with capture group support.

```
Remove quality tags:  My.Show.S01E01.720p.BluRay.x264-GROUP.mkv  →  My.Show.S01E01.mkv
```

### Smart Organize Episodes

Auto-detect episode numbers from filenames and organize into season folders with proper naming. Supports `S01E01`, `1x01`, `[SubsPlease] Name - 01`, `Episode 01`, `001.mkv`, and more.

```
Before (flat folder):         After:
001.mkv                       Season 01/Demon.Slayer.S01E01.mkv
002.mkv                       Season 01/Demon.Slayer.S01E02.mkv
...                           ...
026.mkv                       Season 02/Demon.Slayer.S02E13.mkv
```

Customizable folder and file templates. Optionally fetches real season data from TheTVDB.

### Smart Find & Replace

Multi-rule find and replace with up to 3 chained regex rules, file glob filters (`*.mkv`, `*.{mkv,mp4}`), and per-rule case sensitivity.

```
Folder contents:                                     File filter: *.mkv
My.Show.S01E01.720p.BluRay.x264-GROUP.mkv            Rule 1: \.720p\.BluRay.*?-\w+  →  (empty)  [regex]
My.Show.S01E02.720p.BluRay.x264-GROUP.mkv            Rule 2: \.1080p.*$  →  (empty)  [regex]
My.Show.S01E03.1080p.HDTV.x264-FLEET.mkv
notes.txt (filtered out)                              Result: My.Show.S01E01.mkv, My.Show.S01E02.mkv, ...
```

### Sort Files by Date

Organize files into subfolders by creation date. Group by day (`2025-01-15/`), month (`2025-01/`), or year (`2025/`). Move or copy.

### Sort Photos by Location

Organize photos into subfolders by EXIF GPS data. Group by city, state, or country. Uses OpenStreetMap — no API key required. Supports JPEG, TIFF, HEIC, DNG, and RAW formats.

```
Before:                After (by city):
IMG_1001.jpg (Lisbon)  Lisbon/IMG_1001.jpg
IMG_1002.jpg (Lisbon)  Lisbon/IMG_1002.jpg
IMG_1003.jpg (Tokyo)   Tokyo/IMG_1003.jpg
```

### Create Rename Script

Build reusable rename pipelines. Define a file filter, chain multiple rename steps, preview against the current Finder folder, and save for later.

Example pipeline:
1. **Filter:** `*.mkv`
2. **Step 1:** Swap Delimiter `.` to ` `
3. **Step 2:** Title Case
4. **Step 3:** Rename as TV Show (Breaking Bad, S01)

### Run Rename Script

List and execute saved scripts. Edit existing scripts with `Cmd + E`. Preview before confirming. Supports undo.

### Undo Last Rename

Reverts the last instant command or script execution. Available within 5 minutes.

## Preset Shortcuts

Each preset is available as a standalone command for direct access:

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
| Change File Extension | `.jpeg` to `.jpg`, `.txt` to `.md` |

## Instant Commands

Zero-UI commands that execute immediately against the current Finder folder. No forms, no clicks.

| Command | Example |
|---|---|
| Uppercase All Filenames | `my vacation photo.jpg` → `MY VACATION PHOTO.jpg` |
| Lowercase All Filenames | `My Vacation PHOTO.jpg` → `my vacation photo.jpg` |
| Title Case All Filenames | `my vacation photo.jpg` → `My Vacation Photo.jpg` |
| Sentence Case All Filenames | `MY VACATION PHOTO.jpg` → `My vacation photo.jpg` |
| Replace Dots with Spaces | `My.Show.S01E01.mkv` → `My Show S01E01.mkv` |
| Replace Spaces with Dots | `My Show.mkv` → `My.Show.mkv` |
| Replace Underscores with Spaces | `my_file.jpg` → `my file.jpg` |
| Replace Spaces with Underscores | `my file.jpg` → `my_file.jpg` |
| Replace Dashes with Spaces | `my-file.jpg` → `my file.jpg` |
| Replace Spaces with Dashes | `my file.jpg` → `my-file.jpg` |
| Collapse Multiple Spaces | `my   show  name.mkv` → `my show name.mkv` |
| Enumerate Files by Name | Alphabetical → `001.ext`, `002.ext`, `003.ext` |
| Enumerate Files by Date Created | Oldest first → `001.ext`, `002.ext`, `003.ext` |

## TheTVDB Integration (Optional)

Smart Organize Episodes can fetch real season and episode data from [TheTVDB](https://thetvdb.com).

1. Create a free account at [thetvdb.com](https://thetvdb.com)
2. Get an API key from your [dashboard](https://www.thetvdb.com/dashboard/account/apikey)
3. Open Raycast Preferences → Extensions → Rebaptize → paste the key in **TheTVDB API Key**

Without a key, everything works — you set the episodes-per-season count manually instead.

## Tips

- **Aliases:** Search any command → `Cmd + K` → Configure Command → set an alias (e.g. `tv` for Rename as TV Show, `undo` for Undo Last Rename)
- **Hotkeys:** Same menu — assign a global keyboard shortcut
- **Finder:** All commands auto-detect the current Finder folder. Navigate to the right folder before invoking
- **Smart detection:** Rebaptize Files and Smart Organize analyze files and auto-fill show name, season numbers, and suggested preset
- **Undo:** After any instant command or script, run Undo Last Rename within 5 minutes to revert
- **Scripts:** Build and save custom rename pipelines with Create Rename Script, run them from Run Rename Script
