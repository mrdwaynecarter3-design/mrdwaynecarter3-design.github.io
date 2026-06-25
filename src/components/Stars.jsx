export default function Stars({ count = 0, size = 'text-base' }) {
  return (
    <span className={`inline-flex ${size} leading-none`} aria-label={`${count} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={i <= count ? 'text-gold' : 'text-zinc-700'}>
          ★
        </span>
      ))}
    </span>
  )
}
