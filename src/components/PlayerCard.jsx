import { Link } from 'react-router-dom'
import Stars from './Stars'
import { PlayerAvatar, NewBadge, StatusPill } from './ui'
import { isRecentlyUpdated } from '../data/players'

export default function PlayerCard({ player }) {
  const isNew = isRecentlyUpdated(player.eval.updatedAt)
  return (
    <Link
      to={`/player/${player.slug}`}
      className="card group relative flex flex-col gap-4 p-5 transition-all hover:-translate-y-0.5 hover:border-flame-500/40 hover:bg-ink-2"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <PlayerAvatar name={player.name} />
          <div>
            <p className="font-display text-lg font-bold leading-tight text-white">{player.name}</p>
            <p className="text-sm text-zinc-400">
              {player.position}
              {player.pos2 ? `/${player.pos2}` : ''} · {player.height} · {player.weight} lbs
            </p>
            <div className="mt-1">
              <Stars count={player.stars} size="text-xs" />
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

      <div className="mt-auto flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs text-zinc-400">
          <span className="chip">Class {player.class}</span>
          <span className="chip">{player.state}</span>
        </div>
        {isNew ? <NewBadge /> : <StatusPill status={player.status} detail={player.statusDetail} />}
      </div>

      {player.radar && (
        <span className="absolute -top-2 -left-2 rounded-full bg-flame-600 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-lg shadow-flame-600/30">
          Under the radar
        </span>
      )}
    </Link>
  )
}
