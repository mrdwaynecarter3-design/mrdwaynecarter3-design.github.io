// Small shared presentational helpers.

export function PlayerAvatar({ name, size = 'h-14 w-14', text = 'text-lg' }) {
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
  return (
    <span
      className={`grid ${size} shrink-0 place-items-center rounded-xl bg-gradient-to-br from-ink-3 to-ink ring-1 ring-line ${text} font-display font-bold uppercase text-flame-400`}
    >
      {initials}
    </span>
  )
}

export function NewBadge({ children = 'New update' }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-flame-500/15 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-flame-300 ring-1 ring-flame-500/30">
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-flame-400 opacity-75" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-flame-400" />
      </span>
      {children}
    </span>
  )
}

export function SectionHeading({ eyebrow, title, children }) {
  return (
    <div className="mb-8">
      {eyebrow && (
        <p className="mb-2 font-display text-sm font-bold uppercase tracking-[0.2em] text-flame-400">
          {eyebrow}
        </p>
      )}
      <h2 className="font-display text-3xl font-extrabold uppercase tracking-tight text-white sm:text-4xl">
        {title}
      </h2>
      {children && <p className="mt-3 max-w-2xl text-zinc-400">{children}</p>}
    </div>
  )
}

export function StatusPill({ status, detail }) {
  const committed = status === 'Committed' || status === 'Signed'
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-bold uppercase tracking-wide ${
        committed
          ? 'bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30'
          : 'bg-zinc-500/15 text-zinc-300 ring-1 ring-zinc-500/30'
      }`}
    >
      {status}
      {detail ? ` · ${detail}` : ''}
    </span>
  )
}
