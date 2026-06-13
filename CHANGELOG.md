# Changelog

All notable changes to Tsundoku are listed here. Newest first.

## 1.5.1 — 2026-06-12
- **Faster loading.** The 1.5.0 request pacing was too conservative; it's now adaptive — quick by default (~0.55s spacing) and only slows down if VNDB actually starts throttling, then speeds back up. Steam links/screenshots are fetched at high priority so they appear sooner.
- No more flash when adding/removing a title to the wishlist from its detail page (the button updates in place instead of re-rendering the whole panel).
- Browse sidebar polish: the search field matches the rail's styling, tag chips sit on their own row (no longer sharing a line with "Allow 18+"), and tighter, cleaner spacing.

## 1.5.0 — 2026-06-12
- **Fixed VNDB rate-limit stalls (429).** All VNDB calls now go through a single paced, prioritised queue with proper backoff + caching, so Browse keeps loading as you scroll, cards load quickly, and detail pages reliably show their tags and Steam gallery (which were vanishing when the detail fetch got throttled). Background metadata enrichment now yields to whatever you're actively doing.
- **Detail description no longer collapses** to one line on tag-heavy / Steam titles — it shows in full and the panel scrolls.
- **Private wishlist** — a separate, private wishlist alongside the main one. Toggle Public/Private in the Wishlist header; add titles via the 🔒 button in a title's detail page. (Not NSFW-hidden, so it's the spot for private titles.)
- **New-game alerts** — on startup Tsundoku scans your folders and, if it finds newly installed games (including new Steam games when Steam is a scan folder), shows a "Review & add" strip. Reuses your scan decisions, so it won't nag about ones you've already added or skipped.
- Browse **Sidebar** layout now keeps the search bar inside the sidebar too.

## 1.4.9 — 2026-06-12
- **Filter Browse by multiple tags** — type a tag and press Enter to add it as a chip; add several and titles must match all of them. Remove a tag with its ✕.
- Removed the stray "+" next to the rating filter.
- **Scanner remembers your choices** — folders whose match you left unchecked stay deselected on future rescans, so you only ever confirm genuinely new matches (re-tick one anytime to add it).

## 1.4.8 — 2026-06-12
- A title's detail panel now always offers **Remove from library** alongside **Exclude from library**, so you can fully remove an item even when it's installed and not excluded (previously Remove only appeared for not-installed or excluded titles).

## 1.4.7 — 2026-06-12
- Browse sidebar: each filter group (Year / Rating / Length / Studio / Tag) now sits on its own row, and the rail is a little wider so it doesn't feel empty.

## 1.4.6 — 2026-06-12
- **Browse sidebar is back, done right** — the optional right-rail layout now uses compact chips that wrap to fit the narrow column (no more giant stretched buttons), and the rail is sticky so the sort & filters stay on screen as you scroll through titles.

## 1.4.5 — 2026-06-12
- **Backups now include your appearance & preferences** — theme, color palette, auto-schedule, card size, zoom, title language, and NSFW toggles are saved in the export and restored on import (library merge and per-PC install paths are unchanged).
- Reverted the Browse sidebar layout option (the filters didn't lay out well in the narrow column) — Browse is back to the top sort/filter bar.

## 1.4.4 — 2026-06-12
- **Browse layout option** — a new "Browse controls" setting in Settings → Appearance lets you move the sort + filters into a right-hand sidebar (Steam-style), where the filters stay open beside the results, or keep them across the top as before.

## 1.4.3 — 2026-06-12
- **"Also delete my library data" now wipes everything.** It previously removed only the current data folder, so a reinstall would restore your library from the old `%APPDATA%` fallback copy (left behind by the data-location move) — making it look like the delete did nothing. The wipe now clears every location the app can restore from.

## 1.4.2 — 2026-06-12
- The "Also delete my library data" wipe no longer briefly flashes a terminal window — it now runs hidden in the background.

## 1.4.1 — 2026-06-12
- **Fixed "Also delete my library data" not actually wiping anything** — the in-process delete raced the OS releasing the data-folder watch handle and silently failed. The wipe now runs from a detached shell after the app exits, so it reliably removes `C:\ProgramData\Tsundoku` and `%LOCALAPPDATA%\Tsundoku`.
- Sky theme: lighter, more pastel logo color.

## 1.4.0 — 2026-06-12
A consolidated roundup of everything added and fixed across the 1.3.x line, plus a clickable Releases link in Settings → About.

**Themes & appearance**
- Renamed palettes: Yellow → **Banana** (softer pastel background with a bold accent), Green → **Mint** (de-saturated dark mode), Lav → **Lavender**, Gray → **Stone**. Your saved theme migrates automatically.
- Four card sizes — **Small, Cozy, Comfortable, Large** — in Settings → Appearance.
- Responsive layout: the search bar, library heading and detail panel adapt as the window shrinks (on narrow windows the panel collapses and titles open in a modal instead).
- Dark mode: active settings tab, selected collection and active filter are clearly highlighted.
- A little more breathing room above the top-bar logo.

**Library**
- **Library search** filters your shelf in real time.
- **List view** option (a rich row per title) alongside the grid.
- **Collections** are now a view with their own heading and an **Add to collection** picker (with search; includes excluded titles when "Show excluded entries" is on).
- **Manage** button: bulk-select titles to Hide (exclude) or Remove at once.
- **Exclude / Include / Remove** controls in the detail modal, including for titles not installed on this PC.
- Fixed collection-sidebar glitches (scrolling, selected-row overlap and clipping).

**Stats**
- **Start & finish dates** recorded per title, shown in the detail panel and modal.
- Reading **sessions log** and **Longest session** card; **Wishlisted** count; color-coded library breakdown bar.

**Browse & Wishlist**
- **Wishlist search**; wishlist cards show the release year; release alerts for wishlisted titles on startup.
- Browse filters: specific **developer** match, typed **rating** threshold, **year/decade** range, and an **Allow 18+** toggle — all kept consistent with the NSFW settings.
- **Steam integration**: a "View on Steam" button and screenshot gallery on matched titles.

**Data, syncing & updates**
- **Fixed data location** at `C:\ProgramData\Tsundoku` — identical on every PC, no username in the path (existing libraries migrate automatically).
- **Syncthing-friendly**: the app auto-reloads on external changes, and each game's install path is stored locally per-PC so syncing never overwrites where a game lives.
- **Backup**: export/import your library to a file (install paths stay per-PC).
- Faster update checks via GitHub's CDN; changelog published with every release; the updater can roll back an over-numbered build.

**Settings → About**
- Shows **Install location** and **Data location**, each with an **Open** button.
- **Releases** and **VNDB** links are now **clickable** — they open the GitHub releases page and vndb.org in your browser.
- **Uninstall Tsundoku** button (two confirmations) — keeps your library data by default, with an optional "Also delete my library data" checkbox for a full wipe.

**Hidden / NSFW**
- Block VNDB **tags** to auto-hide matching titles; separate 18+ **blur** toggles for Browse vs your library.

**Scanner**
- Reconciles installed games against your library (no duplicates) and leaves weak/loose name matches unchecked so nothing is added by accident.

## 1.3.32 — 2026-06-11
- Collections sidebar: the last collection's selected outline no longer gets clipped, and collection rows now have even spacing.
- A little more breathing room above the Tsundoku logo in the top bar.

## 1.3.31 — 2026-06-11
- Fixed a visual glitch in the library sidebar where a selected collection/filter overlapped the row hovered just below it.
- The "Add to collection" picker now includes excluded titles when "Show excluded entries" is on, so you can search for and add them.
- New **Cozy** card size, sitting between Small and Comfortable.

## 1.3.30 — 2026-06-11
- **Syncthing-friendly install paths**: each game's launch path is now stored in a local-only file (`%LOCALAPPDATA%\Tsundoku\exe-paths.json`) instead of inside the synced library. Your status, ratings and playtime sync across PCs as before, but each machine keeps its own install paths — so a synced library no longer overwrites where a game lives on this PC. You point a game at its local .exe once per PC and it sticks through every future sync. Existing paths are migrated automatically on first launch.

## 1.3.29 — 2026-06-11
- Settings → About: replaced the "Source code" row with a "Releases" row pointing at github.com/snxwss/tsundoku-releases, and removed the Data location description so it lines up with Install location.

## 1.3.28 — 2026-06-11
- The **Exclude from library** button is back for titles that aren't on this PC — you can hide one from the library view (keeping its history) without having to fully remove it.

## 1.3.27 — 2026-06-11
- Reverted the Settings width tweaks entirely — the About rows are back to the original layout; long paths just wrap.

## 1.3.26 — 2026-06-11
- **Fixed data location**: your library/settings now live at `C:\ProgramData\Tsundoku` — the same path on every PC, with no username in it. An existing library under AppData is copied over automatically on first launch (the old copy is left untouched as a fallback).

## 1.3.25 — 2026-06-11
- Settings About: only the Install location and Data location rows are widened now (so their paths fit on one line) — every other row is back to the normal width.

## 1.3.24 — 2026-06-11
- Reverted the global Settings width change — only the About section is widened now, and the Install/Data paths stay on a single line instead of wrapping.

## 1.3.23 — 2026-06-11
- Wider Settings panel (520 → 700px) so long paths like the Data location no longer wrap.

## 1.3.22 — 2026-06-11
- Mint theme (dark mode): toned down the over-saturated green — softer background tint and a less aggressive accent, in line with the other dark palettes.

## 1.3.21 — 2026-06-11
- Settings → About now shows your **Data location** (library, settings, ratings, playtime) with an **Open** button, and the Install location got a matching Open button.

## 1.3.20 — 2026-06-11
- Banana theme: bolder, more saturated logo/accent color while keeping the soft pastel background.
- Reverted the bold metadata text on cards and the home hero.

## 1.3.19 — 2026-06-11
- **Theme renames**: Yellow → Banana (now more pastel), Green → Mint, Lav → Lavender, Gray → Stone. Existing preference migrates automatically.
- **Bold metadata**: year, developer, playtime, and "on device" text in cards and the home hero are now bold.
- Removed the "Finished in ⟨year⟩" stats card.
- **Uninstall button** in Settings → About — runs the NSIS uninstaller after two confirmations.

## 1.3.18 — 2026-06-11
- The updater now accepts the version the "latest" release points to even if it's lower, so an accidental over-numbered build can be rolled back without clients getting stuck.

## 1.3.17 — 2026-06-11
- **Search your Wishlist** — a search box in the Wishlist header filters saved titles in real time.
- **Start & finish dates** — Tsundoku now records when you started a VN (first time it goes to Reading, or first tracked playtime) and when you finished it. The dates show in a title's detail panel and modal, and there's a "Finished in ⟨year⟩" card on the Stats page.

## 1.3.16 — 2026-06-10
- Dialog buttons (e.g. the delete-collection Cancel/Delete) now use the regular rounded font instead of the monospace one.
- "Add to collection" button and the Browse "Filters" button now use the same accent fill as the Launch button (fixes the off-looking colors).
- Dark mode: the active settings tab, selected collection, and active filter are now clearly highlighted (they were too subtle before).
- **Responsive layout**: the search bar shrinks and the library heading truncates as the window gets smaller, and on small windows (or at 125% zoom) the right detail panel collapses so the grid stays usable — clicking a title opens its detail modal instead. The panel returns when you widen the window.

## 1.3.15 — 2026-06-10
- **Scanner** no longer auto-checks loose matches (e.g. a "Dead by Daylight" game folder matching the "Hooked on You" dating sim) — a match is only auto-selected when the folder name closely resembles the VNDB title.
- Removed the collection chips from the detail modal (collections are managed from the sidebar + "Add to collection" picker now).
- **Collections vs filters**: selecting a status filter (The Pile, etc.) now properly exits a collection view instead of leaving it half-applied; entering a collection resets the status filter to All.
- **18+ in Browse** is now consistent: the filter, the Settings "Hide 18+ in Browse" toggle, and the "Allow 18+" chip all agree, and the chip stays in sync when you change the setting.
- Fixed the library header heading and search bar not lining up when zoomed out.

## 1.3.14 — 2026-06-10
- **Fixed see-through dialogs**: the New Collection, Manage, Add-to-collection and confirm popups now render with a proper solid card (they were inheriting no theme, so the card background was invisible). This also fixes the New Collection dialog being unusable.
- **Library header** no longer overflows when the detail panel is open or at higher zoom — the search/toggle/Manage/Add-to-collection controls wrap cleanly and the count stays on one line.
- **Scanner**: weak matches (e.g. a Steam game matched to a same-named joke VN) are now left **unchecked** by default in scan results, so they're no longer added accidentally — correctly-named VNs stay checked.

## 1.3.13 — 2026-06-10
- Excluded titles now have a **Remove from library** button (below "Include back") in their detail modal.
- New **Manage** button in the library header opens a bulk picker — select multiple titles and **Hide** (exclude) or **Remove** them from your library at once. Bulk remove asks to confirm first.

## 1.3.12 — 2026-06-10
- **Collections are now a view, not a filter**: selecting a collection replaces the "Your shelf" heading with the collection's name and shows an **Add to collection** button.
- **Add to collection**: a checkbox picker lists your whole library (with search) so you can add or remove titles in bulk.
- **Polished dialogs**: New Collection uses a proper centered dialog, and deleting a collection now asks for confirmation first (the VNs stay in your library).
- Empty collections no longer say "match this filter" — they read as collections.
- Library header tidied: smaller search box with the grid/list toggle beside it.
- **Stats**: Longest Session card and the Reading Sessions log are always shown (with an empty state before any session exists), and Stats now refreshes session data without needing an app restart.
- Grid/list toggle buttons show the pointer cursor.

## 1.3.11 — 2026-06-10
- Fixed toggle switches showing wrong cursor (default overriding pointer).
- Stats: replaced Dropped card with Longest Session; more space above highlights section.
- Collections sidebar now scrolls when full instead of pushing Sort off screen.
- New collection uses a proper popup dialog (Enter to confirm, Esc to cancel).

## 1.3.10 — 2026-06-10
- **Reading sessions log**: Stats page now shows a log of past reading sessions (game, duration, when). Only sessions ≥ 30 minutes are recorded.
- **Stats page**: now full-width matching the Achievements section; new "Wishlisted" stat card; removed the redundant dropped-rate percentage (visible in the breakdown bar); 4-column grid.
- **Collections**: moved above Sort in the library sidebar; "New collection" now uses an inline input instead of a browser prompt.
- **Filters button**: text turns black when the filter drawer is open.
- **Settings**: all toggles, mode buttons, palette swatches, and zoom buttons now show the pointer cursor on hover.

## 1.3.9 — 2026-06-10
- **Library search**: Filter your shelf in real time by typing in the search box in the library header.
- **Custom collections**: Create named groups in the library sidebar (+ New collection) and tag any library title from its detail modal. Filter the shelf by collection just like by status.
- **Extra stats**: Stats page now shows Dropped count/rate, average finish time across completed VNs, and a color-coded library breakdown bar (Finished / Reading / Paused / Dropped / Pile).
- **Wishlist release alerts**: On startup, Tsundoku checks VNDB for new official English releases for every wishlisted VN not already in your library. Alerts appear as a strip at the top of the Wishlist page with a badge on the tab; dismiss once you've seen them.

## 1.3.8 — 2026-06-10
- **Syncthing support**: Tsundoku now watches its data folder for external changes. When Syncthing syncs your library from another device, the app reloads automatically — no restart needed.

## 1.3.7 — 2026-06-10
- Fixed auto-updater 404: installer filename in `latest.yml` now matches the actual asset name on GitHub.

## 1.3.6 — 2026-06-10
- Settings → About now shows the install location.

## 1.3.5 — 2026-06-10
- Update checks now hit GitHub's CDN directly instead of the API — significantly faster and no rate limiting.

## 1.3.4 — 2026-06-10
- All library, wishlist, and home shelf cards now show the pointer cursor on hover.
- **Esc** closes the detail modal (in addition to the ✕ button and backdrop click).

## 1.3.3 — 2026-06-10
- Steam screenshot viewer is now a gallery: **‹ › arrow buttons** (and left/right arrow keys) cycle through all screenshots without closing. An **✕ close button** appears top-right, and **Esc** also closes it.

## 1.3.2 — 2026-06-10
- Detail modal is wider (1020px) so there's more room for descriptions and the Steam gallery.
- Steam screenshot gallery shows 3 per row instead of 2.
- All buttons now show the pointer cursor on hover for consistent click feedback.

## 1.3.1 — 2026-06-10
- **Steam integration**: a title's detail page now shows a **View on Steam** button and a **screenshot gallery** when the VN is on Steam (matched automatically via VNDB, no guessing). Click a screenshot to view it full-size. Titles not on Steam show nothing extra.
- Hidden titles (Settings → Hidden) now have **blurred covers** — hover a row to reveal the cover.
- **Finished** and **Dropped** status dots are now distinct colors (purple and crimson) instead of two near-identical reds.

## 1.3.0 — 2026-06-09
- Title language now has a third option: **English / Romaji / Japanese** (original kanji).
- Browse filters reworked:
  - **Developer** filter matches a specific VNDB studio now (typing "key" no longer pulls in "Viscum Key").
  - **Rating** filter is a number you type (e.g. `7` or `7.5`) instead of fixed chips.
  - New **Allow 18+** button next to the Tag filter — a quick toggle for showing/hiding adult titles in Browse.
- Library **list view**: a detailed row per title (cover, title, status, year/length/rating, playtime, launch). Toggle next to "Your shelf" or in Library settings.

## 1.2.4 — 2026-06-09
- Library covers no longer balloon in size when zooming out — they now hold the chosen card size (only the number per row changes with the window), matching Browse and Wishlist.

## 1.2.3 — 2026-06-09
- Brought back the manual **Card size** setting (Small / Comfortable / Large) in Settings → Appearance, replacing the automatic cover sizing. The number of covers per row still adapts to the window width.

## 1.2.2 — 2026-06-09
- Browse keeps loading more entries as you scroll even with many small cards per row — the load-more trigger could stop firing when the first page didn't fill the screen.
- Covers now hold a consistent, comfortable size at any zoom level; only the number per row changes with window width (no more tiny-on-wide or oversized-when-zoomed). Zoom now scales just text and spacing.

## 1.2.1 — 2026-06-09
- Card size is now driven by the **Zoom** setting (and window width) rather than a manual picker — removed the Compact/Comfortable/Large control; covers are larger by default and reflow to fit.
- Fixed **title search** loading nothing — it was hitting VNDB's rate limit via a heavy query. Search is now lighter and also finds niche titles.

## 1.2.0 — 2026-06-09
- Responsive top bar: the window controls (minimize / maximize / close) no longer disappear when the window is small or zoomed in — the nav condenses instead.
- Browse and Wishlist grids now adapt to the window width instead of always forcing 5 columns.
- New **Card size** setting (Compact / Comfortable / Large) in Settings → Appearance — controls cover size and how many fit per row across Library, Browse and Wishlist.

## 1.1.3 — 2026-06-09
- Length on cards is now anchored to the right edge (slightly inset), so its position stays consistent at every zoom level.
- The "Japanese" title option is now **Romaji** — shows the romanized title (e.g. "Super Dangan Ronpa 2 Sayonara Zetsubou Gakuen") instead of kanji.
- Toggle sliders now use the same lighter accent green as the Launch button in light themes.

## 1.1.2 — 2026-06-09
- Title language: VNDB titles now default to **English** when available, with a new **Title language** toggle (English / Japanese) in Settings → Appearance. Your existing library re-fetches once to pick up English titles.
- Light themes: **Launch / Continue** and other primary buttons now use a lighter accent fill with dark text (no more dark, muddy fill).
- Green theme: brighter, more vivid **dark mode**.
- Updates: removed the install pop-up — use the **Restart & install** button in Settings → About (updates still auto-install on quit).
- Wishlist cards now show the release **year**.
- More breathing room before the length on all cards.
- Changelog now published with every GitHub release.

## 1.1.1 — 2026-06-09
- Split the default palette into separate **Yellow** (new default) and **Green** themes; existing "mint" users migrate to Yellow.

## 1.1.0 — 2026-06-09
- Length on cards moved to sit after the year with a clear gap.
- Wishlist length spacing widened.

## 1.0.18 — 2026-06-09
- Wishlist cards show the year.
- Sun/moon shortcut now swaps the Auto schedule instead of leaving Auto mode.

## 1.0.17 — 2026-06-09
- Developer field now shows the full list (e.g. "Spike Chunsoft & Spike & Gemdrops, Inc") instead of just the first.

## 1.0.15 — 2026-06-09
- Scanner reconciles against your library: installed games reconnect to imported history instead of creating duplicates.

## 1.0.14 — 2026-06-09
- Backup: export/import your library to a file. Install paths stay per-PC; library, status, playtime and last-played travel between machines.

## 1.0.13 — 2026-06-09
- Hide-by-tag: block VNDB tags in Settings → Hidden to auto-hide matching titles from Browse & Search.

## 1.0.12 — 2026-06-09
- Achievements: 10 playtime-gated milestones on the Stats page, with an unseen-count badge on the Stats tab. A completion requires at least 1h of logged playtime.

## 1.0.8 — 2026-06-09
- Statistics page: total hours, completions, the pile, average rating, most-read developer, longest completed VN.
