// Clean GitHub release publisher for Tsundoku.
//
// electron-builder's `--publish always` kept creating TWO draft releases and
// splitting the assets across them, so every release needed manual API surgery to
// merge + un-draft. Instead we build with `--publish never` and upload here:
// one published (non-draft) release per version, with latest.yml + installer +
// blockmap, then prune old local installers (keep current + one previous).
//
// Usage:  electron-builder --win nsis --publish never  &&  node scripts/release.mjs
// Needs:  GH_TOKEN env var (classic PAT with public_repo scope).

import { readFileSync, readdirSync, statSync, unlinkSync } from 'node:fs';
import path from 'node:path';

const OWNER = 'snxwss';
const REPO  = 'tsundoku-releases';
const KEEP_GENERATIONS = 2; // current + one previous

const root    = process.cwd();
const distDir = path.join(root, 'dist-installer');
const token   = process.env.GH_TOKEN;

if (!token) { console.error('✗ GH_TOKEN is not set.'); process.exit(1); }

const pkg     = JSON.parse(readFileSync(path.join(root, 'package.json'), 'utf8'));
const version = pkg.version;
const tag     = `v${version}`;
const API     = `https://api.github.com/repos/${OWNER}/${REPO}`;
const headers = { Authorization: `token ${token}`, Accept: 'application/vnd.github+json', 'User-Agent': 'tsundoku-release' };

const localExe = `Tsundoku-Setup-${version}.exe`;
const assets = [
  { local: 'latest.yml',           name: 'latest.yml' },
  { local: localExe,               name: localExe },
  { local: `${localExe}.blockmap`, name: `${localExe}.blockmap` },
];

async function gh(method, url, body) {
  const res = await fetch(url, { method, headers: { ...headers, 'Content-Type': 'application/json' }, body: body ? JSON.stringify(body) : undefined });
  if (!res.ok && res.status !== 404) throw new Error(`${method} ${url} → ${res.status} ${await res.text()}`);
  return res;
}

// Pull the changelog section for the current version out of CHANGELOG.md, to use
// as the GitHub release body (notes). Falls back to a generic line if absent.
function releaseNotes() {
  try {
    const lines = readFileSync(path.join(root, 'CHANGELOG.md'), 'utf8').split(/\r?\n/);
    const start = lines.findIndex(l => l === `## ${version}` || l.startsWith(`## ${version} `));
    if (start === -1) return `Tsundoku ${version}`;
    const body = [];
    for (let i = start + 1; i < lines.length; i++) {
      if (lines[i].startsWith('## ')) break;
      body.push(lines[i]);
    }
    return body.join('\n').trim() || `Tsundoku ${version}`;
  } catch { return `Tsundoku ${version}`; }
}

async function getOrCreateRelease() {
  const notes = releaseNotes();
  const existing = await gh('GET', `${API}/releases/tags/${tag}`);
  if (existing.ok) {
    const rel = await existing.json();
    // Make sure it's published (not a leftover draft), marked latest, notes current.
    await gh('PATCH', `${API}/releases/${rel.id}`, { draft: false, prerelease: false, make_latest: 'true', body: notes });
    return rel;
  }
  const created = await gh('POST', `${API}/releases`, {
    tag_name: tag, name: version, draft: false, prerelease: false,
    body: notes,
  });
  return created.json();
}

async function uploadAsset(rel, asset) {
  const file = path.join(distDir, asset.local);
  let buf;
  try { buf = readFileSync(file); } catch { console.warn(`  • skip ${asset.local} (not found)`); return; }
  // Replace any existing asset of the same name (GitHub rejects duplicates).
  const old = (rel.assets || []).find(a => a.name === asset.name);
  if (old) await gh('DELETE', `${API}/releases/assets/${old.id}`);
  const url = `https://uploads.github.com/repos/${OWNER}/${REPO}/releases/${rel.id}/assets?name=${encodeURIComponent(asset.name)}`;
  const res = await fetch(url, { method: 'POST', headers: { ...headers, 'Content-Type': 'application/octet-stream' }, body: buf });
  if (!res.ok) throw new Error(`upload ${asset.name} → ${res.status} ${await res.text()}`);
  console.log(`  ✓ uploaded ${asset.name} (${(buf.length / 1048576).toFixed(1)} MB)`);
}

function pruneOldInstallers() {
  const re = /^Tsundoku-Setup-(\d+)\.(\d+)\.(\d+)\.exe$/;
  const versions = readdirSync(distDir)
    .map(f => { const m = f.match(re); return m ? { f, key: [+m[1], +m[2], +m[3]] } : null; })
    .filter(Boolean)
    .sort((a, b) => b.key[0] - a.key[0] || b.key[1] - a.key[1] || b.key[2] - a.key[2]);
  for (const { f } of versions.slice(KEEP_GENERATIONS)) {
    for (const target of [f, `${f}.blockmap`]) {
      try { unlinkSync(path.join(distDir, target)); console.log(`  ✗ pruned ${target}`); } catch {}
    }
  }
}

(async () => {
  console.log(`Publishing Tsundoku ${tag} → github.com/${OWNER}/${REPO}`);
  const rel = await getOrCreateRelease();
  for (const a of assets) await uploadAsset(rel, a);
  pruneOldInstallers();
  console.log(`\n✓ Published: https://github.com/${OWNER}/${REPO}/releases/tag/${tag}`);
})().catch(e => { console.error('\n✗ Release failed:', e.message); process.exit(1); });
