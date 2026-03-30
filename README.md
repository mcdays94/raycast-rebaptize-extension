# Rebaptize

A [Raycast](https://raycast.com) extension for bulk renaming and organizing files.

## Commands

### Rebaptize Files

Bulk rename files in a folder using presets for common use-cases. Works with any file type.

**Presets:**

| Preset | Example Output |
|---|---|
| TV Show | `Breaking.Bad.S01E01.mkv` |
| Anime | `[SubsPlease] Jujutsu Kaisen - 01 [1080p].mkv` |
| Movie | `Interstellar.2014.1080p.mkv` |
| Sequential | `Vacation-001.jpg` |
| Date-Based | `Trip-2026-03-30_14-30-00-001.jpg` |
| Find & Replace | `My.Old.Name.txt → My.New.Name.txt` |

**Usage:**

1. Open Raycast and search for **"Rebaptize Files"**
2. Select a folder
3. Choose a preset and configure the options
4. Live preview updates as you type
5. Submit to see a full preview of all renames
6. Confirm to apply

### Sort Photos by Location

Organize photos into subfolders based on GPS location data embedded in EXIF metadata. Uses OpenStreetMap for reverse geocoding — no API key required.

**Granularity options:**
- **City** — e.g. `Lisbon/`, `Tokyo/`, `New York/`
- **State / Region** — e.g. `California/`, `Bavaria/`
- **Country** — e.g. `Portugal/`, `Japan/`

**File actions:**
- **Move** — moves files into location subfolders
- **Copy** — copies files, keeping originals in place

Photos without GPS data are left untouched.

**Supported formats:** JPEG, TIFF, HEIC, DNG, CR2, NEF, ARW, ORF, RW2

**Usage:**

1. Open Raycast and search for **"Sort Photos by Location"**
2. Select a folder of photos
3. Choose granularity (city, state, or country) and action (move or copy)
4. Preview the location groups and file counts
5. Confirm to organize

## Requirements

- macOS
