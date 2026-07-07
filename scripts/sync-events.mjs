// Pulls the events schedule from a published Google Sheet CSV and writes
// src/data/events.generated.json, preferred over the fallback in events.js.
//
// Usage:
//   node scripts/sync-events.mjs                 (reads SHEET_EVENTS_CSV_URL env var)
//   node scripts/sync-events.mjs <url-or-file>   (explicit source, for testing)
//
// Columns: Event Name, Location, Date, Status (upcoming/attended — blank
// auto-derives from the date), Note.
// Exits quietly if no URL is configured, so the workflow can run before
// the Events tab is set up.

import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { loadCsv, readTable, isoDate } from './lib/sheet-utils.mjs'

const OUT_PATH = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'data', 'events.generated.json')

const HEADER_ALIASES = {
  event_name: 'name',
  event: 'name',
  name: 'name',
  location: 'location',
  city: 'location',
  date: 'date',
  status: 'status',
  note: 'note',
  notes: 'note',
}

async function main() {
  const source = process.argv[2] || process.env.SHEET_EVENTS_CSV_URL
  if (!source) {
    console.log('SHEET_EVENTS_CSV_URL not set — skipping events sync.')
    return
  }

  const csv = await loadCsv(source)
  const rows = readTable(csv, HEADER_ALIASES, ['name', 'date'])

  const warnings = []
  const events = []
  for (const { get } of rows) {
    const name = get('name').trim()
    if (!name) continue
    const date = isoDate(get('date'))
    if (!date) {
      warnings.push(`Event "${name}": could not parse date "${get('date')}" — expected MM/DD/YYYY or YYYY-MM-DD. Row skipped.`)
      continue
    }
    let status = get('status').trim().toLowerCase()
    if (status !== 'upcoming' && status !== 'attended') {
      if (status) warnings.push(`Event "${name}": unknown status "${get('status')}" — deriving from date instead.`)
      status = date >= new Date().toISOString().slice(0, 10) ? 'upcoming' : 'attended'
    }
    events.push({
      id: events.length + 1,
      name,
      location: get('location').trim(),
      date,
      status,
      note: get('note').trim(),
    })
  }

  // An empty tab isn't an error — the site keeps its built-in fallback list
  // until the first real row is added.
  if (events.length === 0) {
    console.log('Events tab has no rows yet — site keeps its built-in list.')
  }
  writeFileSync(OUT_PATH, JSON.stringify({ events }, null, 2) + '\n')
  console.log(`Wrote ${events.length} events to src/data/events.generated.json`)
  for (const w of warnings) console.warn(`WARNING: ${w}`)
}

main().catch((err) => {
  console.error(`Events sync failed: ${err.message}`)
  process.exit(1)
})
