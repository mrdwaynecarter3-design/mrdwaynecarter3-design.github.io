import { Link } from 'react-router-dom'
import Stars from './Stars'
import { PlayerAvatar, NewBadge, StatusPill } from './ui'
import { isRecentlyUpdated } from '../data/players'

export default function PlayerCard({ player }) {
  const isNew = isRecentlyUpdated(player.eval.updatedAt)
  return (
    <Link
      to={`/player/${player.slug}`}
      className="card flex flex-col gap-4 p-5 transition-colors hover:border-zinc-600"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <PlayerAvatar name={player.name} slug={player.slug} />
          <div>
            <p className="font-display text-lg font-bold leading-tight text-white">{player.name}</p>
            <p className="text-sm text-zinc-400">
              {player.position}
              {player.pos2 ? `/${player.pos2}` : ''} · {player.height} · {player.weight} lbs
            </p>
            <div className="mt-1.5">
              <Stars count={player.stars} size="sm" />
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="font-display text-3xl font-extrabold leading-none text-white">
            {player.scoutGrade}
          </div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Scout grade</p>
        </div>
      </div>

      <div className="mt-auto flex items-center justify-between gap-2 border-t border-line pt-4">
        <div className="flex items-center gap-2 text-xs text-zinc-400">
          <span className="chip">Class {player.class}</span>
          <span className="chip">{player.state}</span>
          {player.radar && (
            <span className="text-[11px] font-semibold uppercase tracking-wide text-accent">
              Under the radar
            </span>
          )}
        </div>
        {isNew ? <NewBadge /> : <StatusPill status={player.status} detail={player.statusDetail} />}
      </div>
    </Link>
  )
}
