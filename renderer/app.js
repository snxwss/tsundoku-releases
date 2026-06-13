// ── Icons ─────────────────────────────────────────────────────────────────────
const ICONS = {
  home:     'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10',
  library:  'M4 5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1zM12 5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1z',
  browse:   'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM15.5 8.5l-2 5-5 2 2-5z',
  wishlist: 'M12 20s-7-4.4-9.3-8.2C1 8.6 2.5 5 6 5c2 0 3.2 1.3 4 2.5C10.8 6.3 12 5 14 5c3.5 0 5 3.6 3.3 6.8C19 15.6 12 20 12 20z',
  settings: 'M3 5h18M3 12h18M3 19h18M7 3v4M16 10v4M11 17v4',
  play:     'M7 4.5v15l13-7.5z',
  search:   'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM21 21l-4.3-4.3',
  plus:     'M12 5v14M5 12h14',
  check:    'M5 12.5l4.5 4.5L19 7',
  heart:    'M12 20s-7-4.4-9.3-8.2C1 8.6 2.5 5 6 5c2 0 3.2 1.3 4 2.5C10.8 6.3 12 5 14 5c3.5 0 5 3.6 3.3 6.8C19 15.6 12 20 12 20z',
  clock:    'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 7v5l3.5 2',
  sun:      'M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zM12 2v2M12 20v2M4 12H2M22 12h-2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19',
  moon:     'M20 14.5A8 8 0 0 1 9.5 4 7.5 7.5 0 1 0 20 14.5z',
  folder:   'M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z',
  trash:    'M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6',
  x:        'M18 6L6 18M6 6l12 12',
  scan:     'M3 3h5v5H3zM16 3h5v5h-5zM3 16h5v5H3zM7 7h1v1H7zM16 7h1v1h-1zM11 3h2M11 21h2M3 11v2M21 11v2M11 11h2v2h-2z',
  exclude:  'M17 7L7 17M7 7l10 10',
  grid:     'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',
  list:     'M4 6h16M4 12h16M4 18h16',
};

function icon(name, size = 20, filled = false) {
  const d = ICONS[name] || '';
  if (filled) {
    return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="currentColor" style="flex-shrink:0"><path d="${d}"/></svg>`;
  }
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0"><path d="${d}"/></svg>`;
}

// ── Constants ─────────────────────────────────────────────────────────────────
// Status dot colors (single source of truth; the Library sidebar dots in
// index.html mirror these exact values). Finished = purple, Dropped = crimson —
// kept clearly distinct from each other and from the blue Pile / green Reading.
const STATUS_DOT = {
  unplayed: 'oklch(0.6 0.1 238)',
  reading:  'oklch(0.6 0.1 165)',
  paused:   'oklch(0.80 0.15 92)',
  finished: 'oklch(0.58 0.17 305)',
  dropped:  'oklch(0.55 0.19 18)',
};
const STATUS_LIST = ['unplayed', 'reading', 'paused', 'finished', 'dropped'];
const PALETTE_MAP = { banana: 'pal-banana', mint: 'pal-mint', rose: 'pal-rose', cherry: 'pal-cherry', sky: 'pal-sky', lavender: 'pal-lavender', sand: 'pal-sand', stone: 'pal-stone' };
const PALETTES = [
  { k: 'banana',   color: 'oklch(0.905 0.105 97)' },
  { k: 'mint',     color: 'oklch(0.800 0.130 152)' },
  { k: 'rose',     color: 'oklch(0.900 0.110 5)' },
  { k: 'cherry',   color: 'oklch(0.760 0.175 25)' },
  { k: 'sky',      color: 'oklch(0.870 0.130 218)' },
  { k: 'lavender', color: 'oklch(0.875 0.095 290)' },
  { k: 'sand',     color: 'oklch(0.895 0.135 62)' },
  { k: 'stone',    color: 'oklch(0.700 0 0)' },
];
const ZOOM_LEVELS = [75, 90, 100, 110, 125];

// ── Achievement definitions ────────────────────────────────────────────────────
// Hard rule: only count progress backed by real logged playtime_seconds or genuine
// completions. A "finish" only counts with at least FINISH_MIN_SECONDS of logged
// playtime — this blocks marking a barely-launched VN as finished to cheat unlocks.
// binary:true = no progress bar.
const FINISH_MIN_SECONDS = 3600; // 1 hour
const ACHIEVEMENTS = [
  { id: 'first_session', glyph: '▶', label: 'First Session',   desc: 'Log your first reading session',               binary: true, check: s => s.totalSeconds > 0 },
  { id: 'ten_hours',     glyph: '◷', label: '10 Hours',         desc: 'Log 10 total hours of reading time',                         check: s => s.totalSeconds >= 36000,    prog: s => [s.totalSeconds, 36000],    fmt: s => `${(s.totalSeconds/3600).toFixed(1)}h / 10h` },
  { id: 'fifty_hours',   glyph: '◎', label: '50 Hours',         desc: 'Log 50 total hours of reading time',                         check: s => s.totalSeconds >= 180000,   prog: s => [s.totalSeconds, 180000],   fmt: s => `${(s.totalSeconds/3600).toFixed(1)}h / 50h` },
  { id: 'hundred_hours', glyph: '◉', label: '100 Hours',        desc: 'Log 100 total hours of reading time',                        check: s => s.totalSeconds >= 360000,   prog: s => [s.totalSeconds, 360000],   fmt: s => `${(s.totalSeconds/3600).toFixed(1)}h / 100h` },
  { id: 'first_finish',  glyph: '✓', label: 'First Finish',     desc: 'Complete a VN with 1h+ logged',                binary: true, check: s => s.finishedWithTime >= 1 },
  { id: 'five_finishes', glyph: '★', label: 'Five Completions', desc: 'Complete 5 VNs, each with 1h+ logged',                       check: s => s.finishedWithTime >= 5,    prog: s => [s.finishedWithTime, 5],    fmt: s => `${s.finishedWithTime} / 5` },
  { id: 'ten_finishes',  glyph: '◆', label: 'Ten Completions',  desc: 'Complete 10 VNs, each with 1h+ logged',                      check: s => s.finishedWithTime >= 10,   prog: s => [s.finishedWithTime, 10],   fmt: s => `${s.finishedWithTime} / 10` },
  { id: 'long_haul',     glyph: '▲', label: 'The Long Haul',    desc: 'Complete a 50h+ VN you have played',           binary: true, check: s => s.longFinished >= 1 },
  { id: 'the_pile',      glyph: '積', label: 'Pile of Shame',   desc: 'Have 25+ unplayed VNs in your library',                      check: s => s.unplayedCount >= 25,      prog: s => [s.unplayedCount, 25],      fmt: s => `${s.unplayedCount} / 25` },
  { id: 'collector',     glyph: '◈', label: 'Collector',        desc: 'Add 10 or more VNs to your library',                         check: s => s.libraryCount >= 10,       prog: s => [s.libraryCount, 10],       fmt: s => `${s.libraryCount} / 10` },
];

// ── State ─────────────────────────────────────────────────────────────────────
let entries = [];
let settings = {};
let activeView = 'home';
let themeMode = localStorage.getItem('tsund-theme-mode') || localStorage.getItem('tsund-theme') || 'light'; // 'light' | 'dark' | 'auto'
let autoLight = localStorage.getItem('tsund-auto-light') || '07:00';  // light mode starts
let autoDark  = localStorage.getItem('tsund-auto-dark')  || '19:00';  // dark mode starts
let theme   = 'light';  // effective applied theme (computed from themeMode)
let palette = localStorage.getItem('tsund-palette') || 'yellow';
let libFilter  = 'all';
let libSort    = 'added';
let libSelId   = null;
let modalToken = 0;
let scanState  = [];
let browseSort = 'rating';
let browseLoaded = false;
let settingsSection = 'Appearance';
let runningVNIds = new Set(); // ids of currently running VN processes
let updateStatusState = null; // latest auto-update state from main process
let libSearch      = '';
let libCollFilter  = null;   // null = no collection filter; string id when active
let wishSearch     = '';
let wishView       = 'public'; // 'public' = wishlist, 'private' = wishlistPrivate
let wishlistAlerts = [];     // [{ vnId, vnTitle, releases: [] }]

// Browse pagination state
let browsePage     = 1;
let browseMore     = true;  // whether more pages exist
let browseLoading  = false;
let browseVns      = [];    // current result set
let browseRatedPool = [];   // full weighted-sorted pool for "Top Rated"
let browseIsSearch = false;
let browseNsfwOn   = false; // local filter toggle (from settings)
let browseYearFrom = null;
let browseYearTo   = null;
let browseRatingMin = null; // 10–100 scale (e.g. 70 = "7+")
let browseLength    = null; // 1–5 (VNDB length category)
let browseDevId     = null; // resolved VNDB producer id (e.g. "p57")
let browseTagIds    = []; // resolved VNDB tags to filter by (AND): [{ id, name }]

// Bundle the active browse/search filters for an API call.
function currentFilterOpts() {
  return {
    yearFrom: browseYearFrom, yearTo: browseYearTo,
    ratingMin: browseRatingMin, length: browseLength,
    devId: browseDevId || null, tagIds: browseTagIds.map(t => t.id),
  };
}

// Re-run whichever view is active (search or browse) after a filter changes.
// This is the fix for filters (esp. year) silently doing nothing during search.
// Debounced so rapidly toggling several filters fires ONE request burst instead
// of hammering VNDB (which rate-limits and would surface as errors).
let reapplyTimer = null;
function reapplyBrowse() {
  updateFilterCount();
  clearTimeout(reapplyTimer);
  reapplyTimer = setTimeout(() => {
    if (browseIsSearch && document.getElementById('browse-search').value.trim()) {
      runBrowseSearch();
    } else {
      browseIsSearch = false;
      resetBrowse();
      loadBrowse();
    }
  }, 280);
}

// Show how many filters are active on the collapsed "Filters" button.
function updateFilterCount() {
  const el = document.getElementById('filters-count');
  if (!el) return;
  let n = 0;
  if (browseYearFrom || browseYearTo) n++;
  if (browseRatingMin) n++;
  if (browseLength)     n++;
  if (browseDevId)      n++;
  if (browseTagIds.length) n++;
  el.textContent = n ? ` · ${n}` : '';
}

// Render the active tag-filter chips (each removable). Tags AND together.
function renderBrowseTags() {
  const box = document.getElementById('filter-tags');
  if (!box) return;
  box.innerHTML = browseTagIds.map(t =>
    `<span class="tag-chip" data-id="${escHtml(t.id)}">${escHtml(t.name)}<span class="tag-chip-x" title="Remove">✕</span></span>`
  ).join('');
  box.querySelectorAll('.tag-chip-x').forEach(x =>
    x.addEventListener('click', () => {
      browseTagIds = browseTagIds.filter(t => t.id !== x.parentElement.dataset.id);
      renderBrowseTags();
      reapplyBrowse();
    }));
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const imgUrl = img => (img && img.url) || (typeof img === 'string' ? img : null);
const entryById   = id => entries.find(e => e.id === id);
const capitalize  = s  => s ? s.charAt(0).toUpperCase() + s.slice(1) : '';
const stripBBCode = s  => String(s || '').replace(/\[\/?[a-z]+(=[^\]]+)?\]/gi, '').trim();
const byNewest    = (a, b) => (b.added_at || 0) - (a.added_at || 0);
// Bump when the 18+ detection rule below changes, OR when any other persisted
// metadata derivation changes — it gates the lazy backfill, so raising it forces a
// one-time re-fetch + re-derive of every stored entry. (4: developer is now the full
// "A & B & C" list. 5: capture per-language titles for the title-language setting.)
const NSFW_RULE_VERSION = 5;

// Ero-category tags that describe *themes/dialogue* or non-depicted content
// rather than depicted sexual acts. These appear on plenty of all-ages titles
// (e.g. Danganronpa V3 has "Dirty Talk" + "Sexual Harassment") so they must NOT
// count toward the adult threshold.
const NSFW_THEME_TAGS = new Set([
  'dirty talk', 'sexual harassment', 'off screen sex only', 'sexual content',
  'ecchi', 'sexually suggestive', 'no sexual content',
]);

// 18+ detection. Cover rating alone is unreliable (most adult titles have tame
// covers, rating 0). The reliable signal is *depicted* sexual content: we count
// ero-category tags rated ≥ 2.0 (VNDB's own tag-visibility threshold), excluding
// "text-only" variants and the thematic tags above, and flag titles with at
// least TWO. An explicit cover (≥2.0) also counts. Falls back to the stored
// nsfw flag for entries fetched without tags.
const isNsfw = vn => {
  if (vn.nsfw) return true;
  if (vn.image && typeof vn.image === 'object' && Number(vn.image.sexual) >= 2) return true;
  const explicit = (vn.tags || []).filter(t =>
    t && t.category === 'ero' &&
    !/text-only/i.test(t.name || '') &&
    !NSFW_THEME_TAGS.has((t.name || '').toLowerCase()) &&
    Number(t.rating) >= 2.0);
  return explicit.length >= 2;
};

function escHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function ratingStr(r) { return r ? (Number(r) / 10).toFixed(1) : null; }

// VNDB returns multiple developers; join them like the VNDB page does
// ("Spike Chunsoft & Spike & …") instead of dropping all but the first (which the
// API may return in a different order, e.g. "Spike" before "Spike Chunsoft").
function devName(vn) {
  const devs = vn && vn.developers;
  if (Array.isArray(devs) && devs.length) {
    const names = [...new Set(devs.map(d => d && d.name).filter(Boolean))];
    if (names.length) return names.join(' & ');
  }
  return (vn && vn.developer) || null;
}

// Pick a VNDB title for a language from the titles[] array (prefers the official one).
function pickVndbTitle(vn, lang) {
  const arr = Array.isArray(vn && vn.titles) ? vn.titles : [];
  const matches = arr.filter(t => t && t.lang === lang && t.title);
  if (!matches.length) return null;
  return (matches.find(t => t.official) || matches[0]).title;
}

// The title to DISPLAY, honoring the title-language setting. Default 'en' = English
// when available. 'ja' = ROMAJI (the romanized main title, e.g. "Super Dangan Ronpa
// 2 …"), NOT the kanji. Works on raw VNDB objects (titles[] + main title) and stored
// entries (title_en/title_orig); falls back to the main title when unavailable.
function displayTitle(o) {
  if (!o) return '';
  const lang = settings.titleLang || 'en';
  if (lang === 'kanji') { // original Japanese script
    return (Array.isArray(o.titles) ? pickVndbTitle(o, 'ja') : o.title_ja) || o.title_orig || o.title || '';
  }
  if (lang === 'romaji') { // romanized main title
    return (Array.isArray(o.titles) ? o.title : o.title_orig) || o.title || '';
  }
  // english (default)
  if (Array.isArray(o.titles)) return pickVndbTitle(o, 'en') || o.title || '';
  return o.title_en || o.title_orig || o.title || '';
}

// Rewrite each stored entry's in-memory .title to the chosen language, so every
// render site that uses e.title reflects the setting with no per-site changes.
function applyTitleLang() {
  const lang = settings.titleLang || 'en';
  for (const e of entries) {
    if (lang === 'kanji')      { if (e.title_ja   || e.title_orig) e.title = e.title_ja || e.title_orig || e.title; }
    else if (lang === 'romaji') { if (e.title_orig) e.title = e.title_orig; }
    else if (e.title_en || e.title_orig) e.title = e.title_en || e.title_orig || e.title;
  }
}

function metaOf(vn) {
  return {
    id:             vn.id,
    title:          vn.title,
    title_en:       pickVndbTitle(vn, 'en') ?? vn.title_en ?? null,
    title_ja:       pickVndbTitle(vn, 'ja') ?? vn.title_ja ?? null,
    title_orig:     vn.title_orig ?? vn.title ?? null,
    alttitle:       vn.alttitle || null,
    image:          imgUrl(vn.image),
    description:    vn.description ? stripBBCode(vn.description) : null,
    rating:         vn.rating != null ? vn.rating : null,
    nsfw:           isNsfw(vn),
    released:       vn.released || null,
    developer:      devName(vn),
    length_minutes: vn.length_minutes || null,
  };
}

// ── Home hero priority ────────────────────────────────────────────────────────
function getBestHeroEntry(lib) {
  // 1. installed + has been played → most recently played first
  const ip = lib.filter(e => e.exe_path && e.last_played).sort((a, b) => b.last_played - a.last_played);
  if (ip.length) return ip[0];
  // 2. installed + no playtime yet
  const inst = lib.filter(e => e.exe_path).sort(byNewest);
  if (inst.length) return inst[0];
  // 3. not installed + has been played
  const np = lib.filter(e => !e.exe_path && e.last_played).sort((a, b) => b.last_played - a.last_played);
  if (np.length) return np[0];
  // 4. any
  return lib.length ? lib[0] : null;
}

function formatPlaytime(seconds) {
  if (!seconds || seconds < 1) return null;
  if (seconds < 60) return `${seconds}s`;
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

// Compact VN length for cards: prefer estimated hours, fall back to VNDB's
// length category (1–5). Returns null when neither is known.
function formatLength(o) {
  const m = o.length_minutes;
  if (m && m > 0) { const h = Math.round(m / 60); return h >= 1 ? `${h}h` : `${m}m`; }
  const cats = { 1: 'V.short', 2: 'Short', 3: 'Medium', 4: 'Long', 5: 'V.long' };
  return cats[o.length] || null;
}

function formatLastPlayed(ts) {
  if (!ts) return null;
  const diff = Math.floor((Date.now() - ts) / 1000);
  if (diff < 60)        return 'just now';
  if (diff < 3600)      return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400)     return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 86400 * 7) return `${Math.floor(diff / 86400)}d ago`;
  return new Date(ts).toLocaleDateString();
}

// Absolute calendar date (e.g. "Jun 11, 2026") for started/finished timestamps.
function formatDate(ts) {
  if (!ts) return null;
  return new Date(ts).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

// blur: whether to blur this cover if it's nsfw (caller decides per context —
// library vs browse have independent blur settings).
function makePoster(url, rounded = 12, nsfw = false, blur = false) {
  return `<div class="pv2${nsfw && blur ? ' nsfw-blur' : ''}" style="border-radius:${rounded}px">
    ${url
      ? `<img src="${escHtml(url)}" loading="lazy" />`
      : `<div class="pv2-no-img">No Image</div>`}
  </div>`;
}

function statusPill(status) {
  const dot = STATUS_DOT[status] || STATUS_DOT.unplayed;
  return `<span class="spill">
    <span class="sdot" style="background:${dot}"></span>
    ${escHtml(capitalize(status))}
  </span>`;
}

// ── Theme / Palette ───────────────────────────────────────────────────────────
// Resolve the effective light/dark theme from the chosen mode (handles 'auto').
function effectiveTheme() {
  if (themeMode !== 'auto') return themeMode;
  const toMin = t => { const [h, m] = String(t || '0:0').split(':').map(Number); return (h || 0) * 60 + (m || 0); };
  const d = new Date();
  const now = d.getHours() * 60 + d.getMinutes();
  const l = toMin(autoLight), dk = toMin(autoDark);
  // Light during [autoLight, autoDark); handles schedules that wrap past midnight.
  const isLight = l < dk ? (now >= l && now < dk) : (now >= l || now < dk);
  return isLight ? 'light' : 'dark';
}

function applyTheme() {
  theme = effectiveTheme();
  const app = document.getElementById('app');
  app.className = 'app2';
  if (theme === 'dark') app.classList.add('t-dark');
  if (PALETTE_MAP[palette]) app.classList.add(PALETTE_MAP[palette]);
  const toggle = document.getElementById('theme-toggle');
  if (toggle) toggle.innerHTML = icon(theme === 'dark' ? 'sun' : 'moon', 17);
}

function applyZoom() {
  const z = settings.zoom || 100;
  // Use Chromium's zoom factor (scales correctly, no layout/viewport breakage)
  window.api.setZoom(z / 100);
}

// Manual cover-size picker → min card width for the auto-fill grids (the grid still
// reflows the COLUMN COUNT to the window width; this sets the base cover size).
const CARD_SIZES = { small: 160, cozy: 180, comfortable: 200, large: 250 };
function cardSizeKey() {
  const k = settings.cardSize === 'compact' ? 'small' : settings.cardSize; // legacy alias
  return CARD_SIZES[k] ? k : 'comfortable';
}
function applyCardSize() {
  document.getElementById('app')?.style.setProperty('--card-min', `${CARD_SIZES[cardSizeKey()]}px`);
}
async function setCardSize(size) {
  await setSetting('cardSize', size);
  applyCardSize();
  if (activeView === 'settings') renderSettingsSection('Appearance');
}

// Browse controls layout: 'top' (sort + filters across the top) or 'side' (compact right rail).
function applyBrowseLayout() {
  const w = document.querySelector('.browse-wrap');
  if (w) w.classList.toggle('browse-side-mode', (settings.browseLayout || 'top') === 'side');
}
async function setBrowseLayout(v) {
  await setSetting('browseLayout', v);
  applyBrowseLayout();
  if (activeView === 'settings') renderSettingsSection('Appearance');
}

// Theme prefs are mirrored to BOTH localStorage (instant first paint) and
// settings.json (durable — the Chromium localStorage profile has proven
// unreliable across builds, which is why "Auto" wasn't being remembered).
function setThemeMode(mode) {
  themeMode = mode;
  localStorage.setItem('tsund-theme-mode', mode);
  window.api.writeSetting('themeMode', mode);
  applyTheme();
  if (activeView === 'settings') renderSettingsSection(settingsSection);
}

function setAutoTimes(light, dark) {
  if (light) { autoLight = light; localStorage.setItem('tsund-auto-light', light); window.api.writeSetting('autoLight', light); }
  if (dark)  { autoDark  = dark;  localStorage.setItem('tsund-auto-dark',  dark); window.api.writeSetting('autoDark', dark); }
  applyTheme();
}

// Top-bar sun/moon quick toggle. In a fixed mode it flips light↔dark. In Auto it
// swaps the schedule (Light-from ↔ Dark-from) so the CURRENT effective theme flips
// while staying on Auto, instead of dropping out of Auto entirely.
function toggleThemeShortcut() {
  if (themeMode === 'auto') {
    const l = autoLight, d = autoDark;
    setAutoTimes(d, l); // swap → inverts which part of the day is light
    if (activeView === 'settings') renderSettingsSection(settingsSection);
  } else {
    setThemeMode(theme === 'light' ? 'dark' : 'light');
  }
}

function setPalette(p) {
  palette = p; localStorage.setItem('tsund-palette', p); window.api.writeSetting('palette', p); applyTheme();
  if (activeView === 'settings') renderSettingsSection(settingsSection);
}

async function setTitleLang(lang) {
  await setSetting('titleLang', lang);
  applyTitleLang(); // rewrite stored entries' .title to the new language
  if (activeView === 'home')          renderHome();
  else if (activeView === 'library')  renderLibrary();
  else if (activeView === 'wishlist') renderWishlist();
  else if (activeView === 'browse')   renderBrowseGrid(browseVns);
  renderSettingsSection('Appearance');
}

async function setSetting(key, value) {
  settings[key] = value;
  await window.api.writeSetting(key, value);
}

// ── Window controls ───────────────────────────────────────────────────────────
function initWindowControls() {
  document.getElementById('wc-min')?.addEventListener('click', () => window.api.winMinimize());
  document.getElementById('wc-max')?.addEventListener('click', () => window.api.winMaximize());
  document.getElementById('wc-close')?.addEventListener('click', () => window.api.winClose());
  window.api.onWinMaximized(isMax => {
    const btn = document.getElementById('wc-max');
    if (btn) btn.innerHTML = isMax ? '&#10064;' : '&#9744;';
  });
}

// ── Render icon via canvas → set as window icon ───────────────────────────────
// Draws a square yellow rounded tile with the dark "積" kanji centered, using
// the system Japanese fonts available in the renderer, then hands the PNG to
// main.js (which calls win.setIcon). With AppUserModelID set, Windows shows
// this in the taskbar instead of the default Electron icon.
function renderWindowIcon() {
  try {
    const S = 256, r = 46;
    const canvas = document.createElement('canvas');
    canvas.width = S; canvas.height = S;
    const ctx = canvas.getContext('2d');
    // rounded-rect tile
    ctx.fillStyle = '#F5C842';
    ctx.beginPath();
    ctx.moveTo(r, 0); ctx.lineTo(S - r, 0);
    ctx.quadraticCurveTo(S, 0, S, r);
    ctx.lineTo(S, S - r); ctx.quadraticCurveTo(S, S, S - r, S);
    ctx.lineTo(r, S); ctx.quadraticCurveTo(0, S, 0, S - r);
    ctx.lineTo(0, r); ctx.quadraticCurveTo(0, 0, r, 0);
    ctx.closePath(); ctx.fill();
    // single bold kanji, large and centered
    ctx.fillStyle = '#2d3a2a';
    ctx.font = '800 168px "Yu Gothic UI", "Yu Gothic", "Meiryo", "MS Gothic", sans-serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('積', S / 2, S / 2 + 10);
    window.api.setWindowIcon(canvas.toDataURL('image/png'));
  } catch {}
}

// ── View switching ────────────────────────────────────────────────────────────
function switchView(view) {
  activeView = view;
  document.querySelectorAll('.tnav').forEach(el =>
    el.classList.toggle('on', el.dataset.view === view));
  document.querySelectorAll('.view').forEach(el =>
    el.classList.toggle('active', el.id === `view-${view}`));
  document.getElementById('settings-nav').classList.toggle('active', view === 'settings');

  if (view === 'home')     renderHome();
  if (view === 'library')  renderLibrary();
  if (view === 'browse') {
    syncAllowNsfwChip(); // reflect any change made in Settings since last visit
    if (!browseLoaded) { browseLoaded = true; loadBrowse(); }
    else renderBrowseGrid(browseVns); // refresh badges (library/wishlist may have changed)
  }
  if (view === 'wishlist') renderWishlist();
  if (view === 'stats')  { refreshSettingsThen(() => { renderStats(); markAchievementsSeen(); }); }
  if (view === 'settings') renderSettings();
}

// Re-read settings.json (main.js writes session logs into it while the app runs),
// then run cb — so Stats reflects new sessions without an app restart.
async function refreshSettingsThen(cb) {
  try {
    const fresh = await window.api.getSettings();
    if (fresh) settings = fresh;
  } catch {}
  cb();
}

// ── Load entries ──────────────────────────────────────────────────────────────
async function loadEntries() {
  entries = await window.api.entriesGetAll();
  applyTitleLang(); // rewrite .title to the chosen language before any render
  await checkAndUnlockAchievements(); // check before any render so stats page is current
  if (activeView === 'home')     renderHome();
  if (activeView === 'library')  renderLibrary();
  if (activeView === 'wishlist') renderWishlist();
  if (activeView === 'browse')   renderBrowseGrid(browseVns);
  if (activeView === 'stats')    renderStats();
}

// ── Statistics ────────────────────────────────────────────────────────────────
function renderStats() {
  const wrap = document.getElementById('stats-wrap');
  if (!wrap) return;
  const lib = entries.filter(e => e.library && !e.excluded);

  if (!lib.length) {
    wrap.innerHTML = `
      <div class="stats-inner">
        <div class="stats-head"><h2>Statistics</h2></div>
        <div class="empty-state">
          <div class="em-glyph">積</div>
          <div class="em-title">No stats yet</div>
          <div class="em-sub">Add games to your library to start tracking your reading.</div>
        </div>
      </div>`;
    renderAchievements(computeAchStats());
    return;
  }

  const totalSeconds = lib.reduce((a, e) => a + (e.playtime_seconds || 0), 0);
  const totalHours   = totalSeconds / 3600;
  const count        = lib.length;
  const by           = s => lib.filter(e => (e.status || 'unplayed') === s).length;
  const finished     = by('finished');
  const reading      = by('reading');
  const pile         = by('unplayed');
  const completionPct = Math.round((finished / count) * 100);

  const rated     = lib.filter(e => e.rating);
  const avgRating = rated.length ? rated.reduce((a, e) => a + e.rating, 0) / rated.length : null;

  // Most-read developer: by playtime, tie-broken by title count.
  const devMap = new Map();
  for (const e of lib) {
    if (!e.developer) continue;
    const d = devMap.get(e.developer) || { time: 0, count: 0 };
    d.time += e.playtime_seconds || 0; d.count += 1;
    devMap.set(e.developer, d);
  }
  let topDev = null;
  for (const [name, d] of devMap) {
    if (!topDev || d.time > topDev.time || (d.time === topDev.time && d.count > topDev.count)) {
      topDev = { name, ...d };
    }
  }

  // Longest game you've actually FINISHED (not merely own), by estimated length.
  let longest = null;
  for (const e of lib) {
    if (e.status === 'finished' && e.length_minutes && (!longest || e.length_minutes > longest.length_minutes)) longest = e;
  }

  const hoursStr = totalHours >= 10 ? Math.round(totalHours) : Math.round(totalHours * 10) / 10;

  // Extra stats
  const dropped     = by('dropped');
  const paused      = by('paused');
  const wishlisted  = entries.filter(e => e.wishlist).length;
  const finishedWithTime = entries.filter(e => e.library && e.status === 'finished' && (e.playtime_seconds || 0) >= FINISH_MIN_SECONDS);
  const avgFinishSeconds = finishedWithTime.length
    ? finishedWithTime.reduce((a, e) => a + e.playtime_seconds, 0) / finishedWithTime.length
    : null;
  const longestSession = (settings.sessions || []).reduce((best, s) =>
    (!best || s.durationSeconds > best.durationSeconds) ? s : best, null);
  const card = (val, lbl, sub) =>
    `<div class="stat-card"><div class="stat-val">${val}</div><div class="stat-lbl">${escHtml(lbl)}</div>${sub ? `<div class="stat-sub">${escHtml(sub)}</div>` : ''}</div>`;

  // Breakdown bar segments: finished / reading / paused / dropped / pile
  const bkTotal = count || 1;
  const bkSegs = [
    { pct: (finished / bkTotal * 100).toFixed(1), color: STATUS_DOT.finished, label: 'Finished', n: finished },
    { pct: (reading  / bkTotal * 100).toFixed(1), color: STATUS_DOT.reading,  label: 'Reading',  n: reading  },
    { pct: (paused   / bkTotal * 100).toFixed(1), color: STATUS_DOT.paused,   label: 'Paused',   n: paused   },
    { pct: (dropped  / bkTotal * 100).toFixed(1), color: STATUS_DOT.dropped,  label: 'Dropped',  n: dropped  },
    { pct: (pile     / bkTotal * 100).toFixed(1), color: STATUS_DOT.unplayed, label: 'The Pile', n: pile     },
  ].filter(s => s.n > 0);

  wrap.innerHTML = `
    <div class="stats-inner">
    <div class="stats-head"><h2>Statistics</h2><span class="sub">Your reading at a glance</span></div>
    <div class="stats-grid">
      ${card(`${hoursStr}<span class="stat-unit">h</span>`, 'Total read', formatPlaytime(totalSeconds) || 'no playtime yet')}
      ${card(count, 'In library')}
      ${card(finished, 'Finished', `${completionPct}% of library`)}
      ${card(reading, 'Reading now')}
      ${card(pile, 'The Pile', 'unplayed backlog')}
      ${card(avgRating != null ? ratingStr(avgRating) : '—', 'Avg rating', avgRating != null ? `across ${rated.length} rated` : '')}
      ${card(wishlisted, 'Wishlisted', 'saved for later')}
      ${avgFinishSeconds != null ? card(formatPlaytime(avgFinishSeconds) || '—', 'Avg finish time', `across ${finishedWithTime.length} completed`) : ''}
      ${card(longestSession ? (formatPlaytime(longestSession.durationSeconds) || '—') : '—', 'Longest session', longestSession ? (longestSession.vnTitle || '') : 'no sessions yet')}
    </div>
    <div class="stats-bar-section">
      <div class="stats-bar-label">LIBRARY BREAKDOWN</div>
      <div class="stats-bar">
        ${bkSegs.map(s => `<div class="stats-bar-seg" style="width:${s.pct}%;background:${s.color}" title="${s.label}: ${s.n}"></div>`).join('')}
      </div>
      <div class="stats-bar-legend">
        ${bkSegs.map(s => `<div class="stats-bar-leg-item"><div class="stats-bar-dot" style="background:${s.color}"></div>${s.label} (${s.n})</div>`).join('')}
      </div>
    </div>
    <div class="stats-highlights">
      ${topDev ? `<div class="stat-hl">
        <div class="stat-hl-lbl">Most-read developer</div>
        <div class="stat-hl-val">${escHtml(topDev.name)}</div>
        <div class="stat-hl-sub">${topDev.count} title${topDev.count !== 1 ? 's' : ''}${topDev.time ? ' · ' + (formatPlaytime(topDev.time) || '') + ' read' : ''}</div>
      </div>` : ''}
      ${longest ? `<div class="stat-hl">
        <div class="stat-hl-lbl">Longest completed</div>
        <div class="stat-hl-val">${escHtml(longest.title)}</div>
        <div class="stat-hl-sub">${Math.round(longest.length_minutes / 60)}h average length</div>
      </div>` : ''}
    </div>
    </div>`;
  renderAchievements(computeAchStats());
  renderSessionsLog();
}

function renderSessionsLog() {
  const wrap = document.getElementById('stats-wrap');
  if (!wrap) return;
  wrap.querySelector('.sessions-section')?.remove();
  const sessions = (settings.sessions || []).slice().reverse(); // newest first

  const section = document.createElement('div');
  section.className = 'sessions-section';
  if (!sessions.length) {
    section.innerHTML = `
      <div class="stats-head" style="margin-top:28px">
        <h2>Reading Sessions</h2>
        <span class="sub">none logged yet</span>
      </div>
      <div class="sessions-empty">No sessions yet — play a visual novel for 30+ minutes and it'll show up here.</div>`;
    wrap.appendChild(section);
    return;
  }
  section.innerHTML = `
    <div class="stats-head" style="margin-top:28px">
      <h2>Reading Sessions</h2>
      <span class="sub">${sessions.length} session${sessions.length !== 1 ? 's' : ''} logged</span>
    </div>
    <div class="sessions-list">
      ${sessions.map(s => {
        const e = entryById(s.vnId);
        const url = e ? imgUrl(e.image) : null;
        const title = s.vnTitle || (e && e.title) || s.vnId;
        const when  = formatLastPlayed(s.endedAt);
        const dur   = formatPlaytime(s.durationSeconds);
        return `<div class="session-item">
          <div class="session-thumb">${url ? `<img src="${escHtml(url)}" loading="lazy" />` : ''}</div>
          <div class="session-title">${escHtml(title)}</div>
          ${when ? `<div class="session-when">${escHtml(when)}</div>` : ''}
          ${dur   ? `<div class="session-dur">${escHtml(dur)}</div>` : ''}
        </div>`;
      }).join('')}
    </div>`;
  wrap.appendChild(section);
}

// ── Achievement helpers ────────────────────────────────────────────────────────
function computeAchStats() {
  return {
    totalSeconds:     entries.reduce((sum, e) => sum + (e.playtime_seconds || 0), 0),
    finishedWithTime: entries.filter(e => e.status === 'finished' && (e.playtime_seconds || 0) >= FINISH_MIN_SECONDS).length,
    longFinished:     entries.filter(e => e.status === 'finished' && (e.playtime_seconds || 0) >= FINISH_MIN_SECONDS && (e.length_minutes || 0) >= 3000).length,
    unplayedCount:    entries.filter(e => e.library && (!e.status || e.status === 'unplayed')).length,
    libraryCount:     entries.filter(e => e.library).length,
  };
}

function achUnlockedCount() {
  const saved = settings.achievements || {};
  return ACHIEVEMENTS.filter(a => saved[a.id]).length;
}

// Show a small unseen-count badge on the Stats tab (cleared when Stats is opened).
function updateAchBadge() {
  const nav = document.querySelector('.tnav[data-view="stats"]');
  if (!nav) return;
  let badge = nav.querySelector('.tnav-badge');
  const n = achUnlockedCount() - (settings.achSeenCount || 0);
  if (n > 0) {
    if (!badge) {
      badge = document.createElement('span');
      badge.className = 'tnav-badge';
      nav.appendChild(badge);
    }
    badge.textContent = n;
  } else if (badge) {
    badge.remove();
  }
}

// Called when the user opens Stats — marks all current unlocks as seen.
function markAchievementsSeen() {
  const n = achUnlockedCount();
  if ((settings.achSeenCount || 0) !== n) {
    settings.achSeenCount = n;
    window.api.writeSetting('achSeenCount', n);
  }
  updateAchBadge();
}

async function checkAndUnlockAchievements() {
  const achStats = computeAchStats();
  const saved = { ...(settings.achievements || {}) };
  let changed = false;
  for (const a of ACHIEVEMENTS) {
    const ok = a.check(achStats);
    if (ok && !saved[a.id]) {          // newly earned
      saved[a.id] = { unlockedAt: Date.now() };
      changed = true;
    } else if (!ok && saved[a.id]) {   // no longer qualifies (e.g. a cheated finish) → revoke
      delete saved[a.id];
      changed = true;
    }
  }
  if (changed) {
    settings.achievements = saved;
    await window.api.writeSetting('achievements', saved);
  }
  // Never let the seen-count exceed what's actually unlocked (badge math stays correct
  // after a revoke).
  const uc = achUnlockedCount();
  if ((settings.achSeenCount || 0) > uc) {
    settings.achSeenCount = uc;
    await window.api.writeSetting('achSeenCount', uc);
  }
  updateAchBadge();
}

function renderAchievements(achStats) {
  const saved = settings.achievements || {};
  const wrap = document.getElementById('stats-wrap');
  if (!wrap) return;
  wrap.querySelector('.ach-section')?.remove();

  const unlocked = ACHIEVEMENTS.filter(a => saved[a.id]).length;
  const section = document.createElement('div');
  section.className = 'ach-section';

  section.innerHTML = `
    <div class="stats-head" style="margin-top:28px">
      <h2>Achievements</h2>
      <span class="sub">${unlocked} / ${ACHIEVEMENTS.length} unlocked</span>
    </div>
    <div class="achievements-grid">
      ${ACHIEVEMENTS.map(a => {
        const isUnlocked = !!saved[a.id];
        let extra = '';
        if (isUnlocked) {
          const dateStr = new Date(saved[a.id].unlockedAt)
            .toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
          extra = `<div class="ach-date">${escHtml(dateStr)}</div>`;
        } else if (!a.binary && a.prog) {
          const [val, max] = a.prog(achStats);
          const pct = max > 0 ? Math.min(100, Math.round((val / max) * 100)) : 0;
          extra = `<div class="ach-prog-wrap"><div class="ach-prog-bar" style="width:${pct}%"></div></div>
                   <div class="ach-prog-txt">${escHtml(a.fmt(achStats))}</div>`;
        }
        return `
          <div class="ach-card ${isUnlocked ? 'unlocked' : 'locked'}">
            <div class="ach-glyph">${escHtml(a.glyph)}</div>
            <div class="ach-body">
              <div class="ach-label">${escHtml(a.label)}</div>
              <div class="ach-desc">${escHtml(a.desc)}</div>
              ${extra}
            </div>
          </div>`;
      }).join('')}
    </div>`;
  wrap.appendChild(section);
}

// Background backfill: enrich every library/wishlist entry that's missing
// metadata (year, developer, length, alttitle) so grids show full info
// without the user opening each one. Throttled to respect VNDB rate limits.
let backfillRunning = false;
async function backfillMeta() {
  if (backfillRunning) return;
  backfillRunning = true;
  try {
    const missing = entries.filter(e =>
      (e.library || e.wishlist) &&
      (!e.released || !e.developer || !e.length_minutes || e.alttitle == null ||
       e.nsfwRuleVersion !== NSFW_RULE_VERSION));
    if (!missing.length) return;
    let anyChanged = false;
    for (const e of missing) {
      try {
        const data = await window.api.vndbGet(e.id, { background: true });
        const full = data.results?.[0];
        if (full) {
          const changed = await window.api.entryEnrich({
            id:             e.id,
            alttitle:       full.alttitle || null,
            title_en:       pickVndbTitle(full, 'en'),
            title_ja:       pickVndbTitle(full, 'ja'),
            title_orig:     full.title || null,
            released:       full.released || null,
            developer:      devName(full),
            length_minutes: full.length_minutes || null,
            description:    full.description ? stripBBCode(full.description) : null,
            nsfw:           isNsfw(full), // accurate (full has tags); persisted for tagless views
            nsfwRuleVersion: NSFW_RULE_VERSION,
          });
          if (changed) anyChanged = true;
        }
      } catch (_) { /* skip this one */ }
      await new Promise(r => setTimeout(r, 280)); // throttle ~3.5 req/s
    }
    if (anyChanged) await loadEntries(); // refresh grids with backfilled data
  } finally {
    backfillRunning = false;
  }
}

// ── HOME ──────────────────────────────────────────────────────────────────────
function renderHome() {
  const scroll = document.getElementById('home-scroll');
  if (!scroll) return;

  let lib = entries.filter(e => e.library);
  if (!settings.showExcluded) lib = lib.filter(e => !e.excluded);
  if (settings.nsfwHideLibrary) lib = lib.filter(e => !isNsfw(e));
  lib.sort(byNewest);

  const reading  = lib.filter(e => (e.status || 'unplayed') === 'reading');
  const pile     = lib.filter(e => (e.status || 'unplayed') === 'unplayed').slice(0, 6);
  const finished = lib.filter(e => e.status === 'finished').slice(0, 6);
  const cur = getBestHeroEntry(lib);

  // hero
  let heroHtml = '';
  if (cur) {
    const url      = imgUrl(cur.image);
    const onDev    = !!cur.exe_path;
    const pt       = formatPlaytime(cur.playtime_seconds);
    const lp       = formatLastPlayed(cur.last_played);
    const isRunning = runningVNIds.has(cur.id);
    const kicker   = cur.last_played ? '▶ LAST PLAYED' : (cur.status === 'reading' ? '▶ CURRENTLY READING' : '▶ FROM YOUR LIBRARY');
    heroHtml = `
      <div class="hero2">
        <div class="hero2-cover">
          ${makePoster(url, 13, isNsfw(cur), settings.nsfwBlurLibrary)}
        </div>
        <div class="hero2-body">
          <div class="hero2-kicker">${kicker}</div>
          <div class="hero2-title">${escHtml(cur.title)}</div>
          <div class="hero2-meta">
            ${cur.released ? `<span>${cur.released.slice(0,4)}</span>` : ''}
            ${cur.developer ? `<span class="vr"></span><span>${escHtml(cur.developer)}</span>` : ''}
            ${pt ? `<span class="vr"></span><span>${pt} played</span>` : ''}
            ${lp ? `<span class="vr"></span><span>last played ${lp}</span>` : ''}
            ${!pt && !lp ? `<span class="vr"></span><span>${onDev ? '● on device' : '○ not installed'}</span>` : ''}
          </div>
          <div class="hero2-actions">
            ${isRunning
              ? `<div class="btn-pri btn-stop" id="hero-action">■ Stop</div>`
              : onDev
                ? `<div class="btn-pri" id="hero-action">${icon('play', 15, true)} ${cur.status === 'reading' ? 'Continue' : 'Launch'}</div>`
                : `<div class="btn-pri" id="hero-action">${icon('folder', 15)} Locate on device</div>`}
            <div class="btn-sec" id="hero-details">Details</div>
          </div>
        </div>
      </div>`;
  } else {
    heroHtml = `
      <div class="hero2" style="align-items:center;justify-content:center;min-height:200px;">
        <div style="text-align:center">
          <div style="font-family:'Space Grotesk',sans-serif;font-weight:800;font-size:26px;margin-bottom:14px">Your pile awaits.</div>
          <div class="btn-pri" id="hero-action">${icon('browse', 16)} Browse VNDB</div>
        </div>
      </div>`;
  }

  // pile stats
  const totalPt = lib.reduce((acc, e) => acc + (e.playtime_seconds || 0), 0);
  const totalH  = formatPlaytime(totalPt);
  const pilestatHtml = lib.length > 0 ? `
    <div class="pilestat">
      <div class="seg"><b>${lib.length}</b> on the pile</div>
      <div class="vr"></div>
      <div class="seg"><b>${reading.length}</b> playing</div>
      <div class="vr"></div>
      <div class="seg"><b>${finished.length}</b> finished</div>
      ${totalH ? `<div class="vr"></div><div class="seg"><b>${totalH}</b> logged</div>` : ''}
    </div>` : '';

  const makeShelfCard = e => {
    const url    = imgUrl(e.image);
    const rating = ratingStr(e.rating);
    const pt     = formatPlaytime(e.playtime_seconds);
    return `<div class="bk" data-id="${escHtml(e.id)}">
      <div class="pv2-wrap">${makePoster(url, 12, isNsfw(e), settings.nsfwBlurLibrary)}</div>
      <div class="bk-title">${escHtml(e.title)}</div>
      <div class="bk-meta">
        ${rating ? `<span class="pt">★ ${rating}</span>` : ''}
        ${pt ? `<span>${pt}</span>` : (e.exe_path ? '<span>on device</span>' : '')}
      </div>
    </div>`;
  };

  const makeShelf = (label, cnt, items, color) => {
    if (!items.length) return '';
    return `<section class="shelf" style="--acc:${color}">
      <div class="shelf-head">
        <span class="sq" style="background:${color}"></span>
        <span class="lbl">${escHtml(label)}</span>
        <span class="cnt">${escHtml(cnt)}</span>
        <span class="more" data-goto="library">see all →</span>
      </div>
      <div class="shelf-row">${items.map(makeShelfCard).join('')}</div>
    </section>`;
  };

  // "Now playing" lists all reading titles EXCEPT the one featured in the hero,
  // so the count matches what's shown (no off-by-one vs. the hero spotlight).
  const nowPlaying = reading.filter(e => e.id !== (cur && cur.id));
  const shelvesHtml = [
    pile.length > 0       && makeShelf('The pile',          `${pile.length} unplayed`,    pile,              'var(--blue-deep)'),
    nowPlaying.length > 0 && makeShelf('Now playing',       `${nowPlaying.length} more`,  nowPlaying,        'var(--read-deep)'),
    finished.length > 0   && makeShelf('Recently finished', `${finished.length} done`,    finished,          'oklch(0.58 0.17 305)'),
  ].filter(Boolean).join('');

  scroll.innerHTML = `
    <div class="pad">${heroHtml}</div>
    ${pilestatHtml}
    ${shelvesHtml}
    <div style="height:32px"></div>`;

  // wire hero buttons
  document.getElementById('hero-action')?.addEventListener('click', async () => {
    if (!cur) { switchView('browse'); return; }
    if (runningVNIds.has(cur.id)) {
      if (confirm('Save your game first! Force-stop the process?')) {
        await window.api.stopVN(cur.id);
      }
      return;
    }
    if (cur.exe_path) {
      try {
        await window.api.launchVN(cur.exe_path, cur.id);
        runningVNIds.add(cur.id);
        await loadEntries();           // reflect auto unplayed→reading
        renderHome();
      } catch (err) { alert('Could not launch: ' + err.message); }
    } else {
      const p = await window.api.pickExe();
      if (p) { await window.api.libraryUpdateExe(cur.id, p); await loadEntries(); }
    }
  });
  document.getElementById('hero-details')?.addEventListener('click', () => cur && openModal(cur));

  document.querySelectorAll('.bk[data-id]').forEach(el =>
    el.addEventListener('click', () => {
      const e = entryById(el.dataset.id);
      if (e) openModal(e);
    }));
  document.querySelectorAll('.more[data-goto]').forEach(el =>
    el.addEventListener('click', () => switchView(el.dataset.goto)));
}

// ── LIBRARY ───────────────────────────────────────────────────────────────────
function renderLibrary() {
  let lib = entries.filter(e => e.library);
  if (!settings.showExcluded) lib = lib.filter(e => !e.excluded);
  if (settings.nsfwHideLibrary) lib = lib.filter(e => !isNsfw(e));

  const counts = { all: lib.length };
  STATUS_LIST.forEach(s => {
    counts[s] = lib.filter(e => (e.status || 'unplayed') === s).length;
  });
  ['all', ...STATUS_LIST].forEach(s => {
    const el = document.getElementById(`f-count-${s}`);
    if (el) el.textContent = counts[s];
  });

  let filtered = lib;
  if (libFilter !== 'all') filtered = lib.filter(e => (e.status || 'unplayed') === libFilter);
  if (libSearch.trim()) {
    const q = libSearch.toLowerCase();
    filtered = filtered.filter(e => (e.title || '').toLowerCase().includes(q));
  }
  if (libCollFilter !== null) {
    const coll = (settings.collections || []).find(c => c.id === libCollFilter);
    if (coll) filtered = filtered.filter(e => coll.vnIds.includes(e.id));
    else libCollFilter = null;
  }
  // Apply sort
  const sortFns = {
    added:  byNewest,
    played: (a, b) => (b.last_played || 0) - (a.last_played || 0),
    alpha:  (a, b) => (a.title || '').localeCompare(b.title || ''),
    year:   (a, b) => (b.released || '').localeCompare(a.released || ''),
  };
  filtered.sort(sortFns[libSort] || byNewest);

  const onDevice  = filtered.filter(e => e.exe_path);
  const offDevice = filtered.filter(e => !e.exe_path);

  // Collection view: the heading becomes the collection's name and the
  // "Add to collection" button appears (collections are a view, not a filter).
  const activeColl = libCollFilter ? (settings.collections || []).find(c => c.id === libCollFilter) : null;
  const headingEl = document.getElementById('lib-heading');
  if (headingEl) headingEl.textContent = activeColl ? activeColl.name : 'Your shelf';
  const addCollBtn = document.getElementById('lib-addcoll');
  if (addCollBtn) addCollBtn.classList.toggle('hidden', !activeColl);

  const countEl = document.getElementById('lib-count');
  if (countEl) countEl.textContent = `${filtered.length} visual novel${filtered.length !== 1 ? 's' : ''}`;

  const sections   = document.getElementById('lib-sections');
  const emptyEl    = document.getElementById('lib-empty');
  const emptyTitle = document.getElementById('lib-empty-title');
  const emptySub   = document.getElementById('lib-empty-sub');

  if (filtered.length === 0) {
    sections.innerHTML = '';
    emptyEl.classList.remove('hidden');
    if (emptyTitle) {
      emptyTitle.textContent = lib.length === 0
        ? 'Your library is empty'
        : activeColl
          ? 'This collection is empty'
          : libSearch.trim()
            ? `No results for "${libSearch}"`
            : 'No visual novels match this filter';
    }
    if (emptySub) {
      emptySub.innerHTML = lib.length === 0
        ? 'Browse VNDB to add visual novels<br />or scan your games folder in Settings.'
        : activeColl
          ? 'Click “Add to collection” above to add titles from your library.'
          : 'Try a different filter or search term.';
    }
    document.getElementById('lib-preview').classList.add('hidden');
    return;
  }
  emptyEl.classList.add('hidden');

  if (libSelId && !filtered.find(e => e.id === libSelId)) libSelId = null;
  if (!libSelId && filtered.length > 0) libSelId = filtered[0].id;

  // Reflect the active view on the grid/list toggle.
  const isList = (settings.libView || 'grid') === 'list';
  document.querySelectorAll('#lib-view-toggle .lvt-btn').forEach(b =>
    b.classList.toggle('on', b.dataset.libview === (isList ? 'list' : 'grid')));

  const makeSection = isList ? makeListSection : makeSGSection;
  sections.innerHTML = [
    onDevice.length  && makeSection(icon('folder', 13), 'On this PC',   onDevice.length,  onDevice),
    offDevice.length && makeSection(icon('clock',  13), 'Not installed', offDevice.length, offDevice),
  ].filter(Boolean).join('');

  document.querySelectorAll('.sg[data-id], .lib-row[data-id]').forEach(el => {
    el.addEventListener('click', () => {
      // On narrow windows the detail panel is collapsed (CSS), so open the modal
      // instead of selecting into a panel the user can't see.
      if (window.matchMedia('(max-width: 900px)').matches) {
        const entry = entryById(el.dataset.id);
        if (entry) openModal(entry);
        return;
      }
      libSelId = el.dataset.id;
      document.querySelectorAll('.sg, .lib-row').forEach(s => s.classList.remove('sel'));
      el.classList.add('sel');
      renderLibPreview(entryById(libSelId));
    });
  });

  // List-view inline launch buttons.
  document.querySelectorAll('.lr-launch').forEach(el => {
    el.addEventListener('click', async e => {
      e.stopPropagation();
      const entry = entryById(el.dataset.id);
      if (!entry || !entry.exe_path) return;
      if (runningVNIds.has(entry.id)) return;
      try {
        await window.api.launchVN(entry.exe_path, entry.id);
        runningVNIds.add(entry.id);
        await loadEntries();
        renderLibrary();
      } catch (err) { alert('Could not launch: ' + err.message); }
    });
  });

  document.querySelectorAll(`.sg[data-id="${libSelId}"], .lib-row[data-id="${libSelId}"]`).forEach(el => el.classList.add('sel'));
  renderLibPreview(libSelId ? entryById(libSelId) : null);
}

// Library LIST view: a rich row per title (cover thumb · title · status · meta ·
// playtime · launch). Same data-id contract as the grid cards.
function makeListSection(iconHtml, label, count, items) {
  const rows = items.map(e => {
    const url    = imgUrl(e.image);
    const nsfw   = isNsfw(e);
    const rating = ratingStr(e.rating);
    const yr     = e.released ? e.released.slice(0, 4) : null;
    const len    = formatLength(e);
    const status = e.status || 'unplayed';
    const pt     = formatPlaytime(e.playtime_seconds);
    const onDev  = !!e.exe_path;
    const meta = [];
    if (rating) meta.push(`<span class="bi-score">★ ${escHtml(rating)}</span>`);
    if (yr)  meta.push(`<span>${escHtml(yr)}</span>`);
    if (len) meta.push(`<span>${escHtml(len)}</span>`);
    if (e.developer) meta.push(`<span>${escHtml(e.developer)}</span>`);
    return `<div class="lib-row" data-id="${escHtml(e.id)}">
      <div class="lr-thumb">${makePoster(url, 6, nsfw, settings.nsfwBlurLibrary)}</div>
      <div class="lr-main">
        <div class="lr-title">${escHtml(e.title)}</div>
        <div class="lr-meta">${meta.join('<span class="lr-dot">·</span>')}</div>
      </div>
      ${statusPill(status)}
      <div class="lr-playtime">${pt ? escHtml(pt) + ' played' : ''}</div>
      <div class="lr-actions">
        ${onDev
          ? `<div class="btn-sm pri lr-launch" data-id="${escHtml(e.id)}">${icon('play', 12, true)} ${status === 'reading' ? 'Continue' : 'Launch'}</div>`
          : `<span class="lr-noinstall">not installed</span>`}
      </div>
    </div>`;
  }).join('');

  return `<div class="lib-section">
    <div class="lib-section-head">
      ${iconHtml}
      <span class="lsh-label">${escHtml(label)}</span>
      <span class="lsh-cnt">${count} title${count !== 1 ? 's' : ''}</span>
    </div>
    <div class="lib-list">${rows}</div>
  </div>`;
}

async function setLibView(v) {
  await setSetting('libView', v);
  renderLibrary();
}

function makeSGSection(iconHtml, label, count, items) {
  const cards = items.map(e => {
    const url    = imgUrl(e.image);
    const nsfw   = isNsfw(e);
    const yr     = e.released ? e.released.slice(0, 4) : null;
    const dev    = e.developer || null;
    const rating = ratingStr(e.rating);
    const onDev  = !!e.exe_path;
    const len    = formatLength(e);
    // Build meta: highlighted rating, then year (or dev when no year).
    const metaBits = [];
    if (rating) metaBits.push(`<span class="bi-score">★ ${escHtml(rating)}</span>`);
    if (yr) metaBits.push(`<span>${escHtml(yr)}</span>`);
    else if (dev) metaBits.push(`<span>${escHtml(dev)}</span>`);
    const metaLine = metaBits.join(' · ');
    return `<div class="sg" data-id="${escHtml(e.id)}">
      <div class="pv2-wrap">
        ${makePoster(url, 11, nsfw, settings.nsfwBlurLibrary)}
        <div class="sg-play-overlay">
          <div class="sg-play-icon">${icon('play', 20, true)}</div>
        </div>
        ${!onDev ? `<span style="position:absolute;bottom:7px;right:7px;z-index:4;font-family:'Space Mono',monospace;font-size:9px;font-weight:700;background:var(--panel);color:var(--faint);padding:2px 6px;border-radius:5px;border:1px solid var(--line-2)">not installed</span>` : ''}
      </div>
      <div class="sg-t">${escHtml(e.title)}</div>
      <div class="sg-m"><span>${metaLine}</span>${len ? `<span class="card-len">${escHtml(len)}</span>` : ''}</div>
    </div>`;
  }).join('');

  return `<div class="lib-section">
    <div class="lib-section-head">
      ${iconHtml}
      <span class="lsh-label">${escHtml(label)}</span>
      <span class="lsh-cnt">${count} title${count !== 1 ? 's' : ''}</span>
    </div>
    <div class="sgrid">${cards}</div>
  </div>`;
}

function renderLibPreview(entry) {
  const panel = document.getElementById('lib-preview');
  if (!entry) { panel.classList.add('hidden'); return; }
  panel.classList.remove('hidden');

  const url      = imgUrl(entry.image);
  const onDev    = !!entry.exe_path;
  const status   = entry.status || 'unplayed';
  const rating   = ratingStr(entry.rating);
  const desc     = stripBBCode(entry.description || '');
  const pt       = formatPlaytime(entry.playtime_seconds);
  const lp       = formatLastPlayed(entry.last_played);
  const yr       = entry.released ? entry.released.slice(0, 4) : null;
  const dev      = entry.developer || null;
  const nsfw     = isNsfw(entry);
  const lenH     = entry.length_minutes ? `${Math.round(entry.length_minutes / 60)}h avg` : null;
  const isExcluded = !!entry.excluded;
  const isRunning  = runningVNIds.has(entry.id);

  panel.innerHTML = `
    <div style="display:flex;justify-content:center;padding:14px 14px 0">
      <div class="pv2${nsfw && settings.nsfwBlurLibrary ? ' nsfw-blur' : ''}" style="width:62%;aspect-ratio:2/3;border-radius:12px;border:2px solid var(--border);box-shadow:0 4px 0 var(--edge);overflow:hidden;flex-shrink:0">
        ${url
          ? `<img src="${escHtml(url)}" style="width:100%;height:100%;object-fit:cover;display:block;" />`
          : `<div style="width:100%;height:100%;background:var(--panel);display:flex;align-items:center;justify-content:center;color:var(--mut);font-size:0.75rem;font-family:'Space Mono',monospace;">No Image</div>`}
      </div>
    </div>

    <div class="pv-status" style="margin-top:10px">
      ${statusPill(status)}
      ${rating ? `<span class="mono" style="font-size:11px;color:var(--mut)">★ ${rating}</span>` : ''}
      ${onDev
        ? `<span class="mono" style="font-size:10px;color:var(--read-deep);margin-left:auto">● on device</span>`
        : `<span class="mono" style="font-size:10px;color:var(--faint);margin-left:auto">○ not installed</span>`}
    </div>

    <div class="pv-title">${escHtml(entry.title)}</div>
    ${entry.alttitle ? `<div class="pv-alttitle">${escHtml(entry.alttitle)}</div>` : ''}

    <div class="pv-meta">
      ${yr  ? `<div class="m"><span class="mk">YEAR</span><span class="mv">${escHtml(yr)}</span></div>` : ''}
      ${lenH ? `<div class="m"><span class="mk">LENGTH</span><span class="mv">${escHtml(lenH)}</span></div>` : ''}
      ${dev ? `<div class="m" style="grid-column:1/-1"><span class="mk">DEVELOPER</span><span class="mv" style="font-size:12px">${escHtml(dev)}</span></div>` : ''}
      ${entry.started_at ? `<div class="m"><span class="mk">STARTED</span><span class="mv" style="font-size:12px">${escHtml(formatDate(entry.started_at))}</span></div>` : ''}
      ${entry.finished_at ? `<div class="m"><span class="mk">FINISHED</span><span class="mv" style="font-size:12px">${escHtml(formatDate(entry.finished_at))}</span></div>` : ''}
      <div class="m" style="grid-column:1/-1">
        <span class="mk">STATUS</span>
        <select class="pv-status-sel" id="pv-status-sel">
          ${STATUS_LIST.map(s =>
            `<option value="${s}" ${status === s ? 'selected' : ''}>${capitalize(s)}</option>`).join('')}
        </select>
      </div>
    </div>

    ${(pt || lp) ? `<div class="pv-playtime">
      ${pt ? `<span class="pt-total">${pt} played</span>` : ''}
      ${lp ? `<span class="pt-last">last played: ${lp}</span>` : ''}
    </div>` : ''}

    ${desc ? `<div class="pv-desc">${escHtml(desc)}</div>` : ''}

    <div id="pv-tags-area"></div>

    <div class="pv-actions-stack">
      <div class="pv-actions-row">
        ${isRunning
          ? `<div class="btn-sm pri btn-stop pv-btn-main" id="pv-action">■ Stop</div>`
          : onDev
            ? `<div class="btn-sm pri pv-btn-main" id="pv-action">${icon('play', 13, true)} ${status === 'reading' ? 'Continue' : 'Launch'}</div>`
            : `<div class="btn-sm sec pv-btn-main" id="pv-action">${icon('folder', 13)} Locate</div>`}
        <div class="btn-sm sec pv-btn-side" id="pv-details">Details</div>
      </div>
    </div>`;

  panel.scrollTop = 0;

  // Async backfill: fetch full VNDB details, persist missing metadata, refresh.
  const wasMissingMeta = !entry.released || !entry.developer || !entry.length_minutes || !entry.alttitle;
  window.api.vndbGet(entry.id).then(async data => {
    if (!data.results?.length) return;
    const full = data.results[0];
    // Bail if the user has since selected a different entry
    if (libSelId !== entry.id) return;
    const enrichMeta = {
      id:             entry.id,
      alttitle:       full.alttitle || null,
      title_en:       pickVndbTitle(full, 'en'),
      title_ja:       pickVndbTitle(full, 'ja'),
      title_orig:     full.title || null,
      released:       full.released || null,
      developer:      devName(full),
      length_minutes: full.length_minutes || null,
      description:    full.description ? stripBBCode(full.description) : null,
      nsfw:           isNsfw(full),
      nsfwRuleVersion: NSFW_RULE_VERSION,
    };
    const changed = await window.api.entryEnrich(enrichMeta);
    if (changed) {
      await loadEntries();
      if (libSelId !== entry.id) return;
      // Re-render the panel with the now-complete data (one-shot; meta won't be missing again)
      if (wasMissingMeta) { renderLibPreview(entryById(entry.id)); return; }
    }
    // Just inject tags into the current panel
    const tagsArea = document.getElementById('pv-tags-area');
    if (!tagsArea || libSelId !== entry.id) return;
    const tags = (full.tags || []).slice(0, 8);
    if (tags.length) {
      tagsArea.innerHTML = `<div class="pv-tags">${tags.map(t => `<span class="pv-tag">${escHtml(t.name || t)}</span>`).join('')}</div>`;
    }
  }).catch(() => {});

  document.getElementById('pv-status-sel').addEventListener('change', async e => {
    await window.api.libraryUpdateStatus(entry.id, e.target.value);
    await loadEntries();
    libSelId = entry.id;
    renderLibrary();
  });

  document.getElementById('pv-action')?.addEventListener('click', async () => {
    if (runningVNIds.has(entry.id)) {
      if (confirm('Save your game first! Force-stop the process?')) {
        await window.api.stopVN(entry.id);
      }
      return;
    }
    if (onDev) {
      try {
        await window.api.launchVN(entry.exe_path, entry.id);
        runningVNIds.add(entry.id);
        await loadEntries();           // reflect auto unplayed→reading
        libSelId = entry.id;
        renderLibrary();               // refresh grid (status section may change)
      } catch (err) { alert('Could not launch: ' + err.message); }
    } else {
      const p = await window.api.pickExe();
      if (p) {
        await window.api.libraryUpdateExe(entry.id, p);
        await loadEntries(); libSelId = entry.id; renderLibrary();
      }
    }
  });

  document.getElementById('pv-details')?.addEventListener('click', () => openModal(entry));
}

// ── COLLECTIONS SIDEBAR ───────────────────────────────────────────────────────
function renderCollectionsSidebar() {
  const list = document.getElementById('fcoll-list');
  if (!list) return;
  const colls = settings.collections || [];
  list.innerHTML = colls.map(c => {
    const on = libCollFilter === c.id;
    return `<div class="fitem fcoll-item${on ? ' on' : ''}" data-coll-id="${escHtml(c.id)}">
      <span style="flex:1">${escHtml(c.name)}</span>
      <span class="n">${c.vnIds ? c.vnIds.length : 0}</span>
      <span class="fcoll-del" data-del-coll="${escHtml(c.id)}" title="Delete">✕</span>
    </div>`;
  }).join('');

  list.querySelectorAll('.fcoll-item').forEach(el => {
    el.addEventListener('click', e => {
      if (e.target.dataset.delColl) return;
      libCollFilter = (libCollFilter === el.dataset.collId) ? null : el.dataset.collId;
      // Entering a collection resets the status filter to All (exclusive views).
      libFilter = 'all';
      document.querySelectorAll('.fitem[data-filter]').forEach(f =>
        f.classList.toggle('on', f.dataset.filter === 'all'));
      libSelId = null;
      renderCollectionsSidebar();
      renderLibrary();
    });
  });

  list.querySelectorAll('[data-del-coll]').forEach(el => {
    el.addEventListener('click', e => {
      e.stopPropagation();
      const coll = (settings.collections || []).find(c => c.id === el.dataset.delColl);
      if (coll) confirmDeleteCollection(coll);
    });
  });
}

async function toggleVnInCollection(collId, vnId) {
  const colls = settings.collections || [];
  const coll = colls.find(c => c.id === collId);
  if (!coll) return;
  const idx = coll.vnIds.indexOf(vnId);
  if (idx === -1) coll.vnIds.push(vnId);
  else coll.vnIds.splice(idx, 1);
  settings.collections = colls;
  await window.api.writeSetting('collections', colls);
  renderCollectionsSidebar();
}

// ── Reusable styled dialog (name input OR confirm) ─────────────────────────────
// opts: { title, message?, input?, placeholder?, confirmLabel?, cancelLabel?,
//         danger?, onConfirm(value) }. Enter confirms, Esc/backdrop cancels.
function appDialog(opts) {
  if (document.getElementById('app-dialog-backdrop')) return;
  const { title, message, input, placeholder, confirmLabel = 'Done',
          cancelLabel = 'Cancel', danger = false, onConfirm } = opts;
  const backdrop = document.createElement('div');
  backdrop.id = 'app-dialog-backdrop';
  backdrop.className = 'app-dialog-backdrop';
  backdrop.innerHTML = `
    <div class="app-dialog">
      <div class="app-dialog-title">${escHtml(title)}</div>
      ${message ? `<div class="app-dialog-msg">${message}</div>` : ''}
      ${input ? `<input class="app-dialog-input" id="app-dialog-input" type="text" placeholder="${escHtml(placeholder || '')}" maxlength="40" />` : ''}
      <div class="app-dialog-actions">
        <div class="app-dialog-btn" id="app-dialog-cancel">${escHtml(cancelLabel)}</div>
        <div class="app-dialog-btn ${danger ? 'danger' : 'pri'}" id="app-dialog-confirm">${escHtml(confirmLabel)}</div>
      </div>
    </div>`;
  // Append inside .app2 (the themed root) so the dialog inherits the theme CSS
  // variables — they're scoped to .app2, not :root, so a body-level node renders
  // with an undefined (transparent) background.
  (document.getElementById('app') || document.body).appendChild(backdrop);
  const field = document.getElementById('app-dialog-input');

  const close = () => { document.removeEventListener('keydown', onKey, true); backdrop.remove(); };
  const doConfirm = () => {
    const val = field ? field.value.trim() : true;
    close();
    if (onConfirm) onConfirm(val);
  };
  const onKey = e => {
    if (e.key === 'Enter')      { e.preventDefault(); e.stopPropagation(); doConfirm(); }
    else if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); close(); }
  };
  document.addEventListener('keydown', onKey, true);
  document.getElementById('app-dialog-confirm').addEventListener('click', doConfirm);
  document.getElementById('app-dialog-cancel').addEventListener('click', close);
  backdrop.addEventListener('click', e => { if (e.target === backdrop) close(); });
  if (field) field.focus();
}

function showCollDialog() {
  appDialog({
    title: 'New Collection',
    input: true,
    placeholder: 'Collection name…',
    confirmLabel: 'Create',
    onConfirm: async name => {
      if (!name) return;
      const colls = settings.collections || [];
      colls.push({ id: `coll_${Date.now()}`, name, vnIds: [] });
      settings.collections = colls;
      await window.api.writeSetting('collections', colls);
      renderCollectionsSidebar();
    },
  });
}

function confirmDeleteCollection(coll) {
  appDialog({
    title: 'Delete collection?',
    message: `<b>${escHtml(coll.name)}</b> will be removed. The visual novels in it stay in your library.`,
    confirmLabel: 'Delete',
    danger: true,
    onConfirm: async () => {
      settings.collections = (settings.collections || []).filter(c => c.id !== coll.id);
      if (libCollFilter === coll.id) libCollFilter = null;
      await window.api.writeSetting('collections', settings.collections);
      renderCollectionsSidebar();
      renderLibrary();
    },
  });
}

// Add-to-collection picker: every library title with a checkbox reflecting
// membership in the active collection. Clicking a row toggles it live.
function openCollectionPicker(collId) {
  const coll = (settings.collections || []).find(c => c.id === collId);
  if (!coll || document.getElementById('app-dialog-backdrop')) return;

  let lib = entries.filter(e => e.library);
  if (!settings.showExcluded) lib = lib.filter(e => !e.excluded);
  if (settings.nsfwHideLibrary) lib = lib.filter(e => !isNsfw(e));
  lib.sort((a, b) => (a.title || '').localeCompare(b.title || ''));

  const backdrop = document.createElement('div');
  backdrop.id = 'app-dialog-backdrop';
  backdrop.className = 'app-dialog-backdrop';
  backdrop.innerHTML = `
    <div class="app-dialog coll-picker">
      <div class="app-dialog-title">Add to “${escHtml(coll.name)}”</div>
      <input class="coll-picker-search" id="coll-picker-search" type="text" placeholder="Search your library…" />
      <div class="coll-picker-list" id="coll-picker-list"></div>
      <div class="app-dialog-actions">
        <div class="app-dialog-btn pri" id="coll-picker-done">Done</div>
      </div>
    </div>`;
  // Append inside .app2 (the themed root) so the dialog inherits the theme CSS
  // variables — they're scoped to .app2, not :root, so a body-level node renders
  // with an undefined (transparent) background.
  (document.getElementById('app') || document.body).appendChild(backdrop);

  const listEl   = document.getElementById('coll-picker-list');
  const searchEl = document.getElementById('coll-picker-search');
  let q = '';
  const renderRows = () => {
    const rows = lib.filter(e => !q || (e.title || '').toLowerCase().includes(q));
    if (!rows.length) { listEl.innerHTML = `<div class="coll-picker-empty">No titles match.</div>`; return; }
    listEl.innerHTML = rows.map(e => {
      const on  = coll.vnIds.includes(e.id);
      const url = imgUrl(e.image);
      return `<div class="coll-picker-row${on ? ' on' : ''}" data-id="${escHtml(e.id)}">
        <div class="coll-picker-check">✓</div>
        <div class="coll-picker-thumb">${url ? `<img src="${escHtml(url)}" loading="lazy" />` : ''}</div>
        <div class="coll-picker-name">${escHtml(e.title)}</div>
      </div>`;
    }).join('');
    listEl.querySelectorAll('.coll-picker-row').forEach(row =>
      row.addEventListener('click', async () => {
        await toggleVnInCollection(coll.id, row.dataset.id);
        row.classList.toggle('on');
      }));
  };
  renderRows();

  const close = () => {
    document.removeEventListener('keydown', onKey, true);
    backdrop.remove();
    renderCollectionsSidebar();
    renderLibrary();
  };
  const onKey = e => { if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); close(); } };
  document.addEventListener('keydown', onKey, true);
  searchEl.addEventListener('input', e => { q = e.target.value.trim().toLowerCase(); renderRows(); });
  document.getElementById('coll-picker-done').addEventListener('click', close);
  backdrop.addEventListener('click', e => { if (e.target === backdrop) close(); });
  searchEl.focus();
}

// Bulk library manager: multi-select titles, then Hide (exclude from the library
// view, keeps history) or Remove (drop from library) all at once.
function openBatchManager() {
  if (document.getElementById('batch-backdrop')) return;
  let lib = entries.filter(e => e.library);
  if (!settings.showExcluded) lib = lib.filter(e => !e.excluded);
  if (settings.nsfwHideLibrary) lib = lib.filter(e => !isNsfw(e));
  lib.sort((a, b) => (a.title || '').localeCompare(b.title || ''));

  const selected = new Set();
  let q = '';

  const backdrop = document.createElement('div');
  backdrop.id = 'batch-backdrop';
  backdrop.className = 'app-dialog-backdrop';
  backdrop.innerHTML = `
    <div class="app-dialog coll-picker">
      <div class="app-dialog-title">Manage library</div>
      <input class="coll-picker-search" id="batch-search" type="text" placeholder="Search your library…" />
      <div class="coll-picker-list" id="batch-list"></div>
      <div class="batch-footer">
        <span class="batch-count" id="batch-count">0 selected</span>
        <div class="app-dialog-btn" id="batch-hide">Hide selected</div>
        <div class="app-dialog-btn danger" id="batch-remove">Remove selected</div>
      </div>
    </div>`;
  // Append inside .app2 (the themed root) so the dialog inherits the theme CSS
  // variables — they're scoped to .app2, not :root, so a body-level node renders
  // with an undefined (transparent) background.
  (document.getElementById('app') || document.body).appendChild(backdrop);

  const listEl    = document.getElementById('batch-list');
  const searchEl  = document.getElementById('batch-search');
  const countEl   = document.getElementById('batch-count');
  const hideBtn   = document.getElementById('batch-hide');
  const removeBtn = document.getElementById('batch-remove');

  const updateFooter = () => {
    countEl.textContent = `${selected.size} selected`;
    const none = selected.size === 0;
    hideBtn.classList.toggle('disabled', none);
    removeBtn.classList.toggle('disabled', none);
  };
  const renderRows = () => {
    const rows = lib.filter(e => !q || (e.title || '').toLowerCase().includes(q));
    if (!rows.length) { listEl.innerHTML = `<div class="coll-picker-empty">No titles match.</div>`; return; }
    listEl.innerHTML = rows.map(e => {
      const on  = selected.has(e.id);
      const url = imgUrl(e.image);
      return `<div class="coll-picker-row${on ? ' on' : ''}" data-id="${escHtml(e.id)}">
        <div class="coll-picker-check">✓</div>
        <div class="coll-picker-thumb">${url ? `<img src="${escHtml(url)}" loading="lazy" />` : ''}</div>
        <div class="coll-picker-name">${escHtml(e.title)}</div>
      </div>`;
    }).join('');
    listEl.querySelectorAll('.coll-picker-row').forEach(row =>
      row.addEventListener('click', () => {
        const id = row.dataset.id;
        if (selected.has(id)) selected.delete(id); else selected.add(id);
        row.classList.toggle('on');
        updateFooter();
      }));
  };
  renderRows();
  updateFooter();

  const close = () => { document.removeEventListener('keydown', onKey, true); backdrop.remove(); };
  const onKey = e => { if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); close(); } };
  document.addEventListener('keydown', onKey, true);
  searchEl.addEventListener('input', e => { q = e.target.value.trim().toLowerCase(); renderRows(); });
  backdrop.addEventListener('click', e => { if (e.target === backdrop) close(); });

  hideBtn.addEventListener('click', async () => {
    if (!selected.size) return;
    for (const id of selected) await window.api.libraryExclude(id);
    close();
    libSelId = null;
    await loadEntries();
    renderLibrary();
  });
  removeBtn.addEventListener('click', () => {
    if (!selected.size) return;
    const n = selected.size;
    appDialog({
      title: 'Remove from library?',
      message: `<b>${n}</b> title${n !== 1 ? 's' : ''} will be removed from your library. Playtime history is kept.`,
      confirmLabel: 'Remove',
      danger: true,
      onConfirm: async () => {
        for (const id of selected) await window.api.removeFromList(id, 'library');
        close();
        libSelId = null;
        await loadEntries();
        renderLibrary();
      },
    });
  });
  searchEl.focus();
}

// ── WISHLIST ALERTS ───────────────────────────────────────────────────────────
function updateWishBadge() {
  const nav = document.querySelector('.tnav[data-view="wishlist"]');
  if (!nav) return;
  let badge = nav.querySelector('.tnav-badge');
  const n = wishlistAlerts.length;
  if (n > 0) {
    if (!badge) {
      badge = document.createElement('span');
      badge.className = 'tnav-badge';
      nav.appendChild(badge);
    }
    badge.textContent = n;
  } else if (badge) {
    badge.remove();
  }
}

async function checkWishlistAlerts() {
  const wishItems = entries.filter(e => e.wishlist && !e.library);
  if (!wishItems.length) { wishlistAlerts = []; updateWishBadge(); return; }

  const seen = settings.wishlistSeenReleases || {};
  const ids = wishItems.map(e => e.id);

  let releaseMap = {};
  try { releaseMap = await window.api.wishlistGetReleases(ids); } catch { return; }

  wishlistAlerts = [];
  for (const [vnId, rels] of Object.entries(releaseMap)) {
    const newRels = rels.filter(r => !seen[r.id]);
    if (!newRels.length) continue;
    const vn = wishItems.find(e => e.id === vnId);
    if (!vn) continue;
    wishlistAlerts.push({ vnId, vnTitle: vn.title, releases: newRels });
  }

  settings.wishlistLastCheck = Date.now();
  await window.api.writeSetting('wishlistLastCheck', settings.wishlistLastCheck);
  updateWishBadge();
  if (activeView === 'wishlist') renderWishlist();
}

async function dismissWishlistAlerts() {
  const seen = settings.wishlistSeenReleases || {};
  for (const alert of wishlistAlerts) {
    for (const r of alert.releases) seen[r.id] = true;
  }
  settings.wishlistSeenReleases = seen;
  await window.api.writeSetting('wishlistSeenReleases', seen);
  wishlistAlerts = [];
  updateWishBadge();
  renderWishlist();
}

// ── BROWSE ────────────────────────────────────────────────────────────────────
// Keep the "Allow 18+" chip in sync with the effective browse-NSFW state. On =
// adult titles shown (i.e. hiding is OFF). Callable from anywhere the state changes.
function syncAllowNsfwChip() {
  const btn = document.getElementById('allow-nsfw');
  if (btn) btn.classList.toggle('on', !browseNsfwOn);
}

function initBrowse() {
  const browseSearch    = document.getElementById('browse-search');
  const browseSearchBtn = document.getElementById('browse-search-btn');

  // Sort chips
  document.querySelectorAll('.bchip[data-sort]').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.bchip[data-sort]').forEach(c => c.classList.remove('on'));
      chip.classList.add('on');
      browseSort = chip.dataset.sort;
      if (browseIsSearch && browseSearch.value.trim()) {
        runBrowseSearch();          // re-run active search with the new sort
      } else {
        browseSearch.value = '';
        browseIsSearch = false;
        resetBrowse(); loadBrowse();
      }
    });
  });

  // NSFW filter: init from settings (chip removed; now controlled via Settings)
  browseNsfwOn = settings.browseNsfwFilter ?? true;

  // Year decade chips
  document.querySelectorAll('.decade-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const isActive = chip.classList.contains('on');
      document.querySelectorAll('.decade-chip').forEach(c => c.classList.remove('on'));
      if (!isActive) {
        chip.classList.add('on');
        browseYearFrom = parseInt(chip.dataset.from);
        browseYearTo   = parseInt(chip.dataset.to);
      } else {
        browseYearFrom = null; browseYearTo = null;
      }
      const fromEl = document.getElementById('year-from');
      const toEl   = document.getElementById('year-to');
      if (fromEl) fromEl.value = browseYearFrom || '';
      if (toEl)   toEl.value   = browseYearTo   || '';
      reapplyBrowse();
    });
  });

  // Year inputs
  document.getElementById('year-from')?.addEventListener('change', e => {
    browseYearFrom = e.target.value ? parseInt(e.target.value) : null;
    document.querySelectorAll('.decade-chip').forEach(c => c.classList.remove('on'));
    reapplyBrowse();
  });
  document.getElementById('year-to')?.addEventListener('change', e => {
    browseYearTo = e.target.value ? parseInt(e.target.value) : null;
    document.querySelectorAll('.decade-chip').forEach(c => c.classList.remove('on'));
    reapplyBrowse();
  });

  // Clear year
  document.getElementById('year-clear')?.addEventListener('click', () => {
    browseYearFrom = null; browseYearTo = null;
    document.querySelectorAll('.decade-chip').forEach(c => c.classList.remove('on'));
    const fromEl = document.getElementById('year-from');
    const toEl   = document.getElementById('year-to');
    if (fromEl) fromEl.value = '';
    if (toEl)   toEl.value   = '';
    reapplyBrowse();
  });

  // ── Rating / length / developer / tag filters ──────────────────────────────
  // Rating: type a number (7 or 7.5) on the 0–10 scale → VNDB's 10–100 internally.
  document.getElementById('rating-min')?.addEventListener('change', e => {
    const v = parseFloat(e.target.value);
    if (isNaN(v) || v <= 0) { browseRatingMin = null; e.target.value = ''; }
    else {
      const clamped = Math.min(10, Math.max(0, Math.round(v * 10) / 10));
      browseRatingMin = Math.round(clamped * 10);
      e.target.value = String(clamped);
    }
    reapplyBrowse();
  });
  document.querySelectorAll('.length-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const was = chip.classList.contains('on');
      document.querySelectorAll('.length-chip').forEach(c => c.classList.remove('on'));
      if (!was) { chip.classList.add('on'); browseLength = parseInt(chip.dataset.length); }
      else browseLength = null;
      reapplyBrowse();
    });
  });
  // Developer: resolve the typed name to a specific VNDB producer id (like Tag),
  // so "key" matches the studio Key, not every studio with "key" in its name.
  document.getElementById('filter-dev')?.addEventListener('change', async e => {
    const name = e.target.value.trim();
    if (!name) { browseDevId = null; reapplyBrowse(); return; }
    const dev = await window.api.vndbProducerSearch(name).catch(() => null);
    browseDevId = dev ? dev.id : null;
    if (dev && dev.name) e.target.value = dev.name; // snap to the matched studio
    if (!dev) showBrowseStatus(`No studio matching “${name}”.`);
    reapplyBrowse();
  });
  // Tag: type a tag name + Enter to add it as a filter chip. Multiple tags AND
  // together (a title must carry all of them). Each resolves to a VNDB tag id.
  const tagInput = document.getElementById('filter-tag');
  const addBrowseTag = async () => {
    const name = tagInput.value.trim();
    if (!name) return;
    tagInput.disabled = true;
    const tag = await window.api.vndbTagSearch(name).catch(() => null);
    tagInput.disabled = false;
    tagInput.focus();
    if (!tag) { showBrowseStatus(`No tag matching “${name}”.`); return; }
    if (browseTagIds.some(t => t.id === tag.id)) { tagInput.value = ''; return; }
    browseTagIds.push({ id: tag.id, name: tag.name });
    tagInput.value = '';
    renderBrowseTags();
    reapplyBrowse();
  };
  tagInput?.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); addBrowseTag(); } });
  renderBrowseTags();
  document.getElementById('filter-clear')?.addEventListener('click', () => {
    browseRatingMin = null; browseLength = null; browseDevId = null; browseTagIds = [];
    browseYearFrom = null; browseYearTo = null;
    document.querySelectorAll('.length-chip, .decade-chip').forEach(c => c.classList.remove('on'));
    ['filter-dev', 'filter-tag', 'year-from', 'year-to', 'rating-min'].forEach(id => {
      const el = document.getElementById(id); if (el) el.value = '';
    });
    renderBrowseTags();
    reapplyBrowse();
  });

  // "Allow 18+" — inline shortcut for the "Hide 18+ in Browse" setting. Active (on)
  // means adult titles are shown. Kept in sync with settings.browseNsfwFilter.
  const allowNsfwBtn = document.getElementById('allow-nsfw');
  syncAllowNsfwChip();
  allowNsfwBtn?.addEventListener('click', async () => {
    browseNsfwOn = !browseNsfwOn;
    await setSetting('browseNsfwFilter', browseNsfwOn);
    syncAllowNsfwChip();
    renderBrowseGrid(browseVns); // re-filter the already-loaded results instantly
  });

  // Collapsible filter drawer — keeps Browse uncluttered; filters live behind it.
  document.getElementById('filters-toggle')?.addEventListener('click', function () {
    const drawer = document.getElementById('filter-drawer');
    if (!drawer) return;
    drawer.classList.toggle('hidden');
    this.classList.toggle('on', !drawer.classList.contains('hidden'));
  });

  // Search
  browseSearchBtn.addEventListener('click', runBrowseSearch);
  browseSearch.addEventListener('keydown', e => { if (e.key === 'Enter') runBrowseSearch(); });

  // Infinite scroll: the observer kicks off browseFill(), which then loads pages
  // until the sentinel is pushed out of view (handles both tall and short content).
  const sentinel = document.getElementById('browse-sentinel');
  if (sentinel) {
    const scroller = document.querySelector('.browse-wrap');
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) browseFill();
    }, { root: scroller || null, threshold: 0 });
    obs.observe(sentinel);
  }
}

function resetBrowse() {
  browsePage = 1; browseMore = true; browseVns = []; browseRatedPool = [];
  document.getElementById('browse-grid').innerHTML = '';
  document.getElementById('browse-status').classList.add('hidden');
}

function showBrowseStatus(text) {
  const grid   = document.getElementById('browse-grid');
  const status = document.getElementById('browse-status');
  if (!browseVns.length) grid.innerHTML = '';
  status.querySelector('p').textContent = text;
  status.classList.remove('hidden');
}

// Keep loading pages until the sentinel is pushed below the visible scroll area.
// Needed because IntersectionObserver only fires on in/out-of-view CHANGES: with
// small cards (many per row) the first page is short, the sentinel stays in view,
// and the observer never re-fires — so nothing more loads on scroll.
let browseFilling = false;
async function browseFill() {
  if (browseFilling) return;
  browseFilling = true;
  try {
    const sentinel = document.getElementById('browse-sentinel');
    const scroller = document.querySelector('.browse-wrap');
    if (!sentinel) return;
    while (browseMore && !browseIsSearch && !browseLoading) {
      const top    = sentinel.getBoundingClientRect().top;
      const bottom = scroller ? scroller.getBoundingClientRect().bottom : window.innerHeight;
      if (top > bottom + 300) break; // sentinel comfortably below the view → stop
      await loadBrowse(true);
    }
  } finally { browseFilling = false; }
}

async function loadBrowse(append = false) {
  if (browseLoading) return;
  browseLoading = true;
  if (!append) showBrowseStatus('Loading…');
  try {
    // "Top Rated" = IMDb-style weighted ranking. Fetch the re-ranked pool once,
    // then paginate locally (30 at a time) as the user scrolls.
    if (browseSort === 'rating') {
      if (!append) {
        const data = await window.api.vndbTopRated(currentFilterOpts());
        browseRatedPool = data.results || [];
        browseVns = [];
      }
      document.getElementById('browse-status').classList.add('hidden');
      const chunk = browseRatedPool.slice(browseVns.length, browseVns.length + 30);
      browseVns = [...browseVns, ...chunk];
      browseMore = browseVns.length < browseRatedPool.length;
      renderBrowseGrid(browseVns);
      if (!browseRatedPool.length && !append) showBrowseStatus('Nothing to show.');
      if (!append) setTimeout(browseFill, 0); // top up if the page didn't fill the view
      return;
    }

    const opts = { page: browsePage, ...currentFilterOpts() };
    const data = await window.api.vndbBrowse(browseSort, opts);
    document.getElementById('browse-status').classList.add('hidden');
    const results = data.results || [];
    if (results.length < 30) browseMore = false;
    browseVns = append ? [...browseVns, ...results] : results;
    browsePage++;
    renderBrowseGrid(browseVns);
    if (!results.length && !append) showBrowseStatus('Nothing to show.');
    if (!append) setTimeout(browseFill, 0); // top up if the page didn't fill the view
  } catch (err) {
    showBrowseStatus('Error: ' + err.message);
  } finally {
    browseLoading = false;
  }
}

async function runBrowseSearch() {
  const q = document.getElementById('browse-search').value.trim();
  if (!q) { browseIsSearch = false; resetBrowse(); loadBrowse(); return; }
  browseIsSearch = true;
  resetBrowse();
  showBrowseStatus('Searching…');
  try {
    // Title search drops the vote floor (minVotes:0): the user typed a specific
    // title, so surface it even if niche — and this skips the heavy vote-floor +
    // 40-studio OR query that VNDB rate-limits (429), which was stalling search.
    const data = await window.api.vndbSearch(q, browseSort, { ...currentFilterOpts(), minVotes: 0 });
    document.getElementById('browse-status').classList.add('hidden');
    browseVns = data.results || [];
    renderBrowseGrid(browseVns);
    if (!browseVns.length) showBrowseStatus('No results found.');
  } catch (err) {
    showBrowseStatus('Error: ' + err.message);
  }
}

// Lowercased set of tag names the user has chosen to auto-hide from discovery.
function hiddenTagSet() {
  return new Set((settings.hiddenTags || []).map(t => (t.name || '').toLowerCase()));
}
// True if a VN carries any blocked tag (so it should be hidden from Browse/Search).
function hasHiddenTag(vn, set = hiddenTagSet()) {
  if (!set.size) return false;
  return (vn.tags || []).some(t => set.has((t.name || '').toLowerCase()));
}

function renderBrowseGrid(vns) {
  // When the browse 18+ filter is on, hide adult titles from BOTH browse lists
  // and search results. Also drop anything the user explicitly hid, plus anything
  // carrying a user-blocked tag.
  const tagSet = hiddenTagSet();
  let display = vns.filter(vn => !entryById(vn.id)?.hidden && !hasHiddenTag(vn, tagSet));
  if (browseNsfwOn) display = display.filter(vn => !isNsfw(vn));

  const grid = document.getElementById('browse-grid');
  grid.innerHTML = display.map(vn => {
    const url    = imgUrl(vn.image);
    const rating = ratingStr(vn.rating);
    const entry  = entryById(vn.id);
    const inLib  = !!(entry?.library && !entry?.excluded);
    const inWish = !!entry?.wishlist;
    const nsfw   = isNsfw(vn);
    const yr     = vn.released ? vn.released.slice(0, 4) : '';
    const len    = formatLength(vn);

    return `<div class="browse-item" data-id="${escHtml(vn.id)}">
      <div class="bi-poster">
        ${makePoster(url, 12, nsfw, settings.nsfwBlurBrowse)}
        ${inLib  ? `<span class="cover-badge lib">in library</span>` : ''}
        ${!inLib && inWish ? `<span class="cover-badge wish">wishlisted</span>` : ''}
        <div class="bi-overlay">
          ${!inLib
            ? `<div class="btn-sm pri bi-addlib" data-id="${escHtml(vn.id)}">${icon('plus', 13)} Add to library</div>`
            : `<div class="btn-sm sec" style="opacity:0.8;pointer-events:none">${icon('check', 13)} In library</div>`}
          <div class="btn-sm sec bi-wish" data-id="${escHtml(vn.id)}"
            style="${inWish ? 'color:var(--coral-deep)' : ''}">
            ${icon('heart', 13)} ${inWish ? 'Wishlisted' : 'Wishlist'}
          </div>
        </div>
      </div>
      <div class="bi-t">${escHtml(displayTitle(vn))}</div>
      <div class="bi-m">
        ${rating ? `<span class="bi-score">★ ${rating}</span>` : ''}
        ${rating && yr ? `<span>·</span>` : ''}
        ${yr ? `<span>${escHtml(yr)}</span>` : ''}
        ${len ? `<span class="card-len">${escHtml(len)}</span>` : ''}
      </div>
    </div>`;
  }).join('');

  // click card → open modal (overlay is pointer-events:none; buttons stopPropagation)
  grid.querySelectorAll('.browse-item').forEach(el => {
    el.addEventListener('click', () => {
      const vn = vns.find(v => v.id === el.dataset.id);
      if (vn) openModal({ ...metaOf(vn), ...(entryById(vn.id) || {}) });
    });
  });

  grid.querySelectorAll('.bi-addlib').forEach(el => {
    el.addEventListener('click', async e => {
      e.stopPropagation();
      const vn = vns.find(v => v.id === el.dataset.id);
      if (!vn) return;
      await window.api.addToList(metaOf(vn), 'library');
      await loadEntries();
    });
  });

  grid.querySelectorAll('.bi-wish').forEach(el => {
    el.addEventListener('click', async e => {
      e.stopPropagation();
      const vn = vns.find(v => v.id === el.dataset.id);
      if (!vn) return;
      const entry = entryById(vn.id);
      if (entry?.wishlist) await window.api.removeFromList(vn.id, 'wishlist');
      else await window.api.addToList(metaOf(vn), 'wishlist');
      await loadEntries();
    });
  });
}

// ── WISHLIST ──────────────────────────────────────────────────────────────────
function renderWishlist() {
  const isPrivate = wishView === 'private';
  const flag = isPrivate ? 'wishlistPrivate' : 'wishlist';
  let items = entries.filter(e => e[flag]).sort(byNewest);
  // Don't NSFW-hide the Private list — that's exactly where private/18+ titles live.
  if (!isPrivate && settings.nsfwHideLibrary) items = items.filter(e => !isNsfw(e));
  const savedTotal = items.length;
  if (wishSearch.trim()) {
    const q = wishSearch.toLowerCase();
    items = items.filter(e => (e.title || '').toLowerCase().includes(q));
  }

  const countEl   = document.getElementById('wish-count');
  const grid      = document.getElementById('wishlist-grid');
  const empty     = document.getElementById('wishlist-empty');
  const alertsEl  = document.getElementById('wish-alerts');

  // Alerts strip (release alerts apply to the public wishlist only)
  if (alertsEl) {
    if (!isPrivate && wishlistAlerts.length) {
      alertsEl.classList.remove('hidden');
      alertsEl.innerHTML = `
        <div class="wish-alert-head">
          <div>
            <div class="wish-alert-title">New English releases on your wishlist</div>
            <div class="wish-alert-sub">${wishlistAlerts.length} title${wishlistAlerts.length !== 1 ? 's' : ''} got a new English release</div>
          </div>
          <span class="wish-alert-dismiss" id="wish-alert-dismiss">Dismiss all</span>
        </div>
        <div class="wish-alert-list">
          ${wishlistAlerts.map(a => `
            <div class="wish-alert-item" data-id="${escHtml(a.vnId)}">
              <div class="wish-alert-vn">${escHtml(a.vnTitle)}</div>
              <div>
                ${a.releases.map(r => `
                  <div class="wish-alert-rel">${escHtml(r.patch ? 'Patch' : 'Release')}: ${escHtml(r.title)} ${r.released ? `· ${escHtml(r.released)}` : ''}</div>
                `).join('')}
              </div>
              ${a.releases.length ? `<span class="wish-alert-badge">NEW</span>` : ''}
            </div>`).join('')}
        </div>`;
      document.getElementById('wish-alert-dismiss')?.addEventListener('click', dismissWishlistAlerts);
      alertsEl.querySelectorAll('.wish-alert-item[data-id]').forEach(el => {
        el.addEventListener('click', () => {
          const e = entryById(el.dataset.id);
          if (e) openModal(e);
        });
      });
    } else {
      alertsEl.classList.add('hidden');
      alertsEl.innerHTML = '';
    }
  }

  if (countEl) countEl.textContent = wishSearch.trim()
    ? `${items.length} of ${savedTotal}`
    : `${savedTotal} title${savedTotal !== 1 ? 's' : ''} saved`;

  if (items.length === 0) {
    grid.innerHTML = '';
    empty.classList.remove('hidden');
    const et = empty.querySelector('.em-title');
    const es = empty.querySelector('.em-sub');
    if (savedTotal > 0 && wishSearch.trim()) {
      if (et) et.textContent = `No results for "${wishSearch}"`;
      if (es) es.innerHTML = 'Try a different search term.';
    } else {
      if (et) et.textContent = isPrivate ? 'Your private wishlist is empty' : 'Nothing on your wishlist';
      if (es) es.innerHTML = isPrivate
        ? 'Open any title and use the lock button<br />to add it here, privately.'
        : 'Browse VNDB and hover a cover<br />to wishlist titles for later.';
    }
    return;
  }
  empty.classList.add('hidden');

  grid.innerHTML = items.map(e => {
    const url    = imgUrl(e.image);
    const rating = ratingStr(e.rating);
    const inLib  = !!(e.library && !e.excluded);
    const nsfw   = isNsfw(e);
    const len    = formatLength(e);
    const yr     = e.released ? e.released.slice(0, 4) : '';

    return `<div class="wish-item" data-id="${escHtml(e.id)}">
      <div class="wi-poster">
        ${makePoster(url, 12, nsfw, settings.nsfwBlurLibrary)}
        ${inLib ? `<span class="cover-badge lib">in library</span>` : ''}
        <div class="wi-overlay">
          ${!inLib
            ? `<div class="btn-sm pri wi-addlib" data-id="${escHtml(e.id)}">${icon('plus', 13)} Add to library</div>`
            : `<div class="btn-sm sec" style="opacity:0.8;pointer-events:none">${icon('check', 13)} In library</div>`}
          <div class="btn-sm sec wi-remove" data-id="${escHtml(e.id)}">${icon('trash', 13)} Remove</div>
        </div>
      </div>
      <div class="wi-t">${escHtml(e.title)}</div>
      <div class="wi-m">
        ${rating ? `<span class="bi-score">★ ${escHtml(rating)}</span>` : ''}
        ${rating && yr ? `<span>·</span>` : ''}
        ${yr ? `<span>${escHtml(yr)}</span>` : ''}
        ${len ? `<span class="card-len">${escHtml(len)}</span>` : ''}
      </div>
    </div>`;
  }).join('');

  // click card → open modal (overlay is pointer-events:none; buttons stopPropagation)
  grid.querySelectorAll('.wish-item').forEach(el => {
    el.addEventListener('click', () => {
      const entry = entryById(el.dataset.id);
      if (entry) openModal(entry);
    });
  });

  grid.querySelectorAll('.wi-addlib').forEach(el => {
    el.addEventListener('click', async e => {
      e.stopPropagation();
      const entry = entryById(el.dataset.id);
      if (entry) { await window.api.addToList(metaOf(entry), 'library'); await loadEntries(); renderWishlist(); }
    });
  });

  grid.querySelectorAll('.wi-remove').forEach(el => {
    el.addEventListener('click', async e => {
      e.stopPropagation();
      await window.api.removeFromList(el.dataset.id, flag);
      await loadEntries(); renderWishlist();
    });
  });
}

// ── SETTINGS ──────────────────────────────────────────────────────────────────
function renderSettings() { renderSettingsSection(settingsSection); }

async function renderSettingsSection(section) {
  const content = document.getElementById('settings-content');
  if (!content) return;

  if (section === 'Appearance') {
    const zoom = settings.zoom || 100;
    content.innerHTML = `
      <div class="settings-section">
        <div class="settings-h">Appearance</div>

        <div class="settings-row">
          <div><div class="settings-label">Theme</div><div class="settings-sub">Light, dark, or automatic by time of day</div></div>
          <div class="settings-toggle">
            <div class="stog-btn ${themeMode === 'light' ? 'on' : ''}" id="stog-light">Light</div>
            <div class="stog-btn ${themeMode === 'dark'  ? 'on' : ''}" id="stog-dark">Dark</div>
            <div class="stog-btn ${themeMode === 'auto'  ? 'on' : ''}" id="stog-auto">Auto</div>
          </div>
        </div>

        ${themeMode === 'auto' ? `
        <div class="settings-row">
          <div><div class="settings-label">Auto schedule</div><div class="settings-sub">Light mode between these times — dark the rest of the day</div></div>
          <div class="auto-time-row">
            <label class="auto-time">Light from<input type="time" id="auto-light" value="${autoLight}"></label>
            <label class="auto-time">Dark from<input type="time" id="auto-dark" value="${autoDark}"></label>
          </div>
        </div>` : ''}

        <div class="settings-row">
          <div><div class="settings-label">Color palette</div><div class="settings-sub">Background tint and accent color</div></div>
          <div class="accent-swatches">
            ${PALETTES.map(p => `<div class="accent-swatch${palette === p.k ? ' on' : ''}" data-palette="${p.k}" style="background:${p.color}" title="${p.k}"></div>`).join('')}
          </div>
        </div>

        <div class="settings-row">
          <div><div class="settings-label">Title language</div><div class="settings-sub">English when available, romanized (romaji), or the original Japanese</div></div>
          <div class="settings-toggle">
            <div class="stog-btn ${(settings.titleLang || 'en') === 'en' ? 'on' : ''}" id="tlang-en">English</div>
            <div class="stog-btn ${settings.titleLang === 'romaji' ? 'on' : ''}" id="tlang-romaji">Romaji</div>
            <div class="stog-btn ${settings.titleLang === 'kanji' ? 'on' : ''}" id="tlang-kanji">Japanese</div>
          </div>
        </div>

        <div class="settings-row">
          <div><div class="settings-label">Card size</div><div class="settings-sub">Cover size in Library, Browse and Wishlist</div></div>
          <div class="settings-toggle">
            ${[['small', 'Small'], ['cozy', 'Cozy'], ['comfortable', 'Comfortable'], ['large', 'Large']].map(([k, label]) =>
              `<div class="stog-btn ${cardSizeKey() === k ? 'on' : ''}" data-cardsize="${k}">${label}</div>`).join('')}
          </div>
        </div>

        <div class="settings-row">
          <div><div class="settings-label">Browse controls</div><div class="settings-sub">Sort &amp; filters across the top, or in a compact sidebar that stays put as you scroll</div></div>
          <div class="settings-toggle">
            <div class="stog-btn ${(settings.browseLayout || 'top') === 'top' ? 'on' : ''}" data-browselayout="top">Top bar</div>
            <div class="stog-btn ${settings.browseLayout === 'side' ? 'on' : ''}" data-browselayout="side">Sidebar</div>
          </div>
        </div>

        <div class="settings-row">
          <div><div class="settings-label">Zoom</div><div class="settings-sub">Scale the entire interface</div></div>
          <div class="zoom-options">
            ${ZOOM_LEVELS.map(z => `<div class="zoom-btn${zoom === z ? ' on' : ''}" data-zoom="${z}">${z}%</div>`).join('')}
          </div>
        </div>
      </div>`;

    document.getElementById('stog-light').addEventListener('click', () => setThemeMode('light'));
    document.getElementById('stog-dark').addEventListener('click', () => setThemeMode('dark'));
    document.getElementById('stog-auto').addEventListener('click', () => setThemeMode('auto'));
    document.getElementById('auto-light')?.addEventListener('change', e => setAutoTimes(e.target.value, null));
    document.getElementById('auto-dark')?.addEventListener('change', e => setAutoTimes(null, e.target.value));
    content.querySelectorAll('.accent-swatch').forEach(el =>
      el.addEventListener('click', () => setPalette(el.dataset.palette)));
    document.getElementById('tlang-en')?.addEventListener('click', () => setTitleLang('en'));
    document.getElementById('tlang-romaji')?.addEventListener('click', () => setTitleLang('romaji'));
    document.getElementById('tlang-kanji')?.addEventListener('click', () => setTitleLang('kanji'));
    content.querySelectorAll('[data-cardsize]').forEach(el =>
      el.addEventListener('click', () => setCardSize(el.dataset.cardsize)));
    content.querySelectorAll('[data-browselayout]').forEach(el =>
      el.addEventListener('click', () => setBrowseLayout(el.dataset.browselayout)));
    content.querySelectorAll('.zoom-btn').forEach(el =>
      el.addEventListener('click', async () => {
        await setSetting('zoom', parseInt(el.dataset.zoom));
        applyZoom();
        renderSettingsSection('Appearance');
      }));

  } else if (section === 'NSFW') {
    content.innerHTML = `
      <div class="settings-section">
        <div class="settings-h">NSFW / 18+</div>

        <div class="settings-row">
          <div><div class="settings-label">Blur 18+ covers in Browse</div><div class="settings-sub">Blur adult-rated cover images in browse and search</div></div>
          <div class="toggle-switch ${settings.nsfwBlurBrowse ? 'on' : ''}" id="tog-blur-browse"></div>
        </div>

        <div class="settings-row">
          <div><div class="settings-label">Blur 18+ covers in your library</div><div class="settings-sub">Blur adult-rated cover images in Home, Library and Wishlist</div></div>
          <div class="toggle-switch ${settings.nsfwBlurLibrary ? 'on' : ''}" id="tog-blur-lib"></div>
        </div>

        <div class="settings-row">
          <div><div class="settings-label">Hide 18+ in Browse</div><div class="settings-sub">Filter adult-rated titles out of browse lists and search results</div></div>
          <div class="toggle-switch ${(settings.browseNsfwFilter ?? true) ? 'on' : ''}" id="tog-browse-nsfw"></div>
        </div>

        <div class="settings-row">
          <div><div class="settings-label">Hide 18+ in your library</div><div class="settings-sub">Remove adult-rated titles from Home, Library and Wishlist</div></div>
          <div class="toggle-switch ${settings.nsfwHideLibrary ? 'on' : ''}" id="tog-nsfw-lib"></div>
        </div>

        <div class="settings-note">
          18+ detection uses VNDB sexual-content tags (≥ 2 strong tags), so titles with only mild or optional content aren't flagged.
        </div>
      </div>`;

    document.getElementById('tog-blur-browse').addEventListener('click', async function() {
      this.classList.toggle('on');
      await setSetting('nsfwBlurBrowse', this.classList.contains('on'));
      renderBrowseGrid(browseVns);
    });
    document.getElementById('tog-blur-lib').addEventListener('click', async function() {
      this.classList.toggle('on');
      await setSetting('nsfwBlurLibrary', this.classList.contains('on'));
      renderHome(); renderLibrary(); renderWishlist();
    });
    document.getElementById('tog-browse-nsfw').addEventListener('click', async function() {
      this.classList.toggle('on');
      browseNsfwOn = this.classList.contains('on');
      await setSetting('browseNsfwFilter', browseNsfwOn);
      syncAllowNsfwChip(); // keep the Browse "Allow 18+" chip in agreement
      if (!browseIsSearch) { resetBrowse(); loadBrowse(); }
      else renderBrowseGrid(browseVns);
    });
    document.getElementById('tog-nsfw-lib').addEventListener('click', async function() {
      this.classList.toggle('on');
      await setSetting('nsfwHideLibrary', this.classList.contains('on'));
      renderHome(); renderLibrary(); renderWishlist();
    });

  } else if (section === 'Library') {
    const s = await window.api.getSettings().catch(() => ({}));
    const scanDirs = (Array.isArray(s.scanDirs) && s.scanDirs.length) ? s.scanDirs : (s.scanDir ? [s.scanDir] : []);
    content.innerHTML = `
      <div class="settings-section">
        <div class="settings-h">Library</div>

        <div class="settings-row">
          <div><div class="settings-label">Library view</div><div class="settings-sub">Show your shelf as a grid of covers or a detailed list</div></div>
          <div class="settings-toggle">
            <div class="stog-btn ${(settings.libView || 'grid') === 'grid' ? 'on' : ''}" data-set-libview="grid">Grid</div>
            <div class="stog-btn ${settings.libView === 'list' ? 'on' : ''}" data-set-libview="list">List</div>
          </div>
        </div>


        <div class="settings-row">
          <div>
            <div class="settings-label">Show excluded entries</div>
            <div class="settings-sub">Reveal entries you've excluded from the library view</div>
          </div>
          <div class="toggle-switch ${settings.showExcluded ? 'on' : ''}" id="tog-excluded"></div>
        </div>

        <div class="settings-row">
          <div style="flex:1;min-width:0">
            <div class="settings-label">Scan directories</div>
            <div class="settings-sub">Folders scanned for VN executables — add as many as you like</div>
            <div id="scan-dirs-list" style="margin-top:12px;display:flex;flex-direction:column;gap:8px">
              ${scanDirs.length
                ? scanDirs.map(d => `
                  <div class="scan-dir-item">
                    <div class="settings-path">${escHtml(d)}</div>
                    <div class="btn-sm sec scan-dir-remove" data-dir="${escHtml(d)}">${icon('x', 12)} Remove</div>
                  </div>`).join('')
                : `<div class="settings-sub">No directories added yet.</div>`}
            </div>
            <div class="btn-sm sec" id="add-dir-btn" style="margin-top:12px">${icon('plus', 12)} Add directory</div>
          </div>
        </div>

        <div class="settings-row">
          <div>
            <div class="settings-label">Scan for games</div>
            <div class="settings-sub" id="scan-desc">Detect VN executables across all directories and match them to VNDB entries.</div>
          </div>
          <div class="btn-sm pri" id="settings-scan-btn">${icon('scan', 13)} Scan now</div>
        </div>
      </div>`;

    content.querySelectorAll('[data-set-libview]').forEach(el =>
      el.addEventListener('click', async () => {
        await setLibView(el.dataset.setLibview);
        renderSettingsSection('Library');
      }));
    document.getElementById('tog-excluded').addEventListener('click', async function() {
      this.classList.toggle('on');
      await setSetting('showExcluded', this.classList.contains('on'));
      renderLibrary();
    });
    document.getElementById('add-dir-btn').addEventListener('click', async () => {
      await window.api.addScanDir();
      renderSettingsSection('Library');
    });
    content.querySelectorAll('.scan-dir-remove').forEach(el =>
      el.addEventListener('click', async () => {
        await window.api.removeScanDir(el.dataset.dir);
        renderSettingsSection('Library');
      }));
    document.getElementById('settings-scan-btn').addEventListener('click', runScan);

  } else if (section === 'About') {
    const [version, installPath, dataPath] = await Promise.all([
      window.api.getVersion().catch(() => '?'),
      window.api.getInstallPath().catch(() => null),
      window.api.getDataPath().catch(() => null),
    ]);
    content.innerHTML = `
      <div class="settings-section">
        <div class="settings-h">About</div>
        <div class="settings-row">
          <div><div class="settings-label">Version</div><div class="settings-sub update-status" id="update-status-line"></div></div>
          <div style="display:flex;gap:8px;align-items:center">
            <span style="font-family:'Space Mono',monospace;font-size:13px;font-weight:700;color:var(--ink)">v${escHtml(String(version))}</span>
            <button class="btn-sm sec" id="btn-restart-update" style="display:none">Restart &amp; install</button>
            <button class="btn-sm pri" id="btn-check-update">Check for updates</button>
          </div>
        </div>
        ${installPath ? `<div class="settings-row">
          <div><div class="settings-label">Install location</div></div>
          <div style="display:flex;align-items:center;gap:10px;min-width:0">
            <span style="font-family:'Space Mono',monospace;font-size:11px;color:var(--mut);word-break:break-all">${escHtml(installPath)}</span>
            <div class="btn-sm sec data-open" data-path="${escHtml(installPath)}" style="flex-shrink:0">${icon('folder', 12)} Open</div>
          </div>
        </div>` : ''}
        ${dataPath ? `<div class="settings-row">
          <div><div class="settings-label">Data location</div></div>
          <div style="display:flex;align-items:center;gap:10px;min-width:0">
            <span style="font-family:'Space Mono',monospace;font-size:11px;color:var(--mut);word-break:break-all">${escHtml(dataPath)}</span>
            <div class="btn-sm sec data-open" data-path="${escHtml(dataPath)}" style="flex-shrink:0">${icon('folder', 12)} Open</div>
          </div>
        </div>` : ''}
        <div class="settings-row">
          <div><div class="settings-label">Built with</div></div>
          <div style="font-family:'Space Mono',monospace;font-size:11px;color:var(--mut)">Electron · VNDB API · JSON</div>
        </div>
        <div class="settings-row">
          <div><div class="settings-label">Releases</div><div class="settings-sub">Download builds &amp; changelog</div></div>
          <div class="about-link" data-url="https://github.com/snxwss/tsundoku-releases/releases" style="font-family:'Space Mono',monospace;font-size:11.5px;font-weight:700;color:var(--accent-deep);cursor:pointer" title="Open in browser">github.com/snxwss/tsundoku-releases</div>
        </div>
        <div class="settings-row">
          <div><div class="settings-label">VNDB</div><div class="settings-sub">All metadata sourced from vndb.org</div></div>
          <div class="about-link" data-url="https://vndb.org" style="font-family:'Space Mono',monospace;font-size:11.5px;font-weight:700;color:var(--accent-deep);cursor:pointer" title="Open in browser">vndb.org</div>
        </div>
        <div class="settings-row" id="uninstall-row">
          <div><div class="settings-label" style="color:var(--coral-deep)">Uninstall Tsundoku</div><div class="settings-sub">Remove Tsundoku from this PC. Your library data (shown above) is kept.</div></div>
          <div id="uninstall-ctrl"><div class="btn-sm sec" id="btn-uninstall" style="color:var(--coral-deep);border-color:var(--coral-deep)">Uninstall</div></div>
        </div>
      </div>`;
    const checkBtn = document.getElementById('btn-check-update');
    if (checkBtn) checkBtn.addEventListener('click', async () => {
      try { await window.api.checkForUpdates(); } catch {}
      paintUpdateStatus();
    });
    const restartBtn = document.getElementById('btn-restart-update');
    if (restartBtn) restartBtn.addEventListener('click', () => window.api.quitAndInstall());
    paintUpdateStatus();

    content.querySelectorAll('.data-open').forEach(el =>
      el.addEventListener('click', () => window.api.openPath(el.dataset.path)));
    content.querySelectorAll('.about-link[data-url]').forEach(el =>
      el.addEventListener('click', () => window.api.openExternal(el.dataset.url)));

    document.getElementById('btn-uninstall')?.addEventListener('click', () => {
      let deleteData = false;
      const ctrl = document.getElementById('uninstall-ctrl');
      ctrl.innerHTML = `
        <div style="display:flex;flex-direction:column;align-items:flex-end;gap:6px">
          <span style="font-size:11px;color:var(--coral-deep);font-weight:600">Are you sure?</span>
          <div style="display:flex;gap:6px">
            <div class="btn-sm sec" id="uninst-cancel">Cancel</div>
            <div class="btn-sm sec" id="uninst-confirm1" style="color:var(--coral-deep);border-color:var(--coral-deep)">Yes, uninstall</div>
          </div>
          <label style="display:flex;align-items:center;gap:6px;font-size:11px;color:var(--mut);cursor:pointer;-webkit-app-region:no-drag">
            <input type="checkbox" id="uninst-deldata" style="cursor:pointer" /> Also delete my library data
          </label>
        </div>`;
      document.getElementById('uninst-deldata').addEventListener('change', e => { deleteData = e.target.checked; });
      document.getElementById('uninst-cancel').addEventListener('click', () => renderSettingsSection('About'));
      document.getElementById('uninst-confirm1').addEventListener('click', () => {
        const warn = deleteData
          ? 'Really? This deletes the app AND your library data permanently.'
          : 'Really? This will delete all app files.';
        ctrl.innerHTML = `
          <div style="display:flex;flex-direction:column;align-items:flex-end;gap:6px">
            <span style="font-size:11px;color:var(--coral-deep);font-weight:600">${warn}</span>
            <div style="display:flex;gap:6px">
              <div class="btn-sm sec" id="uninst-cancel2">Cancel</div>
              <div class="btn-sm sec" id="uninst-confirm2" style="color:var(--coral-deep);border-color:var(--coral-deep)">Yes, remove it</div>
            </div>
          </div>`;
        document.getElementById('uninst-cancel2').addEventListener('click', () => renderSettingsSection('About'));
        document.getElementById('uninst-confirm2').addEventListener('click', () => window.api.uninstallApp(deleteData));
      });
    });

  } else if (section === 'Hidden') {
    const hiddenItems = entries.filter(e => e.hidden);
    const blockedTags = settings.hiddenTags || [];
    content.innerHTML = `
      <div class="settings-section">
        <div class="settings-h">Hidden from browse</div>

        <div class="settings-label">Blocked tags</div>
        <div class="settings-sub" style="margin:4px 0 12px">Auto-hide any title carrying a tag you block — applies across Browse &amp; Search.</div>
        <div class="hidden-tag-row">
          <input class="filter-input" id="hide-tag-input" type="text" placeholder="e.g. NTR, rape, pregnancy…" style="flex:1" />
          <div class="btn-sm pri" id="hide-tag-add">${icon('plus', 12)} Block tag</div>
        </div>
        <div class="settings-sub" id="hide-tag-status" style="margin-top:8px;min-height:14px"></div>
        <div class="hidden-tag-list" id="hidden-tag-list">
          ${blockedTags.length
            ? blockedTags.map(t => `<span class="hidden-tag-chip">${escHtml(t.name)}<span class="htc-x" data-id="${escHtml(t.id)}" title="Remove">✕</span></span>`).join('')
            : `<span class="settings-sub">No blocked tags yet.</span>`}
        </div>

        <div class="settings-label" style="margin-top:30px">Hidden titles</div>
        <div class="settings-sub" style="margin:4px 0 16px">Individual titles you hid from a detail page. Unhide to let one appear again.</div>
        ${hiddenItems.length
          ? `<div class="hidden-list">${hiddenItems.map(e => `
              <div class="hidden-item">
                <img class="hidden-thumb" src="${escHtml(imgUrl(e.image) || '')}" alt="" />
                <div class="hidden-meta">
                  <div class="hidden-title">${escHtml(e.title)}</div>
                  <div class="settings-sub">${escHtml([e.developer, e.released ? e.released.slice(0, 4) : null].filter(Boolean).join(' · '))}</div>
                </div>
                <div class="btn-sm sec hidden-unhide" data-id="${escHtml(e.id)}">↩ Unhide</div>
              </div>`).join('')}</div>`
          : `<div class="settings-sub">Nothing hidden individually. Use “Hide from browse” on a title’s detail page.</div>`}
      </div>`;

    content.querySelectorAll('.hidden-unhide').forEach(el =>
      el.addEventListener('click', async () => {
        await window.api.unhideEntry(el.dataset.id);
        await loadEntries();
        renderSettingsSection('Hidden');
      }));

    // ── Blocked-tag rules ──
    // Re-filtering the cached results applies the new rule instantly; switchView
    // also re-filters on the next Browse open, so no refetch is needed.
    const refreshBrowseForTags = () => {
      if (activeView === 'browse') renderBrowseGrid(browseVns);
    };
    const addBlockedTag = async () => {
      const input    = document.getElementById('hide-tag-input');
      const statusEl = document.getElementById('hide-tag-status');
      const name = input.value.trim();
      if (!name) return;
      statusEl.textContent = 'Looking up tag…';
      const tag = await window.api.vndbTagSearch(name).catch(() => null);
      if (!tag) { statusEl.textContent = `No VNDB tag matching “${name}”.`; return; }
      const list = settings.hiddenTags || [];
      if (list.some(t => t.id === tag.id)) { statusEl.textContent = `“${tag.name}” is already blocked.`; input.value = ''; return; }
      list.push({ id: tag.id, name: tag.name });
      settings.hiddenTags = list;
      await window.api.writeSetting('hiddenTags', list);
      refreshBrowseForTags();
      renderSettingsSection('Hidden');
    };
    document.getElementById('hide-tag-add')?.addEventListener('click', addBlockedTag);
    document.getElementById('hide-tag-input')?.addEventListener('keydown', e => {
      if (e.key === 'Enter') addBlockedTag();
    });
    content.querySelectorAll('.htc-x').forEach(el =>
      el.addEventListener('click', async () => {
        settings.hiddenTags = (settings.hiddenTags || []).filter(t => t.id !== el.dataset.id);
        await window.api.writeSetting('hiddenTags', settings.hiddenTags);
        refreshBrowseForTags();
        renderSettingsSection('Hidden');
      }));

  } else if (section === 'System') {
    const s = await window.api.getSettings().catch(() => ({}));
    content.innerHTML = `
      <div class="settings-section">
        <div class="settings-h">System</div>

        <div class="settings-row">
          <div>
            <div class="settings-label">Minimize to tray on close</div>
            <div class="settings-sub">Keep Tsundoku running in the background when you close the window. Quit fully from the tray icon. Recommended so playtime keeps tracking while you read.</div>
          </div>
          <div class="toggle-switch ${s.minimizeOnClose !== false ? 'on' : ''}" id="tog-min-close"></div>
        </div>

        <div class="settings-row">
          <div>
            <div class="settings-label">Start with Windows (background)</div>
            <div class="settings-sub">Launch Tsundoku hidden in the tray at login, so it automatically tracks your reading time even for games started from Steam or the desktop.</div>
          </div>
          <div class="toggle-switch ${s.startWithWindows ? 'on' : ''}" id="tog-autostart"></div>
        </div>

        <div class="settings-row">
          <div>
            <div class="settings-label">Backup &amp; restore</div>
            <div class="settings-sub">Export your whole library — status, playtime, last played, ratings — plus your appearance &amp; preferences (theme, color palette, card size, zoom, NSFW toggles) to a file, or import one onto another PC. Install paths stay on this machine and are never imported, so titles you don't have here just show as “not on device” while keeping their history.</div>
          </div>
          <div style="display:flex;gap:8px;flex-shrink:0">
            <div class="btn-sm sec" id="btn-export">${icon('folder', 12)} Export</div>
            <div class="btn-sm pri" id="btn-import">${icon('plus', 12)} Import</div>
          </div>
        </div>
        <div class="settings-sub" id="backup-status" style="margin-top:8px;min-height:14px"></div>
      </div>`;

    document.getElementById('tog-min-close').addEventListener('click', async function() {
      this.classList.toggle('on');
      await setSetting('minimizeOnClose', this.classList.contains('on'));
    });
    document.getElementById('tog-autostart').addEventListener('click', async function() {
      this.classList.toggle('on');
      const on = this.classList.contains('on');
      settings.startWithWindows = on;
      await window.api.setAutoStart(on);
    });
    document.getElementById('btn-export')?.addEventListener('click', async () => {
      const st = document.getElementById('backup-status');
      st.textContent = 'Choose where to save…';
      const r = await window.api.exportData().catch(e => ({ ok: false, error: e.message }));
      if (r?.ok) st.textContent = `✓ Exported ${r.count} title${r.count !== 1 ? 's' : ''} → ${r.path}`;
      else if (r?.error) st.textContent = 'Export failed: ' + r.error;
      else st.textContent = '';
    });
    document.getElementById('btn-import')?.addEventListener('click', async () => {
      const st = document.getElementById('backup-status');
      st.textContent = 'Choose a backup file…';
      const r = await window.api.importData().catch(e => ({ ok: false, error: e.message }));
      if (r?.ok) {
        st.textContent = `✓ Imported — ${r.added} added, ${r.updated} updated${r.settingsApplied ? ', preferences restored' : ''}. Install paths unchanged.`;
        await loadEntries();
        if (r.settingsApplied) {
          // Pull the restored settings back in and re-apply appearance. Color prefs
          // are mirrored to localStorage (first-paint cache), so sync those too.
          settings = await window.api.getSettings().catch(() => settings);
          if (settings.themeMode) { themeMode = settings.themeMode; localStorage.setItem('tsund-theme-mode', themeMode); }
          if (settings.palette)   { palette   = settings.palette;   localStorage.setItem('tsund-palette', palette); }
          if (settings.autoLight) { autoLight = settings.autoLight; localStorage.setItem('tsund-auto-light', autoLight); }
          if (settings.autoDark)  { autoDark  = settings.autoDark;  localStorage.setItem('tsund-auto-dark', autoDark); }
          applyTheme(); applyCardSize(); applyZoom();
          renderSettingsSection('System');
        }
      } else if (r?.error) st.textContent = 'Import failed: ' + r.error;
      else st.textContent = '';
    });
  }
}

// Map the main-process update state to a one-line message for the About page.
function updateStatusText(s) {
  if (!s) return '';
  switch (s.state) {
    case 'unsupported': return 'Updates apply to the installed app only.';
    case 'checking':    return 'Checking for updates…';
    case 'available':   return `Update v${s.version || ''} found — downloading…`;
    case 'downloading': return `Downloading update… ${s.percent || 0}%`;
    case 'ready':       return `Update v${s.version || ''} downloaded — restart to install.`;
    case 'current':     return "You're on the latest version.";
    case 'error':       return s.error ? `Update check failed: ${s.error}` : 'Update check failed. Check your connection.';
    default:            return '';
  }
}

// Repaint the About update line + buttons (no-op if About isn't on screen).
function paintUpdateStatus() {
  const line = document.getElementById('update-status-line');
  if (!line) return;
  const s = updateStatusState;
  line.textContent = updateStatusText(s);
  line.classList.toggle('err', !!(s && s.state === 'error'));
  line.classList.toggle('ok',  !!(s && s.state === 'current'));
  const btn = document.getElementById('btn-check-update');
  if (btn) btn.disabled = !!(s && (s.state === 'checking' || s.state === 'downloading'));
  const restart = document.getElementById('btn-restart-update');
  if (restart) restart.style.display = (s && s.state === 'ready') ? '' : 'none';
}

// ── DETAIL MODAL ──────────────────────────────────────────────────────────────
async function openModal(item) {
  const token   = ++modalToken;
  const overlay = document.getElementById('modal-overlay');
  const left    = document.getElementById('modal-left');
  const right   = document.getElementById('modal-right');

  left.innerHTML  = `<div style="text-align:center;padding:40px 0;color:var(--mut);font-family:'Space Mono',monospace;font-size:12px">Loading…</div>`;
  right.innerHTML = '';
  overlay.classList.remove('hidden');

  let full = item;
  try {
    const data = await window.api.vndbGet(item.id);
    if (data.results && data.results.length) full = { ...item, ...data.results[0] };
  } catch (_) {}
  if (token !== modalToken) return;

  const entry      = entryById(full.id) || {};
  const inLib      = !!entry.library;
  const inWish     = !!entry.wishlist;
  const inWishPriv = !!entry.wishlistPrivate;
  const onDevice   = !!entry.exe_path;
  const isExcluded = !!entry.excluded;
  const isHidden   = !!entry.hidden;
  const isRunning  = runningVNIds.has(full.id);
  const url      = imgUrl(full.image);
  const rating   = ratingStr(full.rating);
  const released = full.released ? full.released.slice(0, 4) : '—';
  const lengthH  = full.length_minutes ? `${Math.round(full.length_minutes / 60)}h avg` : '—';
  const dev      = devName(full);
  const alttitle = full.alttitle || null;
  const tags     = (full.tags || []).slice(0, 20).map(t => `<span class="modal-tag">${escHtml(t.name || t)}</span>`).join('');
  // External links: VNDB page (always) + only English Wikipedia and
  // HowLongToBeat when present — one of each, no duplicates.
  const WANT_LINKS = ['enwiki', 'howlongtobeat'];
  const pickedLinks = {};
  for (const l of (full.extlinks || [])) {
    if (l && l.url && WANT_LINKS.includes(l.name) && !pickedLinks[l.name]) pickedLinks[l.name] = l;
  }
  const extLinks = [
    { label: 'VNDB', url: `https://vndb.org/${full.id}` },
    ...WANT_LINKS.filter(n => pickedLinks[n]).map(n => pickedLinks[n]),
  ];
  const linksHtml = extLinks.map(l =>
    `<span class="modal-link" data-url="${escHtml(l.url)}">${icon('browse', 11)} ${escHtml(l.label || l.name || 'link')}</span>`
  ).join('');
  const desc     = stripBBCode(full.description || '');
  const pt       = formatPlaytime(entry.playtime_seconds);
  const lp       = formatLastPlayed(entry.last_played);
  const nsfw     = isNsfw(full);

  const reopen = async () => {
    await loadEntries();
    if (token === modalToken) openModal(full);
  };

  // ── Left panel ──
  left.innerHTML = `
    <div class="modal-cover-wrap">${makePoster(url, 14, nsfw, activeView === 'browse' ? settings.nsfwBlurBrowse : settings.nsfwBlurLibrary)}</div>

    <div class="modal-left-actions">
      ${inLib && onDevice && isRunning ? `<div class="btn-sm pri btn-stop" id="m-launch">■ Stop</div>` : ''}
      ${inLib && onDevice && !isRunning ? `<div class="btn-sm pri" id="m-launch">${icon('play', 13, true)} ${entry.status === 'reading' ? 'Continue' : 'Launch'}</div>` : ''}
      ${inLib && !onDevice ? `<div class="btn-sm sec" id="m-locate">${icon('folder', 13)} Locate on device</div>` : ''}
      <div class="btn-sm ${inLib ? 'sec' : 'pri'}" id="m-library">
        ${icon(inLib ? 'check' : 'plus', 13)} ${inLib ? 'In Library' : 'Add to Library'}
      </div>
      <div class="btn-sm sec" id="m-wishlist" style="${inWish ? 'color:var(--coral-deep)' : ''}">
        ${icon('heart', 13)} ${inWish ? 'Wishlisted' : 'Wishlist'}
      </div>
      <div class="btn-sm sec" id="m-wishlist-priv" style="${inWishPriv ? 'color:var(--coral-deep)' : ''}">
        🔒 ${inWishPriv ? 'In private list' : 'Private wishlist'}
      </div>
      ${!inLib ? `<div class="btn-sm sec" id="m-hide" style="color:var(--mut)">${icon('exclude', 13)} ${isHidden ? 'Unhide' : 'Hide from browse'}</div>` : ''}
      ${inLib && onDevice ? `<div class="btn-sm sec" id="m-change-exe">${icon('folder', 13)} Change EXE</div>` : ''}
      ${inLib && !isExcluded ? `<div class="btn-sm sec" id="m-exclude" style="color:var(--mut)">${icon('exclude', 13)} Exclude from library</div>` : ''}
      ${inLib && isExcluded ? `<div class="btn-sm sec" id="m-unexclude">↩ Include back</div>` : ''}
      ${inLib ? `<div class="btn-sm danger" id="m-remove-lib">${icon('trash', 13)} Remove from library</div>` : ''}
    </div>

    ${(pt || lp) ? `<div class="pv-playtime" style="margin-top:auto">
      ${pt ? `<span class="pt-total">${pt} played</span>` : ''}
      ${lp ? `<span class="pt-last">last: ${lp}</span>` : ''}
    </div>` : ''}

    <div class="modal-left-score">${rating ? `★ ${rating}` : ''} ${released !== '—' ? '· ' + released : ''}</div>`;

  // ── Right panel ──
  right.innerHTML = `
    <div class="modal-kicker">Visual Novel</div>
    <div class="modal-title">${escHtml(displayTitle(full))}</div>
    ${alttitle ? `<div class="modal-alttitle">${escHtml(alttitle)}</div>` : ''}

    <div class="modal-meta-grid">
      <div class="modal-meta-cell"><div class="mk">YEAR</div><div class="mv">${escHtml(released)}</div></div>
      <div class="modal-meta-cell"><div class="mk">LENGTH</div><div class="mv">${escHtml(lengthH)}</div></div>
      <div class="modal-meta-cell"><div class="mk">SCORE</div><div class="mv">${rating ? '★ ' + rating : '—'}</div></div>
      ${dev ? `<div class="modal-meta-cell" style="grid-column:1/-1"><div class="mk">DEVELOPER</div><div class="mv" style="font-size:13px">${escHtml(dev)}</div></div>` : ''}
      ${entry.started_at ? `<div class="modal-meta-cell"><div class="mk">STARTED</div><div class="mv" style="font-size:13px">${escHtml(formatDate(entry.started_at))}</div></div>` : ''}
      ${entry.finished_at ? `<div class="modal-meta-cell"><div class="mk">FINISHED</div><div class="mv" style="font-size:13px">${escHtml(formatDate(entry.finished_at))}</div></div>` : ''}
    </div>

    ${linksHtml ? `<div class="modal-links-row">
      <div class="mk">LINKS</div>
      <div class="modal-links">${linksHtml}</div>
    </div>` : ''}

    ${desc ? `<div class="modal-desc">${escHtml(desc).replace(/\n/g, '<br>')}</div>` : ''}
    ${tags ? `<div class="modal-tags">${tags}</div>` : ''}

    <div id="m-steam" class="modal-steam"></div>

    ${inLib ? `
    <div class="modal-status-row">
      <span class="modal-status-label">STATUS</span>
      <select class="modal-status-sel" id="m-status">
        ${STATUS_LIST.map(s =>
          `<option value="${s}" ${(entry.status||'unplayed') === s ? 'selected' : ''}>${capitalize(s)}</option>`).join('')}
      </select>
    </div>` : ''}`;

  // wire
  document.getElementById('m-library')?.addEventListener('click', async () => {
    if (inLib) await window.api.removeFromList(full.id, 'library');
    else await window.api.addToList(metaOf(full), 'library');
    reopen();
  });
  document.getElementById('m-wishlist')?.addEventListener('click', async () => {
    if (inWish) await window.api.removeFromList(full.id, 'wishlist');
    else await window.api.addToList(metaOf(full), 'wishlist');
    reopen();
  });
  document.getElementById('m-wishlist-priv')?.addEventListener('click', async () => {
    if (inWishPriv) await window.api.removeFromList(full.id, 'wishlistPrivate');
    else await window.api.addToList(metaOf(full), 'wishlistPrivate');
    reopen();
  });
  document.getElementById('m-hide')?.addEventListener('click', async () => {
    if (isHidden) {
      await window.api.unhideEntry(full.id);
      await loadEntries();
      reopen();
    } else {
      await window.api.hideEntry(metaOf(full));
      await loadEntries();
      closeModal();
      renderBrowseGrid(browseVns); // drop it from the current grid, no re-fetch
    }
  });
  document.getElementById('m-status')?.addEventListener('change', async e => {
    await window.api.libraryUpdateStatus(full.id, e.target.value);
    await loadEntries();
  });
  right.querySelectorAll('.modal-link[data-url]').forEach(el =>
    el.addEventListener('click', () => window.api.openExternal(el.dataset.url)));

  // ── Steam: store link + screenshot gallery (lazy, cached in main) ──
  window.api.steamAppDetails(full.id).then(steam => {
    if (token !== modalToken) return;                 // modal changed/closed
    const box = document.getElementById('m-steam');
    if (!box || !steam) return;                       // not on Steam → render nothing
    const shots = steam.screenshots || [];
    box.innerHTML = `
      <div class="modal-steam-head">
        <span class="mk">STEAM</span>
        <span class="modal-link modal-steam-link" data-url="${escHtml(steam.storeUrl)}">${icon('browse', 11)} View on Steam</span>
      </div>
      ${shots.length ? `<div class="modal-steam-shots">${shots.map(s =>
        `<img class="modal-steam-shot" src="${escHtml(s.thumb)}" data-full="${escHtml(s.full)}" alt="" loading="lazy" />`
      ).join('')}</div>` : ''}`;
    box.querySelector('.modal-steam-link')?.addEventListener('click', () =>
      window.api.openExternal(steam.storeUrl));
    const fullUrls = shots.map(s => s.full);
    box.querySelectorAll('.modal-steam-shot').forEach((img, i) =>
      img.addEventListener('click', () => openLightbox(fullUrls, i)));
  }).catch(() => {});
  document.getElementById('m-launch')?.addEventListener('click', async () => {
    if (isRunning) {
      if (confirm('Save your game first! Force-stop the process?')) {
        await window.api.stopVN(full.id);
      }
      return;
    }
    try {
      await window.api.launchVN(entry.exe_path, full.id);
      runningVNIds.add(full.id);
      reopen();
    } catch (err) { alert('Could not launch: ' + err.message); }
  });
  document.getElementById('m-locate')?.addEventListener('click', async () => {
    const p = await window.api.pickExe();
    if (p) { await window.api.libraryUpdateExe(full.id, p); reopen(); }
  });
  document.getElementById('m-change-exe')?.addEventListener('click', async () => {
    const p = await window.api.pickExe();
    if (p) { await window.api.libraryUpdateExe(full.id, p); reopen(); }
  });
  document.getElementById('m-exclude')?.addEventListener('click', async () => {
    await window.api.libraryExclude(full.id);
    closeModal();
    libSelId = null;
    await loadEntries();
    if (activeView === 'library') renderLibrary();
  });
  document.getElementById('m-unexclude')?.addEventListener('click', async () => {
    await window.api.libraryUnexclude(full.id);
    await loadEntries();
    reopen();
  });
  document.getElementById('m-remove-lib')?.addEventListener('click', async () => {
    await window.api.removeFromList(full.id, 'library');
    closeModal();
    libSelId = null;
    await loadEntries();
    if (activeView === 'library') renderLibrary();
  });
}

function closeModal() {
  document.getElementById('modal-overlay').classList.add('hidden');
  modalToken++;
}

// Gallery lightbox: openLightbox(urlArray, startIndex).
// X button, prev/next arrows, Esc/ArrowLeft/ArrowRight navigation.
let _lbShots = [];
let _lbIdx   = 0;

function openLightbox(shots, idx) {
  _lbShots = Array.isArray(shots) ? shots : [shots];
  _lbIdx   = idx || 0;
  let lb = document.getElementById('img-lightbox');
  if (!lb) {
    lb = document.createElement('div');
    lb.id = 'img-lightbox';
    lb.className = 'img-lightbox hidden';
    lb.innerHTML = `
      <div class="lb-close" id="lb-close">✕</div>
      <div class="lb-prev" id="lb-prev">&#8249;</div>
      <img class="img-lightbox-img" alt="" />
      <div class="lb-next" id="lb-next">&#8250;</div>
      <div class="lb-counter" id="lb-counter"></div>`;
    lb.addEventListener('click', e => { if (e.target === lb) closeLightbox(); });
    lb.querySelector('#lb-close').addEventListener('click', closeLightbox);
    lb.querySelector('#lb-prev').addEventListener('click', e => { e.stopPropagation(); lbNav(-1); });
    lb.querySelector('#lb-next').addEventListener('click', e => { e.stopPropagation(); lbNav(1); });
    document.body.appendChild(lb);
  }
  _lbRender();
  lb.classList.remove('hidden');
}

function closeLightbox() {
  const lb = document.getElementById('img-lightbox');
  if (lb) lb.classList.add('hidden');
}

function lbNav(dir) {
  if (_lbShots.length < 2) return;
  _lbIdx = (_lbIdx + dir + _lbShots.length) % _lbShots.length;
  _lbRender();
}

function _lbRender() {
  const lb = document.getElementById('img-lightbox');
  if (!lb) return;
  lb.querySelector('.img-lightbox-img').src = _lbShots[_lbIdx] || '';
  const multi = _lbShots.length > 1;
  lb.querySelector('#lb-prev').style.display    = multi ? '' : 'none';
  lb.querySelector('#lb-next').style.display    = multi ? '' : 'none';
  lb.querySelector('#lb-counter').style.display = multi ? '' : 'none';
  if (multi) lb.querySelector('#lb-counter').textContent = `${_lbIdx + 1} / ${_lbShots.length}`;
}

// ── SCAN ──────────────────────────────────────────────────────────────────────

// Normalize a title/folder name for fuzzy comparison (lowercase, alphanumerics only).
function normTitle(s) {
  return String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '');
}

// Does a scanned folder name plausibly match a VNDB candidate title? Used to avoid
// auto-selecting loose matches (e.g. a "Dead by Daylight" game folder → the
// "Hooked on You: A Dead by Daylight Dating Sim" VN). Confident only when the
// normalized names are equal, or one fully contains the other AND the shorter is
// at least 60% of the longer's length — so a short folder name buried inside a
// much longer title does NOT count.
function scanNameMatches(name, title) {
  const a = normTitle(name), b = normTitle(title);
  if (!a || !b) return false;
  if (a === b) return true;
  const shorter = a.length <= b.length ? a : b;
  const longer  = a.length <= b.length ? b : a;
  return longer.includes(shorter) && shorter.length / longer.length >= 0.6;
}

// Annotate a scan candidate with whether its VNDB id is already a library/wishlist
// entry on this PC.
const isKnownId = id => !!(entryById(id)?.library || entryById(id)?.wishlist);

// Find a library/wishlist entry whose title matches a scanned folder name — so a
// backup-imported game (not yet installed here) is still recognised even when
// VNDB's folder-name search doesn't surface it in the top results.
function findLibraryMatchByName(name) {
  const q = normTitle(name);
  if (q.length < 4) return null;
  let substr = null;
  for (const e of entries) {
    if (!(e.library || e.wishlist)) continue;
    for (const t of [e.title, e.alttitle]) {
      const nt = normTitle(t);
      if (nt.length < 4) continue;
      if (nt === q) return e; // exact normalized match wins outright
      // Substring only when the shorter side is long enough to be unambiguous.
      if (!substr && Math.min(nt.length, q.length) >= 6 && (nt.includes(q) || q.includes(nt))) {
        substr = e;
      }
    }
  }
  return substr;
}

// Reconcile a scan match against the local library: flag candidates already known,
// inject a missed library entry, and sort known matches first so the DEFAULT
// selection reconnects to existing history (and its exe path) instead of creating a
// duplicate. This makes scan order-independent of import.
function reconcileScanMatch(m) {
  let candidates = (m.candidates || []).map(c => ({ ...c, inLibrary: isKnownId(c.id) }));
  if (!candidates.some(c => c.inLibrary)) {
    const hit = findLibraryMatchByName(m.query || m.folderName);
    if (hit && !candidates.some(c => c.id === hit.id)) {
      candidates.unshift({ ...hit, image: imgUrl(hit.image), inLibrary: true });
    }
  }
  candidates.sort((a, b) => (b.inLibrary ? 1 : 0) - (a.inLibrary ? 1 : 0));
  return candidates;
}

// Build scanState from a scan result and open the review modal. Shared by the
// manual "Scan now" button and the startup "new games found" alert.
function openScanResults(result) {
  if (!result) return;
  // Folders whose match the user explicitly left unchecked on a previous scan —
  // keep them deselected so a rescan doesn't re-suggest something already rejected.
  const dismissed = new Set(settings.dismissedScans || []);
  scanState = result.matches.map(m => {
    const candidates = reconcileScanMatch(m);
    const top = candidates[0];
    // Auto-check only confident NEW matches (or library reconnects), so the user just
    // confirms them. Weak matches stay unchecked so they opt in (avoids Steam games
    // being added as VNs), and anything previously deselected stays deselected.
    const confident = !!top && (top.inLibrary
      || scanNameMatches(m.query, top.title)
      || scanNameMatches(m.folderName, top.title));
    const rejected = dismissed.has(m.exePath) && !(top && top.inLibrary);
    return {
      folderName: m.folderName,
      exePath:    m.exePath,
      query:      m.query,
      candidates,
      selectedId: top ? top.id : '',
      include:    confident && !rejected,
    };
  });
  const reconnects = scanState.filter(r => r.candidates.find(c => c.id === r.selectedId)?.inLibrary).length;
  const weak       = scanState.filter(r => r.candidates.length && !r.include).length;
  const noExeNote  = result.noExe.length ? ` ${result.noExe.length} folder(s) had no exe and were skipped.` : '';
  const reconNote  = reconnects ? ` ${reconnects} reconnect to titles already in your library.` : '';
  const weakNote   = weak ? ` ${weak} weak match(es) left unchecked — tick them if they're correct.` : '';
  document.getElementById('scan-subtitle').textContent =
    `Found ${scanState.length} game folder(s) in ${result.root}.${reconNote}${weakNote}${noExeNote}`;
  renderScanList();
  document.getElementById('scan-overlay').classList.remove('hidden');
}

async function runScan() {
  const btn = document.getElementById('settings-scan-btn');
  if (btn) { btn.disabled = true; btn.innerHTML = `${icon('clock', 13)} Scanning…`; }
  try {
    const result = await window.api.scanFolder();
    openScanResults(result);
  } catch (err) {
    alert('Scan failed: ' + err.message);
  } finally {
    if (btn) { btn.disabled = false; btn.innerHTML = `${icon('scan', 13)} Scan now`; }
  }
}

// Startup check: silently scan the saved folders and, if there are NEW confident
// matches that aren't in the library and weren't previously dismissed, show a
// dismissible strip offering to review + add them. Covers newly installed Steam
// games when the Steam library is one of the scan folders.
async function checkNewGames() {
  let result;
  try { result = await window.api.scanFolderSilent(); } catch { return; }
  if (!result || !result.matches || !result.matches.length) return;
  const dismissed = new Set(settings.dismissedScans || []);
  const fresh = result.matches.filter(m => {
    const top = reconcileScanMatch(m)[0];
    if (!top || isKnownId(top.id) || dismissed.has(m.exePath)) return false;
    return scanNameMatches(m.query, top.title) || scanNameMatches(m.folderName, top.title);
  });
  if (fresh.length) showNewGamesStrip(fresh.length, result);
}

function showNewGamesStrip(count, result) {
  document.getElementById('newgames-strip')?.remove();
  const strip = document.createElement('div');
  strip.id = 'newgames-strip';
  strip.className = 'newgames-strip';
  strip.innerHTML = `
    <span class="ngs-text">🎮 ${count} new game${count !== 1 ? 's' : ''} found in your folders</span>
    <div class="ngs-actions">
      <div class="btn-sm pri" id="ngs-review">Review &amp; add</div>
      <div class="btn-sm sec" id="ngs-dismiss">Dismiss</div>
    </div>`;
  (document.getElementById('app') || document.body).appendChild(strip);
  document.getElementById('ngs-review').addEventListener('click', () => {
    strip.remove();
    openScanResults(result);
  });
  document.getElementById('ngs-dismiss').addEventListener('click', () => strip.remove());
}

function renderScanList() {
  const scanList = document.getElementById('scan-list');
  scanList.innerHTML = '';
  scanState.forEach((row, i) => {
    const selected = row.candidates.find(c => c.id === row.selectedId);
    const cover    = selected ? imgUrl(selected.image) : null;

    const el = document.createElement('div');
    el.className = 'scan-row' + (row.include && row.selectedId ? '' : ' skipped');
    el.innerHTML = `
      <input type="checkbox" class="scan-check" ${row.include && row.selectedId ? 'checked' : ''} />
      ${cover
        ? `<img class="scan-cover" src="${escHtml(cover)}" />`
        : `<div class="scan-cover"></div>`}
      <div class="scan-info">
        <div class="scan-folder">📁 ${escHtml(row.folderName)}${selected && selected.inLibrary ? ` <span class="scan-known">↩ in your library</span>` : ''}</div>
        <select class="scan-match">
          ${row.candidates.map(c =>
            `<option value="${escHtml(c.id)}" ${c.id === row.selectedId ? 'selected' : ''}>${escHtml(c.title)}${c.rating ? ` (★${ratingStr(c.rating)})` : ''}${c.inLibrary ? ' ✓ in library' : ''}</option>`
          ).join('')}
          <option value="" ${row.selectedId === '' ? 'selected' : ''}>— skip this folder —</option>
        </select>
        <div class="scan-research">
          <input class="scan-q" placeholder="Wrong match? Search VNDB…" />
          <button class="scan-q-btn">Search</button>
        </div>
        <div class="scan-exe">▶ ${escHtml(row.exePath)}</div>
      </div>`;

    el.querySelector('.scan-check').addEventListener('change', e => {
      row.include = e.target.checked;
      el.classList.toggle('skipped', !(row.include && row.selectedId));
      updateScanCount();
    });
    el.querySelector('.scan-match').addEventListener('change', e => {
      row.selectedId = e.target.value;
      row.include = row.selectedId !== '';
      renderScanList();
    });

    const qInput = el.querySelector('.scan-q');
    const runResearch = async () => {
      const q = qInput.value.trim();
      if (!q) return;
      const btn = el.querySelector('.scan-q-btn');
      btn.textContent = '…';
      try {
        // Scanner matches OWNED games (may be niche) — bypass the vote floor
        const data = await window.api.vndbSearch(q, 'rating', { minVotes: 0 });
        row.candidates = (data.results || []).map(c => ({ ...c, inLibrary: isKnownId(c.id) }));
        row.selectedId = row.candidates[0] ? row.candidates[0].id : '';
        row.include = !!row.candidates[0];
      } catch (err) { alert('Search failed: ' + err.message); }
      renderScanList();
    };
    el.querySelector('.scan-q-btn').addEventListener('click', runResearch);
    qInput.addEventListener('keydown', e => { if (e.key === 'Enter') runResearch(); });

    scanList.appendChild(el);
  });
  updateScanCount();
}

function updateScanCount() {
  const n = scanState.filter(r => r.include && r.selectedId).length;
  const scanCount = document.getElementById('scan-count');
  const scanAdd   = document.getElementById('scan-add');
  if (scanCount) scanCount.textContent = `${n} of ${scanState.length} selected`;
  if (scanAdd)   scanAdd.disabled = n === 0;
}

// ── INIT ──────────────────────────────────────────────────────────────────────
async function init() {
  // Load settings first
  settings = await window.api.getSettings().catch(() => ({}));

  // Theme prefs: settings.json is the durable source of truth (localStorage can
  // reset between builds). Adopt any saved values, then re-mirror to localStorage.
  if (settings.themeMode) themeMode = settings.themeMode;
  if (settings.autoLight) autoLight = settings.autoLight;
  if (settings.autoDark)  autoDark  = settings.autoDark;
  if (settings.palette)   palette   = settings.palette;
  // Legacy palette renames: yellow/mint → banana, green → mint, lav → lavender, gray → stone
  if (palette === 'yellow' || palette === 'mint') palette = 'banana';
  else if (palette === 'green') palette = 'mint';
  else if (palette === 'lav') palette = 'lavender';
  else if (palette === 'gray') palette = 'stone';
  // titleLang 'ja' used to mean romaji; 'ja' is now unused (kanji uses 'kanji').
  if (settings.titleLang === 'ja') { settings.titleLang = 'romaji'; window.api.writeSetting('titleLang', 'romaji'); }
  // Persist the Browse 18+ default (hide) once, so the filter, the Settings toggle
  // and the "Allow 18+" chip all read the same value instead of disagreeing.
  if (settings.browseNsfwFilter === undefined) { settings.browseNsfwFilter = true; window.api.writeSetting('browseNsfwFilter', true); }
  try {
    localStorage.setItem('tsund-theme-mode', themeMode);
    localStorage.setItem('tsund-auto-light', autoLight);
    localStorage.setItem('tsund-auto-dark',  autoDark);
    localStorage.setItem('tsund-palette',    palette);
  } catch {}

  applyTheme();
  applyZoom();
  applyCardSize();
  applyBrowseLayout();
  renderWindowIcon();   // upgrade taskbar icon to the real 積 kanji
  initWindowControls();

  // Auto theme: re-evaluate every minute so it flips at the scheduled times.
  setInterval(() => { if (themeMode === 'auto') applyTheme(); }, 60000);

  // Version in top bar
  const version = await window.api.getVersion().catch(() => null);
  const vEl = document.getElementById('tbar-version');
  if (vEl && version) vEl.textContent = `v${version}`;

  // Settings icon
  const settingsNav = document.getElementById('settings-nav');
  if (settingsNav) settingsNav.innerHTML = icon('settings', 17);

  // Top bar nav
  document.querySelectorAll('.tnav').forEach(el =>
    el.addEventListener('click', () => switchView(el.dataset.view)));
  document.getElementById('theme-toggle')?.addEventListener('click', toggleThemeShortcut);
  settingsNav?.addEventListener('click', () => switchView('settings'));

  // Library filters — selecting a status filter exits any active collection view.
  document.querySelectorAll('.fitem[data-filter]').forEach(el => {
    el.addEventListener('click', () => {
      document.querySelectorAll('.fitem[data-filter]').forEach(f => f.classList.remove('on'));
      el.classList.add('on');
      libFilter = el.dataset.filter;
      libCollFilter = null;       // status filters and collections are exclusive views
      libSelId  = null;
      renderCollectionsSidebar(); // clear the collection highlight
      renderLibrary();
    });
  });

  // Library search
  document.getElementById('lib-search')?.addEventListener('input', e => {
    libSearch = e.target.value;
    libSelId  = null;
    renderLibrary();
  });

  // Wishlist search
  document.getElementById('wish-search')?.addEventListener('input', e => {
    wishSearch = e.target.value;
    renderWishlist();
  });
  // Public / Private wishlist toggle
  document.querySelectorAll('#wish-view-toggle [data-wishview]').forEach(el => {
    el.addEventListener('click', () => {
      wishView = el.dataset.wishview;
      document.querySelectorAll('#wish-view-toggle [data-wishview]').forEach(b =>
        b.classList.toggle('on', b.dataset.wishview === wishView));
      renderWishlist();
    });
  });

  // Library sort
  document.querySelectorAll('.fsort-item').forEach(el => {
    el.addEventListener('click', () => {
      document.querySelectorAll('.fsort-item').forEach(s => s.classList.remove('on'));
      el.classList.add('on');
      libSort = el.dataset.libsort;
      renderLibrary();
    });
  });

  // Library grid/list view toggle
  document.querySelectorAll('#lib-view-toggle .lvt-btn').forEach(btn => {
    btn.innerHTML = icon(btn.dataset.libview, 15);
    btn.addEventListener('click', () => setLibView(btn.dataset.libview));
  });

  // VN process detected as started (auto-tracking) → reflect "now playing".
  window.api.onVNStarted(async id => {
    runningVNIds.add(id);
    await loadEntries();
  });

  // VN process stopped → reload so the just-written playtime/status shows.
  window.api.onVNStopped(async id => {
    runningVNIds.delete(id);
    await loadEntries();
  });

  // Window re-shown from tray → reload in case data changed while hidden.
  window.api.onWindowShown(() => { loadEntries(); });

  // entries.json changed on disk externally (e.g. Syncthing) → live reload.
  window.api.onEntriesChanged(() => { loadEntries(); });

  // Auto-update status — register once, repaint About line if it's on screen.
  window.api.onUpdateStatus(s => { updateStatusState = s; paintUpdateStatus(); });
  window.api.getUpdateState().then(s => { updateStatusState = s; paintUpdateStatus(); }).catch(() => {});

  // Browse
  initBrowse();

  // Settings sidebar
  document.querySelectorAll('.settings-nav-item').forEach(el => {
    el.addEventListener('click', () => {
      document.querySelectorAll('.settings-nav-item').forEach(s => s.classList.remove('on'));
      el.classList.add('on');
      settingsSection = el.dataset.section;
      renderSettingsSection(settingsSection);
    });
  });

  // Detail modal close
  document.getElementById('modal-close')?.addEventListener('click', closeModal);
  document.getElementById('modal-overlay')?.addEventListener('click', e => {
    if (e.target === document.getElementById('modal-overlay')) closeModal();
  });

  // Keyboard: lightbox navigation + modal dismiss
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    const lb = document.getElementById('img-lightbox');
    const lbOpen = lb && !lb.classList.contains('hidden');
    if (lbOpen) {
      if (e.key === 'Escape')     { closeLightbox(); e.preventDefault(); }
      if (e.key === 'ArrowLeft')  { lbNav(-1); e.preventDefault(); }
      if (e.key === 'ArrowRight') { lbNav(1); e.preventDefault(); }
    } else if (e.key === 'Escape') {
      const overlay = document.getElementById('modal-overlay');
      if (overlay && !overlay.classList.contains('hidden')) { closeModal(); e.preventDefault(); }
    }
  });

  // Scan modal
  document.getElementById('scan-close')?.addEventListener('click', () =>
    document.getElementById('scan-overlay').classList.add('hidden'));
  document.getElementById('scan-overlay')?.addEventListener('click', e => {
    if (e.target === document.getElementById('scan-overlay'))
      document.getElementById('scan-overlay').classList.add('hidden');
  });
  document.getElementById('scan-add')?.addEventListener('click', async () => {
    const btn = document.getElementById('scan-add');
    btn.disabled = true;
    // Remember decisions: added folders are cleared from the dismissed set; folders
    // with a real match that the user left unchecked are remembered so a future rescan
    // keeps them deselected.
    const dismissed = new Set(settings.dismissedScans || []);
    for (const row of scanState) {
      if (row.include && row.selectedId) {
        const cand = row.candidates.find(c => c.id === row.selectedId);
        if (cand) await window.api.libraryAddScanned(metaOf(cand), row.exePath);
        dismissed.delete(row.exePath);
      } else if (row.candidates.length) {
        dismissed.add(row.exePath);
      }
    }
    await setSetting('dismissedScans', [...dismissed]);
    document.getElementById('scan-overlay').classList.add('hidden');
    await loadEntries();
    switchView('library');
  });

  // New collection — styled popup dialog (showCollDialog is module-level)
  document.getElementById('fcoll-group')?.addEventListener('click', e => {
    if (e.target.id === 'fcoll-new' || e.target.closest('#fcoll-new')) showCollDialog();
  });

  // "Add to collection" header button → checkbox picker for the active collection
  document.getElementById('lib-addcoll')?.addEventListener('click', () => {
    if (libCollFilter) openCollectionPicker(libCollFilter);
  });

  // "Manage" header button → bulk hide / remove
  document.getElementById('lib-manage')?.addEventListener('click', openBatchManager);

  await loadEntries();
  renderCollectionsSidebar();
  updateWishBadge();
  // Check for new English releases on wishlisted VNs (fire-and-forget)
  setTimeout(checkWishlistAlerts, 3000);
  setTimeout(checkNewGames, 5000); // detect newly installed games in scan folders
  backfillMeta(); // fire-and-forget background metadata enrichment
}

document.addEventListener('DOMContentLoaded', init);
