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
      <div className="card">
        <div className="grid gap-8 p-6 sm:p-10 lg:grid-cols-[auto_1fr] lg:items-center">
          <div className="flex flex-col items-center gap-4 text-center">
            <PlayerAvatar name={featured.name} slug={featured.slug} size="h-32 w-32" text="text-4xl" />
            <div>
              <span className="font-display text-6xl font-extrabold leading-none text-accent">
                {featured.scoutGrade}
              </span>
              <p className="text-xs uppercase tracking-widest text-zinc-500">Scout grade</p>
            </div>
            <Stars count={featured.stars} size="lg" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-display text-xs font-bold uppercase tracking-[0.2em] text-accent">
                NXT MAN
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
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-zinc-300">
              {featured.eval.overview}
            </p>
            <Link to={`/player/${featured.slug}`} className="btn-accent mt-6">
              Full evaluation
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
