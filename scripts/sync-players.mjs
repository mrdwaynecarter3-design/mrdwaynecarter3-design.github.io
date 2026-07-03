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

import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { loadCsv, readTable, slugify, truthy, num, isoDate } from './lib/sheet-utils.mjs'

const OUT_PATH = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'data', 'players.generated.json')

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

const pct = (v) => {
  const s = String(v || '').trim()
  if (!s) return ''
  return s.endsWith('%') ? s : `${s}%`
}

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

async function main() {
  const source = process.argv[2] || process.env.SHEET_CSV_URL
  if (!source) {
    console.error('No source. Set the SHEET_CSV_URL environment variable or pass a URL/file path.')
    process.exit(1)
  }

  const csv = await loadCsv(source)
  const rows = readTable(csv, HEADER_ALIASES, ['name', 'class', 'position'])

  const warnings = []
  const players = []
  for (const { get, getNumbered } of rows) {
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

  // No timestamp in the output: the file must be byte-identical when the
  // sheet hasn't changed, so the workflow's "no changes" check works.
  writeFileSync(OUT_PATH, JSON.stringify({ players }, null, 2) + '\n')
  console.log(`Wrote ${players.length} players to src/data/players.generated.json`)
  for (const w of warnings) console.warn(`WARNING: ${w}`)
}

main().catch((err) => {
  console.error(`Sync failed: ${err.message}`)
  process.exit(1)
})
