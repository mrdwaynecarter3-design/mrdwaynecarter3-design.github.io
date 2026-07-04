import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { players, POSITIONS, CLASSES, RATING_LEGEND } from '../data/players'
import Stars from '../components/Stars'
import { SectionHeading, PlayerAvatar } from '../components/ui'

export default function Rankings() {
  const [year, setYear] = useState('All')
  const [position, setPosition] = useState('All')

  const rows = useMemo(() => {
    return players
      .filter((p) => (year === 'All' ? true : p.class === year))
      .filter((p) => (position === 'All' ? true : p.position === position || p.pos2 === position))
      .sort((a, b) => a.scoutGrade - b.scoutGrade)
      .reverse()
  }, [year, position])

  const years = ['All', ...CLASSES]
  const positions = ['All', ...POSITIONS]

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <SectionHeading eyebrow="The Board" title="Select a year & position">
        Number rankings and the paper stats. Click any player to open the full evaluation, film, and
        interview.
      </SectionHeading>

      {/* Filters */}
      <div className="card p-5">
        <p className="mb-2 font-display text-xs font-bold uppercase tracking-widest text-zinc-500">
          Class
        </p>
        <div className="flex flex-wrap gap-2">
          {years.map((y) => (
            <button
              key={y}
              onClick={() => setYear(y)}
              className={`rounded-lg px-4 py-2 font-display text-sm font-bold uppercase tracking-wide transition-colors ${
                year === y
                  ? 'bg-accent text-ink'
                  : 'border border-line bg-ink-3 text-zinc-300 hover:bg-ink-2'
              }`}
            >
              {y === 'All' ? 'All classes' : y}
            </button>
          ))}
        </div>

        <p className="mb-2 mt-5 font-display text-xs font-bold uppercase tracking-widest text-zinc-500">
          Position
        </p>
        <div className="flex flex-wrap gap-2">
          {positions.map((p) => (
            <button
              key={p}
              onClick={() => setPosition(p)}
              className={`rounded-lg px-4 py-2 font-display text-sm font-bold uppercase tracking-wide transition-colors ${
                position === p
                  ? 'bg-accent text-ink'
                  : 'border border-line bg-ink-3 text-zinc-300 hover:bg-ink-2'
              }`}
            >
              {p === 'All' ? 'All positions' : p}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="card mt-6 overflow-hidden">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full min-w-[760px] text-left">
            <thead>
              <tr className="bg-ink-3/80 text-[11px] uppercase tracking-wider text-zinc-400">
                <th className="px-4 py-3 font-bold">Rank</th>
                <th className="px-4 py-3 font-bold">Name</th>
                <th className="px-4 py-3 font-bold">Rating</th>
                <th className="px-4 py-3 font-bold">State</th>
                <th className="px-4 py-3 font-bold">HT</th>
                <th className="px-4 py-3 font-bold">WT</th>
                <th className="px-4 py-3 font-bold">Offers &amp; Commitment</th>
                <th className="px-4 py-3 text-right font-bold">Player Profile</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p, i) => (
                <tr
                  key={p.id}
                  className="border-t border-line transition-colors hover:bg-ink-2"
                >
                  <td className="px-4 py-3">
                    <span className="font-display text-xl font-extrabold text-white">{i + 1}</span>
                  </td>
                  <td className="px-4 py-3">
                    <Link to={`/player/${p.slug}`} className="flex items-center gap-3 group">
                      <PlayerAvatar name={p.name} slug={p.slug} size="h-10 w-10" text="text-sm" />
                      <div>
                        <p className="font-semibold text-white group-hover:text-accent">
                          {p.name}
                        </p>
                        <p className="text-xs text-zinc-500">
                          {p.position}
                          {p.pos2 ? `/${p.pos2}` : ''} · Class {p.class}
                        </p>
                      </div>
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="font-display text-lg font-extrabold text-white">
                        {p.scoutGrade}
                      </span>
                      <Stars count={p.stars} size="sm" />
                    </div>
                  </td>
                  <td className="px-4 py-3 text-zinc-300">{p.state}</td>
                  <td className="px-4 py-3 text-zinc-300">{p.height}</td>
                  <td className="px-4 py-3 text-zinc-300">{p.weight}</td>
                  <td className="px-4 py-3">
                    {p.status === 'Committed' || p.status === 'Signed' ? (
                      <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-500/10 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-emerald-400">
                        {p.status} · {p.statusDetail}
                      </span>
                    ) : (
                      <span className="text-sm text-zinc-400">Uncommitted</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      to={`/player/${p.slug}`}
                      className="font-display text-sm font-bold uppercase tracking-wide text-accent hover:text-accent-hover"
                    >
                      View →
                    </Link>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-zinc-500">
                    No players ranked for this class &amp; position yet. Check back after the next
                    live period.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Rating legend */}
      <div className="card mt-6 p-6">
        <p className="font-display text-sm font-bold uppercase tracking-widest text-zinc-400">
          Player ratings
        </p>
        <div className="mt-4 grid gap-x-8 gap-y-2 sm:grid-cols-2">
          {RATING_LEGEND.map((r) => (
            <div key={r.score} className="flex items-start gap-3 text-sm">
              <span className="w-24 shrink-0 font-display font-bold text-accent">{r.score}</span>
              <span className="text-zinc-400">{r.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
