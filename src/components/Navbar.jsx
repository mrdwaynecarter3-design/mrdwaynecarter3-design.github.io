import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'

const links = [
  { to: '/rankings', label: 'Rankings' },
  { to: '/evaluations', label: 'Evaluations' },
  { to: '/spotlight', label: 'NXT MAN' },
  { to: '/events', label: 'Events' },
  { to: '/interviews', label: 'Interviews' },
]

function Logo() {
  return (
    <Link to="/" className="group flex items-center gap-2.5">
      <span className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-flame-400 to-flame-600 font-display text-xl font-extrabold text-ink shadow-lg shadow-flame-600/20">
        N
      </span>
      <span className="font-display text-2xl font-extrabold uppercase leading-none tracking-tight text-white">
        NXT<span className="text-flame-gradient"> MAN UP</span>
      </span>
    </Link>
  )
}

export default function Navbar() {
  const [open, setOpen] = useState(false)

  const linkClass = ({ isActive }) =>
    `text-sm font-semibold uppercase tracking-wide transition-colors ${
      isActive ? 'text-white' : 'text-zinc-400 hover:text-flame-400'
    }`

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-ink/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Logo />

        <div className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} className={linkClass}>
              {l.label}
            </NavLink>
          ))}
          <Link
            to="/evaluations"
            className="rounded-lg bg-gradient-to-r from-flame-400 to-flame-600 px-4 py-2 text-sm font-bold uppercase tracking-wide text-ink transition-transform hover:scale-[1.03]"
          >
            For Coaches
          </Link>
        </div>

        <button
          className="grid h-10 w-10 place-items-center rounded-lg border border-line text-zinc-200 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <div className="space-y-1.5">
            <span className={`block h-0.5 w-5 bg-current transition ${open ? 'translate-y-2 rotate-45' : ''}`} />
            <span className={`block h-0.5 w-5 bg-current transition ${open ? 'opacity-0' : ''}`} />
            <span className={`block h-0.5 w-5 bg-current transition ${open ? '-translate-y-2 -rotate-45' : ''}`} />
          </div>
        </button>
      </nav>

      {open && (
        <div className="border-t border-line bg-ink-2 px-4 py-3 md:hidden">
          <div className="flex flex-col gap-1">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2.5 text-sm font-semibold uppercase tracking-wide ${
                    isActive ? 'bg-ink-3 text-white' : 'text-zinc-300'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
