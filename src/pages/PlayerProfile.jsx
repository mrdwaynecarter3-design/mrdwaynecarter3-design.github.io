import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Check, Minus, Film, Quote } from 'lucide-react'
import { getPlayer, isRecentlyUpdated, formatDate } from '../data/players'
import Stars from '../components/Stars'
import { PlayerAvatar, NewBadge, StatusPill } from '../components/ui'
import NotFound from './NotFound'

function ordinal(n) {
  return n === 1 ? 'st' : n === 2 ? 'nd' : n === 3 ? 'rd' : 'th'
}

export default function PlayerProfile() {
  const { slug } = useParams()
  const player = getPlayer(slug)
  if (!player) return <NotFound />

  const isNew = isRecentlyUpdated(player.eval.updatedAt)

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="mb-6 flex items-center justify-between">
        <Link
          to="/evaluations"
          className="inline-flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wide text-zinc-400 hover:text-white"
        >
          <ArrowLeft size={16} /> All evaluations
        </Link>
        <span className="chip">Class of {player.class}</span>
      </div>

      {/* ===== Profile header (top-of-evaluation card) ===== */}
      <div className="card overflow-hidden">
        <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_auto]">
          {/* Left: identity */}
          <div>
            <div className="flex items-start gap-4">
              <PlayerAvatar name={player.name} size="h-20 w-20" text="text-2xl" />
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="font-display text-4xl font-extrabold uppercase leading-none tracking-tight text-white sm:text-5xl">
                    {player.name}
                  </h1>
                  {isNew && <NewBadge />}
                </div>
                <div className="mt-2 flex items-center gap-3">
                  <Stars count={player.stars} size="lg" />
                  <span className="text-zinc-400">
                    {player.position}
                    {player.pos2 ? `/${player.pos2}` : ''}
                  </span>
                </div>
                <p className="mt-1 font-display text-lg font-semibold text-zinc-300">
                  {player.height} · {player.weight} lbs · Class of {player.class}
                </p>
              </div>
            </div>

            <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 text-sm sm:max-w-md">
              <div>
                <dt className="text-xs uppercase tracking-wide text-zinc-500">Hometown</dt>
                <dd className="mt-0.5 font-semibold text-zinc-200">{player.hometown}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-zinc-500">School</dt>
                <dd className="mt-0.5 font-semibold text-zinc-200">{player.school}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-zinc-500">Position</dt>
                <dd className="mt-0.5 font-semibold text-zinc-200">
                  {player.position}
                  {player.pos2 ? ` / ${player.pos2}` : ''}
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-zinc-500">Status</dt>
                <dd className="mt-1">
                  <StatusPill status={player.status} detail={player.statusDetail} />
                  {player.statusDate && (
                    <span className="ml-2 text-xs text-zinc-500">{player.statusDate}</span>
                  )}
                </dd>
              </div>
            </dl>
          </div>

          {/* Right: scout grade */}
          <div className="w-full self-start border-t border-line pt-6 lg:w-56 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
            <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-500">
              Scout grade
            </p>
            <div className="mt-1 flex items-end gap-2">
              <span className="font-display text-6xl font-extrabold leading-none text-accent">
                {player.scoutGrade}
              </span>
              <Stars count={player.stars} size="sm" />
            </div>
            <p className="mt-3 font-display text-lg font-bold uppercase tracking-wide text-white">
              No. {player.rank}
              <span className="text-zinc-500"> · NXT class rank</span>
            </p>
            <dl className="mt-4 space-y-2 text-sm">
              {[
                ['National', `#${player.rank}`],
                ['Regional', `#${player.regionalRank}`],
                [`${player.state} · ${player.position}`, `#${player.stateRank}`],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between gap-4">
                  <dt className="text-zinc-500">{label}</dt>
                  <dd className="font-display text-lg font-extrabold text-white">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {/* Paper stats row */}
        <div className="grid grid-cols-2 border-t border-line sm:grid-cols-4">
          {[
            ['PPG', player.stats.ppg],
            ['RPG', player.stats.rpg],
            ['APG', player.stats.apg],
            ['FG%', player.stats.fg],
          ].map(([label, value], i) => (
            <div
              key={label}
              className={`p-4 text-center ${i < 3 ? 'border-r border-line' : ''}`}
            >
              <p className="font-display text-2xl font-extrabold text-white">{value}</p>
              <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-500">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Update banner */}
      {isNew && (
        <div className="mt-4 flex flex-wrap items-center gap-3 rounded-lg border border-line bg-ink-2 px-4 py-3 text-sm">
          <NewBadge>Updated {formatDate(player.eval.updatedAt)}</NewBadge>
          <span className="text-zinc-400">
            This evaluation was revised recently — new notes reflected below.
          </span>
        </div>
      )}

      {/* ===== Evaluation body ===== */}
      <section className="mt-10">
        <h2 className="font-display text-2xl font-extrabold uppercase tracking-tight text-white">
          The Evaluation
        </h2>
        <p className="mt-1 text-xs uppercase tracking-wide text-zinc-500">
          Last updated {formatDate(player.eval.updatedAt)}
        </p>
        <p className="mt-4 text-lg leading-relaxed text-zinc-300">{player.eval.overview}</p>

        {/* Strengths & Weaknesses headliners */}
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="font-display text-lg font-extrabold uppercase tracking-wide text-emerald-400">
              Strengths
            </h3>
            <ul className="mt-4 space-y-3">
              {player.eval.strengths.map((s, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-zinc-300">
                  <Check size={18} className="mt-0.5 shrink-0 text-emerald-400" />
                  {s}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display text-lg font-extrabold uppercase tracking-wide text-red-400">
              Weaknesses
            </h3>
            <ul className="mt-4 space-y-3">
              {player.eval.weaknesses.map((w, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-zinc-300">
                  <Minus size={18} className="mt-0.5 shrink-0 text-red-400" />
                  {w}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Film & interview */}
      <section className="mt-10 grid gap-6 md:grid-cols-2">
        <div>
          <h3 className="font-display text-lg font-extrabold uppercase tracking-wide text-white">
            Personal film
          </h3>
          <p className="mt-1 text-sm text-zinc-500">Footage I gathered in person.</p>
          {player.film.length ? (
            <ul className="mt-4 space-y-2">
              {player.film.map((f, i) => (
                <li
                  key={i}
                  className="flex items-center gap-3 rounded-lg border border-line bg-ink-2 px-4 py-3 text-sm text-zinc-300"
                >
                  <Film size={18} className="shrink-0 text-accent" />
                  {f}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-zinc-500">No personal film logged yet.</p>
          )}
        </div>

        <div>
          <h3 className="font-display text-lg font-extrabold uppercase tracking-wide text-white">
            Interview
          </h3>
          {player.interview.hasInterview ? (
            <>
              <p className="mt-1 text-sm text-zinc-500">Sat down with {player.name} on camera.</p>
              <blockquote className="mt-4 flex gap-3 rounded-lg border border-line bg-ink-2 p-4 text-zinc-300">
                <Quote size={18} className="mt-0.5 shrink-0 text-accent" />
                <span>{player.interview.quote}</span>
              </blockquote>
              <Link
                to="/interviews"
                className="mt-4 inline-block font-display text-sm font-bold uppercase tracking-wide text-accent hover:text-accent-hover"
              >
                Watch in the film room →
              </Link>
            </>
          ) : (
            <p className="mt-4 text-sm text-zinc-500">
              No interview recorded yet — on the list for the next live look.
            </p>
          )}
        </div>
      </section>

      {/* ===== Player Comparison ===== */}
      <section className="mt-10">
        <div className="card p-6 sm:p-8">
          <p className="font-display text-sm font-bold uppercase tracking-[0.2em] text-accent">
            Player Comparison
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <span className="font-display text-3xl font-extrabold uppercase text-white">
              {player.name.split(' ')[0]}
            </span>
            <span className="font-display text-2xl text-zinc-600">/</span>
            <span className="font-display text-3xl font-extrabold uppercase text-accent">
              {player.comparison.player}
            </span>
          </div>
          <p className="mt-4 max-w-3xl leading-relaxed text-zinc-300">
            {player.comparison.reasoning}
          </p>
        </div>
      </section>

      {/* CTA */}
      <div className="mt-10 flex flex-col items-center gap-4 rounded-xl border border-line bg-ink-2 p-8 text-center">
        <p className="font-display text-2xl font-extrabold uppercase tracking-tight text-white">
          Want a deeper look at {player.name.split(' ')[0]}?
        </p>
        <p className="max-w-lg text-sm text-zinc-400">
          I can put together a full report — extended film, in-person notes, and projection — on
          request for your staff.
        </p>
        <a
          href={`mailto:scouting@nxtmanup.com?subject=Scouting request — ${player.name}`}
          className="btn-accent"
        >
          Request full report
        </a>
      </div>
    </div>
  )
}
