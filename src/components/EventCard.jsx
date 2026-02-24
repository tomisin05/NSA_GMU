export default function EventCard({ event, style }) {
  const isPast = event.date && new Date(event.date) < new Date()
  const formattedDate = event.date
    ? new Date(event.date).toLocaleDateString('en-US', {
        month: 'long', day: 'numeric', year: 'numeric',
      })
    : null

  return (
    <a
      href={event.url || '#'}
      target={event.url ? '_blank' : '_self'}
      rel="noopener noreferrer"
      style={style}
      className="block p-5 rounded-2xl animate-slide-up transition-all duration-200
                 hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(0,135,81,0.25)]
                 bg-gradient-to-br from-nsa-green/20 to-nsa-gold/10
                 border border-nsa-green/40 hover:border-nsa-green/70"
    >
      <span className={`inline-block text-white text-[0.65rem] uppercase tracking-widest
                        font-medium px-3 py-1 rounded-full mb-3
                        ${isPast ? 'bg-white/20' : 'bg-nsa-green'}`}>
        {isPast ? 'Past Event' : (event.badge || 'Upcoming')}
      </span>
      <h3 className="font-display text-xl font-bold mb-2 text-white">{event.title}</h3>
      {event.description && (
        <p className="text-white/60 text-sm mb-3 line-clamp-2">{event.description}</p>
      )}
      <div className="flex flex-wrap gap-4 text-sm text-white/55">
        {formattedDate && (
          <span className="flex items-center gap-1.5">{formattedDate}</span>
        )}
        {event.time && (
          <span className="flex items-center gap-1.5">{event.time}</span>
        )}
        {event.location && (
          <span className="flex items-center gap-1.5">{event.location}</span>
        )}
        {event.price && (
          <span className="flex items-center gap-1.5">{event.price}</span>
        )}
      </div>
    </a>
  )
}
