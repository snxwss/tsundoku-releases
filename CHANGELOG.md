# Changelog

All notable changes to Tsundoku are listed here. Newest first.

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
