# Changelog

Tsundoku is a Windows visual novel launcher, library manager, and playtime tracker powered by VNDB. Browse and search VNDB's full catalog from inside the app, track your library and wishlist, and scan your own folders to automatically match installed VNs to their VNDB entries — no manual data entry required. Playtime is tracked automatically via process detection, regardless of how a game is launched (Steam, a shortcut, or directly). Features include: NSFW/18+ content controls (independent blur/hide settings for Browse vs. your library, plus a dedicated extreme-content safety layer), backups with cross-device merge support, shared-folder device sync, VNDB list import, an achievements system, playtime/reading stats, Steam integration, and light/dark/auto themes with multiple color palettes.

All notable changes to Tsundoku are listed here. Newest first.

## 1.5.4-beta — 2026-08-18

- Fixed tag matching (Hidden tags, Browse filter, Library filter) reporting "no tag matching" during a brief VNDB rate-limit hit, which looked like the typed name was wrong when VNDB was just busy. Lookups now retry harder before giving up, and a real failure is now messaged distinctly from a genuine no-match.

## 1.5.3-beta — 2026-08-18

- Fixed folders whose VNDB search failed (timeout/rate-limit during a large scan) being silently dumped into the Ignored tab as if no VN existed for them. They now land in Low confidence instead of disappearing.

## 1.5.2-beta — 2026-08-18

- Fixed two more installer-helper exe names (an EA "AppInstaller" and a plain "Cleanup.exe") that the previous fix's junk-exe filter didn't catch, still causing installer/support subfolders to be mismatched against unrelated VNs.

## 1.5.1-beta — 2026-08-18

- Fixed the in-app updater failing to detect new releases.
- Fixed the folder scanner treating a game's internal installer/support subfolders (e.g. an EA title's Origin or Engine folder) as separate games and matching them to unrelated VNs.

## 1.5.0-beta — 2026-08-19

Tsundoku is currently in beta. Not all features may work exactly as intended, and some manual tinkering may occasionally be necessary. Also note: VNDB's API rate limits accumulate quickly under heavy use (e.g. scanning a large folder), and timeouts or failed matches during a scan are common and expected — there's no fix for this yet on my end.

This one's a large batch of fixes to folder scanning and content safety.

**Content safety**
- Extreme content is now hidden from Browse & Search by default (previously just blurred).
- Matching for hidden/blocked content now uses VNDB's internal tag IDs instead of readable tag names, for more precise, collision-free filtering.
- Several additional content categories are now hard-blocked outright.
- Revealed extreme-content titles now require clicking through a "Content Warning" interstitial (with a "Don't show again" option) before opening.

**Folder scanning — reliability overhaul**
- VNDB search failures during a scan are now logged instead of silently showing as "no match."
- Fixed the automatic background "check for new games" running at the same time as a manual scan, which doubled VNDB request traffic and could trigger rate-limit failures.
- "Collection" folders containing multiple separate games (e.g. a multi-volume pack with each entry in its own subfolder) are now split into individual scan targets instead of being collapsed into one wrong match.
- Matching now checks every title variant VNDB returns, catching titles whose local folder name is shorter than the full official title.
- Fixed the scanner sometimes "reconnecting" a folder to an unrelated title you already own elsewhere in your library.
- Increased the VNDB candidate pool per folder from 5 to 10 results.
- Fixed false-positive matches where a short or generic folder name (e.g. a mainstream Steam game) coincidentally resembled an unrelated VN title.
- Added a "Low confidence" tab so uncertain matches no longer get mixed into "New matches."
- Scan Results now opens on "New matches" by default instead of "All."
- Added a one-click "Ignore" button on each scan row.
- New-match covers now respect the Browse blur setting (on by default) instead of the Library setting (off by default); reconnects to already-owned titles are exempt from blur.

## 1.4.1 — 2026-08-17

- Internal: content-blocklist matching now uses VNDB's stable tag IDs instead of tag names, which also fixed an unrelated false-positive where a couple of unrelated character-trope tags could get mismatched due to an accidental substring collision.

## 1.4.0 — 2026-08-17

**Playtime & process tracking**
- Process detection now matches by full executable path instead of just the filename, so a generic exe name shared across different VN engines/installs can't be mistaken for the wrong title.
- Tracking now follows a bootstrapper exe's handoff to the actual game process, so a launcher that exits after starting the real game no longer drops tracking.
- Added extra checks right after launch to catch bootstrappers that exit faster than the normal check interval.
- Force Stop and auto-detected stops now update immediately instead of waiting on the next check, and kill the correct process (including child processes spawned by a launcher).
- Fixed a bug where playtime could briefly accrue too fast right after hitting Play.

**Folder scan**
- Fixed the scanner sometimes picking an updater/launcher exe as a title's main executable instead of the actual game.
- Fixed newly-scanned matches getting silently and permanently marked "Ignored" instead of appearing under "New matches" on later scans.

**Browse & Search**
- Fixed developer search/filter hiding titles from small or niche developers due to the popularity vote floor.
- Added many more well-known studios to the curated list that bypasses the vote floor in Browse/Top Rated.
- Added a "Screenshots only" filter.
- Extreme content is now hidden from Browse & Search by default; a toggle in Settings → Hidden reveals it (shown like any other title, no special treatment).
- A few additional content categories are now hard-blocked outright, same as the existing baseline blocklist.

## 1.3.18 — 2026-08-17

- Added a second toggle in Settings → Hidden: the heavy blur + warning label on revealed extreme content is now its own on/off switch, separate from whether it's hidden in the first place.

## 1.3.17 — 2026-08-17

- Extreme content is now hidden from Browse &amp; Search by default instead of just blurred — toggle "Hide extreme content" off in Settings → Hidden to reveal it (still with the heavy blur + warning label).

## 1.3.16 — 2026-08-17

- Added an "Extreme content warnings" tier: certain strongly-tagged titles still show up with 18+ allowed, but get a much heavier blur and a warning label instead of blending in as ordinary 18+ content. Toggle it off in Settings → Hidden if you don't want it.
- A few more content categories are now hard-blocked outright, same treatment as the existing baseline blocklist — never shown regardless of settings.
- Fixed the extreme-content check flagging titles off a single weak/low-confidence tag vote — now requires the same tag-strength bar as normal 18+ detection.

## 1.3.15 — 2026-08-09

- Added a "Screenshots only" filter to Browse — hides titles that have no screenshots on VNDB.

## 1.3.14 — 2026-08-09

- Added ~29 more well-known VN studios to the curated list that bypasses the vote-count floor in Browse/Top Rated (age, ensemble, Unison Shift, Akatsuki WORKS, 0verflow, light, GIGA, Whirlpool, Eushully, HOOKSOFT, Lump of Sugar, Navel, Tactics, C's Ware, MOONSTONE, propeller, QuinRose, Rejet, Vridge, Escu:de, Alchemist, Yeti, Windmill, CLOCKUP, Cocktail Soft, Marmalade, NekoNeko Soft, Kogado Studio, Applique), so new/lower-vote releases from these studios still surface without needing the developer filter.

## 1.3.13 — 2026-08-09

- Fixed developer search/filter hiding titles from small or niche developers (e.g. Suikasoft) — it was still applying the global 200-vote popularity floor unless the studio was on a curated list of ~40 well-known developers. Filtering by a specific developer now shows that studio's whole catalog, popular or not.

## 1.3.12 — 2026-08-09

- Fixed genuinely new folder-scan matches silently disappearing from "New matches" on later scans — clicking Add was treating any weak match left at its default unchecked state as an explicit rejection, not just folders you actually chose "— skip this folder —" for. Weak matches you haven't decided on now stay visible as New instead of getting permanently pushed to Ignored.

## 1.3.11 — 2026-08-09

- Fixed playtime accruing too fast for a few seconds right after hitting Play — the burst-polling added in 1.3.9 could fire a new process check before the previous one finished, and two overlapping checks would each credit the same stretch of real time to playtime. Overlapping checks are now skipped instead of double-counting.

## 1.3.10 — 2026-08-09

- Added a diagnostic log at `C:\ProgramData\Tsundoku\process-debug.log` recording every launch, poll tick, stop-detection, and Force Stop for process tracking — temporary, for tracking down remaining detection edge cases.

## 1.3.9 — 2026-08-09

- When you hit Play, Tsundoku now checks for the running process a few times in the first few seconds instead of only every 5 seconds — catches bootstrapper exes that hand off to the real engine binary and exit faster than the normal poll interval, so process-tree tracking (1.3.8) actually gets a chance to anchor onto the handoff.

## 1.3.8 — 2026-08-09

- Fixed tracking losing a running VN when its exe is a bootstrapper that launches the real game as a separate child process and then exits — process detection now follows the handoff instead of only watching the exact exe you picked, so both auto-stop-detection and Force Stop keep working through the redirect.

## 1.3.7 — 2026-08-09

- Fixed games sometimes never being detected as closed (and the Stop button appearing to do nothing) — process tracking now matches by full executable path instead of just the filename, which could be fooled by generically-named exes shared across different VN engines/titles.
- Stop now updates Tsundoku's own "running" state immediately instead of waiting for the next background check to confirm.
- Force-stop now kills the whole process tree, so a launcher/updater exe that spawned the actual game as a separate process gets closed too.
- Folder scan no longer picks an updater/launcher exe as a VN's main executable just because it's the largest file in the folder.

## 1.3.6 — 2026-06-20

- Folders with no VNDB match at all (nothing to select but "skip this folder") now count as Ignored instead of New matches.

## 1.3.5 — 2026-06-20

**Scan**
- Added an "Ignored" tab for folders previously left unchecked, separate from genuinely new matches.
- Fixed the close button on Scan Results / VNDB Import scrolling away with the content instead of staying pinned in the corner.

## 1.3.4 — 2026-06-20

**Scan**
- Folder-scan candidate covers now respect "Blur 18+ covers in your library".
- Scan Results now has All / New matches / Reconnects tabs, so you can review new additions separately from titles reconnecting to your existing library.

## 1.3.3 — 2026-06-20

- Fixed Steam/JAST links sometimes not appearing even when they exist — a background refresh could wipe them out if it finished after they were already shown; it now reapplies them correctly regardless of which finishes first.

## 1.3.2 — 2026-06-20

- JAST links pointing to the retired jastusa.com domain (still stored on many VNDB entries) are now rewritten to jaststore.com instead of sending you to the old site.

## 1.3.1 — 2026-06-20

- Fixed JAST link detection to match any "jast" domain/label (JAST rebranded from jastusa.com to jaststore.com), instead of a single fixed domain pattern.

## 1.3.0 — 2026-06-20

**Privacy**
- New Settings → Privacy tab: lock your Private wishlist behind a click or an optional 4-digit PIN, with a configurable unlock duration (5/15/30/60 minutes or until Tsundoku closes) and a "Lock now" button.
- PIN entry redesigned as 4 individual digit slots with a bigger Unlock button.
- Changing or removing your PIN now requires entering the current PIN first.
- Leaving the Private wishlist tab (switching to Public, or navigating elsewhere) re-locks it immediately.
- Backups no longer include the PIN or lock settings — those stay per-device; your library and Private wishlist entries still travel with backups as before.
- Moved Privacy below Library in the settings sidebar.

**Detail modal**
- Full offline support: cover, description, tags, rating, external links, and characters all cached locally after the first online view.
- 18+ titles now use VNDB's own screenshots instead of Steam's SFW store screenshots, falling back to Steam only when VNDB has none.
- Added a "Blur 18+ screenshots" toggle (separate for Browse and your library) controlling character art and screenshots independently from cover blurring.
- Added Steam and JAST store links to the Links row, alongside VNDB/Wikipedia/HowLongToBeat.
- Fixed the screenshot lightbox stretching images to fill the frame instead of keeping their native aspect ratio.
- Fixed a lightbox flash of the previous (wrongly blurred/unblurred) image when rapidly cycling through screenshots.
- Fixed the modal's rounded corners clipping the scrollbar.

**Sync**
- New Sync section in Settings: keep your library in sync across PCs via a shared cloud folder (Google Drive, Dropbox, OneDrive, etc.), with automatic syncing and a manual "Sync now" button.
- Fixed preferences, reading status, and color palette (incl. light/dark mode and auto schedule) syncing correctly using last-write-wins instead of blindly overwriting.
- VNDB username now syncs with the Library toggle instead of Preferences.

**Browse & Performance**
- Added a "Load more" button below the Browse grid — recovers a stalled infinite-scroll without losing your scroll position.
- Raised max concurrent VNDB requests from 3 to 4 to better absorb bursty usage before hitting rate limits.
- Tag search now fails fast under rate-limiting (~20s worst case instead of ~40s) and shows "Searching…" while it works.
- Tag search now ignores punctuation differences ("bla-bla" / "bla/bla" / "bla bla" all match), preferring an exact match over the most popular substring match.
- Fixed cover images hanging indefinitely on a stalled connection instead of failing and retrying.
- Added a single "Blocked tags" master toggle in Settings → Hidden to temporarily allow everything without clearing your blocked list.

**Windows**
- Replaced the reactive DPI-restore fix with a permanent one — Tsundoku now forces a fixed rendering scale factor, sidestepping the Windows/Electron scaling bug entirely.
- Wired up F12 / Ctrl+Shift+I to open DevTools.

**Fixes**
- Fixed several Settings layout bugs: a Privacy PIN section rendering with a huge blank gap, and rows with wide button groups squeezing their label text down to nothing.
- Fixed wishlist titles not showing after viewing a locked Private wishlist.
- Auto schedule time fields are now plain text inputs (HH:MM, with shorthand like "800" → 8:00) instead of the browser time picker.

## 1.2.22 — 2026-06-20

**Fixes**
- Reverted the screenshot reveal-gate to a translucent overlay — the fully opaque version from 1.2.21 blacked out the preview entirely instead of just closing a minor timing gap.
- Wired up F12 / Ctrl+Shift+I to open DevTools — it wasn't registered at all in this frameless window, so the console was unreachable.

## 1.2.21 — 2026-06-20

**Fixes**
- Fixed the "Load more" button in Browse never actually appearing — a CSS `!important` rule was silently overriding the JS that was supposed to show it.
- Fixed a remaining edge case in the screenshot lightbox where a blur could lag a frame behind on fast navigation — the reveal gate is now fully opaque instead of relying on the image's blur filter alone.

## 1.2.20 — 2026-06-20

**Browse**
- Added a "Load more" button below the grid — recovers a stalled infinite-scroll without losing your scroll position (unlike Refresh, which resets to page 1).

**Fixes**
- Fixed cover images that could hang indefinitely on a stalled connection instead of failing and retrying.
- Fixed the screenshot lightbox briefly showing the previous (wrongly blurred/unblurred) image when rapidly cycling through screenshots — Chromium was decoding the new image asynchronously, so it could keep painting the old one for a frame while the new one loaded.

## 1.2.19 — 2026-06-20

- Tag search now ignores punctuation differences — "bla-bla", "bla/bla", and "bla bla" all match a tag named any of those, and an exact match is now preferred over just the most popular substring match.

## 1.2.18 — 2026-06-20

**Performance**
- Fixed the Browse tag search field appearing to freeze during VNDB rate-limiting — it now fails fast (~20s worst case instead of ~40s) and shows "Searching…" while it works.
- Raised max concurrent VNDB requests from 3 to 4 to better absorb bursty usage (scrolling, opening several titles quickly, typing tag searches) before hitting rate limits.

## 1.2.17 — 2026-06-20

**NSFW**
- Added separate "Blur 18+ images" toggles for Browse and your library, controlling character art and screenshots in the detail modal independently from cover blurring.

## 1.2.16 — 2026-06-20

- Bug fixes.

## 1.2.15 — 2026-06-20

- Actually fixed the Privacy PIN section's huge blank gap this time — a flex-basis rule meant for horizontal rows was being reinterpreted as a ~220px minimum height once the row switched to a stacked layout.

## 1.2.14 — 2026-06-20

**Privacy**
- Fixed the Privacy PIN section rendering with a huge blank gap between the label and the buttons.
- Leaving the Private wishlist tab (switching to Public, or navigating to another part of the app) now re-locks it immediately. The "Stay unlocked for" duration now only governs how long it stays unlocked while you remain on the tab.

## 1.2.13 — 2026-06-20

**Privacy**
- Redesigned PIN entry as 4 individual digit slots with a bigger Unlock button, replacing the oversized single text field.
- Changing or removing your PIN now requires entering the current PIN first.
- Backups no longer include the PIN or lock settings (lock config is per-device); your library and Private wishlist entries still travel with backups as before.

## 1.2.12 — 2026-06-20

**Fixes**
- Fixed wishlist titles not showing after viewing a locked Private wishlist — the grid stayed hidden even after unlocking or switching back to Public.
- Fixed re-enabling the Private wishlist lock not actually locking it if it was previously left unlocked.
- Fixed the Privacy settings row (duration picker) squeezing its label text down to nothing — settings rows now reserve a minimum label width and wrap wide button groups onto their own line instead.
- Replaced the reactive DPI-restore fix with a permanent one: the app now forces a fixed rendering scale factor, sidestepping the Windows/Electron bug entirely instead of patching individual triggers.

**Settings**
- Moved Privacy below Library in the settings sidebar.
- Added a single "Blocked tags" master toggle in Settings → Hidden to temporarily allow everything without clearing your blocked list.

## 1.2.11 — 2026-06-20

**Privacy**
- New Settings → Privacy tab: lock your Private wishlist behind a click (or an optional PIN), with a configurable unlock duration (5/15/30/60 minutes or until Tsundoku closes) and a "Lock now" button.

**Detail modal**
- 18+ titles now use VNDB's own screenshots instead of Steam's SFW store screenshots, falling back to Steam only when VNDB has none.
- Fixed the modal's rounded corners clipping the scrollbar.

**Windows**
- Strengthened the fix for content rendering oversized after restoring a minimized window or moving to a monitor with a different scale — now forces a real relayout instead of a no-op zoom reapply.

## 1.2.10 — 2026-06-20

**Detail modal**
- Screenshot gallery now falls back to VNDB screenshots when a title isn't on Steam or Steam has none. Adult-rated screenshots are blurred, matching the existing cover/character blur setting.

**Windows**
- Fixed content rendering oversized after restoring a minimized window — zoom is now reapplied on restore.

## 1.2.9 — 2026-06-20

- Auto schedule inputs now accept 3-digit shorthand (e.g. 800 → 8:00) and reject invalid hours (e.g. 80 reverts).

## 1.2.8 — 2026-06-20

- Fixed dropped/finished/paused status not overwriting "reading" on the other PC when syncing entries that predate the 1.2.5 status timestamp fix.

## 1.2.7 — 2026-06-20

- Fixed auto schedule time inputs losing their styling after the 1.2.6 change.

## 1.2.6 — 2026-06-20

- Auto schedule time fields are now plain text inputs (type HH:MM) instead of the browser time picker.

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
