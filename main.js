const { app, BrowserWindow, ipcMain, dialog, Menu, Tray, nativeImage, shell } = require('electron');
const path = require('path');
const fs   = require('fs');
const zlib = require('zlib');
const { spawn, execFile } = require('child_process');

// ── Taskbar icon (pure Node.js, no native deps) ───────────────────────────────
// Renders the yellow tsundoku tile with a dark "積" glyph, returns a PNG buffer.
function makeIconPng(S) {
  const R = Math.round(S * 0.18); // corner radius
  // CRC32 table
  const ct = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    ct[i] = c;
  }
  const crc32 = buf => {
    let c = 0xFFFFFFFF;
    for (let i = 0; i < buf.length; i++) c = ct[(c ^ buf[i]) & 0xFF] ^ (c >>> 8);
    return (c ^ 0xFFFFFFFF) >>> 0;
  };
  const chunk = (type, data) => {
    const tb = Buffer.from(type, 'ascii');
    const lb = Buffer.allocUnsafe(4); lb.writeUInt32BE(data.length, 0);
    const cb = Buffer.allocUnsafe(4); cb.writeUInt32BE(crc32(Buffer.concat([tb, data])), 0);
    return Buffer.concat([lb, tb, data, cb]);
  };
  // Helper: is (x,y) inside the rounded-rect tile?
  const inTile = (x, y) => {
    const cx = Math.max(R, Math.min(S - 1 - R, x));
    const cy = Math.max(R, Math.min(S - 1 - R, y));
    return (x - cx) ** 2 + (y - cy) ** 2 <= R * R;
  };
  // Draw a "stack of books" mark (tsundoku = a pile of unread books):
  // three offset horizontal bars, varying widths, to read as a book pile.
  const ink = (x, y) => {
    const u = S / 16;                 // grid unit (0..16)
    const gx = x / u, gy = y / u;
    const book = (cy, x0, x1, h = 0.95) => gy >= cy - h && gy <= cy + h && gx >= x0 && gx <= x1;
    if (book(11.0, 3.4, 12.6)) return true; // bottom — widest
    if (book(8.2,  4.4, 13.0)) return true; // middle — shifted right
    if (book(5.4,  3.0, 11.2)) return true; // top — shifted left
    return false;
  };
  const raw = Buffer.alloc(S * (S * 4 + 1));
  for (let y = 0; y < S; y++) {
    raw[y * (S * 4 + 1)] = 0; // filter None
    for (let x = 0; x < S; x++) {
      const idx = y * (S * 4 + 1) + 1 + x * 4;
      if (!inTile(x, y)) { raw[idx] = raw[idx+1] = raw[idx+2] = raw[idx+3] = 0; continue; }
      if (ink(x, y)) {
        raw[idx] = 0x2d; raw[idx+1] = 0x3a; raw[idx+2] = 0x2a; raw[idx+3] = 0xFF; // dark glyph
      } else {
        raw[idx] = 0xF5; raw[idx+1] = 0xC8; raw[idx+2] = 0x42; raw[idx+3] = 0xFF; // yellow
      }
    }
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(S, 0); ihdr.writeUInt32BE(S, 4);
  ihdr[8] = 8; ihdr[9] = 6;
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', ihdr),
    chunk('IDAT', zlib.deflateSync(raw)),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

// Wrap a 256×256 PNG in an .ico container (Windows prefers .ico for taskbar).
function makeIcoBuffer(pngBuffer) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);   // reserved
  header.writeUInt16LE(1, 2);   // type: 1 = icon
  header.writeUInt16LE(1, 4);   // image count
  const entry = Buffer.alloc(16);
  entry.writeUInt8(0, 0);                       // width  (0 ⇒ 256)
  entry.writeUInt8(0, 1);                       // height (0 ⇒ 256)
  entry.writeUInt8(0, 2);                       // palette
  entry.writeUInt8(0, 3);                       // reserved
  entry.writeUInt16LE(1, 4);                    // color planes
  entry.writeUInt16LE(32, 6);                   // bits per pixel
  entry.writeUInt32LE(pngBuffer.length, 8);     // image size
  entry.writeUInt32LE(22, 12);                  // offset (6 + 16)
  return Buffer.concat([header, entry, pngBuffer]);
}

// Build (once) an .ico on disk and return { iconPath, nativeImg }.
let _iconCache = null;
function getAppIcon() {
  if (_iconCache) return _iconCache;
  try {
    // Prefer the bundled kanji .ico (used for the packaged build) if present.
    const bundled = path.join(__dirname, 'build', 'icon.ico');
    if (fs.existsSync(bundled)) {
      _iconCache = { iconPath: bundled, nativeImg: nativeImage.createFromPath(bundled) };
      return _iconCache;
    }
    // Otherwise generate the pure-JS book-stack fallback at runtime.
    const png256 = makeIconPng(256);
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    const icoPath = path.join(DATA_DIR, 'tsundoku.ico');
    fs.writeFileSync(icoPath, makeIcoBuffer(png256));
    _iconCache = { iconPath: icoPath, nativeImg: nativeImage.createFromBuffer(png256) };
  } catch { _iconCache = { iconPath: null, nativeImg: null }; }
  return _iconCache;
}

// ── Running VN process tracker ────────────────────────────────────────────────
const runningVNs = new Map(); // id → { proc, startTime }  (app-launched, for Stop)

// ── Automatic playtime via process detection ──────────────────────────────────
// While Tsundoku runs (incl. background/tray), poll the OS process list and match
// against library exe filenames. Works no matter HOW the game was launched
// (Steam, desktop, Start menu) — you never have to launch through Tsundoku.
const autoTracking  = new Map(); // id → last tick timestamp (ms)
const sessionStarts = new Map(); // id → session start timestamp (ms)
const launchTimes   = new Map(); // id → when WE launched it (ms); lets the poller
                                // backfill the gap before the process appears
let pollTimer = null;
const POLL_INTERVAL_MS = 5000;  // how often we scan running processes
// Cap a single tick's accrual so a sleep/hibernate (where the timestamp jumps far
// ahead while a game is still "running") can't dump fake playtime. ~2 polls of
// slack absorbs normal scheduling jitter; anything beyond is treated as a sleep gap.
const MAX_TICK_SECONDS = 12;

function pollRunningGames() {
  execFile('tasklist', ['/fo', 'csv', '/nh'], { windowsHide: true, maxBuffer: 16 * 1024 * 1024 }, (err, stdout) => {
    if (err) return;
    const running = new Set();
    for (const line of stdout.split(/\r?\n/)) {
      const m = line.match(/^"([^"]+)"/);
      if (m) running.add(m[1].toLowerCase());
    }
    const store = readStore();
    // basename(lower) → id for every library game with a known exe
    const idx = new Map();
    for (const e of Object.values(store)) {
      if (e.library && e.exe_path) idx.set(path.basename(e.exe_path).toLowerCase(), e.id);
    }
    const now = Date.now();
    let changed = false;
    // Accrue time for running games (incrementally, so a crash loses ≤ one tick).
    for (const [base, id] of idx) {
      if (!running.has(base)) continue;
      const e = store[id];
      if (!e) continue;
      if (!autoTracking.has(id)) {
        // Backfill the gap between when the user hit play and the process first
        // showing up (Steam/engine boot is a few seconds). Only trust a recent
        // launch, and cap it so a stale launch can't inject a big chunk.
        const lt = launchTimes.get(id);
        launchTimes.delete(id);
        let gap = (lt && now - lt < 300000) ? Math.round((now - lt) / 1000) : 0;
        if (gap > MAX_TICK_SECONDS) gap = MAX_TICK_SECONDS;
        if (gap > 0) { e.playtime_seconds = (e.playtime_seconds || 0) + gap; e.last_played = now; changed = true; }
        autoTracking.set(id, now);
        sessionStarts.set(id, now);
        if (e.status === 'unplayed' || e.status === 'paused') { e.status = 'reading'; changed = true; }
        if (!e.started_at) { e.started_at = now; changed = true; }
        if (win && !win.isDestroyed()) win.webContents.send('vn-started', id);
      } else {
        let delta = Math.round((now - autoTracking.get(id)) / 1000);
        if (delta > MAX_TICK_SECONDS) delta = MAX_TICK_SECONDS; // ignore sleep gaps
        if (delta > 0) { e.playtime_seconds = (e.playtime_seconds || 0) + delta; e.last_played = now; changed = true; }
        autoTracking.set(id, now);
      }
    }
    // Detect stops.
    for (const id of [...autoTracking.keys()]) {
      const e = store[id];
      const base = e && e.exe_path ? path.basename(e.exe_path).toLowerCase() : null;
      if (!base || !running.has(base)) {
        const startMs = sessionStarts.get(id);
        autoTracking.delete(id);
        sessionStarts.delete(id);
        if (startMs) {
          const durationSeconds = Math.round((now - startMs) / 1000);
          if (durationSeconds >= 1800) { // only log sessions >= 30 min
            try {
              const s = readSettings();
              const sessions = s.sessions || [];
              sessions.push({
                vnId: id,
                vnTitle: (e && e.title) || id,
                startedAt: startMs,
                endedAt: now,
                durationSeconds,
              });
              // keep last 100 sessions
              s.sessions = sessions.slice(-100);
              writeSettings(s);
            } catch (_) {}
          }
        }
        if (win && !win.isDestroyed()) win.webContents.send('vn-stopped', id);
      }
    }
    if (changed) writeStore(store);
  });
}

function applyAutoStart(enabled) {
  try { app.setLoginItemSettings({ openAtLogin: !!enabled, args: ['--hidden'] }); } catch {}
}

// ── Auto-update ────────────────────────────────────────────────────────────────
// Only runs in the installed (electron-builder) build; silently no-ops in dev or
// packager builds (no update feed present). Downloads in the background and also
// reports progress to the Settings → About page so it isn't a silent black box.
let autoUpdaterRef = null;
// state: unsupported | idle | checking | available | downloading | ready | current | error
let updateState = { state: app.isPackaged ? 'idle' : 'unsupported', version: null, percent: 0, error: null };

function setUpdateState(patch) {
  updateState = { ...updateState, ...patch };
  try { if (win && !win.isDestroyed()) win.webContents.send('update-status', updateState); } catch {}
}

function initAutoUpdate() {
  if (!app.isPackaged) return;
  let autoUpdater;
  try { ({ autoUpdater } = require('electron-updater')); } catch { setUpdateState({ state: 'unsupported' }); return; }
  autoUpdaterRef = autoUpdater;
  autoUpdater.autoDownload = true;
  autoUpdater.autoInstallOnAppQuit = true;
  // Accept whatever the "latest" release points to, even a lower version — lets us
  // roll back (e.g. an accidental high version) without clients getting stuck.
  autoUpdater.allowDowngrade = true;
  autoUpdater.on('checking-for-update', () => setUpdateState({ state: 'checking', error: null }));
  autoUpdater.on('update-available',     (info) => setUpdateState({ state: 'available', version: info && info.version, percent: 0 }));
  autoUpdater.on('update-not-available', ()     => setUpdateState({ state: 'current', percent: 0 }));
  autoUpdater.on('download-progress',    (p)    => setUpdateState({ state: 'downloading', percent: Math.round((p && p.percent) || 0) }));
  autoUpdater.on('update-downloaded', (info) => {
    // No modal — the About page surfaces a "Restart & install" button, and the
    // update also installs automatically on next quit (autoInstallOnAppQuit).
    setUpdateState({ state: 'ready', version: info && info.version, percent: 100 });
  });
  autoUpdater.on('error', (err) => setUpdateState({ state: 'error', error: err && err.message ? String(err.message).split('\n')[0] : 'update failed' }));
  try { autoUpdater.checkForUpdates(); } catch {}
}

// Manual "Check for updates" from the About page.
ipcMain.handle('get-update-state', () => updateState);
ipcMain.handle('check-for-updates', () => {
  if (!app.isPackaged) return { ...updateState, state: 'unsupported' };
  if (!autoUpdaterRef) { initAutoUpdate(); return updateState; }
  setUpdateState({ state: 'checking', error: null });
  try { autoUpdaterRef.checkForUpdates(); } catch (e) { setUpdateState({ state: 'error', error: 'check failed' }); }
  return updateState;
});
ipcMain.handle('quit-and-install', () => {
  if (autoUpdaterRef) { isQuitting = true; try { autoUpdaterRef.quitAndInstall(); } catch {} }
  return true;
});

// Kill default menu immediately
Menu.setApplicationMenu(null);

// Pin the data directory to a FIXED, machine-independent path. It used to live
// under %APPDATA%\Tsundoku\vn-launcher, but that embeds the Windows username
// (C:\Users\<name>\AppData\…) so the path differed on every PC. ProgramData is the
// same on every Windows install (C:\ProgramData), so the location is now identical
// everywhere and contains no per-user path. migrateToFixedDataDir() copies an
// existing AppData library here on first launch so nobody loses data.
const OLD_DATA_DIR  = path.join(app.getPath('appData'), 'Tsundoku', 'vn-launcher');
const DATA_DIR      = path.join(process.env.ProgramData || 'C:\\ProgramData', 'Tsundoku');
const DB_PATH       = path.join(DATA_DIR, 'entries.json');
const SETTINGS_PATH = path.join(DATA_DIR, 'settings.json');

// Per-machine launch paths (exe_path) live HERE, in a local-only file under
// %LOCALAPPDATA% — deliberately OUTSIDE the synced DATA_DIR. A game can be installed
// at a different path on each PC, so install paths must never travel with the synced
// library: Syncthing keeps entries.json (status/playtime/ratings) identical across
// machines, while each PC keeps its own exe paths here and they survive every sync.
const LOCAL_DIR    = path.join(process.env.LOCALAPPDATA || path.join(app.getPath('home'), 'AppData', 'Local'), 'Tsundoku');
const PATHS_PATH   = path.join(LOCAL_DIR, 'exe-paths.json'); // { [vnId]: exePath }

function readExePaths() {
  try { return JSON.parse(fs.readFileSync(PATHS_PATH, 'utf8')); } catch { return {}; }
}
function writeExePaths(map) {
  try {
    if (!fs.existsSync(LOCAL_DIR)) fs.mkdirSync(LOCAL_DIR, { recursive: true });
    const tmp = PATHS_PATH + '.tmp';
    fs.writeFileSync(tmp, JSON.stringify(map, null, 2), 'utf8');
    fs.renameSync(tmp, PATHS_PATH);
  } catch {}
}

// ── Settings ──────────────────────────────────────────────────────────────────
const SETTINGS_DEFAULTS = {
  scanDir:          null,    // legacy single dir (migrated into scanDirs)
  scanDirs:         [],      // multiple folders scanned for VN executables
  nsfwHide:         false,   // legacy (unused; superseded by nsfwHideLibrary)
  nsfwHideLibrary:  false,   // hide 18+ in Home/Library/Wishlist
  nsfwBlur:         false,   // legacy (split into the two below)
  nsfwBlurLibrary:  false,   // blur 18+ covers in Home/Library/Wishlist
  nsfwBlurBrowse:   true,    // blur 18+ covers in Browse/Search (on by default)
  browseNsfwFilter: true,    // hide 18+ in Browse lists (search still shows all)
  zoom:             100,
  showExcluded:     false,
  minimizeOnClose:  true,    // close button hides to tray instead of quitting
  startWithWindows: false,   // launch hidden in the tray at Windows login
};

function readSettings() {
  if (!fs.existsSync(SETTINGS_PATH)) return { ...SETTINGS_DEFAULTS };
  try {
    const loaded = JSON.parse(fs.readFileSync(SETTINGS_PATH, 'utf8'));
    // Migrate the old single blur toggle → both per-context toggles.
    if (loaded.nsfwBlur && loaded.nsfwBlurLibrary === undefined && loaded.nsfwBlurBrowse === undefined) {
      loaded.nsfwBlurLibrary = true;
      loaded.nsfwBlurBrowse  = true;
    }
    // Migrate the old single scanDir → scanDirs array.
    if ((!Array.isArray(loaded.scanDirs) || !loaded.scanDirs.length) && loaded.scanDir) {
      loaded.scanDirs = [loaded.scanDir];
    }
    // Rename sand palette → coffee.
    if (loaded.palette === 'sand') loaded.palette = 'coffee';
    // Remove blocked tags from the user's hidden-tags list.
    if (Array.isArray(loaded.hiddenTags)) {
      const before = loaded.hiddenTags.length;
      loaded.hiddenTags = loaded.hiddenTags.filter(t => {
        const name = (t.name || '').toLowerCase();
        return !BLOCKED_TAG_FRAGMENTS.some(f => name.includes(f));
      });
      if (loaded.hiddenTags.length !== before) writeJsonAtomic(SETTINGS_PATH, loaded);
    }
    return { ...SETTINGS_DEFAULTS, ...loaded };
  } catch { return { ...SETTINGS_DEFAULTS }; }
}

// Atomic JSON write: write to a temp file then rename, so a crash/kill mid-write
// can never leave a half-written (corrupt) file that would wipe data on next read.
function writeJsonAtomic(file, data) {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  const tmp = file + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2), 'utf8');
  fs.renameSync(tmp, file);
}

function writeSettings(s) {
  writeJsonAtomic(SETTINGS_PATH, s);
}

// ── Store ─────────────────────────────────────────────────────────────────────
function readStore() {
  if (!fs.existsSync(DB_PATH)) return {};
  let store;
  try { store = JSON.parse(fs.readFileSync(DB_PATH, 'utf8')); }
  catch {
    // Corrupt file: preserve a backup for recovery rather than silently wiping it.
    try { fs.copyFileSync(DB_PATH, DB_PATH + '.corrupt-' + Date.now()); } catch {}
    return {};
  }
  for (const e of Object.values(store)) {
    if (e.library === undefined) e.library = !!(e.owned || e.readlist);
    delete e.owned; delete e.readlist;
  }
  // Purge any titles carrying completely unacceptable tags.
  let purged = false;
  for (const id of Object.keys(store)) {
    if (hasBlockedTag(store[id])) { delete store[id]; purged = true; }
  }
  if (purged) writeJsonAtomic(DB_PATH, store);

  // Overlay THIS machine's launch paths from the local-only file. The synced
  // entries.json carries no exe paths, so this is always the source of truth for
  // where a game lives on this PC (regardless of what another PC synced over).
  const localPaths = readExePaths();
  for (const [id, e] of Object.entries(store)) e.exe_path = localPaths[id] || null;
  return store;
}

function writeStore(store) {
  // Peel machine-specific launch paths off into the local-only file and keep them
  // OUT of the synced entries.json, so Syncthing can never overwrite this PC's paths.
  const localPaths = readExePaths();
  let pathsChanged = false;
  const synced = {};
  for (const [id, e] of Object.entries(store)) {
    const p = e.exe_path || null;
    if (p !== (localPaths[id] || null)) {
      if (p) localPaths[id] = p; else delete localPaths[id];
      pathsChanged = true;
    }
    const { exe_path, ...rest } = e; // strip exe_path from the synced copy
    synced[id] = rest;
  }
  if (pathsChanged) writeExePaths(localPaths);
  writeJsonAtomic(DB_PATH, synced);
}

function ensureEntry(store, meta) {
  if (!store[meta.id]) {
    store[meta.id] = {
      id:               meta.id,
      title:            meta.title,
      title_en:         meta.title_en ?? null,
      title_ja:         meta.title_ja ?? null,
      title_orig:       meta.title_orig ?? meta.title ?? null,
      alttitle:         meta.alttitle ?? null,
      image:            meta.image ?? null,
      description:      meta.description ?? null,
      rating:           meta.rating ?? null,
      nsfw:             meta.nsfw ?? false,
      released:         meta.released ?? null,
      developer:        meta.developer ?? null,
      length_minutes:   meta.length_minutes ?? null,
      length:           meta.length         ?? null,
      library:          false,
      exe_path:         null,
      status:           'unplayed',
      wishlist:         false,
      wishlistPrivate:  false,
      excluded:         false,
      playtime_seconds: 0,
      last_played:      null,
      started_at:       null,
      finished_at:      null,
      added_at:         Date.now(),
    };
  } else {
    const e = store[meta.id];
    if (meta.title)     e.title       = meta.title;
    if (meta.title_en   !== undefined) e.title_en   = meta.title_en;
    if (meta.title_ja   !== undefined) e.title_ja   = meta.title_ja;
    if (meta.title_orig != null)       e.title_orig = meta.title_orig;
    if (meta.alttitle !== undefined) e.alttitle = meta.alttitle || null;
    if (meta.image)     e.image       = meta.image;
    if (meta.description) e.description = meta.description;
    if (meta.rating   != null) e.rating   = meta.rating;
    if (meta.nsfw     != null) e.nsfw     = meta.nsfw;
    if (meta.released != null) e.released = meta.released;
    if (meta.developer)        e.developer = meta.developer;
    if (meta.length_minutes != null) e.length_minutes = meta.length_minutes;
  }
  return store[meta.id];
}

// One-time migration: earlier builds saved under %APPDATA%\vn-launcher before the
// app was renamed to "Tsundoku". Merge any old library/progress into the current
// store so renaming never loses data. Prefers the higher playtime / real status.
// Move an existing AppData library to the new fixed ProgramData location. Runs
// before any store read. If the new dir already has entries.json we've migrated
// (or it's a fresh install) — do nothing. Files are copied, not moved, so the old
// AppData copy stays as a fallback and nothing is destroyed.
function migrateToFixedDataDir() {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    if (OLD_DATA_DIR === DATA_DIR) return;
    if (fs.existsSync(DB_PATH)) return;            // already populated here
    if (!fs.existsSync(OLD_DATA_DIR)) return;      // nothing to bring over
    for (const name of fs.readdirSync(OLD_DATA_DIR)) {
      const src = path.join(OLD_DATA_DIR, name);
      const dst = path.join(DATA_DIR, name);
      try { if (fs.statSync(src).isFile() && !fs.existsSync(dst)) fs.copyFileSync(src, dst); } catch {}
    }
  } catch {}
}

// One-time: lift machine-specific launch paths out of the synced entries.json into
// the local-only exe-paths.json. Guarded by that file's existence so it runs once.
// Only adopts a path that actually EXISTS on this machine — so a library synced from
// another PC doesn't inherit that PC's (wrong) install locations; those just show as
// "Locate on device" until the user points them at the local copy once.
function migrateExePathsLocal() {
  try {
    if (fs.existsSync(PATHS_PATH)) return;          // already split out
    if (!fs.existsSync(DB_PATH)) { writeExePaths({}); return; }
    let raw; try { raw = JSON.parse(fs.readFileSync(DB_PATH, 'utf8')); } catch { return; }
    const localPaths = {};
    let strippedAny = false;
    for (const e of Object.values(raw)) {
      if (e && e.exe_path) {
        if (fs.existsSync(e.exe_path)) localPaths[e.id] = e.exe_path;
        delete e.exe_path;
        strippedAny = true;
      }
    }
    writeExePaths(localPaths);
    if (strippedAny) writeJsonAtomic(DB_PATH, raw);
  } catch {}
}

function migrateLegacyStore() {
  try {
    const flag = path.join(DATA_DIR, '.migrated-v2');
    if (fs.existsSync(flag)) return;
    // Every place older builds may have written, due to app-name resolution.
    const candidates = [
      path.join(app.getPath('appData'), 'vn-launcher', 'vn-launcher', 'entries.json'),
      path.join(app.getPath('appData'), 'Electron',    'vn-launcher', 'entries.json'),
    ];
    const cur = readStore();
    let merged = false;
    for (const legacyDb of candidates) {
      if (!fs.existsSync(legacyDb) || legacyDb === DB_PATH) continue;
      let legacy; try { legacy = JSON.parse(fs.readFileSync(legacyDb, 'utf8')); } catch { continue; }
      for (const [id, le] of Object.entries(legacy)) {
        const ce = cur[id];
        if (!ce) { cur[id] = le; merged = true; continue; }
        if ((le.playtime_seconds || 0) > (ce.playtime_seconds || 0)) { ce.playtime_seconds = le.playtime_seconds; merged = true; }
        if ((le.last_played || 0) > (ce.last_played || 0)) { ce.last_played = le.last_played; merged = true; }
        if (le.library  && !ce.library)  { ce.library = true; merged = true; }
        if (le.wishlist && !ce.wishlist) { ce.wishlist = true; merged = true; }
        if ((!ce.status || ce.status === 'unplayed') && le.status && le.status !== 'unplayed') { ce.status = le.status; merged = true; }
        if (!ce.exe_path && le.exe_path) { ce.exe_path = le.exe_path; merged = true; }
      }
    }
    if (merged) writeStore(cur);
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(flag, new Date().toISOString());
  } catch {}
}

// One-time repair: earlier scans used a "largest exe wins" heuristic that could
// pick a helper exe (e.g. UnityCrashHandler64.exe is bigger than the game in some
// Unity titles). That broke playtime detection — the poller watched the wrong
// process name. Re-point any library entry whose stored exe is now flagged as junk
// to the real main exe in the same folder. pickMainExe() is hoisted (declared
// below) so it's available here at runtime.
function repairJunkExePaths() {
  try {
    const flag = path.join(DATA_DIR, '.exe-repaired-v1');
    if (fs.existsSync(flag)) return;
    const store = readStore();
    let changed = false;
    for (const e of Object.values(store)) {
      if (!e.library || !e.exe_path) continue;
      if (!EXE_JUNK.test(path.basename(e.exe_path))) continue;
      const better = pickMainExe(path.dirname(e.exe_path));
      if (better && better.toLowerCase() !== e.exe_path.toLowerCase()) {
        e.exe_path = better; changed = true;
      }
    }
    if (changed) writeStore(store);
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(flag, new Date().toISOString());
  } catch {}
}

// Write where this instance is actually reading/writing — so the exact build +
// path in use can be verified (this is what diagnosed the "two datasets" issue).
function writeRuntimeDebug() {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(path.join(DATA_DIR, 'runtime-debug.json'), JSON.stringify({
      time:     new Date().toISOString(),
      execPath: process.execPath,
      appName:  app.getName(),
      dataDir:  DATA_DIR,
      argv:     process.argv,
    }, null, 2));
  } catch {}
}

function pruneIfOrphan(store, id) {
  const e = store[id];
  // Keep entries that have playtime history, or are hidden from browse, so the flag persists.
  if (e && !e.library && !e.wishlist && !e.wishlistPrivate && !e.hidden && !e.playtime_seconds && !e.last_played) {
    delete store[id];
  }
}

// If an exe lives under a Steam library (…\steamapps\common\<game>\…), find its
// Steam appid from the appmanifest, so we can launch it through Steam (launching
// the exe directly is usually blocked / relaunches via Steam anyway).
function findSteamAppId(exePath) {
  try {
    const marker = `${path.sep}steamapps${path.sep}common${path.sep}`;
    const i = exePath.toLowerCase().indexOf(marker.toLowerCase());
    if (i === -1) return null;
    const steamappsDir = exePath.slice(0, i) + `${path.sep}steamapps`;
    const installDir = exePath.slice(i + marker.length).split(path.sep)[0];
    if (!installDir) return null;
    for (const f of fs.readdirSync(steamappsDir)) {
      if (!/^appmanifest_\d+\.acf$/i.test(f)) continue;
      const txt = fs.readFileSync(path.join(steamappsDir, f), 'utf8');
      const inst = txt.match(/"installdir"\s+"([^"]+)"/i);
      if (inst && inst[1].toLowerCase() === installDir.toLowerCase()) {
        const id = txt.match(/"appid"\s+"(\d+)"/i);
        if (id) return id[1];
      }
    }
  } catch {}
  return null;
}

// ── Window + Tray ─────────────────────────────────────────────────────────────
let win;
let tray = null;
let isQuitting = false;

function showWindow() {
  if (!win || win.isDestroyed()) { createWindow(); return; }
  if (win.isMinimized()) win.restore();
  win.show();
  win.focus();
  // Re-read the store in case data changed while hidden (e.g. game playtime).
  try { win.webContents.send('window-shown'); } catch {}
}

function quitFromTray() {
  const choice = dialog.showMessageBoxSync({
    type: 'question',
    buttons: ['Quit', 'Cancel'],
    defaultId: 0,
    cancelId: 1,
    title: 'Quit Tsundoku',
    message: 'Quit Tsundoku completely?',
    detail: 'It will stop running in the background, and any game currently being tracked will no longer have its playtime recorded.',
  });
  if (choice === 0) { isQuitting = true; app.quit(); }
}

function createTray() {
  try {
    const { iconPath, nativeImg } = getAppIcon();
    tray = new Tray(iconPath || nativeImg);
    tray.setToolTip('Tsundoku');
    tray.setContextMenu(Menu.buildFromTemplate([
      { label: 'Open Tsundoku', click: showWindow },
      { type: 'separator' },
      { label: 'Quit Tsundoku', click: quitFromTray },
    ]));
    tray.on('click', showWindow);
    tray.on('double-click', showWindow);
  } catch {}
}

function createWindow() {
  const { iconPath, nativeImg } = getAppIcon();
  const startHidden = process.argv.includes('--hidden'); // auto-start → run in tray
  win = new BrowserWindow({
    width: 1200, height: 800, minWidth: 900, minHeight: 600,
    frame: false,
    title: 'Tsundoku',
    show: !startHidden,
    backgroundColor: '#141714',
    ...(iconPath ? { icon: iconPath } : (nativeImg ? { icon: nativeImg } : {})),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
    },
  });
  // Set both forms; Windows taskbar honours one of them depending on version.
  try { if (iconPath) win.setIcon(iconPath); else if (nativeImg) win.setIcon(nativeImg); } catch {}
  // Keep the OS window title as "Tsundoku" (don't inherit document title changes to "Electron").
  win.on('page-title-updated', e => { e.preventDefault(); win.setTitle('Tsundoku'); });
  win.loadFile(path.join(__dirname, 'renderer', 'index.html'));
  win.webContents.once('did-finish-load', () => { try { win.setTitle('Tsundoku'); } catch {} });

  // Tell renderer when maximize state changes
  win.on('maximize',   () => win.webContents.send('win-maximized', true));
  win.on('unmaximize', () => win.webContents.send('win-maximized', false));

  // Close button → hide to tray (keep running) unless really quitting or the
  // "minimize on close" setting is off.
  win.on('close', (e) => {
    if (isQuitting) return;
    let minimize = true;
    try { minimize = readSettings().minimizeOnClose !== false; } catch {}
    if (minimize) { e.preventDefault(); win.hide(); }
  });
}

// Prevent a second copy from running — two instances share the same data file
// and would clobber each other's writes (lost progress).
const gotLock = app.requestSingleInstanceLock();
if (!gotLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (win) { if (win.isMinimized()) win.restore(); win.focus(); }
  });

  app.whenReady().then(() => {
    // Distinct AppUserModelID so Windows shows OUR icon, not electron.exe's, in dev.
    try { app.setAppUserModelId('com.tsundoku.launcher'); } catch {}
    migrateToFixedDataDir();
    migrateExePathsLocal();
    migrateLegacyStore();
    repairJunkExePaths();
    writeRuntimeDebug();
    applyAutoStart(readSettings().startWithWindows);
    createWindow();
    createTray();
    watchDataDir();
    // Begin automatic playtime detection.
    pollRunningGames();
    pollTimer = setInterval(pollRunningGames, POLL_INTERVAL_MS);
    // Check for updates (installed build only).
    initAutoUpdate();
  });
  app.on('before-quit', () => { isQuitting = true; });
  app.on('activate', () => showWindow());
  // Fires only when the window is truly closed (not when hidden to tray), so the
  // "minimize on close" case never reaches here — it just quits as expected.
  app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
}

// ── Syncthing / external file watcher ────────────────────────────────────────
// Watches entries.json for changes made outside the app (e.g. Syncthing sync).
// Debounced so rapid successive writes only fire one reload.
let _syncDebounce = null;
let dataWatcher = null;
function watchDataDir() {
  try {
    dataWatcher = fs.watch(DATA_DIR, (event, filename) => {
      if (filename !== 'entries.json') return;
      clearTimeout(_syncDebounce);
      _syncDebounce = setTimeout(() => {
        if (win && !win.isDestroyed()) win.webContents.send('entries-changed');
      }, 600);
    });
    // Swallow watcher errors (e.g. EPERM when the data folder is removed during an
    // uninstall-with-delete-data) so they don't crash the main process.
    dataWatcher.on('error', () => {});
  } catch {}
}

// ── Window Controls IPC ───────────────────────────────────────────────────────
ipcMain.on('win-minimize', () => win?.minimize());
ipcMain.on('win-maximize', () => win?.isMaximized() ? win.unmaximize() : win.maximize());
ipcMain.on('win-close',    () => win?.close());
ipcMain.handle('win-is-maximized', () => win?.isMaximized() || false);
ipcMain.handle('win-set-icon', (_e, dataUrl) => {
  try {
    const img = nativeImage.createFromDataURL(dataUrl);
    if (win && !img.isEmpty()) {
      win.setIcon(img);
      // Dump what we actually set, so the icon can be inspected off-screen.
      try { fs.writeFileSync(path.join(DATA_DIR, 'icon-debug.png'), img.toPNG()); } catch {}
    }
  } catch {}
});

// Open an external URL in the user's default browser.
ipcMain.handle('open-external', (_e, url) => {
  try {
    if (typeof url === 'string' && /^https?:\/\//i.test(url)) shell.openExternal(url);
  } catch {}
  return true;
});
ipcMain.handle('get-version', () => app.getVersion());
ipcMain.handle('get-install-path', () => path.dirname(app.getPath('exe')));
ipcMain.handle('get-data-path', () => DATA_DIR);
// Open a local folder in the OS file manager (highlights it).
ipcMain.handle('open-path', (_e, p) => {
  try { if (typeof p === 'string' && fs.existsSync(p)) shell.openPath(p); } catch {}
  return true;
});
ipcMain.handle('uninstall-app', (_e, deleteData) => {
  // The NSIS uninstaller only removes the installed program (deleteAppDataOnUninstall
  // is false). The library lives in C:\ProgramData\Tsundoku, which the installer never
  // created, so it's never touched by the uninstaller.
  const uninstallerPath = path.join(path.dirname(app.getPath('exe')), 'Uninstall Tsundoku.exe');
  try { spawn(uninstallerPath, [], { detached: true, stdio: 'ignore' }).unref(); } catch {}
  // When the user opts in, wipe the data folders AFTER this app exits (deleting
  // in-process raced the OS releasing the data-folder watch handle — rmSync threw
  // EPERM/EBUSY, swallowed, so the wipe silently failed). We run it via a hidden
  // VBScript through wscript.exe: wscript has no console window, and Run(…, 0, …)
  // launches the delete with a hidden window — so nothing flashes on screen (a plain
  // detached cmd.exe shows a console even with windowsHide). The script sleeps ~2s for
  // the app to fully exit, removes the folders, then deletes itself.
  //
  // Must wipe EVERY location the app can restore from, or a reinstall resurrects the
  // library: the current ProgramData store, the per-PC exe-paths, the %APPDATA%\Tsundoku
  // copy left as a fallback by the 1.3.26 migration, and the two pre-rename legacy dirs
  // that migrateLegacyStore() still merges from.
  if (deleteData) {
    try { clearInterval(pollTimer); pollTimer = null; } catch {}
    try { dataWatcher?.close(); dataWatcher = null; } catch {}
    try {
      const appData = app.getPath('appData');
      const wipe = [
        DATA_DIR,                                            // C:\ProgramData\Tsundoku (current)
        LOCAL_DIR,                                           // %LOCALAPPDATA%\Tsundoku (exe paths)
        path.join(appData, 'Tsundoku'),                     // %APPDATA%\Tsundoku (1.3.26 fallback + chromium userData)
        path.join(appData, 'vn-launcher'),                  // legacy (pre-rename)
        path.join(appData, 'Electron', 'vn-launcher'),      // legacy (electron default name)
      ];
      const vbsPath = path.join(app.getPath('temp'), `tsundoku-wipe-${Date.now()}.vbs`);
      const del = wipe.map(d => `rmdir /s /q ""${d}""`).join(' & ');
      const vbs = [
        'Set s = CreateObject("WScript.Shell")',
        'WScript.Sleep 2000',
        `s.Run "cmd /c ${del}", 0, True`,
        `s.Run "cmd /c del ""${vbsPath}""", 0, False`,
      ].join('\r\n');
      fs.writeFileSync(vbsPath, vbs);
      spawn('wscript.exe', [vbsPath], { detached: true, stdio: 'ignore', windowsHide: true }).unref();
    } catch {}
  }
  setTimeout(() => app.quit(), 300);
});

// Reset appearance/behavior preferences to defaults. Keeps the library, reading
// stats and config (scan folders, collections, VNDB account, blocked tags).
ipcMain.handle('restore-default-settings', () => {
  const KEEP = ['sessions', 'achievements', 'achSeenCount', 'collections',
    'scanDirs', 'scanDir', 'hiddenTags', 'dismissedScans', 'vndbUsername', 'vndbToken'];
  const cur = readSettings();
  const next = { ...SETTINGS_DEFAULTS };
  for (const k of KEEP) if (cur[k] !== undefined) next[k] = cur[k];
  writeSettings(next);
  applyAutoStart(next.startWithWindows);
  return true;
});

// Wipe the library + reading stats so the app is empty and can be rebuilt from a
// backup file. Backup files are never touched (they live wherever you exported them).
// Settings/preferences are kept and the app stays installed.
ipcMain.handle('wipe-library-data', () => {
  try { writeStore({}); } catch {}
  try { if (fs.existsSync(PATHS_PATH)) fs.unlinkSync(PATHS_PATH); } catch {}
  try {
    const s = readSettings();
    s.sessions = [];
    s.achievements = {};
    s.achSeenCount = 0;
    writeSettings(s);
  } catch {}
  return true;
});

// ── Wishlist release alerts ────────────────────────────────────────────────────
// Fetches all official English releases for the given VNDB IDs.
// Returns { vnId: [{id, title, released, patch}] }.
ipcMain.handle('wishlist-get-releases', async (_e, vnIds) => {
  if (!vnIds || !vnIds.length) return {};
  const out = {};
  const BATCH = 20;
  for (let i = 0; i < vnIds.length; i += BATCH) {
    const chunk = vnIds.slice(i, i + BATCH);
    try {
      const vnFilter = chunk.length === 1
        ? ['vn', '=', chunk[0]]
        : ['or', ...chunk.map(id => ['vn', '=', id])];
      let data;
      try {
        data = await vndbFetch('release', {
          filters: ['and', ['lang', '=', 'en'], ['official', '=', true], vnFilter],
          fields: 'id,title,released,patch,vns.id',
          results: 100,
        }, { priority: PRI.LOW });
      } catch { continue; }
      for (const rel of (data.results || [])) {
        for (const vn of (rel.vns || [])) {
          if (!vnIds.includes(vn.id)) continue;
          if (!out[vn.id]) out[vn.id] = [];
          out[vn.id].push({ id: rel.id, title: rel.title, released: rel.released, patch: !!rel.patch });
        }
      }
    } catch {}
  }
  return out;
});

// ── VNDB request queue ────────────────────────────────────────────────────────
// VNDB rate-limits hard (429) and bills by query execution time, so bursts of
// concurrent calls (browse infinite-scroll + background backfill + modal opens)
// blow past its budget. Serialize ALL VNDB calls through one queue with a minimum
// spacing; higher-priority (user-initiated) requests jump ahead of low-priority
// background work (backfill, release checks).
// Adaptive spacing: run fast normally, automatically slow down if VNDB starts
// throttling (429), then recover. This keeps things snappy without bursting.
const VNDB_GAP_MIN = 550;
const VNDB_GAP_MAX = 2200;
let vndbGap = VNDB_GAP_MIN;
const PRI = { HIGH: 2, NORMAL: 1, LOW: 0 };
const vndbQueue = [];
let vndbBusy = false;
let vndbLastAt = 0;

function vndbEnqueue(run, priority = PRI.NORMAL) {
  return new Promise((resolve, reject) => {
    const item = { run, resolve, reject, priority };
    // Insert by priority (higher first), stable/FIFO within the same priority.
    let i = vndbQueue.length;
    while (i > 0 && vndbQueue[i - 1].priority < priority) i--;
    vndbQueue.splice(i, 0, item);
    vndbPump();
  });
}
async function vndbPump() {
  if (vndbBusy) return;
  const item = vndbQueue.shift();
  if (!item) return;
  vndbBusy = true;
  const wait = Math.max(0, vndbGap - (Date.now() - vndbLastAt));
  if (wait) await new Promise(r => setTimeout(r, wait));
  try { item.resolve(await item.run()); }
  catch (e) { item.reject(e); }
  finally { vndbLastAt = Date.now(); vndbBusy = false; vndbPump(); }
}

// One POST to a VNDB endpoint, enqueued so spacing is enforced. Retries 429/5xx
// with exponential backoff (honouring Retry-After) — the backoff sleeps inside the
// queue slot, so it also delays the following request.
function vndbFetch(endpoint, body, { priority = PRI.NORMAL, headers = {} } = {}) {
  return vndbEnqueue(async () => {
    for (let attempt = 0; ; attempt++) {
      const res = await fetch(`https://api.vndb.org/kana/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...headers },
        body: JSON.stringify(body),
      });
      if ((res.status === 429 || res.status >= 500) && attempt < 5) {
        vndbGap = Math.min(VNDB_GAP_MAX, vndbGap + 450); // back off globally
        const ra = parseInt(res.headers.get('retry-after'), 10);
        const ms = Number.isFinite(ra) ? ra * 1000 : Math.min(8000, 1000 * 2 ** attempt);
        await new Promise(r => setTimeout(r, ms));
        continue;
      }
      if (!res.ok) throw new Error(`VNDB ${res.status}`);
      vndbGap = Math.max(VNDB_GAP_MIN, vndbGap - 60); // healthy — speed back up
      return res.json();
    }
  }, priority);
}

// ── VNDB ──────────────────────────────────────────────────────────────────────
const vndbVN = (body, opts = {}) => vndbFetch('vn', body, opts);

// Fields we always request for list/search results.
// tags.{name,category,rating} drive accurate 18+ detection (cover rating alone
// misses adult titles with tame covers).
const LIST_FIELDS = 'id, title, alttitle, titles.lang, titles.title, titles.official, titles.main, image.url, image.sexual, description, rating, votecount, released, developers.name, length, length_minutes, tags.name, tags.category, tags.rating';
// Full detail fields for single-VN fetch
const DETAIL_FIELDS = 'id, title, alttitle, titles.lang, titles.title, titles.official, titles.main, image.url, image.sexual, description, rating, released, developers.name, tags.name, tags.category, tags.rating, length, length_minutes, extlinks.url, extlinks.label, extlinks.name';

// Tags whose presence makes a title completely unacceptable — never stored, never shown.
// Matched as lowercase substrings so all variants (e.g. "Lesbian Lolicon") are caught.
const BLOCKED_TAG_FRAGMENTS = ['lolicon', 'shotacon', 'sex involving children'];
function hasBlockedTag(vn) {
  const tags = vn.tags || [];
  return tags.some(t => {
    const name = (t.name || t || '').toLowerCase();
    return BLOCKED_TAG_FRAGMENTS.some(f => name.includes(f));
  });
}

// Minimum vote count for a VN to appear in browse lists AND search. Filters out
// the long tail of obscure/doujin titles nobody has heard of. (The folder
// scanner bypasses this so you can still match owned niche games.)
const MIN_VOTES = 200;

// Well-known/established developers — their games are allowed through regardless
// of vote count, so a new release by a respected studio still surfaces.
// Derived from the studios behind the most-voted VNs (≥3 top titles each).
const ALLOWED_DEV_IDS = [
  'p42',   // NITRO PLUS
  'p120',  // Alice Soft
  'p24',   // Key
  'p146',  // MAGES.
  'p350',  // CAPCOM (Ace Attorney / Dai Gyakuten Saiban)
  'p6',    // TYPE-MOON
  'p82',   // 07th Expansion
  'p2807', // Spike Chunsoft (Danganronpa, Zero Escape)
  'p336',  // Frontwing (Grisaia)
  'p98',   // Yuzusoft
  'p10',   // Palette (9-nine)
  'p4488', // NEKO WORKs (Nekopara)
  'p277',  // Innocent Grey
  'p21',   // Leaf
  'p240',  // OVERDRIVE
  'p301',  // Minato Soft (Maji de Watashi ni Koishinasai)
  'p87',   // AQUAPLUS (Utawarerumono, White Album)
  'p4153', // STING
  'p56',   // AKABEiSOFT2
  'p1326', // sprite (Aokana)
  'p619',  // NITRO CHiRAL (BL)
  'p65',   // CIRCUS (Da Capo)
  'p589',  // Otomate
  'p2361', // Design Factory / Idea Factory
  'p19',   // D.O.
  'p331',  // Chunsoft (Ever17 / 428)
  'p8',    // KID (Infinity series)
  'p19579',// SDR Project
  'p104',  // Regista
  'p76',   // PULLTOP
  'p1741', // Torotoro Resistance
  'p328',  // SMEE
  'p378',  // SAGA PLANETS
  'p259',  // Makura
  'p132',  // Purple software
  'p7659', // Qruppo (Nukitashi)
  'p2446', // tone work's
  'p371',  // ASa Project
  'p437',  // Fuguriya (Sono Hanabira)
  'p29',   // Liar-soft
];

// VNDB filter that matches any VN developed by an allowed studio.
function allowedDevFilter() {
  return ['developer', '=', ['or', ...ALLOWED_DEV_IDS.map(id => ['id', '=', id])]];
}

// Shared query builder for both browse and search so they behave identically
// (same vote floor, same sort options, same year filters).
function buildVnQuery(sort, { query, page, yearFrom, yearTo, minVotes = MIN_VOTES, ratingMin, length, devSearch, devId, tagId, tagIds, simpleFloor } = {}) {
  const today = new Date().toISOString().slice(0, 10);
  const presets = {
    rating:   { sort: 'rating',    reverse: true },
    popular:  { sort: 'votecount', reverse: true },
    newest:   { sort: 'released',  reverse: true, extra: ['released', '<=', today] },
    title:    { sort: 'title',     reverse: false },
    relevant: { sort: 'searchrank', reverse: false },
  };
  let cfg = presets[sort] || presets.rating;
  // VNDB only allows the "searchrank" sort alongside a text search; when the user is
  // just browsing/filtering (no query) fall back to Top Rated so it doesn't 400.
  if (cfg.sort === 'searchrank' && !query) cfg = presets.rating;

  const filters = [];
  // Vote floor, but always allow games by well-known developers through. The dev
  // bypass is a 40-clause OR (+ developer join) that's expensive on VNDB; Top
  // Rated passes simpleFloor:true to skip it, since low-vote titles rank low after
  // weighting anyway — keeping that query cheap avoids 429 throttling.
  if (minVotes > 0) {
    filters.push(simpleFloor
      ? ['votecount', '>=', minVotes]
      : ['or', ['votecount', '>=', minVotes], allowedDevFilter()]);
  }
  if (cfg.extra)    filters.push(cfg.extra);
  if (query)        filters.push(['search', '=', query]);
  if (yearFrom)     filters.push(['released', '>=', `${yearFrom}-01-01`]);
  if (yearTo)       filters.push(['released', '<=', `${yearTo}-12-31`]);
  if (ratingMin)    filters.push(['rating', '>=', ratingMin]);          // 10–100 scale
  if (length)       filters.push(['length', '=', length]);             // 1=v.short … 5=v.long
  if (devId)        filters.push(['developer', '=', ['id', '=', devId]]);     // exact studio match
  else if (devSearch) filters.push(['developer', '=', ['search', '=', devSearch]]);
  // One or more tags — a title must carry ALL of them (AND). The [id, maxspoiler,
  // minlevel] form requires the tag to be STRONGLY applied (avg level ≥ 2.0 out of 3),
  // so a title that's only loosely/incidentally tagged doesn't match.
  const tagClause = id => ['tag', '=', [id, 2, 2.0]];
  const tags = (Array.isArray(tagIds) ? tagIds : []).concat(tagId ? [tagId] : []).filter(Boolean);
  if (tags.length === 1)      filters.push(tagClause(tags[0]));
  else if (tags.length > 1)   filters.push(['and', ...tags.map(tagClause)]);

  const body = {
    fields: LIST_FIELDS,
    sort: cfg.sort,
    reverse: cfg.reverse,
    results: 30,
  };
  if (page) body.page = page;
  if (filters.length === 1) body.filters = filters[0];
  else if (filters.length > 1) body.filters = ['and', ...filters];
  return body;
}

// Search: 1000-vote floor + active browse sort + year filters. Pass
// opts.minVotes = 0 to bypass the floor (used by the folder-scan matcher).
function filterBlockedFromResults(data) {
  if (!data || !data.results) return data;
  return { ...data, results: data.results.filter(vn => !hasBlockedTag(vn)) };
}

async function fetchFilteredBrowse_UNUSED(sort, opts = {}) {
  let page = opts.page || 1;
  const results = [];
  let last = null;
  let more = true;

  // Fill one visible page even when blocked titles thin out individual VNDB pages.
  for (let fetched = 0; results.length < 30 && more && fetched < 8; fetched++, page++) {
    const data = await vndbVN(buildVnQuery(sort, {
      page,
      yearFrom: opts.yearFrom, yearTo: opts.yearTo,
      ratingMin: opts.ratingMin, length: opts.length, devSearch: opts.devSearch, devId: opts.devId, tagId: opts.tagId, tagIds: opts.tagIds,
    }), { priority: PRI.HIGH });
    last = data;
    more = !!data.more;
    results.push(...((data.results || []).filter(vn => !hasBlockedTag(vn))));
  }

  return { ...(last || {}), results, more, nextPage: page };
}

ipcMain.handle('vndb-search', async (_e, query, sort = 'rating', opts = {}) =>
  filterBlockedFromResults(await vndbVN(buildVnQuery(sort, {
    query, minVotes: opts.minVotes, simpleFloor: opts.simpleFloor,
    yearFrom: opts.yearFrom, yearTo: opts.yearTo,
    ratingMin: opts.ratingMin, length: opts.length, devSearch: opts.devSearch, devId: opts.devId, tagId: opts.tagId, tagIds: opts.tagIds,
  }), { priority: PRI.HIGH })));

// Resolve a free-text tag name to its VNDB tag id (most-used match) so it can be
// used as a filter. Returns { id, name } or null.
const tagSearchCache = new Map();
ipcMain.handle('vndb-tag-search', async (_e, name, opts) => {
  const { nsfw = true } = opts || {};
  if (!name || !name.trim()) return null;
  if (BLOCKED_TAG_FRAGMENTS.some(f => name.trim().toLowerCase().includes(f))) return null;
  const cacheKey = `${name.trim().toLowerCase()}|${nsfw}`;
  if (tagSearchCache.has(cacheKey)) return tagSearchCache.get(cacheKey);
  try {
    const d = await vndbFetch('tag', { fields: 'id,name,vn_count,category', filters: ['search', '=', name.trim()], sort: 'vn_count', reverse: true, results: 10 }, { priority: PRI.HIGH });
    let results = (d.results || []).filter(t => !BLOCKED_TAG_FRAGMENTS.some(f => t.name.toLowerCase().includes(f)));
    if (!results.length) return null;
    const q = name.trim().toLowerCase();
    const words = q.split(/\s+/);
    const score = t => {
      const n = t.name.toLowerCase();
      if (n === q) return 3;
      if (n.startsWith(q)) return 2;
      if (words.every(w => n.includes(w))) return 1;
      return 0;
    };
    // Ero tags always require query to cover ≥70% of the tag name
    // ("lesbian" = 63% of "Lesbian Sex" → blocked; "lesbian s" = 82% → passes)
    results = results.filter(t => t.category !== 'ero' || (score(t) > 0 && q.length / t.name.length >= 0.7));
    // With NSFW off, block all remaining ero tags
    if (!nsfw) results = results.filter(t => t.category !== 'ero');
    if (!results.length) return null;
    // Higher score wins; within same score, prefer shorter names ("Yuri" over "Yuri Game Jam")
    results.sort((a, b) => score(b) - score(a) || a.name.length - b.name.length);
    const result = { id: results[0].id, name: results[0].name };
    tagSearchCache.set(cacheKey, result);
    return result;
  } catch { return null; }
});

// Resolve a free-text developer name to a VNDB producer { id, name } so the browse
// developer filter matches a specific studio (not a substring like "Viscum Key").
ipcMain.handle('vndb-producer-search', async (_e, name) => {
  if (!name || !name.trim()) return null;
  try {
    const d = await vndbFetch('producer', { fields: 'id,name', filters: ['search', '=', name.trim()], sort: 'searchrank', results: 1 }, { priority: PRI.HIGH });
    return (d.results && d.results[0]) ? { id: d.results[0].id, name: d.results[0].name } : null;
  } catch { return null; }
});

// ── Steam store integration ────────────────────────────────────────────────
// VNDB stores Steam links on RELEASES (not the VN entity), so we look up the
// VN's releases, find a Steam extlink, then pull the store page + screenshots
// from Steam's (undocumented, key-less) storefront appdetails endpoint.
// Results are cached in-memory per VN (incl. "no steam" negatives) to avoid
// re-hitting either API on every modal open. TTL is generous since this rarely
// changes; the cache resets on app restart.
const steamCache = new Map(); // vnId -> { data, ts }
const STEAM_TTL_MS = 6 * 60 * 60 * 1000; // 6h

// Find the Steam appid for a VN via its VNDB releases' external links.
async function steamAppIdForVn(vnId) {
  let d;
  try {
    d = await vndbFetch('release', {
      filters: ['vn', '=', ['id', '=', vnId]],
      fields: 'extlinks.url, extlinks.name',
      results: 100, // VNDB page max; most VNs have far fewer releases than this
    }, { priority: PRI.HIGH });
  } catch { return null; }
  for (const rel of (d.results || [])) {
    for (const l of (rel.extlinks || [])) {
      if (l && l.name === 'steam' && typeof l.url === 'string') {
        const m = l.url.match(/\/app\/(\d+)/);
        if (m) return m[1];
      }
    }
  }
  return null;
}

// Main/primary characters for a VN (portrait + name), cached per VN. Lazy-loaded by
// the detail modal so it never blocks the initial render.
const charCache = new Map(); // vnId -> { data, ts }
ipcMain.handle('vndb-characters', async (_e, vnId) => {
  if (!vnId) return [];
  const hit = charCache.get(vnId);
  if (hit && Date.now() - hit.ts < STEAM_TTL_MS) return hit.data;
  let chars = [];
  try {
    const d = await vndbFetch('character', {
      filters: ['vn', '=', ['id', '=', vnId]],
      fields: 'id, name, image.url, image.sexual, vns.role, vns.id',
      results: 100,
    }, { priority: PRI.HIGH });
    // Show the whole cast, ordered by importance (main → primary → side → appears).
    const rank = { main: 0, primary: 1, side: 2, appears: 3 };
    chars = (d.results || [])
      .map(c => {
        const v = (c.vns || []).find(x => x.id === vnId) || {};
        return { id: c.id, name: c.name, image: c.image?.url || null, sexual: c.image?.sexual || 0, role: v.role || '' };
      })
      .sort((a, b) => (rank[a.role] ?? 4) - (rank[b.role] ?? 4));
  } catch {}
  charCache.set(vnId, { data: chars, ts: Date.now() });
  return chars;
});

ipcMain.handle('steam-appdetails', async (_e, vnId) => {
  if (!vnId) return null;
  const cached = steamCache.get(vnId);
  if (cached && (Date.now() - cached.ts) < STEAM_TTL_MS) return cached.data;

  let data = null;
  try {
    const appId = await steamAppIdForVn(vnId);
    if (appId) {
      const r = await fetch(`https://store.steampowered.com/api/appdetails?appids=${appId}&l=english`);
      if (r.ok) {
        const j = await r.json();
        const entry = j && j[appId];
        if (entry && entry.success && entry.data) {
          const shots = (entry.data.screenshots || [])
            .map(s => ({ thumb: s.path_thumbnail, full: s.path_full }))
            .filter(s => s.full);
          data = {
            appId,
            storeUrl: `https://store.steampowered.com/app/${appId}/`,
            name: entry.data.name || null,
            screenshots: shots,
          };
        }
      }
      // A link existed but Steam returned nothing usable (e.g. age-gated adult
      // page): still expose the store link so the button shows.
      if (!data) data = { appId, storeUrl: `https://store.steampowered.com/app/${appId}/`, name: null, screenshots: [] };
    }
  } catch { data = null; }

  steamCache.set(vnId, { data, ts: Date.now() });
  return data;
});

// Per-id detail cache so reopening a modal / a backfill pass doesn't refetch.
// `background:true` (used by backfill) runs at LOW priority so it yields to the
// user's browse/modal requests.
const vnDetailCache = new Map(); // id -> { data, ts }
const VN_DETAIL_TTL = 30 * 60 * 1000; // 30 min
ipcMain.handle('vndb-get', async (_e, id, { background = false } = {}) => {
  const hit = vnDetailCache.get(id);
  if (hit && Date.now() - hit.ts < VN_DETAIL_TTL) return hit.data;
  const data = await vndbVN({
    filters: ['id', '=', id],
    fields: DETAIL_FIELDS,
    results: 1,
  }, { priority: background ? PRI.LOW : PRI.HIGH });
  const vn = data?.results?.[0];
  if (vn && hasBlockedTag(vn)) return null;
  vnDetailCache.set(id, { data, ts: Date.now() });
  return data;
});

ipcMain.handle('vndb-browse', async (_e, sort, opts = {}) =>
  filterBlockedFromResults(await vndbVN(buildVnQuery(sort, {
    page: opts.page || 1,
    yearFrom: opts.yearFrom, yearTo: opts.yearTo,
    ratingMin: opts.ratingMin, length: opts.length, devSearch: opts.devSearch, devId: opts.devId, tagId: opts.tagId, tagIds: opts.tagIds,
  }), { priority: PRI.HIGH })));

// "Top Rated" uses an IMDb-style weighted ranking instead of raw average, so a
// 9.0 with 16k votes outranks a 9.0 with 141 votes. We fetch a pool of the
// highest-rated titles and re-rank them by:
//   WR = (v/(v+m))·R + (m/(v+m))·C
// where v = votecount, R = raw rating, m = vote weight, C = global mean.
const WR_M = 1000;   // votes needed before a title mostly "owns" its rating
const WR_C = 65;     // pulled toward this (≈ global VN average) when low-vote
// Cache top-rated pools by filter signature so re-entering Browse or toggling a
// filter back to a prior state is instant and doesn't re-hit VNDB (429 defence).
const topRatedCache = new Map();
const TOP_RATED_TTL = 5 * 60 * 1000;
ipcMain.handle('vndb-top-rated', async (_e, opts = {}) => {
  const { yearFrom, yearTo, ratingMin, length, devSearch, devId, tagId, tagIds } = opts;
  const key = JSON.stringify({ yearFrom, yearTo, ratingMin, length, devSearch, devId, tagId, tagIds });
  const hit = topRatedCache.get(key);
  if (hit && Date.now() - hit.ts < TOP_RATED_TTL) return { results: hit.results };

  const pool = [];
  // Up to 8 pages keeps Top Rated usable after mandatory content filtering.
  // OR (simpleFloor) keeps each query cheap — together this avoids the throttling.
  for (let page = 1; page <= 8 && pool.length < 240; page++) {
    const body = buildVnQuery('rating', { page, yearFrom, yearTo, ratingMin, length, devSearch, devId, tagId, tagIds, simpleFloor: true });
    body.results = 100;
    let data;
    // Let a page-1 failure (network / VNDB down / rate-limit) propagate so the UI
    // shows a real error instead of a misleading "Nothing to show". Once we have
    // some results, a later page failing just ends pagination.
    try { data = await vndbVN(body, { priority: PRI.HIGH }); }
    catch (e) { if (page === 1) throw e; break; }
    const raw = data.results || [];
    const r = raw.filter(vn => !hasBlockedTag(vn));
    pool.push(...r);
    if (raw.length < 100 || !data.more) break;
  }
  for (const v of pool) {
    const R = v.rating || 0, vc = v.votecount || 0;
    v.weighted = (vc / (vc + WR_M)) * R + (WR_M / (vc + WR_M)) * WR_C;
  }
  pool.sort((a, b) => b.weighted - a.weighted);
  topRatedCache.set(key, { ts: Date.now(), results: pool });
  return { results: pool };
});

// ── Store read ────────────────────────────────────────────────────────────────
const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;

// Auto-transition: a "reading" title untouched for 30+ days becomes "paused".
function applyAutoPause(store) {
  let changed = false;
  const now = Date.now();
  for (const e of Object.values(store)) {
    if (e.status === 'reading' && e.last_played && (now - e.last_played) > THIRTY_DAYS) {
      e.status = 'paused';
      changed = true;
    }
  }
  return changed;
}

ipcMain.handle('entries-get-all', () => {
  const store = readStore();
  if (applyAutoPause(store)) writeStore(store);
  return Object.values(store);
});

// Enrich an existing entry's metadata (year, dev, length, alttitle) without
// touching library/wishlist/status/playtime. Used for lazy backfill.
ipcMain.handle('entry-enrich', (_e, meta) => {
  if (!meta || !meta.id) return false;
  const store = readStore();
  const e = store[meta.id];
  if (!e) return false;
  let changed = false;
  if (meta.title_en   !== undefined && e.title_en   !== meta.title_en)   { e.title_en = meta.title_en; changed = true; }
  if (meta.title_ja   !== undefined && e.title_ja   !== meta.title_ja)   { e.title_ja = meta.title_ja; changed = true; }
  if (meta.title_orig != null       && e.title_orig !== meta.title_orig) { e.title_orig = meta.title_orig; changed = true; }
  if (meta.alttitle       != null && e.alttitle       !== meta.alttitle)       { e.alttitle = meta.alttitle; changed = true; }
  if (meta.released       != null && e.released       !== meta.released)       { e.released = meta.released; changed = true; }
  if (meta.developer      != null && e.developer      !== meta.developer)      { e.developer = meta.developer; changed = true; }
  if (meta.length_minutes != null && e.length_minutes !== meta.length_minutes) { e.length_minutes = meta.length_minutes; changed = true; }
  if (meta.length        != null && e.length        !== meta.length)        { e.length        = meta.length;        changed = true; }
  if (meta.description    != null && !e.description)                           { e.description = meta.description; changed = true; }
  if (meta.nsfw           != null && e.nsfw !== meta.nsfw)                     { e.nsfw = meta.nsfw; changed = true; }
  // Track which detection-rule version computed the flag, so a rule change
  // re-checks every entry exactly once.
  if (meta.nsfwRuleVersion != null && e.nsfwRuleVersion !== meta.nsfwRuleVersion) {
    e.nsfwRuleVersion = meta.nsfwRuleVersion; changed = true;
  }
  // Store the entry's top content tag names so the library can be filtered by tag
  // (kept small — top ~20 by strength — so entries.json doesn't balloon).
  if (Array.isArray(meta.tags) && JSON.stringify(meta.tags) !== JSON.stringify(e.tags || [])) {
    e.tags = meta.tags; changed = true;
  }
  if (changed) writeStore(store);
  return changed;
});

// ── List membership ───────────────────────────────────────────────────────────
ipcMain.handle('entry-add-to-list', (_e, meta, list) => {
  if (list !== 'library' && list !== 'wishlist' && list !== 'wishlistPrivate') throw new Error('bad list');
  const store = readStore();
  const entry = ensureEntry(store, meta);
  entry[list] = true;
  if (list === 'library') entry.excluded = false; // re-adding clears exclusion
  writeStore(store);
  return true;
});

ipcMain.handle('entry-remove-from-list', (_e, id, list) => {
  if (list !== 'library' && list !== 'wishlist' && list !== 'wishlistPrivate') throw new Error('bad list');
  const store = readStore();
  if (store[id]) {
    store[id][list] = false;
    if (list === 'library') { store[id].exe_path = null; store[id].excluded = false; }
    pruneIfOrphan(store, id);
    writeStore(store);
  }
  return true;
});

// Hide a browse/search result so it stops showing up in discovery. Creates a
// lightweight entry flagged hidden (kept out of library/wishlist).
ipcMain.handle('entry-hide', (_e, meta) => {
  const store = readStore();
  const entry = ensureEntry(store, meta);
  entry.hidden = true;
  writeStore(store);
  return true;
});

ipcMain.handle('entry-unhide', (_e, id) => {
  const store = readStore();
  if (store[id]) {
    store[id].hidden = false;
    pruneIfOrphan(store, id); // drop it entirely if it was only ever a hidden stub
    writeStore(store);
  }
  return true;
});

// Exclude an entry from library view (soft hide)
ipcMain.handle('library-exclude', (_e, id) => {
  const store = readStore();
  if (store[id]) { store[id].excluded = true; writeStore(store); }
  return true;
});

// Un-exclude (bring back) an entry
ipcMain.handle('library-unexclude', (_e, id) => {
  const store = readStore();
  if (store[id]) { store[id].excluded = false; writeStore(store); }
  return true;
});

ipcMain.handle('library-add-scanned', (_e, meta, exePath) => {
  const store = readStore();
  const entry = ensureEntry(store, meta);
  entry.library   = true;
  entry.exe_path  = exePath || null;
  entry.excluded  = false;
  if (!entry.status) entry.status = 'unplayed';
  writeStore(store);
  return true;
});

ipcMain.handle('library-update-status', (_e, id, status) => {
  const store = readStore();
  const e = store[id];
  if (e) {
    const prev = e.status;
    e.status = status;
    const now = Date.now();
    // Track when a title was started / finished.
    if ((status === 'reading' || status === 'finished') && !e.started_at) e.started_at = now;
    if (status === 'finished') e.finished_at = now;
    else if (prev === 'finished' && status !== 'finished') e.finished_at = null;
    writeStore(store);
  }
  return true;
});

ipcMain.handle('library-update-exe', (_e, id, exePath) => {
  const store = readStore();
  if (store[id]) { store[id].exe_path = exePath || null; writeStore(store); }
  return true;
});

// ── Playtime: launch with tracking ───────────────────────────────────────────
ipcMain.handle('launch-vn', (_e, exePath, id) => {
  if (!exePath || !fs.existsSync(exePath)) throw new Error('Executable not found');
  // Don't double-launch
  if (id && runningVNs.has(id)) return true;
  // Auto-advance status: unplayed/paused → reading on launch.
  if (id) {
    const store = readStore();
    if (store[id] && (store[id].status === 'unplayed' || store[id].status === 'paused')) {
      store[id].status = 'reading';
      writeStore(store);
    }
    // Mark launch time so the poller can backfill startup time (Steam/engine boot).
    launchTimes.set(id, Date.now());
  }
  // Steam game → launch through the Steam client; the poller tracks playtime.
  const appId = findSteamAppId(exePath);
  if (appId) { try { shell.openExternal('steam://rungameid/' + appId); } catch {} return true; }

  const proc = spawn(exePath, [], { cwd: path.dirname(exePath), detached: true, stdio: 'ignore' });
  if (id) runningVNs.set(id, { proc, startTime: Date.now() });
  // Playtime is handled by the process-detection poller (pollRunningGames), which
  // also catches games launched outside Tsundoku (e.g. via Steam). We only clean
  // up the proc handle here so the Stop button can kill what we launched.
  proc.on('exit', () => { if (id) runningVNs.delete(id); });
  proc.unref();
  return true;
});

ipcMain.handle('is-vn-running', (_e, id) => runningVNs.has(id) || autoTracking.has(id));

ipcMain.handle('stop-vn', (_e, id) => {
  const entry = runningVNs.get(id);
  if (entry) { try { entry.proc.kill(); } catch {} return true; }
  // Auto-detected game (launched outside Tsundoku): kill it by image name.
  const store = readStore();
  const exe = store[id] && store[id].exe_path;
  if (exe) { try { execFile('taskkill', ['/IM', path.basename(exe), '/F'], { windowsHide: true }, () => {}); } catch {} return true; }
  return false;
});

// Auto-start (launch hidden at Windows login) toggle.
ipcMain.handle('set-auto-start', (_e, enabled) => {
  const s = readSettings();
  s.startWithWindows = !!enabled;
  writeSettings(s);
  applyAutoStart(!!enabled);
  return true;
});

// ── Settings IPC ──────────────────────────────────────────────────────────────
ipcMain.handle('get-settings', () => readSettings());

ipcMain.handle('write-setting', (_e, key, value) => {
  const s = readSettings();
  s[key] = value;
  writeSettings(s);
  return true;
});

function getScanDirs(s) {
  const dirs = Array.isArray(s.scanDirs) ? s.scanDirs.slice() : [];
  if (!dirs.length && s.scanDir) dirs.push(s.scanDir);
  return dirs;
}

ipcMain.handle('add-scan-dir', async () => {
  const r = await dialog.showOpenDialog({
    title: 'Select a folder that contains your VN folders',
    properties: ['openDirectory'],
  });
  if (r.canceled) return null;
  const s = readSettings();
  const dirs = getScanDirs(s);
  const dir = r.filePaths[0];
  if (!dirs.includes(dir)) dirs.push(dir);
  s.scanDirs = dirs;
  writeSettings(s);
  return dirs;
});

ipcMain.handle('remove-scan-dir', (_e, dir) => {
  const s = readSettings();
  s.scanDirs = getScanDirs(s).filter(d => d !== dir);
  writeSettings(s);
  return s.scanDirs;
});

// ── File / folder pickers ─────────────────────────────────────────────────────
ipcMain.handle('pick-exe', async () => {
  const r = await dialog.showOpenDialog({
    title: 'Select VN Executable',
    filters: [{ name: 'Executable', extensions: ['exe'] }],
    properties: ['openFile'],
  });
  return r.canceled ? null : r.filePaths[0];
});

// ── Backup: export / import library ───────────────────────────────────────────
// Export writes a portable snapshot of every entry. Import merges a snapshot into
// the local store but NEVER touches the local exe_path — install paths are always
// per-PC. Library membership, status, playtime, last_played, ratings and metadata
// DO travel between machines (a title not installed here just shows "not on device").
ipcMain.handle('export-data', async () => {
  const ts = new Date().toISOString().slice(0, 10);
  const r = await dialog.showSaveDialog({
    title: 'Export Tsundoku library',
    defaultPath: `tsundoku-backup-${ts}.json`,
    filters: [{ name: 'Tsundoku backup', extensions: ['json'] }],
  });
  if (r.canceled || !r.filePath) return { ok: false };
  const entries = Object.values(readStore());
  const exportSettings = { ...readSettings() };
  delete exportSettings.vndbToken; // never write the private API token into a backup file
  const payload = {
    type: 'tsundoku-backup', version: 2,
    exportedAt: Date.now(), appVersion: app.getVersion(),
    count: entries.length, entries,
    settings: exportSettings, // appearance + preferences (theme/palette/auto times live here too)
  };
  try {
    fs.writeFileSync(r.filePath, JSON.stringify(payload, null, 2), 'utf8');
    return { ok: true, count: entries.length, path: r.filePath };
  } catch (err) {
    return { ok: false, error: err.message };
  }
});

ipcMain.handle('import-data', async () => {
  const r = await dialog.showOpenDialog({
    title: 'Import Tsundoku library',
    filters: [{ name: 'Tsundoku backup', extensions: ['json'] }],
    properties: ['openFile'],
  });
  if (r.canceled || !r.filePaths[0]) return { ok: false };
  let data;
  try { data = JSON.parse(fs.readFileSync(r.filePaths[0], 'utf8')); }
  catch (err) { return { ok: false, error: 'Could not read file: ' + err.message }; }

  const incoming = Array.isArray(data) ? data
    : (data && Array.isArray(data.entries) ? data.entries
    : (data && typeof data === 'object' ? Object.values(data).filter(v => v && v.id) : null));
  if (!incoming || !incoming.length) return { ok: false, error: 'Not a valid Tsundoku backup file.' };

  const store = readStore();
  let added = 0, updated = 0;
  for (const imp of incoming) {
    if (!imp || !imp.id) continue;
    const local = store[imp.id];
    if (!local) {
      // New on this PC: take everything EXCEPT the install path.
      store[imp.id] = { ...imp, exe_path: null, added_at: imp.added_at || Date.now() };
      added++;
    } else {
      // Merge: keep LOCAL exe_path, never lose playtime, keep the latest play.
      local.library  = local.library  || !!imp.library;
      local.wishlist = local.wishlist || !!imp.wishlist;
      local.wishlistPrivate = local.wishlistPrivate || !!imp.wishlistPrivate;
      if (imp.status && (!local.status || local.status === 'unplayed')) local.status = imp.status;
      local.playtime_seconds = Math.max(local.playtime_seconds || 0, imp.playtime_seconds || 0);
      const plays = [local.last_played, imp.last_played].filter(v => v != null);
      local.last_played = plays.length ? plays.reduce((a, b) => (a > b ? a : b)) : null;
      // Keep the earliest start and an existing finish (else take the incoming one).
      const starts = [local.started_at, imp.started_at].filter(v => v != null);
      if (starts.length) local.started_at = Math.min(...starts);
      if (local.finished_at == null && imp.finished_at != null) local.finished_at = imp.finished_at;
      if (imp.hidden) local.hidden = true;
      if (imp.rating != null && local.rating == null) local.rating = imp.rating;
      // Backfill any metadata missing locally.
      for (const k of ['title', 'alttitle', 'image', 'description', 'released', 'developer', 'length_minutes', 'nsfw']) {
        if ((local[k] == null || local[k] === '') && imp[k] != null) local[k] = imp[k];
      }
      updated++;
    }
  }
  writeStore(store);

  // Restore appearance + preferences from the backup. Whitelisted prefs are taken from
  // the backup; cumulative data (sessions, achievements, blocked tags, collections) is
  // MERGED so it survives a restore. Machine-specific keys (scan folders, autostart,
  // API token) stay local.
  let settingsApplied = false;
  if (data && data.settings && typeof data.settings === 'object') {
    const PREF_KEYS = ['themeMode', 'palette', 'autoLight', 'autoDark', 'cardSize', 'zoom',
      'titleLang', 'nsfwHideLibrary', 'nsfwBlurLibrary', 'nsfwBlurBrowse', 'browseNsfwFilter',
      'showExcluded', 'minimizeOnClose', 'importPriority', 'vndbUsername'];
    const local = readSettings();
    for (const k of PREF_KEYS) {
      if (data.settings[k] !== undefined) { local[k] = data.settings[k]; settingsApplied = true; }
    }
    // Cumulative stats are MERGED (not overwritten) so reading sessions and
    // achievements — and the dates they were earned — survive a backup/restore and
    // combine across PCs rather than being lost.
    const imp = data.settings;
    if (Array.isArray(imp.sessions) && imp.sessions.length) {
      const merged = Array.isArray(local.sessions) ? local.sessions.slice() : [];
      const seen = new Set(merged.map(s => `${s.vnId}|${s.endedAt}`));
      for (const s of imp.sessions) {
        const key = `${s.vnId}|${s.endedAt}`;
        if (!seen.has(key)) { merged.push(s); seen.add(key); }
      }
      merged.sort((a, b) => (a.endedAt || 0) - (b.endedAt || 0));
      local.sessions = merged;
      settingsApplied = true;
    }
    if (imp.achievements && typeof imp.achievements === 'object') {
      const merged = { ...(local.achievements || {}) };
      for (const [id, v] of Object.entries(imp.achievements)) {
        if (!merged[id]) merged[id] = v;                       // earned only in the backup
        else if (v?.unlockedAt && merged[id]?.unlockedAt)      // earned on both → keep the earliest date
          merged[id] = { ...merged[id], unlockedAt: Math.min(merged[id].unlockedAt, v.unlockedAt) };
      }
      local.achievements = merged;
      settingsApplied = true;
    }
    // Blocked tags + collections: merge by id (union) so they survive a restore and
    // combine across PCs instead of being dropped.
    if (Array.isArray(imp.hiddenTags) && imp.hiddenTags.length) {
      const merged = Array.isArray(local.hiddenTags) ? local.hiddenTags.slice() : [];
      const seen = new Set(merged.map(t => t && t.id));
      for (const t of imp.hiddenTags) if (t && t.id && !seen.has(t.id)) { merged.push(t); seen.add(t.id); }
      local.hiddenTags = merged;
      settingsApplied = true;
    }
    if (Array.isArray(imp.collections) && imp.collections.length) {
      const merged = Array.isArray(local.collections) ? local.collections.slice() : [];
      const byId = new Map(merged.map(c => [c.id, c]));
      for (const c of imp.collections) {
        if (!c || !c.id) continue;
        const ex = byId.get(c.id);
        if (!ex) { merged.push(c); byId.set(c.id, c); }
        else ex.vnIds = [...new Set([...(ex.vnIds || []), ...(c.vnIds || [])])]; // union members
      }
      local.collections = merged;
      settingsApplied = true;
    }
    if (settingsApplied) writeSettings(local);
  }
  return { ok: true, added, updated, settingsApplied };
});

// ── VNDB list import ──────────────────────────────────────────────────────────
// Fetch a VNDB user's public list and return the raw ulist items (with each VN's
// metadata inline). Resolution of username→id and pagination happen here; the
// renderer maps items to entries (so NSFW/title/dev logic stays in one place) and
// commits them via 'library-import-batch'. Re-runnable: it just refetches.
const ULIST_VN_FIELDS = [
  'vn.title', 'vn.alttitle', 'vn.titles.lang', 'vn.titles.title', 'vn.titles.official',
  'vn.image.url', 'vn.image.sexual', 'vn.description', 'vn.rating', 'vn.released',
  'vn.developers.name', 'vn.length_minutes', 'vn.tags.name', 'vn.tags.category', 'vn.tags.rating',
].join(', ');

ipcMain.handle('vndb-import-fetch', async (_e, opts = {}) => {
  const token   = String(opts.token || '').trim();
  const rawUser = String(opts.user || '').trim();
  // With a token we read the token owner's OWN list (including private labels); the
  // header is sent on every ulist call. Without one we read a public list by username.
  const authHeaders = token ? { Authorization: `token ${token}` } : {};
  let userId, username;
  if (token) {
    try {
      const ar = await fetch('https://api.vndb.org/kana/authinfo', { headers: authHeaders });
      if (ar.status === 401) return { ok: false, error: 'VNDB rejected that token (it needs “List read” permission).' };
      if (!ar.ok) return { ok: false, error: `VNDB auth failed (${ar.status}).` };
      const aj = await ar.json();
      userId = aj.id; username = aj.username;
    } catch (err) {
      return { ok: false, error: 'Could not reach VNDB: ' + err.message };
    }
  } else {
    if (!rawUser) return { ok: false, error: 'Enter a VNDB username, or paste a token for a private list.' };
    // Resolve username (or "u123") → canonical user id via the GET /user endpoint.
    try {
      const ur = await fetch(`https://api.vndb.org/kana/user?q=${encodeURIComponent(rawUser)}`);
      if (!ur.ok) return { ok: false, error: `VNDB user lookup failed (${ur.status}).` };
      const uj = await ur.json();
      const hit = uj && uj[rawUser];
      if (!hit) return { ok: false, error: `No VNDB user “${rawUser}”.` };
      userId = hit.id; username = hit.username;
    } catch (err) {
      return { ok: false, error: 'Could not reach VNDB: ' + err.message };
    }
  }
  // Page through the list (100/page, cap at 5000 to stay sane).
  const items = [];
  try {
    for (let page = 1; page <= 50; page++) {
      const j = await vndbFetch('ulist', {
        user: userId,
        fields: `id, started, finished, labels.id, labels.label, ${ULIST_VN_FIELDS}`,
        sort: 'added', reverse: true, results: 100, page,
      }, { priority: PRI.HIGH, headers: authHeaders });
      if (Array.isArray(j.results)) items.push(...j.results);
      if (!j.more) break;
    }
  } catch (err) {
    return { ok: false, error: 'VNDB list fetch failed: ' + err.message };
  }
  return { ok: true, userId, username, items };
});

// Commit a batch of mapped import entries in a single store write. Each item:
// { meta, list: 'library'|'wishlist', status?, started_at?, finished_at? }.
// Conflict resolution follows the "When importing, prioritize" setting:
//   vndb     → the VNDB value wins for status + dates whenever it has one
//   tsundoku → the existing local value is kept; VNDB only fills blanks
// Either way, playtime / last-played / exe path are always left untouched, and a
// blank VNDB value never erases a local one.
ipcMain.handle('library-import-batch', (_e, batch) => {
  if (!Array.isArray(batch)) return { added: 0, updated: 0 };
  const store = readStore();
  const vndbWins = (readSettings().importPriority || 'vndb') !== 'tsundoku';
  let added = 0, updated = 0;
  const counts = { reading: 0, finished: 0, paused: 0, dropped: 0, unplayed: 0, wishlist: 0 };
  for (const it of batch) {
    if (!it || !it.meta || !it.meta.id) continue;
    if (hasBlockedTag(it.meta)) continue;
    const existed = !!store[it.meta.id];
    const e = ensureEntry(store, it.meta);
    if (it.list === 'blacklist') {
      // VNDB Blacklist → Tsundoku hidden. Don't add it to library/wishlist.
      e.hidden = true;
      counts.blacklist = (counts.blacklist || 0) + 1;
      if (existed) updated++; else added++;
      continue;
    }
    e.hidden = false; // an explicit library/wishlist import un-hides a hidden title
    if (it.list === 'wishlist') {
      // Respect a deliberate private placement: if it's already in the private
      // wishlist, leave it there rather than also surfacing it on the public one.
      if (!e.wishlistPrivate) e.wishlist = true;
      counts.wishlist++;
    } else {
      e.library = true;
      e.excluded = false;
      // Owning/reading a title supersedes wishing for it — drop it from both wishlists.
      e.wishlist = false;
      e.wishlistPrivate = false;
      if (it.status && (vndbWins || !e.status || e.status === 'unplayed')) e.status = it.status;
      counts[e.status] = (counts[e.status] || 0) + 1;
    }
    // Dates from VNDB ("YYYY-MM-DD") → ms.
    const sd = it.started_at ? Date.parse(it.started_at) : null;
    const fd = it.finished_at ? Date.parse(it.finished_at) : null;
    if (Number.isFinite(sd) && (vndbWins || !e.started_at))  e.started_at  = sd;
    if (Number.isFinite(fd) && (vndbWins || !e.finished_at)) e.finished_at = fd;
    if (existed) updated++; else added++;
  }
  writeStore(store);
  return { added, updated, counts };
});

// ── Folder scanner ────────────────────────────────────────────────────────────
// Non-game helper exes to skip. First group matches names that appear "glued"
// (e.g. UnityCrashHandler64.exe — which is often LARGER than the actual game, so
// the size heuristic used to wrongly pick it); second group is installer/util
// names that sit at a word boundary.
const EXE_JUNK = /(unitycrashhandler|crashhandler|crashpad|werfault|epicwebhelper|prereqsetup|nvngx)|(^|[\s_-])(unins\d*|uninstall|setup|install|vc_?redist|vcredist|dx_?websetup|dx_?setup|directx|oalinst|crashreport|notification_helper|sendrpt|dotnet(fx)?|dxsetup|config\.|settings?\.)/i;

function findExes(dir, depth, acc) {
  if (depth < 0) return;
  let items;
  try { items = fs.readdirSync(dir, { withFileTypes: true }); } catch { return; }
  for (const it of items) {
    const full = path.join(dir, it.name);
    if (it.isDirectory()) findExes(full, depth - 1, acc);
    else if (it.isFile() && it.name.toLowerCase().endsWith('.exe')) acc.push(full);
  }
}

function pickMainExe(folder) {
  const exes = [];
  findExes(folder, 3, exes);
  const candidates = exes.filter(p => !EXE_JUNK.test(path.basename(p)));
  const pool = candidates.length ? candidates : exes;
  if (pool.length === 0) return null;
  return pool
    .map(p => { let size = 0; try { size = fs.statSync(p).size; } catch {} return { p, size }; })
    .sort((a, b) => b.size - a.size)[0].p;
}

function cleanName(folder) {
  return folder
    .replace(/\[[^\]]*\]/g, ' ').replace(/\([^)]*\)/g, ' ')
    .replace(/[._]+/g, ' ').replace(/\bv?\d+(\.\d+)+\b/gi, ' ')
    .replace(/\b(eng(lish)?|jpn|jp|patch|crack|repack|full|hd|remaster(ed)?|edition|uncensored|18\+?)\b/gi, ' ')
    .replace(/\s+/g, ' ').trim();
}

async function scanDirectory(root) {
  let subdirs;
  try {
    subdirs = fs.readdirSync(root, { withFileTypes: true })
      .filter(d => d.isDirectory()).map(d => d.name);
  } catch (e) { throw new Error('Could not read folder: ' + e.message); }

  const targets = subdirs.length
    ? subdirs.map(name => ({ name, folderPath: path.join(root, name) }))
    : [{ name: path.basename(root), folderPath: root }];

  const matches = [], noExe = [];
  for (const { name, folderPath } of targets) {
    const exe = pickMainExe(folderPath);
    if (!exe) { noExe.push(name); continue; }
    const query = cleanName(name) || name;
    let candidates = [];
    try {
      const data = await vndbVN({
        filters: ['search', '=', query],
        fields: LIST_FIELDS,
        results: 5,
      });
      candidates = data.results || [];
    } catch {}
    matches.push({ folderName: name, exePath: exe, query, candidates });
  }
  return { root, matches, noExe };
}

ipcMain.handle('scan-folder', async () => {
  const s = readSettings();
  let dirs = getScanDirs(s).filter(d => d && fs.existsSync(d));
  if (!dirs.length) {
    const r = await dialog.showOpenDialog({
      title: 'Select a folder that contains your VN folders',
      properties: ['openDirectory'],
    });
    if (r.canceled) return null;
    dirs = [r.filePaths[0]];
    s.scanDirs = dirs;
    writeSettings(s);
  }
  // Scan every configured directory and aggregate the results.
  const matches = [], noExe = [];
  for (const root of dirs) {
    try {
      const res = await scanDirectory(root);
      matches.push(...res.matches);
      noExe.push(...res.noExe);
    } catch { /* skip unreadable dir */ }
  }
  return { root: dirs.join('  ·  '), matches, noExe };
});

// Non-interactive scan of the SAVED folders only (for the startup "new games"
// check). Returns null when no scan folders are configured — never pops a dialog.
ipcMain.handle('scan-folder-silent', async () => {
  const s = readSettings();
  const dirs = getScanDirs(s).filter(d => d && fs.existsSync(d));
  if (!dirs.length) return null;
  const matches = [], noExe = [];
  for (const root of dirs) {
    try {
      const res = await scanDirectory(root);
      matches.push(...res.matches);
      noExe.push(...res.noExe);
    } catch { /* skip unreadable dir */ }
  }
  return { root: dirs.join('  ·  '), matches, noExe };
});
