// NXT MAN UP — "Publish to site" menu for the roster spreadsheet.
// Paste into Extensions -> Apps Script. Setup: docs/SHEET-PUBLISH-BUTTON.md.
// Requires a GITHUB_TOKEN script property (fine-grained PAT, Actions: write).

const GITHUB_OWNER = 'mrdwaynecarter3-design'
const GITHUB_REPO = 'mrdwaynecarter3-design.github.io'
const WORKFLOW_FILE = 'sync-roster.yml'

function onOpen() {
  SpreadsheetApp.getUi().createMenu('NXT MAN UP').addItem('Publish to site', 'publishToSite').addToUi()
}

function publishToSite() {
  const ss = SpreadsheetApp.getActiveSpreadsheet()
  const token = PropertiesService.getScriptProperties().getProperty('GITHUB_TOKEN')
  if (!token) {
    SpreadsheetApp.getUi().alert(
      'Publish is not set up yet — the GitHub token is missing. Contact your developer.'
    )
    return
  }

  ss.toast('Publishing…', 'NXT MAN UP', 5)
  const url =
    'https://api.github.com/repos/' +
    GITHUB_OWNER +
    '/' +
    GITHUB_REPO +
    '/actions/workflows/' +
    WORKFLOW_FILE +
    '/dispatches'

  const response = UrlFetchApp.fetch(url, {
    method: 'post',
    contentType: 'application/json',
    headers: {
      Authorization: 'Bearer ' + token,
      Accept: 'application/vnd.github+json',
    },
    payload: JSON.stringify({ ref: 'main' }),
    muteHttpExceptions: true,
  })

  const code = response.getResponseCode()
  if (code === 204) {
    ss.toast('Sent! The site updates in a couple of minutes.', 'NXT MAN UP', 8)
  } else if (code === 401 || code === 403) {
    SpreadsheetApp.getUi().alert(
      'Publish failed: GitHub rejected the token (it may have expired). Contact your developer.'
    )
  } else {
    SpreadsheetApp.getUi().alert(
      'Publish failed (HTTP ' + code + '). Try again in a minute; if it keeps failing, contact your developer.'
    )
  }
}
