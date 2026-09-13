# Tsundoku

Tsundoku is a Windows visual novel launcher, library manager, and playtime tracker powered by VNDB. Browse and search VNDB's full catalog from inside the app, track your library and wishlist, and scan your own folders to automatically match installed VNs to their VNDB entries — no manual data entry required. Playtime is tracked automatically via process detection, regardless of how a game is launched (Steam, a shortcut, or directly).

Tsundoku is currently in beta. Not all features may work exactly as intended, and some manual tinkering may occasionally be necessary. Also note: VNDB's API rate limits accumulate quickly under heavy use (e.g. scanning a large folder), and timeouts or failed matches during a scan are common and expected.

## Features

- Browse and search VNDB's full catalog from inside the app
- Library and wishlist tracking, with automatic playtime tracking via process detection
- Folder scanning that matches installed VN executables to their VNDB entries automatically
- NSFW/18+ content controls — independent blur/hide settings for Browse vs. your library, plus a dedicated extreme-content safety layer
- Backups with cross-device merge support
- Shared-folder device sync (Google Drive, Dropbox, etc.)
- VNDB list import
- An achievements system
- Playtime and reading stats
- Steam integration
- Light/dark/auto themes with multiple color palettes

## Download

Get the latest release from the [Releases page](https://github.com/snxwss/tsundoku-releases/releases/latest).

- **Windows:** `Tsundoku-Setup-<version>.exe`
- **Linux:** `Tsundoku-<version>.AppImage`

## Linux

Linux support is new and less tested than Windows.

1. Download the `.AppImage`, make it executable (`chmod +x Tsundoku-*.AppImage`), and run it.
2. Your library is stored in `~/.local/share/Tsundoku`.
3. Most visual novels are Windows games. Tsundoku launches them through **Wine** (install it from your distro), or you can add a game to Steam and run it with Proton. Playtime is tracked either way, including when you start the game outside Tsundoku.
4. Updates install automatically, as on Windows.

**If it won't start** on Ubuntu 24.04 or newer with a sandbox error, run it with `--no-sandbox`. Newer Ubuntu releases restrict the sandbox that AppImages rely on.

**No tray icon?** Some desktops (e.g. GNOME without an extension) don't show tray icons. Closing the window then sends Tsundoku to the background. Launch it again to bring the window back, or turn off *Minimize to tray on close* in Settings.

See [CHANGELOG.md](CHANGELOG.md) for release notes.
