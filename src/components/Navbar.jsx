import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { Menu, X } from 'lucide-react'

const links = [
  { to: '/rankings', label: 'Rankings' },
  { to: '/evaluations', label: 'Evaluations' },
  { to: '/spotlight', label: 'NXT MAN' },
  { to: '/events', label: 'Events' },
  { to: '/interviews', label: 'Interviews' },
]

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2.5">
      <span className="grid h-9 w-9 place-items-center rounded-md bg-accent font-display text-xl font-extrabold text-ink">
        N
      </span>
      <span className="font-display text-2xl font-extrabold uppercase leading-none tracking-tight text-white">
        NXT MAN UP
      </span>
    </Link>
  )
}

export default function Navbar() {
  const [open, setOpen] = useState(false)

  const linkClass = ({ isActive }) =>
    `text-sm font-semibold uppercase tracking-wide transition-colors ${
      isActive ? 'text-white' : 'text-zinc-400 hover:text-white'
    }`

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-ink">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Logo />

        <div className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} className={linkClass}>
              {l.label}
            </NavLink>
          ))}
          <Link to="/evaluations" className="btn-accent">
            For Coaches
          </Link>
        </div>

        <button
          className="grid h-10 w-10 place-items-center rounded-lg border border-line text-zinc-200 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-line bg-ink px-4 py-3 md:hidden">
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
