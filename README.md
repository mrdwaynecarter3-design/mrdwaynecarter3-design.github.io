# NXT MAN UP

Independent scouting, rankings, and player evaluations on high school basketball athletes on the
rise and under the radar. Built for coaches who want the read before the rest of the country catches
on — every interview ends with the same line: **“I got next.”**

## Features

- **Rankings** — pick a class (2025–2032) and position to see number rankings, paper stats, and
  commitment status.
- **Evaluations** — coach-facing player profiles with a scout-grade header, Strengths & Weaknesses,
  personal film, recorded interviews, and a **Player Comparison** with the reasoning behind it.
- **New-update flags** — evaluations changed recently are auto-badged across the site.
- **NXT MAN spotlight** — the player who stands out most recently/consistently.
- **Events** — where the scout has been and where he’ll be next.
- **Interviews** — the film room, every clip closing on “I got next.”

## Tech

React 18 · Vite · React Router · Tailwind CSS v4.

## Develop

```bash
npm install
npm run dev      # local dev server
npm run build    # production build to /dist
npm run preview  # preview the production build
```

## Editing content

All content lives in plain JS files — no CMS required:

- `src/data/players.js` — players, rankings, evaluations, comparisons.
- `src/data/events.js` — events attended / upcoming.
- `src/data/interviews.js` — uploaded interviews (add a `youtubeId` when footage is ready).

An evaluation auto-flags as a **New update** when its `updatedAt` date is within ~3 weeks of today.

## Deploy (GitHub Pages)

This is a user site repo (`mrdwaynecarter3-design.github.io`). Build with `npm run build` and publish
the `dist/` output to the Pages branch. Routing uses `HashRouter`, so deep links and refreshes work
on static hosting without extra config.
