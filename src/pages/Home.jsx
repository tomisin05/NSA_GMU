import { useLinks } from "../hooks/useLinks";
import { useEvents } from "../hooks/useEvents";
import { useProfile } from "../hooks/useProfile";
import LinkCard from "../components/LinkCard";
import EventCard from "../components/EventCard";
import {
  Instagram,
  Twitter,
  Facebook,
  MessageCircle,
  Youtube,
  Mail,
} from "lucide-react";

const SOCIALS = [
  { key: "instagram", label: "Instagram", Icon: Instagram },
  { key: "twitter", label: "Twitter", Icon: Twitter },
  { key: "facebook", label: "Facebook", Icon: Facebook },
  { key: "whatsapp", label: "WhatsApp", Icon: MessageCircle },
  { key: "youtube", label: "YouTube", Icon: Youtube },
  { key: "email", label: "Email", Icon: Mail, prefix: "mailto:" },
];

export default function Home() {
  const { links, loading: linksLoading, trackClick } = useLinks();
  const { events, loading: eventsLoading } = useEvents();
  const { profile } = useProfile();

  const getEventStatus = (event) => {
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

  const upcomingEvents = events.filter(e => {
    const status = getEventStatus(e)
    return status === 'upcoming' || status === 'live'
  })
  const pastEvents = events.filter(e => getEventStatus(e) === 'past')
  const featuredEvent = upcomingEvents[0];

  return (
    <div className="min-h-screen bg-mesh bg-nsa-dark flex justify-center py-16 px-4">
      <div className="w-full max-w-[560px] flex flex-col items-center">
        {/* Avatar */}
        <div className="relative mb-5 animate-fade-down">
          <img
            src="/nsa.png"
            alt="NSA Logo"
            className="w-32 h-32 object-contain"
          />
        </div>

        {/* Name */}
        <h1
          className="font-display text-[1.75rem] font-black text-gradient text-center
                       animate-fade-down [animation-delay:100ms] mb-2"
        >
          {profile.name}
        </h1>
        <p
          className="text-white/45 text-sm uppercase tracking-widest
                      animate-fade-down [animation-delay:150ms] mb-3"
        >
          {profile.handle}
        </p>

        {/* Bio */}
        <p
          className="text-center text-white/65 text-sm leading-relaxed max-w-sm
                      animate-fade-in [animation-delay:220ms] mb-10 px-2"
        >
          {profile.bio}
        </p>

        {/* Upcoming Events */}
        {upcomingEvents.length > 0 && (
          <>
            <SectionLabel label="Upcoming Events" delay={260} />
            <div className="w-full flex flex-col gap-3 mb-3">
              {upcomingEvents.map((event, i) => (
                <EventCard
                  key={event.id}
                  event={event}
                  style={{ animationDelay: `${280 + i * 60}ms` }}
                />
              ))}
            </div>
          </>
        )}

        {/* Links */}
        {!linksLoading && links.length > 0 && (
          <>
            <SectionLabel label="Quick Links" delay={400} />
            <div className="w-full flex flex-col gap-3 mb-3">
              {links.map((link, i) => (
                <LinkCard
                  key={link.id}
                  link={link}
                  onTrackClick={trackClick}
                  style={{ animationDelay: `${420 + i * 60}ms` }}
                />
              ))}
            </div>
          </>
        )}

        {/* Past Events */}
        {pastEvents.length > 0 && (
          <>
            <SectionLabel label="Past Events" delay={500} />
            <div className="w-full flex flex-col gap-3 mb-3">
              {pastEvents.map((event, i) => (
                <EventCard
                  key={event.id}
                  event={event}
                  style={{ animationDelay: `${520 + i * 60}ms` }}
                />
              ))}
            </div>
          </>
        )}

        {/* Socials */}
        <div className="flex gap-2.5 mt-8 animate-fade-in [animation-delay:700ms]">
          {SOCIALS.map(({ key, label, Icon, prefix }) => {
            const val = profile[key];
            if (!val) return null;
            const href = prefix ? `${prefix}${val}` : val;
            return (
              <a
                key={key}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                title={label}
                className="w-11 h-11 rounded-full bg-white/6 border border-white/10
                            flex items-center justify-center
                            hover:bg-nsa-green/25 hover:border-nsa-green hover:-translate-y-0.5
                            transition-all duration-200"
              >
                <Icon size={20} className="text-white" />
              </a>
            );
          })}
        </div>

        <p className="mt-10 text-white/20 text-xs animate-fade-in [animation-delay:900ms]">
          © {new Date().getFullYear()} Nigerian Student Association
        </p>

        {/* Admin link */}
        <a
          href="/admin"
          className="mt-4 text-white/15 text-xs hover:text-white/40 transition-colors"
        >
          Admin ↗
        </a>
      </div>
    </div>
  );
}

function SectionLabel({ label, delay }) {
  return (
    <div
      className="self-start text-nsa-gold text-[0.7rem] uppercase tracking-[0.15em]
                    font-medium mb-2.5 mt-1 pl-1 w-full animate-fade-in"
      style={{ animationDelay: `${delay}ms`, opacity: 0 }}
    >
      {label}
    </div>
  );
}
