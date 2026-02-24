export default function LinkCard({ link, onTrackClick, style }) {
  const handleClick = () => {
    onTrackClick(link.id)
  }

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      style={style}
      className="group flex items-center gap-4 p-4 rounded-2xl card-glass
                 transition-all duration-200 hover:-translate-y-0.5
                 hover:shadow-[0_8px_32px_rgba(0,135,81,0.2)] animate-slide-up"
    >
      <div className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl
                      bg-white/5 border border-white/10 flex-shrink-0">
        {link.icon || '→'}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-medium text-[0.97rem] text-white truncate">{link.title}</div>
        {link.subtitle && (
          <div className="text-xs text-white/45 truncate">{link.subtitle}</div>
        )}
      </div>
      <span className="text-white/30 group-hover:text-nsa-gold group-hover:translate-x-1
                       transition-all duration-200 text-lg">›</span>
    </a>
  )
}
