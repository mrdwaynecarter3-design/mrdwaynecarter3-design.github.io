# NXT MAN UP — Design & Build Reference

> Snapshot of the original site design, written **before** applying the `unslop-ui` skill.
> If the new UI turns out worse, this document + the `backup/original-ui` git branch let you
> rebuild or revert exactly. See [Restoring](#restoring-this-version) at the bottom.

---

## 1. What this site is

An independent basketball scouting site for high-school athletes "on the rise and under the radar."
Public-facing for coaches; the owner publishes rankings + evaluations. Brand hook: every interview
closes with **"I got next."**

---

## 2. Tech stack

| Layer    | Choice                         | Why |
|----------|--------------------------------|-----|
| Framework| **React 18**                   | Component reuse across player cards, badges, etc. |
| Build    | **Vite 5**                     | Fast dev/build; simple static output to `dist/`. |
| Routing  | **react-router-dom 6** (`HashRouter`) | Hash routing so deep links/refreshes work on GitHub Pages with **zero** server config. |
| Styling  | **Tailwind CSS v4** (`@tailwindcss/vite`) | Utility classes + a custom theme defined in CSS via `@theme`. |
| Fonts    | Barlow Condensed (display) + Inter (body), via Google Fonts in `index.html`. |
| Hosting  | **GitHub Pages** via Actions workflow (`.github/workflows/deploy.yml`). |

No backend, no database, no CMS. **All content is plain JS data files** (see §5).

---

## 3. Design system

Defined in [`src/index.css`](src/index.css) under `@theme`. Restore these exact tokens to keep the look.

### Color tokens
| Token            | Hex       | Use |
|------------------|-----------|-----|
| `--color-ink`    | `#0a0a0b` | Page background (near-black) |
| `--color-ink-2`  | `#121214` | Card background |
| `--color-ink-3`  | `#1b1b1f` | Chips, insets |
| `--color-line`   | `#2a2a30` | Borders/dividers |
| `--color-flame-300` | `#ffb763` | Accent light |
| `--color-flame-400` | `#ff9d2f` | Accent (gradient start) |
| `--color-flame-500` | `#ff7a1a` | Accent mid |
| `--color-flame-600` | `#ff4d2e` | Accent (gradient end) |
| `--color-gold`   | `#ffcb45` | Star ratings |

**Signature accent** = the amber→orange-red "flame" gradient
(`from-flame-400 to-flame-600`) on a near-black, court-dark base. The body has two fixed radial
glows (top-right + top-left) for depth.

### Reusable utility classes (in `index.css`)
- `.card` — rounded border + dark translucent bg + blur. The base of nearly every panel.
- `.chip` — small uppercase pill (class year, state, etc.).
- `.text-flame-gradient` — gradient clipped to text (used on "MAN UP", comparisons).
- `.font-display` — Barlow Condensed; used for all headings/numbers.
- `.no-scrollbar` — hides scrollbars on horizontal strips/tables.

### Type & tone
Big condensed uppercase display headings; tight tracking; sporty/broadcast feel (think 247Sports /
On3 / ESPN recruiting). Numbers (scout grades, stats) are oversized and bold.

---

## 4. File structure

```
index.html                  # entry, Google Fonts, meta
vite.config.js              # base:'/', react + tailwind plugins
public/favicon.svg          # "N" monogram in flame gradient
src/
  main.jsx                  # mounts <App> inside <HashRouter>
  index.css                 # Tailwind import + @theme tokens + utilities
  App.jsx                   # routes + ScrollToTop
  components/
    Navbar.jsx              # sticky top nav, mobile menu, "For Coaches" CTA
    Footer.jsx
    Stars.jsx               # 0–5 gold star rating
    ui.jsx                  # PlayerAvatar, NewBadge, SectionHeading, StatusPill
    PlayerCard.jsx          # grid card used on Home/Evaluations/Spotlight
  pages/
    Home.jsx                # hero, spotlight, top-of-board, risers, coach CTA
    Rankings.jsx            # "Select a Year & Position" filterable table
    Evaluations.jsx         # coach grid + search/filters + "new updates" strip
    PlayerProfile.jsx       # THE centerpiece (see §6)
    Spotlight.jsx           # "NXT MAN" featured player
    Events.jsx              # attended / upcoming events
    Interviews.jsx          # "film room" video cards
    NotFound.jsx            # 404
  data/
    players.js              # players + rankings + evaluations (see §5)
    events.js
    interviews.js
```

---

## 5. Data model (the important part for editing)

All content is edited in `src/data/*.js` — no code changes needed to publish.

### `players.js`
Exports `players[]`, plus `POSITIONS`, `CLASSES`, `RATING_LEGEND`, and helpers
`getPlayer(slug)`, `isRecentlyUpdated(date)`, `formatDate(date)`.

A player object:
```js
{
  id, slug,                     // slug = URL: /player/<slug>
  name, class: '2026', position: 'SF', pos2: 'PF',
  rank, regionalRank, stateRank,
  scoutGrade: 95, stars: 5,     // grade 0–100, stars 0–5
  height: "6'7\"", weight: '230',
  hometown, state, school,
  status: 'Committed', statusDetail: 'Kansas', statusDate: '04/28/2026',
  spotlight: true,              // feature as NXT MAN
  radar: false,                 // "Under the radar" tag
  stats: { ppg, rpg, apg, fg },
  interview: { hasInterview, quote, videoUrl },
  film: ['clip label', ...],
  eval: {
    updatedAt: '2026-06-18',    // drives the NEW-UPDATE badge (see §7)
    overview: '...',
    strengths: ['...'],         // headliner list
    weaknesses: ['...'],        // headliner list
  },
  comparison: { player: 'Paul Pierce', reasoning: '...' },
}
```

### `events.js`
`events[]` of `{ id, name, location, date, status: 'upcoming'|'attended', note }`.

### `interviews.js`
`interviews[]` of `{ id, playerSlug, playerName, title, date, duration, youtubeId, closer }`.
Set `youtubeId` to embed real footage; until then a placeholder frame shows.

---

## 6. Player profile = the centerpiece

[`src/pages/PlayerProfile.jsx`](src/pages/PlayerProfile.jsx) is modeled on the reference scouting
card from the brief (Tyran Stokes) **without copying its layout**. Sections, top to bottom:

1. **Header card** — avatar monogram, name, stars, position, HT/WT/class; a right-side **scout-grade
   box** (big number + stars, national/regional/state ranks, "Nth NXT" badge); a **paper-stats row**
   (PPG/RPG/APG/FG%).
2. **Update banner** — appears only if the eval was changed recently.
3. **The Evaluation** — overview paragraph + two headliner panels: **Strengths** (green) and
   **Weaknesses** (red).
4. **Personal film** + **Interview** (with the player's "I got next" quote).
5. **Player Comparison** — "Name ⟷ Comp" with the owner's reasoning (a required brief item).
6. **CTA** — "Request full report" mailto for coaches.

---

## 7. Notable behaviors

- **New-update auto-flag:** `isRecentlyUpdated()` in `players.js` returns true when `eval.updatedAt`
  is within **21 days** of today. That single date field drives the pulsing "New update" badge on
  cards, the profile banner, and the Evaluations "new updates" strip. Change the window via
  `NEW_WINDOW_DAYS` in `players.js`.
- **No real photos:** `PlayerAvatar` (in `ui.jsx`) renders initials in a gradient tile. Swap for
  `<img>` when real headshots exist.
- **Routing:** `HashRouter` → URLs look like `/#/player/tyran-stokes`. Required for GitHub Pages.
- **Placeholders to replace later:** contact email `scouting@nxtmanup.com`; interview `youtubeId`s.

---

## 8. Deploy (GitHub Pages)

- Workflow: `.github/workflows/deploy.yml` — on push to `main`, runs `npm ci && npm run build`,
  uploads `dist/`, deploys to Pages.
- **One-time manual step (repo owner / admin):** Settings → Pages → Build and deployment → Source →
  **GitHub Actions**. Pages was *not* yet enabled at the time of this snapshot.
- User GitHub Pages site → served from root, so `vite.config.js` uses `base: '/'`.

Local commands:
```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # -> dist/
npm run preview   # serve the build
```

---

## Restoring this version

The full original code is preserved on the **`backup/original-ui`** git branch.

```bash
# See what the original looked like
git checkout backup/original-ui

# If the new UI is bad and you want main back to this version:
git checkout main
git reset --hard backup/original-ui      # discards new-skill changes on main
# (or cherry-pick individual files):
git checkout backup/original-ui -- src/pages/PlayerProfile.jsx
```

If git history is gone for any reason, this document + the data model in §5 + the tokens in §3 are
enough to rebuild the look from scratch.
