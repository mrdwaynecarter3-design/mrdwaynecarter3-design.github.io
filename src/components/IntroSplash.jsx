import { useEffect, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'

// Full-screen "I GOT NEXT" intro shown on page load. Any scroll / key / tap
// reveals the site beneath it.
export default function IntroSplash() {
  const [done, setDone] = useState(false)
  const [leaving, setLeaving] = useState(false)
  const leavingRef = useRef(false)

  const dismiss = () => {
    if (leavingRef.current) return
    leavingRef.current = true
    setLeaving(true)
    window.setTimeout(() => {
      document.body.style.overflow = ''
      setDone(true)
    }, 700)
  }

  useEffect(() => {
    document.body.style.overflow = 'hidden'

    const onWheel = (e) => {
      if (e.deltaY > 0) dismiss()
    }
    const onKey = (e) => {
      if ([' ', 'Enter', 'ArrowDown', 'PageDown'].includes(e.key)) dismiss()
    }

    window.addEventListener('wheel', onWheel, { passive: true })
    window.addEventListener('touchmove', dismiss, { passive: true })
    window.addEventListener('keydown', onKey)

    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchmove', dismiss)
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (done) return null

  return (
    <button
      type="button"
      aria-label="Enter site"
      onClick={dismiss}
      className={`fixed inset-0 z-[100] flex w-full cursor-pointer flex-col items-center justify-center bg-ink transition-all duration-700 ease-out ${
        leaving ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'
      }`}
    >
      <span className="font-display text-sm font-bold uppercase tracking-[0.4em] text-accent">
        NXT MAN UP
      </span>
      <h1 className="mt-4 px-4 text-center font-display text-7xl font-extrabold uppercase leading-[0.9] tracking-tight text-white sm:text-9xl lg:text-[11rem]">
        I Got Next<span className="text-accent">.</span>
      </h1>

      <span className="absolute bottom-10 flex flex-col items-center gap-2 text-zinc-500">
        <span className="text-xs font-semibold uppercase tracking-[0.2em]">Scroll to enter</span>
        <ChevronDown size={20} className="animate-bounce" />
      </span>
    </button>
  )
}
