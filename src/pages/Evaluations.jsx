import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { players, isRecentlyUpdated, formatDate } from '../data/players'
import PlayerCard from '../components/PlayerCard'
import { SectionHeading, PlayerAvatar, NewBadge } from '../components/ui'

export default function Evaluations() {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('All')

  const recentlyUpdated = useMemo(
    () =>
      players
        .filter((p) => isRecentlyUpdated(p.eval.updatedAt))
        .sort((a, b) => new Date(b.eval.updatedAt) - new Date(a.eval.updatedAt)),
    [],
  )

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return players
      .filter((p) => {
        if (filter === 'Under the radar') return p.radar
        if (filter === 'Committed') return p.status === 'Committed' || p.status === 'Signed'
        if (filter === 'Recently updated') return isRecentlyUpdated(p.eval.updatedAt)
        return true
      })
      .filter(
        (p) =>
          !q ||
          p.name.toLowerCase().includes(q) ||
          p.school.toLowerCase().includes(q) ||
          p.state.toLowerCase().includes(q),
      )
      .sort((a, b) => b.scoutGrade - a.scoutGrade)
  }, [query, filter])

  const filters = ['All', 'Recently updated', 'Under the radar', 'Committed']

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <SectionHeading eyebrow="For Coaches" title="Player evaluations">
        Click into any player for the full breakdown — scout grade, strengths & weaknesses, personal
        film, recorded interview, and my player comparison.
      </SectionHeading>

      {/* New updates strip */}
      {recentlyUpdated.length > 0 && (
        <div className="card mb-8 p-5">
          <div className="mb-4 flex items-center gap-3">
            <NewBadge>New updates</NewBadge>
            <p className="text-sm text-zinc-400">Evaluations changed in the last few weeks</p>
          </div>
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
            {recentlyUpdated.map((p) => (
              <Link
                key={p.id}
                to={`/player/${p.slug}`}
                className="flex min-w-[230px] items-center gap-3 rounded-xl border border-flame-500/30 bg-flame-500/5 p-3 transition-colors hover:bg-flame-500/10"
              >
                <PlayerAvatar name={p.name} size="h-11 w-11" text="text-sm" />
                <div>
                  <p className="font-semibold text-white">{p.name}</p>
                  <p className="text-xs text-flame-300">Updated {formatDate(p.eval.updatedAt)}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-lg px-4 py-2 text-sm font-bold uppercase tracking-wide transition-colors ${
                filter === f
                  ? 'bg-gradient-to-r from-flame-400 to-flame-600 text-ink'
                  : 'border border-line bg-ink-3 text-zinc-300 hover:border-flame-500/40'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search name, school, state…"
          className="w-full rounded-lg border border-line bg-ink-2 px-4 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:border-flame-500/50 focus:outline-none sm:w-72"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p) => (
          <PlayerCard key={p.id} player={p} />
        ))}
      </div>
      {filtered.length === 0 && (
        <p className="py-12 text-center text-zinc-500">No players match that search.</p>
      )}
    </div>
  )
}
