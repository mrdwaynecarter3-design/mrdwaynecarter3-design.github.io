import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center sm:px-6">
      <p className="font-display text-7xl font-extrabold text-accent">404</p>
      <h1 className="mt-4 font-display text-3xl font-extrabold uppercase tracking-tight text-white">
        Off the board
      </h1>
      <p className="mt-3 text-zinc-400">
        That page didn’t make the rankings. Let’s get you back to the players.
      </p>
      <Link
        to="/"
        className="btn-accent mt-8"
      >
        Back to home
      </Link>
    </div>
  )
}
