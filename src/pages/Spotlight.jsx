import { Link } from 'react-router-dom'
import { players } from '../data/players'
import Stars from '../components/Stars'
import { SectionHeading, PlayerAvatar, NewBadge } from '../components/ui'
import PlayerCard from '../components/PlayerCard'

export default function Spotlight() {
  const featured = players.find((p) => p.spotlight) || players[0]
  const consistent = players.filter((p) => p.slug !== featured.slug && !p.radar).slice(0, 3)

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <SectionHeading eyebrow="Player Watch" title="The NXT MAN">
        The player who stood out most recently — and most consistently. Who I’d tell a coach to put
        eyes on first.
      </SectionHeading>

      {/* Hero feature */}
      <div className="card relative overflow-hidden">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-flame-600/20 blur-3xl" />
        <div className="grid gap-8 p-6 sm:p-10 lg:grid-cols-[auto_1fr] lg:items-center">
          <div className="flex flex-col items-center gap-4 text-center">
            <PlayerAvatar name={featured.name} size="h-32 w-32" text="text-4xl" />
            <div>
              <span className="font-display text-6xl font-extrabold leading-none text-white">
                {featured.scoutGrade}
              </span>
              <p className="text-xs uppercase tracking-widest text-zinc-500">Scout grade</p>
            </div>
            <Stars count={featured.stars} size="text-xl" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded bg-gradient-to-r from-flame-400 to-flame-600 px-2.5 py-1 font-display text-xs font-extrabold uppercase tracking-wide text-ink">
                ★ NXT MAN
              </span>
              <NewBadge>Spotlight</NewBadge>
            </div>
            <h3 className="mt-3 font-display text-5xl font-extrabold uppercase leading-none tracking-tight text-white">
              {featured.name}
            </h3>
            <p className="mt-2 text-zinc-400">
              {featured.position}
              {featured.pos2 ? `/${featured.pos2}` : ''} · {featured.height} · {featured.weight} lbs ·
              Class {featured.class} · {featured.school}
            </p>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-zinc-200">
              {featured.eval.overview}
            </p>
            <Link
              to={`/player/${featured.slug}`}
              className="mt-6 inline-block rounded-xl bg-gradient-to-r from-flame-400 to-flame-600 px-6 py-3 font-display font-bold uppercase tracking-wide text-ink hover:scale-[1.03]"
            >
              Full evaluation →
            </Link>
          </div>
        </div>
      </div>

      {/* Also watching */}
      <div className="mt-12">
        <h3 className="mb-6 font-display text-2xl font-extrabold uppercase tracking-tight text-white">
          Also on watch
        </h3>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {consistent.map((p) => (
            <PlayerCard key={p.id} player={p} />
          ))}
        </div>
      </div>
    </div>
  )
}
