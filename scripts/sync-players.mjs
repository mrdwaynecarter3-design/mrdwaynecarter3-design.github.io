// Pulls the player roster from a published Google Sheet CSV and writes
// src/data/players.generated.json, which the site prefers over the
// hardcoded fallback in src/data/players.js.
//
// Usage:
//   node scripts/sync-players.mjs                 (reads SHEET_CSV_URL env var)
//   node scripts/sync-players.mjs <url-or-file>   (explicit source, for testing)
//
// The sheet has one row per player. Headers are matched case-insensitively
// with spaces/punctuation ignored, so "Scout Grade" and "scout_grade" both work.

import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const OUT_PATH = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'data', 'players.generated.json')

// ---------- CSV parsing (RFC 4180: quoted fields, doubled quotes, newlines) ----------

function parseCsv(text) {
  const rows = []
  let row = []
  let field = ''
  let inQuotes = false
  let i = 0
  // Strip BOM
  if (text.charCodeAt(0) === 0xfeff) text = text.slice(1)
  while (i < text.length) {
    const ch = text[i]
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          field += '"'
          i += 2
        } else {
          inQuotes = false
          i += 1
        }
      } else {
        field += ch
        i += 1
      }
    } else if (ch === '"') {
      inQuotes = true
      i += 1
    } else if (ch === ',') {
      row.push(field)
      field = ''
      i += 1
    } else if (ch === '\r') {
      i += 1
    } else if (ch === '\n') {
      row.push(field)
      rows.push(row)
      row = []
      field = ''
      i += 1
    } else {
      field += ch
      i += 1
    }
  }
  if (field !== '' || row.length > 0) {
    row.push(field)
    rows.push(row)
  }
  return rows
}

// ---------- Header normalization ----------

const normalizeHeader = (h) => h.trim().toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '')

// Maps normalized sheet headers to canonical keys. Numbered columns
// (strength_1, film_2, ...) are handled separately.
const HEADER_ALIASES = {
  name: 'name',
  player: 'name',
  player_name: 'name',
  class: 'class',
  grad_year: 'class',
  position: 'position',
  pos: 'position',
  second_position: 'pos2',
  pos2: 'pos2',
  national_rank: 'rank',
  rank: 'rank',
  regional_rank: 'regionalRank',
  state_rank: 'stateRank',
  scout_grade: 'scoutGrade',
  grade: 'scoutGrade',
  stars: 'stars',
  height: 'height',
  weight: 'weight',
  hometown: 'hometown',
  state: 'state',
  school: 'school',
  status: 'status',
  status_detail: 'statusDetail',
  committed_to: 'statusDetail',
  status_date: 'statusDate',
  spotlight: 'spotlight',
  radar: 'radar',
  on_the_radar: 'radar',
  ppg: 'ppg',
  rpg: 'rpg',
  apg: 'apg',
  fg: 'fg',
  fg_pct: 'fg',
  interview_quote: 'interviewQuote',
  quote: 'interviewQuote',
  interview_video_url: 'interviewVideoUrl',
  video_url: 'interviewVideoUrl',
  eval_updated: 'evalUpdated',
  eval_date: 'evalUpdated',
  eval_overview: 'evalOverview',
  overview: 'evalOverview',
  comparison_player: 'comparisonPlayer',
  pro_comparison: 'comparisonPlayer',
  comparison_reasoning: 'comparisonReasoning',
}

// ---------- Field helpers ----------

const slugify = (name) =>
  name.trim().toLowerCase().replace(/['’.]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

const truthy = (v) => /^(y|yes|true|x|1)/i.test((v || '').trim())

const num = (v) => {
  const n = Number(String(v || '').replace(/[^0-9.\-]/g, ''))
  return Number.isFinite(n) && String(v).trim() !== '' ? n : 0
}

const pct = (v) => {
  const s = String(v || '').trim()
  if (!s) return ''
  return s.endsWith('%') ? s : `${s}%`
}

// Accepts YYYY-MM-DD or M/D/YYYY, returns YYYY-MM-DD (or '' if unparseable).
function isoDate(v) {
  const s = String(v || '').trim()
  if (!s) return ''
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s
  const m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
  if (m) return `${m[3]}-${m[1].padStart(2, '0')}-${m[2].padStart(2, '0')}`
  return ''
}

// ---------- Row → player ----------

function rowToPlayer(get, getNumbered, index, warnings) {
  const name = get('name').trim()
  const quote = get('interviewQuote').trim()
  const videoUrl = get('interviewVideoUrl').trim()
  const evalUpdated = isoDate(get('evalUpdated'))
  if (get('evalUpdated').trim() && !evalUpdated) {
    warnings.push(`Row ${index + 2} (${name}): could not parse Eval Updated date "${get('evalUpdated')}" — expected MM/DD/YYYY or YYYY-MM-DD.`)
  }
  return {
    id: index + 1,
    slug: slugify(name),
    name,
    class: get('class').trim(),
    position: get('position').trim().toUpperCase(),
    pos2: get('pos2').trim().toUpperCase(),
    rank: num(get('rank')),
    regionalRank: num(get('regionalRank')),
    stateRank: num(get('stateRank')),
    scoutGrade: num(get('scoutGrade')),
    stars: num(get('stars')),
    height: get('height').trim(),
    weight: get('weight').trim(),
    hometown: get('hometown').trim(),
    state: get('state').trim().toUpperCase(),
    school: get('school').trim(),
    status: get('status').trim() || 'Uncommitted',
    statusDetail: get('statusDetail').trim(),
    statusDate: get('statusDate').trim(),
    spotlight: truthy(get('spotlight')),
    radar: truthy(get('radar')),
    stats: {
      ppg: num(get('ppg')),
      rpg: num(get('rpg')),
      apg: num(get('apg')),
      fg: pct(get('fg')),
    },
    interview: {
      hasInterview: Boolean(quote || videoUrl),
      quote,
      videoUrl,
    },
    film: getNumbered('film', 3),
    eval: {
      updatedAt: evalUpdated,
      overview: get('evalOverview').trim(),
      strengths: getNumbered('strength', 4),
      weaknesses: getNumbered('weakness', 3),
    },
    comparison: {
      player: get('comparisonPlayer').trim(),
      reasoning: get('comparisonReasoning').trim(),
    },
  }
}

// ---------- Main ----------

async function loadCsv(source) {
  if (/^https?:\/\//i.test(source)) {
    const res = await fetch(source, { redirect: 'follow' })
    if (!res.ok) throw new Error(`Fetch failed: HTTP ${res.status} ${res.statusText}`)
    const text = await res.text()
    if (/^\s*</.test(text)) {
      throw new Error('Got an HTML page instead of CSV — is the sheet published to the web as CSV?')
    }
    return text
  }
  return readFileSync(source, 'utf8')
}

async function main() {
  const source = process.argv[2] || process.env.SHEET_CSV_URL
  if (!source) {
    console.error('No source. Set the SHEET_CSV_URL environment variable or pass a URL/file path.')
    process.exit(1)
  }

  const csv = await loadCsv(source)
  const rows = parseCsv(csv)
  if (rows.length < 2) throw new Error('Sheet has no data rows.')

  const headers = rows[0].map(normalizeHeader)
  const colFor = {}
  const numberedCols = {} // e.g. { strength: { 1: colIdx, ... }, film: {...}, weakness: {...} }
  headers.forEach((h, idx) => {
    if (HEADER_ALIASES[h]) {
      colFor[HEADER_ALIASES[h]] = idx
    } else {
      const m = h.match(/^(strength|weakness|film)_?(\d+)$/)
      if (m) {
        numberedCols[m[1]] = numberedCols[m[1]] || {}
        numberedCols[m[1]][m[2]] = idx
      }
    }
  })

  for (const required of ['name', 'class', 'position']) {
    if (!(required in colFor)) throw new Error(`Sheet is missing a required column: ${required}`)
  }

  const warnings = []
  const players = []
  for (let r = 1; r < rows.length; r++) {
    const row = rows[r]
    const get = (key) => (colFor[key] != null ? row[colFor[key]] || '' : '')
    const getNumbered = (prefix, max) => {
      const out = []
      for (let n = 1; n <= max; n++) {
        const idx = numberedCols[prefix] && numberedCols[prefix][n]
        const v = idx != null ? (row[idx] || '').trim() : ''
        if (v) out.push(v)
      }
      return out
    }
    if (!get('name').trim()) continue // skip blank rows
    players.push(rowToPlayer(get, getNumbered, players.length, warnings))
  }

  if (players.length === 0) throw new Error('No players found in the sheet.')

  // Duplicate-slug check (two players with the same name need a tiebreaker).
  const seen = new Set()
  for (const p of players) {
    if (seen.has(p.slug)) warnings.push(`Duplicate player name/slug: "${p.name}" — profile links will collide.`)
    seen.add(p.slug)
  }

  // Order by national rank when provided; sheet order otherwise.
  if (players.every((p) => p.rank > 0)) {
    players.sort((a, b) => a.rank - b.rank)
    players.forEach((p, i) => (p.id = i + 1))
  }

  writeFileSync(OUT_PATH, JSON.stringify({ syncedAt: new Date().toISOString(), players }, null, 2) + '\n')
  console.log(`Wrote ${players.length} players to src/data/players.generated.json`)
  for (const w of warnings) console.warn(`WARNING: ${w}`)
}

main().catch((err) => {
  console.error(`Sync failed: ${err.message}`)
  process.exit(1)
})
