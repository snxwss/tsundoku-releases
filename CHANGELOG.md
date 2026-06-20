# Changelog

All notable changes to Tsundoku are listed here. Newest first.

## 1.2.5 — 2026-06-20

**Sync fixes**
- Color palette sync option now also covers light/dark mode and auto schedule.
- Reading status now syncs correctly using last-write-wins — dropped, finished, etc. propagate to the other PC instead of being overwritten by the local status.

## 1.2.4 — 2026-06-20

**Sync fixes**
- Preferences now sync correctly using last-write-wins — whichever device changed a preference most recently wins, instead of blindly overwriting on every sync.
- VNDB username now syncs with the Library toggle instead of Preferences.

## 1.2.3 — 2026-06-20

- Moved Sync above System in the Settings sidebar.

## 1.2.2 — 2026-06-20

**Offline mode**
- Detail panel now works fully offline for library and wishlist titles — cover image, description, tags, rating, external links, and characters are all cached locally after the first online view.
- Cover images are cached on first view via a local `cover://` protocol — instant loads and zero re-downloads.
- Characters and external links (Wikipedia, HowLongToBeat) are stored per-title after first open.
- Cache is automatically cleared when a title is removed from both library and wishlist.
- Settings → System → Danger zone: "Clear offline cache" button to free up storage manually.

**Sync**
- Added "Sync now" button in Settings → Sync for manual on-demand sync.

## 1.2.0 — 2026-06-20

**Device Sync**
- New Sync section in Settings: keep your library in sync across PCs by pointing all devices at the same cloud folder (Google Drive, Dropbox, OneDrive, etc.).
- Pick any folder that all your PCs can see — Tsundoku writes a single `tsundoku-sync.json` file there.
- Syncs automatically: on launch, on every library or status change (debounced 3s), and instantly when the cloud provider downloads a change from another device.
- Library removals propagate correctly — a title removed on PC B disappears on PC A, not re-added.
- "What to sync" toggles let you control what each PC contributes and receives.
- Last synced time shown in the Sync section. Remove the folder at any time without losing local data.

**Browse / Performance**
- Fixed VNDB rate-limit backoff accumulating across tab switches — switching sorts no longer causes a multi-second delay. Max gap capped at 600ms, recovery doubled, idle reset triggers after 2s.

**Settings / Scan**
- Folder scan is now ~3-10× faster — all VNDB lookups run in parallel instead of one at a time.

**Home**
- "see all →" links now show a pointer cursor.
- "The pile" section header now shows the correct total count.

## 1.1.1 — 2026-06-17

- Tag filter now uses VNDB's own ranking to pick the best match (reverts custom scoring added in a prior release).
- Modal navigation arrows also work from the Home screen.
- "Remove selected" button moved to the right edge of the Manage library footer.

## 1.1.0 — 2026-06-17

**Navigation**
- Left/right arrow buttons now appear in the detail modal when browsing results or your library/wishlist — click to jump to the previous or next title. Arrow keys work too.

**Browse**
- Tag filter search reverted to straightforward matching — short queries like "lesbian" now resolve correctly again.
- Refresh button now reliably reloads when browse is stuck.
- Scrollbar visible in all browse layouts.

**Library**
- Manage library now shows hidden titles with a "hidden" badge. Selecting only hidden titles shows an "Unhide selected" button; selecting visible titles shows "Hide selected"; both appear when the selection is mixed.
- Preview panel shows tag chips instead of the description.

**Settings / Scan**
- Folder scan candidate dropdown respects your title language setting (English/Romaji/Japanese) instead of always showing romaji.

**Performance — major fix**
- Rewrote VNDB request handling to run several requests at once (was single-file). A single slow request no longer blocks browse, characters, or Steam screenshots behind it.
- Background enrichment capped to one slot so it can't starve interactive requests.
- Detail modal opens instantly with available data; description, characters, and Steam screenshots load in the background.
- Added 10s timeouts and single retry to all VNDB and Steam requests.

**Appearance**
- Scrollbars now match the active color palette in dark mode.
- Scrollbars visible and draggable throughout the app.

## 1.0.21 — 2026-06-17

**Performance — major fix**
- Rewrote the VNDB request handling to run several requests at once instead of one at a time. Previously a single slow request blocked everything behind it, which is what made browse take forever to load, characters and Steam screenshots never appear, and infinite scroll seem broken.
- Background library enrichment is now capped to one slot so it can never starve browsing, opening a game, or scrolling.
- Faster request pacing and quicker failure recovery (10s timeout, single retry).

## 1.0.20 — 2026-06-17

**Browse**
- Fixed the refresh button doing nothing when browse was stuck — it now clears the stuck loading state before reloading, so it actually recovers.

## 1.0.19 — 2026-06-17

**Browse**
- Added a refresh button next to the search bar — reloads the browse list from the start if it ever gets stuck.
- Made scrollbars clearly visible in both browse layouts.

**Library**
- Replaced the description in the library preview panel with tag chips.

## 1.0.18 — 2026-06-17

**Performance**
- Detail modal now opens instantly using the data already on hand (cover, title, rating, tags, length). Description, links, characters and Steam screenshots fill in as they load instead of blocking the whole modal on a "Loading…" screen.

**Browse**
- Sidebar-layout scrollbar moved closer to the filter rail.

## 1.0.17 — 2026-06-17

**Performance & reliability**
- Added timeouts to all VNDB and Steam requests. Previously a single stalled request could freeze the whole app — modals stuck on "Loading…", characters and Steam screenshots never appearing, browse pages not loading. The queue now recovers instead of hanging.
- Rate-limit backoff now resets after a short idle period, so returning to the app after a pause is fast again instead of crawling.

**Browse**
- Scrollbar in sidebar layout now appears between the title grid and the filter rail.

## 1.0.16 — 2026-06-17

- Fixed browse scroll broken by 1.0.15 (reverted sidebar scroll position change).

## 1.0.15 — 2026-06-17

**Browse**
- Scrollbar in the sidebar layout now appears between the title grid and the filter rail instead of at the far edge of the window.

## 1.0.14 — 2026-06-17

- Removed controller scroll support.
- Scrollbars are now visible and draggable throughout the app.

## 1.0.13 — 2026-06-17

**Controller**
- Left stick, right stick, and D-pad up/down now scroll Browse, Settings, Library, Wishlist, and Home.

## 1.0.12 — 2026-06-17

**Browse**
- Fixed infinite scroll stopping when 18+ filter was on — Top Rated now uses standard VNDB pagination instead of a pre-fetched pool, so scroll always loads more titles regardless of how many are filtered out.
- VN detail modals now open immediately instead of waiting for the Top Rated pool to finish loading.

## 1.0.11 — 2026-06-16

**Browse**
- Fixed infinite scroll stopping early when a page contained filtered titles.

## 1.0.10 â€” 2026-06-16

**Content**
- Unsuitable tags can no longer be searched or added in the browse tag filter â€” they return no result.

## 1.0.9 â€” 2026-06-16

**Content**
- Unsuitable tags are now also removed from the hidden tags list in Settings on launch, and any associated titles are purged from the library.

## 1.0.8 â€” 2026-06-16

**Content**
- Titles with unsuitable tags are now also skipped during VNDB list import â€” they will not appear even if present in an imported list.

## 1.0.7 â€” 2026-06-16

**Content**
- Unsuitable titles and tags permanently removed from browse, search, and library. Existing entries are purged automatically on launch.

## 1.0.6 â€” 2026-06-16

**Detail modal & cards**
- Length now shows an estimated range (e.g. "~10â€“30h") for titles where VNDB has a length category but not enough playtime votes for an exact average. Previously these showed nothing.

## 1.0.5 â€” 2026-06-16

**Appearance**
- Renamed the Sand color palette to Coffee.

**Detail modal**
- Steam screenshot gallery now shows all available screenshots instead of capping at 8. Images still load lazily so the modal opens just as fast.

## 1.0.0 â€” 2026-06-14
First stable release of Tsundoku â€” a desktop visual novel launcher and library manager powered by VNDB.

**Library & tracking**
- Organize your VNs with reading statuses (Reading, Paused, Finished, Dropped, and your backlog).
- Automatic playtime tracking â€” even for titles launched from Steam or the desktop â€” plus last-played and start/finish dates.
- Launch installed titles straight from Tsundoku.

**Discover**
- Browse VNDB by Top Rated, Most Relevant, Most Voted and New Releases.
- Filter by year, length, rating, studio and tags (stack several at once), or search by title.
- Rich detail pages: synopsis, score, length, developer, the full character cast (linked to VNDB), Steam store link with screenshots, and external links (VNDB, Wikipedia, HowLongToBeat).

**Organize**
- Custom collections, plus public and private wishlists.
- Filter your library by status, tag or collection.

**Get your games in**
- Scan folders to auto-detect installed VNs and match them to VNDB, with an alert when new titles appear.
- Import a VNDB list (public by username, or private with a read token) â€” statuses, wishlist and start/finish dates carry over, and you choose what to add.

**Make it yours**
- Light / dark / auto themes with color palettes, card sizes, zoom, and title language (English, Romaji, Japanese).
- Browse controls as a sidebar or a top bar.
- Content controls: blur or hide adult content in Browse and your library, block specific tags, or hide individual titles.

**Your data**
- Everything is stored locally. Back up and restore your library and preferences to move between PCs (install paths stay on each machine).
- Runs quietly in the tray and updates itself automatically.
