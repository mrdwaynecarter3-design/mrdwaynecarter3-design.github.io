# "Publish to site" button inside the Google Sheet

Gives Dwayne a menu inside the spreadsheet — **NXT MAN UP → Publish to
site** — that triggers the sync workflow. He never needs to open GitHub.

## One-time setup (you, the dev)

### 1. Create a GitHub token the script can use

1. GitHub → your avatar → **Settings → Developer settings →
   Personal access tokens → Fine-grained tokens → Generate new token**.
2. Name: `sheet-publish-button`. Expiration: 1 year (set a reminder).
3. **Repository access:** Only select repositories →
   `mrdwaynecarter3-design.github.io`.
4. **Permissions → Repository permissions → Actions: Read and write.**
   Leave everything else "No access".
5. Generate and copy the token (starts with `github_pat_`).

### 2. Attach the script to the spreadsheet

1. Open the spreadsheet → **Extensions → Apps Script**.
2. Delete any placeholder code and paste the contents of
   `docs/sheet-publish-button.gs` from this repo.
3. In the Apps Script editor: **Project Settings (gear icon) → Script
   Properties → Add script property**. Name: `GITHUB_TOKEN`, value: the
   token from step 1. (Stored server-side by Google; not visible in the
   sheet itself.)
4. Back in the editor, click **Run** once on the `publishToSite` function.
   Google will ask you to authorize the script (it needs permission to
   contact an external service and show menus). Approve it.
5. Reload the spreadsheet. A **NXT MAN UP** menu appears to the right of
   Help. Done.

## Dwayne's flow

1. Edit the sheet.
2. **NXT MAN UP → Publish to site.**
3. A "Publishing…" note pops up, then "Sent! The site updates in a couple
   of minutes." That's it.

Notes:
- The button just triggers the same sync workflow as the GitHub "Run
  workflow" button; the twice-daily auto-sync still runs as a backstop.
- If the token expires or is revoked, the button shows an error message
  telling him to contact you.
