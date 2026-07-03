# Google Sheet content — setup and daily use

The players, events, and interviews all live in one Google Sheet (three tabs).
A GitHub Action ("Sync content from Google Sheet") pulls each tab, converts it
to `src/data/*.generated.json`, commits it, and redeploys the site. Each tab's
published-CSV URL is stored as a GitHub secret, so none of them are visible in
the code or on the site.

| Tab        | Secret name              | Template to import              |
| ---------- | ------------------------ | ------------------------------- |
| Players    | `SHEET_CSV_URL`          | `docs/players-template.csv`     |
| Events     | `SHEET_EVENTS_CSV_URL`   | `docs/events-template.csv`      |
| Interviews | `SHEET_INTERVIEWS_CSV_URL` | `docs/interviews-template.csv` |

The Events and Interviews secrets are optional — until they're added, the sync
simply skips those tabs and the site keeps its built-in lists.

## One-time setup

1. **Create the sheet.** Go to [sheets.google.com](https://sheets.google.com), create a new
   spreadsheet named e.g. "NXT MAN UP Roster", then **File → Import → Upload**
   and upload `docs/players-template.csv` from this repo (choose "Replace
   spreadsheet"). For the Events and Interviews tabs, import their templates
   with **Insert new sheet(s)** instead. Every tab arrives pre-filled with the
   current site content so every column has a working example.

2. **Publish each tab as CSV.** In the sheet: **File → Share → Publish to
   web**. Under "Link", pick a specific tab (NOT "Entire document") and change
   "Web page" to **Comma-separated values (.csv)**, then click Publish and
   copy the URL. Repeat per tab — each tab gets its own URL (they differ by a
   `gid=` number at the end). These links are read-only — nobody can edit the
   sheet through them — and they're about to be hidden in secrets anyway. Do
   NOT click "Share" / "Anyone with the link"; the sheet itself stays private
   to Dwayne's Google account.

3. **Store each URL as a secret.** In the GitHub repo: **Settings → Secrets
   and variables → Actions → New repository secret**, using the secret names
   from the table above. This is the only place the links exist.

4. **Run the first sync.** Repo → **Actions → Sync content from Google Sheet →
   Run workflow**. When it goes green, the site is now driven by the sheet.

## Dwayne's day-to-day

1. Edit the Google Sheet (add a player row, log an event, post an interview).
2. Go to the repo's **Actions** tab → **Sync content from Google Sheet** →
   **Run workflow** button. The site updates a couple of minutes later.
3. That's it. (Even if he forgets step 2, content auto-syncs twice a day.)

## Events tab rules

- Columns: **Event Name, Location, Date, Status, Note**.
- **Status** is `upcoming` or `attended` — or leave it blank and it's worked
  out automatically from the date (today or later = upcoming). Past events
  flip to "attended" on their own at the next sync.
- Rows with no Event Name or an unreadable Date are skipped.

## Interviews tab rules

- Columns: **Player Name, Title, Date, Duration, YouTube, Closer**.
- **YouTube** takes the full video URL straight from the browser bar (or just
  the video ID). Leave blank until footage is uploaded.
- **Duration** like `12:40`. Format the column as *Plain text* in Google
  Sheets so it doesn't get converted into a time value.
- **Closer** is the player's "I got next" line shown under the clip.
- Player Name should match the Players tab spelling so the interview links to
  the right profile.

## Players tab rules

- **One row per player.** A row with an empty **Name** is ignored.
- **Don't rename or delete the header row.** Extra columns are fine — they're
  ignored. Column order doesn't matter.
- **Position / Second Position:** PG, SG, SF, PF, or C.
- **Class:** the grad year, e.g. `2027`.
- **Spotlight / On The Radar:** put `YES` to turn on, leave blank for off.
- **Status:** e.g. `Committed` or `Uncommitted`; put the school in
  **Status Detail** and the date in **Status Date** (MM/DD/YYYY).
- **Eval Updated:** date of the latest evaluation, `MM/DD/YYYY` or
  `YYYY-MM-DD`. Within the last ~3 weeks it shows a "NEW UPDATE" badge.
- **National Rank** drives the order on the rankings page. If every player has
  one, the roster is sorted by it; otherwise sheet order is used.
- **Interview Quote / Video URL:** filling either one marks the player as
  having an interview.
- **FG** can be `54` or `54%` — both work.

## Testing a sheet locally

```
npm run sync:players -- <published-csv-url or path-to-csv>
node scripts/sync-events.mjs <url-or-csv>
node scripts/sync-interviews.mjs <url-or-csv>
npm run dev
```

This regenerates the `src/data/*.generated.json` files from the given source
so you can preview exactly what the live site will show.

## Troubleshooting

- **Sync run is green but the site didn't change:** check the "Deploy to
  GitHub Pages" run that follows it in the Actions tab. GitHub Pages
  occasionally fails with "Deployment failed, try again later" — open the
  failed deploy run and click **Re-run failed jobs**. The roster data is
  already committed at that point; only the publish step needs to be retried.
- **Sync run is red:** open the run's log. The most common causes are a
  secret missing/wrong, or the sheet's "Publish to web" having been turned
  off.
- **Sheet edits take a few minutes to appear in the published CSV.** If you
  press the button immediately after editing, Google may still serve the old
  version — wait ~5 minutes and run it again.

## Upgrade path (full "option 2")

If the published-CSV link ever needs to go away entirely, swap it for a Google
service account: share the (fully private) sheet with the service account's
email, store its JSON key as a secret, and change only the fetch step in
`scripts/sync-players.mjs` to call the Sheets API. Nothing else — workflow,
site code, sheet format — changes.
