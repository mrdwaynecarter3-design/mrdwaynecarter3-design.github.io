import { Link, useParams } from 'react-router-dom'
import { getPlayer, isRecentlyUpdated, formatDate } from '../data/players'
import Stars from '../components/Stars'
import { PlayerAvatar, NewBadge, StatusPill } from '../components/ui'
import NotFound from './NotFound'

function RankBadge({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-line/70 py-1.5 last:border-0">
      <span className="font-display text-2xl font-extrabold leading-none text-white">{value}</span>
      <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">{label}</span>
    </div>
  )
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
          className="text-sm font-semibold uppercase tracking-wide text-zinc-400 hover:text-flame-400"
        >
          ← All evaluations
        </Link>
        <span className="chip">Class of {player.class}</span>
      </div>

      {/* ===== Profile header (top-of-evaluation card) ===== */}
      <div className="card relative overflow-hidden">
        <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-flame-600/15 blur-3xl" />
        <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1fr_auto]">
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
                  <Stars count={player.stars} size="text-lg" />
                  <span className="text-zinc-400">
                    {player.position}
                    {player.pos2 ? `/${player.pos2}` : ''}
                  </span>
                </div>
                <p className="mt-1 font-display text-lg font-semibold text-zinc-200">
                  {player.height} · {player.weight} lbs · Class of {player.class}
                </p>
              </div>
            </div>

            <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 text-sm sm:max-w-md">
              <div>
                <dt className="text-xs uppercase tracking-wide text-zinc-500">Hometown</dt>
                <dd className="mt-0.5 font-semibold text-flame-300">{player.hometown}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-zinc-500">School</dt>
                <dd className="mt-0.5 font-semibold text-flame-300">{player.school}</dd>
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

          {/* Right: scout grade box (à la the reference) */}
          <div className="w-full self-start rounded-xl border border-line bg-ink/70 p-5 lg:w-60">
            <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-500">
              Scout grade
            </p>
            <div className="mt-1 flex items-end gap-2">
              <span className="font-display text-6xl font-extrabold leading-none text-white">
                {player.scoutGrade}
              </span>
              <Stars count={player.stars} size="text-sm" />
            </div>
            <div className="mt-4 flex items-center gap-2 border-y border-line py-3">
              <span className="font-display text-3xl font-extrabold italic text-flame-400">
                {player.rank}
                {player.rank === 1 ? 'st' : player.rank === 2 ? 'nd' : player.rank === 3 ? 'rd' : 'th'}
              </span>
              <span className="rounded bg-gradient-to-r from-flame-400 to-flame-600 px-2 py-0.5 font-display text-xs font-extrabold uppercase tracking-wide text-ink">
                NXT
              </span>
            </div>
            <div className="mt-3">
              <RankBadge label="National" value={`#${player.rank}`} />
              <RankBadge label="Regional" value={`#${player.regionalRank}`} />
              <RankBadge label={`${player.state} · ${player.position}`} value={`#${player.stateRank}`} />
            </div>
          </div>
        </div>

        {/* Paper stats row */}
        <div className="grid grid-cols-2 border-t border-line sm:grid-cols-4">
          {[
            ['PPG', player.stats.ppg],
            ['RPG', player.stats.rpg],
            ['APG', player.stats.apg],
            ['FG%', player.stats.fg],
          ].map(([label, value]) => (
            <div key={label} className="border-r border-line p-4 text-center last:border-0">
              <p className="font-display text-2xl font-extrabold text-white">{value}</p>
              <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-500">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Update banner */}
      {isNew && (
        <div className="mt-4 flex items-center gap-3 rounded-xl border border-flame-500/30 bg-flame-500/5 px-4 py-3 text-sm">
          <NewBadge>Updated {formatDate(player.eval.updatedAt)}</NewBadge>
          <span className="text-zinc-300">
            This evaluation was revised recently — new notes reflected below.
          </span>
        </div>
      )}

      {/* ===== Evaluation body ===== */}
      <section className="mt-8">
        <h2 className="font-display text-2xl font-extrabold uppercase tracking-tight text-white">
          The Evaluation
        </h2>
        <p className="mt-1 text-xs uppercase tracking-wide text-zinc-500">
          Last updated {formatDate(player.eval.updatedAt)}
        </p>
        <p className="mt-4 text-lg leading-relaxed text-zinc-200">{player.eval.overview}</p>

        {/* Strengths & Weaknesses headliners */}
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <div className="card overflow-hidden">
            <div className="flex items-center gap-2 border-b border-line bg-emerald-500/10 px-5 py-3">
              <span className="text-emerald-400">▲</span>
              <h3 className="font-display text-lg font-extrabold uppercase tracking-wide text-emerald-300">
                Strengths
              </h3>
            </div>
            <ul className="space-y-3 p-5">
              {player.eval.strengths.map((s, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-zinc-200">
                  <span className="mt-1 text-emerald-400">+</span>
                  {s}
                </li>
              ))}
            </ul>
          </div>

          <div className="card overflow-hidden">
            <div className="flex items-center gap-2 border-b border-line bg-red-500/10 px-5 py-3">
              <span className="text-red-400">▼</span>
              <h3 className="font-display text-lg font-extrabold uppercase tracking-wide text-red-300">
                Weaknesses
              </h3>
            </div>
            <ul className="space-y-3 p-5">
              {player.eval.weaknesses.map((w, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-zinc-200">
                  <span className="mt-1 text-red-400">–</span>
                  {w}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Film & interview */}
      <section className="mt-8 grid gap-5 md:grid-cols-2">
        <div className="card p-6">
          <h3 className="font-display text-lg font-extrabold uppercase tracking-wide text-white">
            Personal film
          </h3>
          <p className="mt-1 text-sm text-zinc-400">Footage I gathered in person.</p>
          {player.film.length ? (
            <ul className="mt-4 space-y-2">
              {player.film.map((f, i) => (
                <li
                  key={i}
                  className="flex items-center gap-3 rounded-lg border border-line bg-ink-3/50 px-4 py-3 text-sm text-zinc-200"
                >
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-flame-500/15 text-flame-400">
                    ▶
                  </span>
                  {f}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-zinc-500">No personal film logged yet.</p>
          )}
        </div>

        <div className="card p-6">
          <h3 className="font-display text-lg font-extrabold uppercase tracking-wide text-white">
            Interview
          </h3>
          {player.interview.hasInterview ? (
            <>
              <p className="mt-1 text-sm text-zinc-400">Sat down with {player.name} on camera.</p>
              <blockquote className="mt-4 rounded-xl border-l-2 border-flame-500 bg-ink-3/50 p-4 text-zinc-200">
                <span className="text-flame-400">“</span>
                {player.interview.quote}
                <span className="text-flame-400">”</span>
              </blockquote>
              <Link
                to="/interviews"
                className="mt-4 inline-block font-display text-sm font-bold uppercase tracking-wide text-flame-400 hover:underline"
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
      <section className="mt-8">
        <div className="card relative overflow-hidden p-6 sm:p-8">
          <div className="pointer-events-none absolute -left-16 -bottom-16 h-56 w-56 rounded-full bg-flame-600/10 blur-3xl" />
          <p className="font-display text-sm font-bold uppercase tracking-[0.2em] text-flame-400">
            Player Comparison
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <span className="font-display text-3xl font-extrabold uppercase text-white">
              {player.name.split(' ')[0]}
            </span>
            <span className="font-display text-2xl text-zinc-600">⟷</span>
            <span className="font-display text-3xl font-extrabold uppercase text-flame-gradient">
              {player.comparison.player}
            </span>
          </div>
          <p className="mt-4 max-w-3xl leading-relaxed text-zinc-200">
            {player.comparison.reasoning}
          </p>
        </div>
      </section>

      {/* CTA */}
      <div className="mt-10 flex flex-col items-center gap-4 rounded-2xl border border-line bg-ink-2/60 p-8 text-center">
        <p className="font-display text-2xl font-extrabold uppercase tracking-tight text-white">
          Want a deeper look at {player.name.split(' ')[0]}?
        </p>
        <p className="max-w-lg text-sm text-zinc-400">
          I can put together a full report — extended film, in-person notes, and projection — on
          request for your staff.
        </p>
        <a
          href={`mailto:scouting@nxtmanup.com?subject=Scouting request — ${player.name}`}
          className="rounded-xl bg-gradient-to-r from-flame-400 to-flame-600 px-6 py-3 font-display font-bold uppercase tracking-wide text-ink hover:scale-[1.03]"
        >
          Request full report
        </a>
      </div>
    </div>
  )
}
