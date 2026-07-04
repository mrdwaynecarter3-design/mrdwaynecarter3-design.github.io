// Small shared presentational helpers.

import { useState } from 'react'

// Fixed-size frame either way: headshot from /public/players/{slug}.jpg when
// one exists, initials otherwise — layout is identical with or without a photo.
// To add a photo, drop {slug}.jpg into public/players/ (see the NAMING.md there).
export function PlayerAvatar({ name, slug, size = 'h-14 w-14', text = 'text-lg' }) {
  const [photoFailed, setPhotoFailed] = useState(false)
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
  return (
    <span
      className={`relative grid ${size} shrink-0 place-items-center overflow-hidden rounded-full bg-ink-3 ring-1 ring-line ${text} font-display font-bold uppercase text-zinc-200`}
    >
      {initials}
      {slug && !photoFailed && (
        <img
          src={`/players/${slug}.jpg`}
          alt=""
          loading="lazy"
          onError={() => setPhotoFailed(true)}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
    </span>
  )
}

export function NewBadge({ children = 'New update' }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md bg-accent/10 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-accent ring-1 ring-accent/25">
      <span className="h-1.5 w-1.5 rounded-full bg-accent" />
      {children}
    </span>
  )
}

export function SectionHeading({ eyebrow, title, children }) {
  return (
    <div className="mb-8">
      {eyebrow && (
        <p className="mb-2 font-display text-sm font-bold uppercase tracking-[0.2em] text-accent">
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
        committed ? 'bg-emerald-500/10 text-emerald-400' : 'bg-ink-3 text-zinc-400'
      }`}
    >
      {status}
      {detail ? ` · ${detail}` : ''}
    </span>
  )
}
