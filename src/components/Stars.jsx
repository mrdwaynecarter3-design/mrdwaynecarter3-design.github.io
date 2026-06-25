import { Star } from 'lucide-react'

const sizeMap = {
  sm: 12,
  base: 14,
  lg: 18,
}

export default function Stars({ count = 0, size = 'base' }) {
  const px = sizeMap[size] || sizeMap.base
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${count} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={px}
          strokeWidth={0}
          className={i <= count ? 'fill-gold' : 'fill-zinc-700'}
        />
      ))}
    </span>
  )
}
