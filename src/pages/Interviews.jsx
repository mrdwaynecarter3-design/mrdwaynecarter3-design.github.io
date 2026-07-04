import { Link } from 'react-router-dom'
import { Play } from 'lucide-react'
import { interviews } from '../data/interviews'
import { formatDate } from '../data/players'
import { SectionHeading, PlayerAvatar } from '../components/ui'

function InterviewCard({ item }) {
  return (
    <div className="card overflow-hidden">
      {/* Video frame */}
      <div className="relative aspect-video bg-ink-3">
        {item.youtubeId ? (
          <iframe
            className="absolute inset-0 h-full w-full"
            src={`https://www.youtube.com/embed/${item.youtubeId}`}
            title={item.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center">
            <div className="text-center">
              <span className="grid h-14 w-14 mx-auto place-items-center rounded-full border border-line text-zinc-300">
                <Play size={22} className="ml-0.5 fill-current" />
              </span>
              <p className="mt-3 text-xs font-bold uppercase tracking-widest text-zinc-500">
                Footage uploading soon
              </p>
            </div>
          </div>
        )}
        <span className="absolute bottom-3 right-3 rounded bg-ink/90 px-2 py-0.5 text-xs font-bold text-zinc-200">
          {item.duration}
        </span>
      </div>

      <div className="p-5">
        <div className="flex items-center gap-3">
          <PlayerAvatar name={item.playerName} slug={item.playerSlug} size="h-10 w-10" text="text-sm" />
          <div>
            <Link
              to={`/player/${item.playerSlug}`}
              className="font-display text-base font-bold text-white hover:text-accent"
            >
              {item.playerName}
            </Link>
            <p className="text-xs text-zinc-500">{formatDate(item.date)}</p>
          </div>
        </div>
        <p className="mt-3 font-semibold text-zinc-200">{item.title}</p>

        {/* The signature closer */}
        <div className="mt-4 border-t border-line pt-3">
          <span className="font-display text-xs font-bold uppercase tracking-wider text-accent">
            Closer
          </span>
          <p className="mt-1 text-sm italic text-zinc-300">“{item.closer}”</p>
        </div>
      </div>
    </div>
  )
}

export default function Interviews() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <SectionHeading eyebrow="The Film Room" title="Interviews">
        Sit-downs with the players I’m tracking. Every single one ends the same way —{' '}
        <span className="text-accent">“I got next.”</span>
      </SectionHeading>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {interviews.map((item) => (
          <InterviewCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  )
}
