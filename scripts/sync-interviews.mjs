// Pulls the interviews list from a published Google Sheet CSV and writes
// src/data/interviews.generated.json, preferred over the fallback in interviews.js.
//
// Usage:
//   node scripts/sync-interviews.mjs                 (reads SHEET_INTERVIEWS_CSV_URL env var)
//   node scripts/sync-interviews.mjs <url-or-file>   (explicit source, for testing)
//
// Columns: Player Name, Title, Date, Duration, YouTube (full URL or bare ID),
// Closer (the "I got next" line).
// Exits quietly if no URL is configured, so the workflow can run before
// the Interviews tab is set up.

import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { loadCsv, readTable, slugify, isoDate } from './lib/sheet-utils.mjs'

const OUT_PATH = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'data', 'interviews.generated.json')

const HEADER_ALIASES = {
  player_name: 'playerName',
  player: 'playerName',
  name: 'playerName',
  title: 'title',
  date: 'date',
  duration: 'duration',
  youtube: 'youtube',
  youtube_id: 'youtube',
  youtube_url: 'youtube',
  video: 'youtube',
  video_url: 'youtube',
  closer: 'closer',
  quote: 'closer',
}

// Accepts a bare video id or any common YouTube URL form.
function youtubeId(v) {
  const s = String(v || '').trim()
  if (!s) return ''
  if (/^[A-Za-z0-9_-]{11}$/.test(s)) return s
  const m = s.match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|shorts\/|embed\/|live\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/)
  return m ? m[1] : ''
}

async function main() {
  const source = process.argv[2] || process.env.SHEET_INTERVIEWS_CSV_URL
  if (!source) {
    console.log('SHEET_INTERVIEWS_CSV_URL not set — skipping interviews sync.')
    return
  }

  const csv = await loadCsv(source)
  const rows = readTable(csv, HEADER_ALIASES, ['playerName', 'title'])

  const warnings = []
  const interviews = []
  for (const { get } of rows) {
    const playerName = get('playerName').trim()
    if (!playerName) continue
    const ytRaw = get('youtube').trim()
    const ytId = youtubeId(ytRaw)
    if (ytRaw && !ytId) {
      warnings.push(`Interview for "${playerName}": could not read a YouTube ID from "${ytRaw}" — paste the full video URL or the 11-character ID.`)
    }
    interviews.push({
      id: interviews.length + 1,
      playerSlug: slugify(playerName),
      playerName,
      title: get('title').trim(),
      date: isoDate(get('date')),
      duration: get('duration').trim(),
      youtubeId: ytId,
      closer: get('closer').trim(),
    })
  }

  // An empty tab isn't an error — the site keeps its built-in fallback list
  // until the first real row is added.
  if (interviews.length === 0) {
    console.log('Interviews tab has no rows yet — site keeps its built-in list.')
  }

  // Newest first, matching how the film room reads.
  interviews.sort((a, b) => (b.date || '').localeCompare(a.date || ''))
  interviews.forEach((it, i) => (it.id = i + 1))

  writeFileSync(OUT_PATH, JSON.stringify({ interviews }, null, 2) + '\n')
  console.log(`Wrote ${interviews.length} interviews to src/data/interviews.generated.json`)
  for (const w of warnings) console.warn(`WARNING: ${w}`)
}

main().catch((err) => {
  console.error(`Interviews sync failed: ${err.message}`)
  process.exit(1)
})
