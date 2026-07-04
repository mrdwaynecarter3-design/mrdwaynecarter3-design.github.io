import { Link } from 'react-router-dom'
import { Check } from 'lucide-react'
import { players } from '../data/players'
import PlayerCard from '../components/PlayerCard'
import Stars from '../components/Stars'
import { SectionHeading, PlayerAvatar, NewBadge } from '../components/ui'

export default function Home() {
  const spotlight = players.find((p) => p.spotlight) || players[0]
  const risers = players.filter((p) => p.radar).slice(0, 3)
  const topThree = [...players].sort((a, b) => a.rank - b.rank).slice(0, 3)

  return (
    <>
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 pb-16 pt-16 sm:px-6 sm:pt-24">
        <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <span className="chip">Independent Scouting · Class of 2025–2032</span>
            <h1 className="mt-5 font-display text-6xl font-extrabold uppercase leading-[0.95] tracking-tight text-white sm:text-7xl">
              Find the next
              <br />
              before they’re
              <span className="text-accent"> next.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-zinc-400">
              Rankings and film-backed evaluations on high school athletes on the rise and under the
              radar. Built for coaches who want the read before the rest of the country catches on.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link to="/rankings" className="btn-accent">
                View the rankings
              </Link>
              <Link to="/evaluations" className="btn-ghost">
                Coach evaluations
              </Link>
            </div>
            <div className="mt-10 flex items-center gap-10">
              {[
                ['6', 'Classes tracked'],
                ['100%', 'Eyes-on, in person'],
                ['6+', 'Prospects on the board'],
              ].map(([n, l]) => (
                <div key={l}>
                  <p className="font-display text-2xl font-extrabold text-white">{n}</p>
                  <p className="text-xs uppercase tracking-wide text-zinc-500">{l}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Spotlight card */}
          <Link
            to={`/player/${spotlight.slug}`}
            className="card block p-6 transition-colors hover:border-zinc-600"
          >
            <div className="flex items-center justify-between">
              <span className="font-display text-xs font-bold uppercase tracking-[0.2em] text-accent">
                NXT MAN — Spotlight
              </span>
              <NewBadge>Most consistent</NewBadge>
            </div>
            <div className="mt-5 flex items-center gap-4">
              <PlayerAvatar name={spotlight.name} slug={spotlight.slug} size="h-20 w-20" text="text-2xl" />
              <div>
                <p className="font-display text-2xl font-extrabold text-white">{spotlight.name}</p>
                <p className="text-sm text-zinc-400">
                  {spotlight.position} · {spotlight.height} · {spotlight.weight} lbs · Class{' '}
                  {spotlight.class}
                </p>
                <div className="mt-1.5 flex items-center gap-2">
                  <Stars count={spotlight.stars} size="sm" />
                  <span className="text-sm text-zinc-500">{spotlight.school}</span>
                </div>
              </div>
            </div>
            <p className="mt-5 line-clamp-3 text-sm leading-relaxed text-zinc-400">
              {spotlight.eval.overview}
            </p>
            <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
              <div>
                <span className="font-display text-4xl font-extrabold text-white">
                  {spotlight.scoutGrade}
                </span>
                <span className="ml-2 text-xs uppercase tracking-wide text-zinc-500">
                  Scout grade
                </span>
              </div>
              <span className="font-display text-sm font-bold uppercase tracking-wide text-accent">
                Full evaluation →
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* Top of the board */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <SectionHeading eyebrow="The Board" title="Top of the class" />
          <Link
            to="/rankings"
            className="mb-8 shrink-0 font-display text-sm font-bold uppercase tracking-wide text-accent hover:text-accent-hover"
          >
            All rankings →
          </Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {topThree.map((p) => (
            <PlayerCard key={p.id} player={p} />
          ))}
        </div>
      </section>

      {/* Under the radar */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <SectionHeading eyebrow="Buy Stock Early" title="Under the radar">
          The risers I’m highest on before the recruiting world catches up.
        </SectionHeading>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {risers.map((p) => (
            <PlayerCard key={p.id} player={p} />
          ))}
        </div>
      </section>

      {/* For coaches CTA */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="card p-8 sm:p-12">
          <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-center">
            <div>
              <h3 className="font-display text-3xl font-extrabold uppercase tracking-tight text-white sm:text-4xl">
                Coaches — let me do the legwork.
              </h3>
              <p className="mt-4 max-w-xl text-zinc-400">
                Independent, eyes-on evaluations with strengths, weaknesses, personal film, and
                player comparisons. Hire me to scout a region, a camp, or a specific name on your
                board.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link to="/evaluations" className="btn-accent">
                  Browse evaluations
                </Link>
                <a href="mailto:scouting@nxtmanup.com" className="btn-ghost">
                  Hire for scouting
                </a>
              </div>
            </div>
            <ul className="grid gap-3">
              {[
                'Strengths & weaknesses on every player',
                'Personal film + recorded interviews',
                'Player comparison with the why behind it',
                'New-update flags when an eval changes',
              ].map((f) => (
                <li key={f} className="flex items-start gap-3 text-sm text-zinc-300">
                  <Check size={18} className="mt-0.5 shrink-0 text-accent" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  )
}
