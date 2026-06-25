import { events } from '../data/events'
import { formatDate } from '../data/players'
import { SectionHeading } from '../components/ui'

function EventRow({ event }) {
  const upcoming = event.status === 'upcoming'
  const d = new Date(event.date + 'T00:00:00')
  return (
    <div className="card flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-4">
        <div className="grid h-14 w-14 shrink-0 place-items-center rounded-lg border border-line bg-ink-3 text-center">
          <span className="font-display text-lg font-extrabold leading-none text-white">
            {d.getDate()}
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
            {d.toLocaleDateString('en-US', { month: 'short' })}
          </span>
        </div>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-display text-xl font-bold text-white">{event.name}</p>
            <span
              className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                upcoming ? 'bg-accent/10 text-accent' : 'bg-ink-3 text-zinc-400'
              }`}
            >
              {upcoming ? 'Attending' : 'Attended'}
            </span>
          </div>
          <p className="mt-0.5 text-sm text-zinc-400">
            {event.location} · {formatDate(event.date)}
          </p>
          <p className="mt-2 max-w-xl text-sm text-zinc-300">{event.note}</p>
        </div>
      </div>
    </div>
  )
}

export default function Events() {
  const upcoming = events
    .filter((e) => e.status === 'upcoming')
    .sort((a, b) => new Date(a.date) - new Date(b.date))
  const attended = events
    .filter((e) => e.status === 'attended')
    .sort((a, b) => new Date(b.date) - new Date(a.date))

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <SectionHeading eyebrow="On The Road" title="Events & schedule">
        Where I’ve been and where I’ll be. If your prospect is at one of these, I’ll have eyes on
        them.
      </SectionHeading>

      <div className="mb-10">
        <h3 className="mb-4 font-display text-xl font-extrabold uppercase tracking-tight text-white">
          Upcoming
        </h3>
        <div className="space-y-4">
          {upcoming.map((e) => (
            <EventRow key={e.id} event={e} />
          ))}
          {upcoming.length === 0 && (
            <p className="text-zinc-500">No events on the calendar right now — check back soon.</p>
          )}
        </div>
      </div>

      <div>
        <h3 className="mb-4 font-display text-xl font-extrabold uppercase tracking-tight text-zinc-400">
          Recently attended
        </h3>
        <div className="space-y-4">
          {attended.map((e) => (
            <EventRow key={e.id} event={e} />
          ))}
        </div>
      </div>
    </div>
  )
}
