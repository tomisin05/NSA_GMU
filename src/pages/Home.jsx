import { useLinks } from '../hooks/useLinks'
import { useEvents } from '../hooks/useEvents'
import { useProfile } from '../hooks/useProfile'
import LinkCard from '../components/LinkCard'
import EventCard from '../components/EventCard'

const SOCIALS = [
  { key: 'instagram', emoji: '📷', label: 'Instagram' },
  { key: 'twitter', emoji: '🐦', label: 'Twitter' },
  { key: 'facebook', emoji: '👥', label: 'Facebook' },
  { key: 'whatsapp', emoji: '💬', label: 'WhatsApp' },
  { key: 'youtube', emoji: '▶️', label: 'YouTube' },
  { key: 'email', emoji: '✉️', label: 'Email', prefix: 'mailto:' },
]

export default function Home() {
  const { links, loading: linksLoading, trackClick } = useLinks()
  const { events, loading: eventsLoading } = useEvents()
  const { profile } = useProfile()

  const upcomingEvents = events.filter(e => e.date && new Date(e.date) >= new Date())
  const featuredEvent = upcomingEvents[0]

  return (
    <div className="min-h-screen bg-mesh bg-nsa-dark flex justify-center py-16 px-4">
      <div className="w-full max-w-[560px] flex flex-col items-center">

        {/* Avatar */}
        <div className="relative mb-5 animate-fade-down">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-nsa-green to-nsa-gold
                          flex items-center justify-center font-display text-3xl font-black
                          border-2 border-nsa-gold/50
                          shadow-[0_0_40px_rgba(0,135,81,0.4),0_0_0_6px_rgba(0,135,81,0.1)]">
            NSA
          </div>
          <div className="absolute bottom-0.5 right-0.5 w-7 h-7 bg-white rounded-full
                          flex items-center justify-center text-base
                          border-2 border-nsa-dark shadow-md">
            🇳🇬
          </div>
        </div>

        {/* Name */}
        <h1 className="font-display text-[1.75rem] font-black text-gradient text-center
                       animate-fade-down [animation-delay:100ms] mb-2">
          {profile.name}
        </h1>
        <p className="text-white/45 text-sm uppercase tracking-widest
                      animate-fade-down [animation-delay:150ms] mb-3">
          {profile.handle}
        </p>

        {/* Flag stripe */}
        <div className="w-14 h-0.5 rounded-full animate-fade-in [animation-delay:200ms] mb-5"
             style={{ background: 'linear-gradient(to right, #008751 33%, white 33%, white 66%, #008751 66%)' }} />

        {/* Bio */}
        <p className="text-center text-white/65 text-sm leading-relaxed max-w-sm
                      animate-fade-in [animation-delay:220ms] mb-10 px-2">
          {profile.bio}
        </p>

        {/* Featured Event */}
        {featuredEvent && (
          <>
            <SectionLabel emoji="🔥" label="Featured Event" delay={260} />
            <div className="w-full mb-3">
              <EventCard event={featuredEvent} style={{ animationDelay: '280ms' }} />
            </div>
          </>
        )}

        {/* All upcoming events if more than 1 */}
        {upcomingEvents.length > 1 && (
          <>
            <SectionLabel emoji="📅" label="All Events" delay={320} />
            <div className="w-full flex flex-col gap-3 mb-3">
              {upcomingEvents.slice(1).map((event, i) => (
                <EventCard key={event.id} event={event}
                           style={{ animationDelay: `${340 + i * 60}ms` }} />
              ))}
            </div>
          </>
        )}

        {/* Links */}
        {!linksLoading && links.length > 0 && (
          <>
            <SectionLabel emoji="🔗" label="Quick Links" delay={400} />
            <div className="w-full flex flex-col gap-3 mb-3">
              {links.map((link, i) => (
                <LinkCard key={link.id} link={link} onTrackClick={trackClick}
                          style={{ animationDelay: `${420 + i * 60}ms` }} />
              ))}
            </div>
          </>
        )}

        {/* Socials */}
        <div className="flex gap-2.5 mt-8 animate-fade-in [animation-delay:700ms]">
          {SOCIALS.map(({ key, emoji, label, prefix }) => {
            const val = profile[key]
            if (!val) return null
            const href = prefix ? `${prefix}${val}` : val
            return (
              <a key={key} href={href} target="_blank" rel="noopener noreferrer"
                 title={label}
                 className="w-11 h-11 rounded-full bg-white/6 border border-white/10
                            flex items-center justify-center text-lg
                            hover:bg-nsa-green/25 hover:border-nsa-green hover:-translate-y-0.5
                            transition-all duration-200">
                {emoji}
              </a>
            )
          })}
        </div>

        <p className="mt-10 text-white/20 text-xs animate-fade-in [animation-delay:900ms]">
          © {new Date().getFullYear()} Nigerian Student Association · Built with ❤️ and 🇳🇬 pride
        </p>

        {/* Admin link */}
        <a href="/admin" className="mt-4 text-white/15 text-xs hover:text-white/40 transition-colors">
          Admin ↗
        </a>
      </div>
    </div>
  )
}

function SectionLabel({ emoji, label, delay }) {
  return (
    <div className="self-start text-nsa-gold text-[0.7rem] uppercase tracking-[0.15em]
                    font-medium mb-2.5 mt-1 pl-1 w-full animate-fade-in"
         style={{ animationDelay: `${delay}ms`, opacity: 0 }}>
      {emoji} {label}
    </div>
  )
}
