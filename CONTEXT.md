# Rebaptize - Project Context

## Overview

Raycast extension for bulk renaming and organizing files. 30 commands total.
Author: miguel_caetano_dias (Raycast Store username)

## Repositories

- **Development repo:** https://github.com/mcdays94/raycast-rebaptize-extension
- **Store PR:** https://github.com/raycast/extensions/pull/26792
- **Store page (once merged):** https://raycast.com/miguel_caetano_dias/rebaptize
- **Raycast extensions monorepo:** https://github.com/raycast/extensions

## Publishing Workflow

1. Develop locally, commit and push to `mcdays94/raycast-rebaptize-extension`
2. Run `npm run publish` to create/update a PR in `raycast/extensions`
3. The CLI handles forking, copying code, and opening the PR
4. Raycast team reviews and merges -- extension goes live in the Store
5. If someone else contributes directly to `raycast/extensions`, run `npx @raycast/api@latest pull-contributions` to sync their changes back before next publish

## What We Did (March 31, 2026)

### Raycast Store Submission Prep

1. **Set author** to `miguel_caetano_dias` in package.json (created Raycast account with Google)
2. **Upgraded dependencies:**
   - `@raycast/api` from ^1.93.2 to latest (1.104.11)
   - `@raycast/eslint-config` from 1.0.11 to 2.1.1
   - `eslint` from ^8 to ^9
3. **Fixed ESLint flat config compatibility** -- `@raycast/eslint-config@2.1.1` has a bug where index 5 in the config array is a nested array. Fixed with `.flat(Infinity)` in `eslint.config.js`
4. **Fixed all ESLint errors (13 total):**
   - Removed unused `Alert` import from 5 files (rebaptize.tsx, smart-find-replace.tsx, smart-organize.tsx, sort-by-date.tsx, sort-by-location.tsx)
   - Removed dead state variables `analysis`/`analyzed` in rebaptize.tsx (setters were called but values never read)
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
8. **Fixed TypeScript strict check** -- CI runs `tsc --noEmit` which caught `exif.gps` type error in location.ts:90. Cast fallback with `as any` for exif-reader v1 compat.
9. **Added MIT LICENSE file**
10. **Added icon to README** header
11. **Set repo About section** -- description, homepage URL, and topics (raycast, raycast-extension, bulk-rename, file-management, macos, productivity)

### PR Submission

- Ran `npm run publish` which created draft PR #26792
- Filled in PR description with all 30 commands, key features, preferences, checked all checklist items
- CI checks: 6 passed, 1 failed (TypeScript strict check) -- fixed and needs republish

### Pending

- Run `npm run publish` again to push the TypeScript fix + LICENSE to the PR
- Click "Ready for review" on the PR once CI is green
- Monitor for issues: bookmark https://github.com/raycast/extensions/issues?q=rebaptize

## README Audit

All 30 commands documented. All 2 preferences documented. Sections:
- Getting Started
- Rename Files (10 presets with full option tables)
- Smart Organize Episodes (patterns, options, season config, detection)
- Smart Find & Replace
- Sort Files by Date
- Sort Photos by Location
- Custom Rename Scripts (Create + Run)
- Preset Shortcuts (9 commands)
- Instant Commands (13 commands: case, delimiter, utility)
- Undo
- Smart Detection
- Finder Detection
- Metadata Integration (TMDB + TheTVDB setup)
- Tips

## Key Files

- `package.json` -- extension manifest, all 30 commands, 2 preferences
- `eslint.config.js` -- flat config with `.flat(Infinity)` workaround
- `src/location.ts:90` -- exif.gps fallback cast for v1 compat
- `metadata/rebaptize-{1-6}.png` -- 6 screenshots, 2000x1250px
- `assets/icon.png` -- 512x512px extension icon
- `CHANGELOG.md` -- version history with {PR_MERGE_DATE} placeholders
