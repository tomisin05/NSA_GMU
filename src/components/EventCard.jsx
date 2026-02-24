export default function EventCard({ event, onTrackClick, style }) {
  const getEventStatus = () => {
    if (!event.date) return 'upcoming'
    const now = new Date()
    const eventDate = new Date(event.date + 'T00:00:00')
    
    if (event.time && event.endTime) {
      const parseTime = (timeStr) => {
        const [time, period] = timeStr.trim().split(' ')
        const [hours, minutes] = time.split(':')
        let hour = parseInt(hours)
        if (period?.toLowerCase() === 'pm' && hour !== 12) hour += 12
        if (period?.toLowerCase() === 'am' && hour === 12) hour = 0
        return { hour, minute: parseInt(minutes) || 0 }
      }
      
      const start = parseTime(event.time)
      const end = parseTime(event.endTime)
      const eventStart = new Date(eventDate)
      eventStart.setHours(start.hour, start.minute)
      const eventEnd = new Date(eventDate)
      eventEnd.setHours(end.hour, end.minute)
      
      if (now >= eventStart && now <= eventEnd) return 'live'
      if (now > eventEnd) return 'past'
    } else if (now > eventDate) {
      return 'past'
    }
    
    return 'upcoming'
  }

  const handleClick = () => {
    if (onTrackClick) onTrackClick(event.id)
  }

  const status = getEventStatus()
  const formattedDate = event.date
    ? new Date(event.date + 'T00:00:00').toLocaleDateString('en-US', {
        month: 'long', day: 'numeric', year: 'numeric',
      })
    : null

  return (
    <a
      href={event.url || '#'}
      target={event.url ? '_blank' : '_self'}
      rel="noopener noreferrer"
      onClick={handleClick}
      style={style}
      className="block p-5 rounded-2xl animate-slide-up transition-all duration-200
                 hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(0,135,81,0.25)]
                 bg-gradient-to-br from-nsa-green/20 to-nsa-gold/10
                 border border-nsa-green/40 hover:border-nsa-green/70"
    >
      {event.flyer && (
        <img src={event.flyer} alt={event.title} className="w-full object-contain rounded-xl mb-4" />
      )}
      <span className={`inline-block text-white text-[0.65rem] uppercase tracking-widest
                        font-medium px-3 py-1 rounded-full mb-3
                        ${status === 'past' ? 'bg-white/20' : status === 'live' ? 'bg-red-500 animate-pulse' : 'bg-nsa-green'}`}>
        {status === 'past' ? 'Past Event' : status === 'live' ? 'Live Now' : (event.badge || 'Upcoming')}
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
          <span className="flex items-center gap-1.5">{event.time}{event.endTime && ` - ${event.endTime}`}</span>
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
