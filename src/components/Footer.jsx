import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-line">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <p className="font-display text-2xl font-extrabold uppercase tracking-tight text-white">
              NXT MAN UP
            </p>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">
              Independent scouting, rankings, and evaluations on high school athletes on the rise and
              under the radar. Every prospect ends with the same line: “I got next.”
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 text-sm">
            <div>
              <p className="mb-3 font-display text-xs font-bold uppercase tracking-widest text-zinc-500">
                Explore
              </p>
              <ul className="space-y-2">
                <li><Link to="/rankings" className="text-zinc-300 hover:text-white">Rankings</Link></li>
                <li><Link to="/evaluations" className="text-zinc-300 hover:text-white">Evaluations</Link></li>
                <li><Link to="/spotlight" className="text-zinc-300 hover:text-white">NXT MAN</Link></li>
              </ul>
            </div>
            <div>
              <p className="mb-3 font-display text-xs font-bold uppercase tracking-widest text-zinc-500">
                Work With Me
              </p>
              <ul className="space-y-2">
                <li><Link to="/events" className="text-zinc-300 hover:text-white">Events</Link></li>
                <li><Link to="/interviews" className="text-zinc-300 hover:text-white">Interviews</Link></li>
                <li><a href="mailto:scouting@nxtmanup.com" className="text-zinc-300 hover:text-white">Hire for scouting</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-line pt-6 text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} NXT MAN UP. All rights reserved.</p>
          <p>Evaluations are independent opinions for coaching &amp; recruiting use.</p>
        </div>
      </div>
    </footer>
  )
}
