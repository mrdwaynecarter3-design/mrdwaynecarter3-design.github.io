# Google Sheet roster — setup and daily use

The player roster lives in a Google Sheet. A GitHub Action ("Sync roster from
Google Sheet") pulls the sheet, converts it to `src/data/players.generated.json`,
commits it, and redeploys the site. The sheet's URL is stored as a GitHub
secret, so it is never visible in the code or on the site.

## One-time setup

1. **Create the sheet.** Go to [sheets.google.com](https://sheets.google.com), create a new
   spreadsheet named e.g. "NXT MAN UP Roster", then **File → Import → Upload**
   and upload `docs/players-template.csv` from this repo (choose "Replace
   spreadsheet"). It arrives pre-filled with the current six players so every
   column has a working example.

2. **Publish it as CSV.** In the sheet: **File → Share → Publish to web**.
   Under "Link", pick the roster tab and change "Web page" to
   **Comma-separated values (.csv)**, then click Publish and copy the URL.
   This link is read-only — nobody can edit the sheet through it — and it is
   about to be hidden in a secret anyway. Do NOT click "Share" / "Anyone with
   the link"; the sheet itself stays private to Dwayne's Google account.

3. **Store the URL as a secret.** In the GitHub repo: **Settings → Secrets and
   variables → Actions → New repository secret**. Name: `SHEET_CSV_URL`,
   value: the URL you copied. This is the only place the link exists.

4. **Run the first sync.** Repo → **Actions → Sync roster from Google Sheet →
   Run workflow**. When it goes green, the site is now driven by the sheet.

## Dwayne's day-to-day

1. Edit the Google Sheet (add a row for a new player, update stats, etc.).
2. Go to the repo's **Actions** tab → **Sync roster from Google Sheet** →
   **Run workflow** button. The site updates a couple of minutes later.
3. That's it. (Even if he forgets step 2, the roster auto-syncs twice a day.)

## Sheet rules

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
npm run dev
```

This regenerates `src/data/players.generated.json` from the given source so
you can preview exactly what the live site will show.

## Troubleshooting

- **Sync run is green but the site didn't change:** check the "Deploy to
  GitHub Pages" run that follows it in the Actions tab. GitHub Pages
  occasionally fails with "Deployment failed, try again later" — open the
  failed deploy run and click **Re-run failed jobs**. The roster data is
  already committed at that point; only the publish step needs to be retried.
- **Sync run is red:** open the run's log. The most common causes are the
  `SHEET_CSV_URL` secret missing/wrong, or the sheet's "Publish to web"
  having been turned off.
- **Sheet edits take a few minutes to appear in the published CSV.** If you
  press the button immediately after editing, Google may still serve the old
  version — wait ~5 minutes and run it again.

## Upgrade path (full "option 2")

If the published-CSV link ever needs to go away entirely, swap it for a Google
service account: share the (fully private) sheet with the service account's
email, store its JSON key as a secret, and change only the fetch step in
`scripts/sync-players.mjs` to call the Sheets API. Nothing else — workflow,
site code, sheet format — changes.
