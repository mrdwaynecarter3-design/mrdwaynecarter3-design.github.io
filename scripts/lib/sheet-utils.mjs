// Shared helpers for the Google Sheet sync scripts.

import { readFileSync } from 'node:fs'

// ---------- CSV parsing (RFC 4180: quoted fields, doubled quotes, newlines) ----------

export function parseCsv(text) {
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

// ---------- Header + field helpers ----------

export const normalizeHeader = (h) =>
  h.trim().toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '')

export const slugify = (name) =>
  name.trim().toLowerCase().replace(/['’.]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

export const truthy = (v) => /^(y|yes|true|x|1)/i.test((v || '').trim())

export const num = (v) => {
  const n = Number(String(v || '').replace(/[^0-9.\-]/g, ''))
  return Number.isFinite(n) && String(v).trim() !== '' ? n : 0
}

// Accepts YYYY-MM-DD or M/D/YYYY, returns YYYY-MM-DD (or '' if unparseable).
export function isoDate(v) {
  const s = String(v || '').trim()
  if (!s) return ''
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s
  const m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
  if (m) return `${m[3]}-${m[1].padStart(2, '0')}-${m[2].padStart(2, '0')}`
  return ''
}

// ---------- Loading ----------

export async function loadCsv(source) {
  if (/^https?:\/\//i.test(source)) {
    const res = await fetch(source, { redirect: 'follow' })
    if (!res.ok) throw new Error(`Fetch failed: HTTP ${res.status} ${res.statusText}`)
    const text = await res.text()
    if (/^\s*</.test(text)) {
      throw new Error('Got an HTML page instead of CSV — is the sheet tab published to the web as CSV?')
    }
    return text
  }
  return readFileSync(source, 'utf8')
}

// Parses a CSV into row-accessor functions using a header-alias map.
// Returns { rows: [{ get, getNumbered }] } for non-empty data rows.
export function readTable(csv, aliases, requiredKeys = []) {
  const parsed = parseCsv(csv)
  if (parsed.length === 0) throw new Error('Sheet is completely empty — no header row.')

  const headers = parsed[0].map(normalizeHeader)
  const colFor = {}
  const numberedCols = {}
  headers.forEach((h, idx) => {
    if (aliases[h]) {
      colFor[aliases[h]] = idx
    } else {
      const m = h.match(/^([a-z]+)_?(\d+)$/)
      if (m) {
        numberedCols[m[1]] = numberedCols[m[1]] || {}
        numberedCols[m[1]][m[2]] = idx
      }
    }
  })

  for (const required of requiredKeys) {
    if (!(required in colFor)) throw new Error(`Sheet is missing a required column: ${required}`)
  }

  const rows = []
  for (let r = 1; r < parsed.length; r++) {
    const row = parsed[r]
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
    rows.push({ get, getNumbered })
  }
  return rows
}
