# Rebaptize - Project Context

## Status: 🎉 LIVE in Raycast Store (merged 2026-05-12)

- **Store page:** https://raycast.com/miguel_caetano_dias/rebaptize
- **Store PR (MERGED):** https://github.com/raycast/extensions/pull/26792
- **Merged by:** raycastbot at 2026-05-12 11:35 UTC (merge commit `72f13eb`)

## Overview

Raycast extension for bulk renaming and organizing files. **40 commands total.**
- Extension title (Raycast Store display): **"Rebaptize - Rename"**
- Project name / README header: **"Rebaptize"** (the brand identity is still "Rebaptize"; "- Rename" is appended to the store title for discoverability)
- Author: `miguel_caetano_dias` (Raycast Store username)

## Repositories

- **Development repo:** https://github.com/mcdays94/raycast-rebaptize-extension
- **Store PR (MERGED):** https://github.com/raycast/extensions/pull/26792
- **Store page:** https://raycast.com/miguel_caetano_dias/rebaptize
- **Raycast extensions monorepo:** https://github.com/raycast/extensions

## Publishing Workflow

1. Develop locally, commit and push to `mcdays94/raycast-rebaptize-extension`
2. Run `npm run publish` to create/update a PR in `raycast/extensions`
3. The CLI handles forking, copying code, and opening/updating the PR
4. Raycast team reviews and merges -- extension goes live in the Store
5. If someone else contributes directly to `raycast/extensions`, run `npx @raycast/api@latest pull-contributions` to sync their changes back before next publish

## What We Did (March 31, 2026) — Initial Submission

### Raycast Store Submission Prep

1. **Set author** to `miguel_caetano_dias` in package.json (created Raycast account with Google)
2. **Upgraded dependencies:**
   - `@raycast/api` from ^1.93.2 to latest (1.104.11)
   - `@raycast/eslint-config` from 1.0.11 to 2.1.1
   - `eslint` from ^8 to ^9
3. **Fixed ESLint flat config compatibility** -- `@raycast/eslint-config@2.1.1` has a bug where index 5 in the config array is a nested array. Fixed with `.flat(Infinity)` in `eslint.config.js`
4. **Fixed all ESLint errors (13 total):**
   - Removed unused `Alert` import from 5 files (rebaptize.tsx, smart-find-replace.tsx, smart-organize.tsx, sort-by-date.tsx, sort-by-location.tsx)
   - Removed dead state variables `analysis`/`analyzed` in rebaptize.tsx
   - Made `animeSeason` a const instead of unused state setter in rebaptize.tsx
   - Fixed `Icon.Tv` -> `Icon.Monitor` and `Icon.Film` -> `Icon.FilmStrip` in rebaptize.tsx
   - Fixed `let` -> `const` for `spaced` in file-analyzer.ts
   - Fixed title case: `"Move Up"` -> `"Move up"` in create-script.tsx
   - Removed unused `_globalIndex` param in scripts.ts
   - Removed unused `folderName` function in sort-by-date.tsx
   - Removed unused `i` param in rebaptize.tsx map callback
5. **Prettier auto-formatted** all 15 source files
6. **Renumbered screenshots** from gaps (1, 3, 4, 7, 10, 11) to sequential (1-6)
7. **Removed .DS_Store** from metadata folder
8. **Fixed TypeScript strict check** -- CI runs `tsc --noEmit` which caught `exif.gps` type error in location.ts. Cast fallback with `as any` for exif-reader v1 compat.
9. **Added MIT LICENSE file**
10. **Added icon to README** header
11. **Set repo About section** -- description, homepage URL, and topics (raycast, raycast-extension, bulk-rename, file-management, macos, productivity)

### PR Submission

- Ran `npm run publish` which created draft PR #26792
- Filled in PR description with key features, preferences, checked all checklist items
- All CI checks passed after the TypeScript + LICENSE follow-up push

## What We Did (May 12, 2026) — Review Feedback Cycle

After ~6 weeks in the review queue, 0xdhrv (Raycast team) returned with one discoverability suggestion. Greptile (automated bot reviewer) found several real correctness issues across 4 review rounds. All addressed in 4 commits, then the PR was merged by raycastbot.

### Reviewer (0xdhrv) feedback — addressed in `981054d`

- **Extension title** renamed from `"Rebaptize"` to **`"Rebaptize - Rename"`** for store discoverability (since "Rebaptize" is a coined name, not descriptive on its own)
- Removed the redundant `"subtitle": "Rebaptize"` from all 33 sub-commands so they consistently inherit the new extension title in the Raycast picker (instead of half showing "Rebaptize - Rename" and half showing the old "Rebaptize" subtitle)

### Greptile Round 1 cleanups — addressed in `981054d`

- Removed unused dependencies: `@raycast/utils`, `node-fetch`
- Removed manual `interface Preferences` in `tmdb.ts` / `tvdb.ts`; use auto-generated global type from `raycast-env.d.ts`
- **Added `raycast-env.d.ts` to `tsconfig.json` `include` array** (otherwise the global `Preferences` type can't resolve at `tsc --noEmit` time — Raycast template has this by default but our tsconfig didn't)
- Switched `eslint.config.js` to use `defineConfig` from `eslint/config` (ESLint v9 idiom)
- Moved Nominatim rate-limit sleep inside `reverseGeocode` so cache hits don't pay the 1.1s tax

### Greptile Round 2 — Partial-rename atomicity (commit `fb5fdf0`)

**The bug:** if `fsRename` throws mid-batch (name conflict, permission error), `saveUndoState` was never reached. Files renamed before the failure had no undo entry — silent unrecoverable partial state.

**The fix pattern:** track completed renames incrementally; persist undo state from the catch path so partial runs are recoverable via "Undo Last Rename". Applied to:
- `instant-runner.ts` (shared by 23 instant commands)
- `rename-from-csv.tsx`
- `sort-by-date.tsx` + `sort-by-location.tsx`
- `location.ts` (`organizeByLocation` helper, called by sort-by-location)

`organizeByDate` / `organizeByLocation` return `{ count, changes, error? }` instead of throwing, so the caller always sees partial state.

### Greptile Round 3 — Atomicity sweep + episode map collision (commit `e662ce3`)

**More atomicity sites** (Greptile flagged 2, we proactively swept the rest):
- `smart-organize.tsx` (flagged)
- `exif-rename.tsx` (flagged)
- `smart-find-replace.tsx`, `run-script.tsx`, `instant-parent-folder.ts`, `instant-enumerate-by-{date,name}.ts` (proactive)

**Extracted `executeRenames` helper** in `instant-runner.ts` — the 3 standalone instant commands + `runInstantRename` now share one atomicity implementation.

**Episode map collision fix** (flagged P1): when files have explicit season info (S01E05, S02E05), the original `Map<number, ...>` collided on `episodeNumber = 5`, silently overwriting Season 1's entry with Season 2's. Misassigned every Season 1 file to Season 2 in multi-season folders.

Fix: changed to `Map<string, ...>` with disambiguated keys:
- `"abs:N"` — absolute episode N (files numbered 001, 002, …)
- `"S-E"` — season + episode (files labelled S##E##)

The TMDB/TVDB and manual+assignSeasons paths store BOTH keys via `setBothKeys()` so lookups work regardless of the file's own naming scheme.

### Greptile Round 4 — Key mismatch fix (commit `679f98a`)

Self-inflicted defect from Round 3: the manual+hasSeasons branch was using a hand-rolled key at set time (`"${season ?? 1}-${ep}"`) while the lookup used `keyForFile(p)`, which returns `"abs:N"` for files without explicit season info. Result: mixed-naming folders (e.g. `S01E05.mkv` + `05.mkv` together) silently dropped the absolute-numbered files from the organized output.

Fix: use `keyForFile(p)` at both set and lookup sites so the keys derive identically.

Also refreshed two stale README counts that had drifted as the extension grew:
- `30 commands` → `40 commands`
- `Available step types (24)` → `(23)`

### Greptile Round 5 — Zero findings

The atomicity sweep + careful key fix produced zero new findings on commit `679f98a` (i.e. `5fa8870` on the PR side). Cycle broken.

### Merge

- 0xdhrv signed off after seeing the cc on the round-4 commit
- raycastbot auto-merged at 2026-05-12 11:35 UTC (merge commit `72f13eb`)
- Extension now live in Raycast Store at https://raycast.com/miguel_caetano_dias/rebaptize

## README Audit (current state)

All 40 commands documented. All 2 preferences documented. Sections:
- Getting Started
- Rename Files (8 presets with full option tables — TV Show, Anime, Movie, Date-Based, Change Case, Swap Delimiter, Auto Enumerate, Change Extension, Find & Replace)
- Smart Organize Episodes (9 filename patterns, options, season config, detection)
- Smart Find & Replace
- Sort Files by Date
- Sort Photos by Location
- Rename Photos by EXIF
- Rename from CSV
- Custom Rename Scripts (Create + Run, 23 step types)
- Preset Shortcuts (8 commands)
- Instant Commands (case, delimiter, clean up, utility, undo)
- Finder Detection
- Metadata Integration (TMDB + TheTVDB setup)
- Tips

## Key Files

- `package.json` -- extension manifest. Title: `"Rebaptize - Rename"`. 40 commands, 2 preferences. **No `subtitle` fields** on the sub-commands (removed 2026-05-12 so they consistently inherit the extension title in the Raycast picker).
- `eslint.config.js` -- uses `defineConfig` from `eslint/config`, with `.flat(Infinity)` workaround for the `@raycast/eslint-config@2.1.1` nested-array bug.
- `tsconfig.json` -- `include` array contains BOTH `src/**/*` AND `raycast-env.d.ts` (necessary for the global auto-generated `Preferences` type to resolve at `tsc --noEmit` time).
- `src/instant-runner.ts` -- exports `getFinderFiles`, `saveUndoState`, `executeRenames` (shared atomicity helper added 2026-05-12), `runInstantRename`. The atomicity helper persists undo state on both happy and catch paths so partial-failure batches are recoverable.
- `src/smart-organize.tsx` -- `episodeMap` uses `Map<string, ...>` with `"abs:N"` / `"S-E"` keys, derived via `keyForFile(p)` consistently at set and lookup. Prevents multi-season collisions and mixed-naming silent drops.
- `src/location.ts` -- `organizeByLocation` returns `{ count, changes, error? }`. Nominatim rate-limit sleep is inside `reverseGeocode` (the HTTP path), so cache hits don't pay the 1.1s tax. `exif.gps` fallback cast for exif-reader v1 compat.
- `metadata/rebaptize-{1-6}.png` -- 6 screenshots, 2000x1250px
- `assets/icon.png` -- 512x512px extension icon
- `CHANGELOG.md` -- version history with `{PR_MERGE_DATE}` placeholders. Untouched during May 12 review feedback (those changes were pre-merge polishing, not new release content).

## Lessons (for future review cycles)

1. **Greptile is diff-scoped.** Each push triggers a re-review that focuses on changed files + adjacent code. Yields can be hidden in nearby code that wasn't touched yet. When fixing a class of bug (atomicity, collisions, etc.), **proactively sweep the entire codebase for the same pattern** in one push rather than fixing only the flagged sites — saves 1-2 review cycles.
2. **Verify counts in the README before each push.** As the extension grows, counts ("30 commands", "24 step types") become stale and can be flagged as inaccuracies during review.
3. **The `runInstantRename` -> `executeRenames` extraction** is the canonical pattern for new instant commands: keep the rename logic separate from the file-fetching/transform logic so future commands don't have to re-implement the atomicity defensive code.
4. **For Map-based lookups, define a single key-derivation function and use it at both set and lookup sites.** Hand-rolling keys on either side is a recipe for silent drops or collisions.
