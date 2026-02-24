import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLinks } from '../hooks/useLinks'
import { useEvents } from '../hooks/useEvents'
import { useProfile } from '../hooks/useProfile'
import { storage } from '../firebase'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import toast from 'react-hot-toast'

const TABS = ['Links', 'Events', 'Analytics', 'Profile']
const EMOJI_OPTIONS = ['→','✓','★','●','▶','■','•','✦','✧','✨','✿','❀','❁','❂','❃','❄','❅','❆']

export default function Admin() {
  const [tab, setTab] = useState('Links')
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/admin/login')
    toast.success('Logged out')
  }

  return (
    <div className="min-h-screen bg-nsa-dark text-white">
      {/* Top bar */}
      <header className="border-b border-white/10 px-6 py-4 flex items-center justify-between
                         bg-black/20 backdrop-blur-sm sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-nsa-green to-nsa-gold
                          flex items-center justify-center font-display text-sm font-black">
            NSA
          </div>
          <div>
            <p className="font-semibold text-sm">NSA Admin</p>
            <p className="text-white/40 text-xs">Dashboard</p>
          </div>
        </div>
        <div className="flex gap-3">
          <a href="/" target="_blank" rel="noopener noreferrer"
             className="px-4 py-2 rounded-lg bg-white/8 hover:bg-white/14 text-sm
                        border border-white/10 transition-all">
            View Page ↗
          </a>
          <button onClick={handleLogout}
                  className="px-4 py-2 rounded-lg bg-white/8 hover:bg-red-500/20 text-sm
                             border border-white/10 hover:border-red-500/40 transition-all">
            Log Out
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-1 mb-8 bg-white/5 p-1 rounded-xl border border-white/10 w-fit">
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
                    className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                      tab === t
                        ? 'bg-nsa-green text-white shadow-lg'
                        : 'text-white/50 hover:text-white hover:bg-white/8'
                    }`}>
              {t}
            </button>
          ))}
        </div>

        {tab === 'Links' && <LinksTab />}
        {tab === 'Events' && <EventsTab />}
        {tab === 'Analytics' && <AnalyticsTab />}
        {tab === 'Profile' && <ProfileTab />}
      </div>
    </div>
  )
}

/* ─── Links Tab ─── */
function LinksTab() {
  const { links, loading, addLink, updateLink, deleteLink } = useLinks()
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ title: '', subtitle: '', url: '', icon: '→', order: 0 })

  const openAdd = () => {
    setEditing(null)
    setForm({ title: '', subtitle: '', url: '', icon: '→', order: links.length })
    setShowForm(true)
  }

  const openEdit = (link) => {
    setEditing(link.id)
    setForm({ title: link.title, subtitle: link.subtitle || '', url: link.url, icon: link.icon || '→', order: link.order || 0 })
    setShowForm(true)
  }

  const handleSave = async () => {
    if (!form.title || !form.url) return toast.error('Title and URL are required')
    try {
      if (editing) {
        await updateLink(editing, form)
        toast.success('Link updated!')
      } else {
        await addLink(form)
        toast.success('Link added!')
      }
      setShowForm(false)
    } catch {
      toast.error('Something went wrong')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this link?')) return
    await deleteLink(id)
    toast.success('Link deleted')
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-xl font-bold">Links</h2>
        <button onClick={openAdd}
                className="px-4 py-2 bg-nsa-green rounded-xl text-sm font-medium
                           hover:bg-nsa-green/80 transition-all">
          + Add Link
        </button>
      </div>

      {showForm && (
        <FormCard title={editing ? 'Edit Link' : 'New Link'} onCancel={() => setShowForm(false)} onSave={handleSave}>
          <EmojiPicker value={form.icon} onChange={v => setForm(f => ({ ...f, icon: v }))} />
          <FormField label="Title*" value={form.title} onChange={v => setForm(f => ({ ...f, title: v }))} placeholder="e.g. Events Calendar" />
          <FormField label="Subtitle" value={form.subtitle} onChange={v => setForm(f => ({ ...f, subtitle: v }))} placeholder="Short description (optional)" />
          <FormField label="URL*" value={form.url} onChange={v => setForm(f => ({ ...f, url: v }))} placeholder="https://..." />
          <FormField label="Order" type="number" value={form.order} onChange={v => setForm(f => ({ ...f, order: Number(v) }))} placeholder="0" />
        </FormCard>
      )}

      {loading ? <Spinner /> : (
        <div className="space-y-3">
          {links.map(link => (
            <div key={link.id} className="flex items-center gap-4 p-4 rounded-xl bg-white/5
                                          border border-white/10 hover:border-white/20 transition-all">
              <span className="text-2xl">{link.icon || '→'}</span>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{link.title}</p>
                <p className="text-white/40 text-xs truncate">{link.url}</p>
              </div>
              <span className="text-white/30 text-xs">{link.clicks || 0} clicks</span>
              <div className="flex gap-2">
                <button onClick={() => openEdit(link)}
                        className="px-3 py-1.5 text-xs rounded-lg bg-white/8 hover:bg-white/14 transition-all">
                  Edit
                </button>
                <button onClick={() => handleDelete(link.id)}
                        className="px-3 py-1.5 text-xs rounded-lg bg-red-500/10 hover:bg-red-500/25
                                   text-red-400 transition-all">
                  Delete
                </button>
              </div>
            </div>
          ))}
          {links.length === 0 && <EmptyState message="No links yet. Add your first link!" />}
        </div>
      )}
    </div>
  )
}

/* ─── Events Tab ─── */
function EventsTab() {
  const { events, loading, addEvent, updateEvent, deleteEvent } = useEvents()
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [form, setForm] = useState({
    title: '', description: '', date: '', time: '', location: '',
    price: 'Free Entry', url: '', badge: 'Upcoming', flyer: ''
  })

  const openAdd = () => {
    setEditing(null)
    setForm({ title: '', description: '', date: '', time: '', location: '', price: 'Free Entry', url: '', badge: 'Upcoming', flyer: '' })
    setShowForm(true)
  }

  const openEdit = (ev) => {
    setEditing(ev.id)
    setForm({
      title: ev.title, description: ev.description || '', date: ev.date || '',
      time: ev.time || '', location: ev.location || '', price: ev.price || 'Free Entry',
      url: ev.url || '', badge: ev.badge || 'Upcoming', flyer: ev.flyer || ''
    })
    setShowForm(true)
  }

  const handleFileUpload = async (file) => {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file')
      return
    }
    setUploading(true)
    try {
      const storageRef = ref(storage, `event-flyers/${Date.now()}_${file.name}`)
      await uploadBytes(storageRef, file)
      const url = await getDownloadURL(storageRef)
      setForm(f => ({ ...f, flyer: url }))
      toast.success('Image uploaded!')
    } catch (error) {
      toast.error('Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleSave = async () => {
    if (!form.title) return toast.error('Title is required')
    try {
      if (editing) {
        await updateEvent(editing, form)
        toast.success('Event updated!')
      } else {
        await addEvent(form)
        toast.success('Event added!')
      }
      setShowForm(false)
    } catch {
      toast.error('Something went wrong')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this event?')) return
    await deleteEvent(id)
    toast.success('Event deleted')
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-xl font-bold">Events</h2>
        <button onClick={openAdd}
                className="px-4 py-2 bg-nsa-green rounded-xl text-sm font-medium
                           hover:bg-nsa-green/80 transition-all">
          + Add Event
        </button>
      </div>

      {showForm && (
        <FormCard title={editing ? 'Edit Event' : 'New Event'} onCancel={() => setShowForm(false)} onSave={handleSave}>
          <FormField label="Title*" value={form.title} onChange={v => setForm(f => ({ ...f, title: v }))} placeholder="e.g. Nigerian Cultural Night 2025" />
          <FormField label="Description" value={form.description} onChange={v => setForm(f => ({ ...f, description: v }))} placeholder="Brief description" multiline />
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Date" type="date" value={form.date} onChange={v => setForm(f => ({ ...f, date: v }))} />
            <FormField label="Time" value={form.time} onChange={v => setForm(f => ({ ...f, time: v }))} placeholder="e.g. 7:00 PM" />
          </div>
          <FormField label="Location" value={form.location} onChange={v => setForm(f => ({ ...f, location: v }))} placeholder="e.g. Student Union Hall, Room 101" />
          <FormField label="Price / Ticket Info" value={form.price} onChange={v => setForm(f => ({ ...f, price: v }))} placeholder="e.g. Free Entry, $10" />
          <ImageUpload value={form.flyer} onUpload={handleFileUpload} uploading={uploading} />
          <FormField label="RSVP / Ticket URL" value={form.url} onChange={v => setForm(f => ({ ...f, url: v }))} placeholder="https://..." />
          <FormField label="Badge Label" value={form.badge} onChange={v => setForm(f => ({ ...f, badge: v }))} placeholder="e.g. Upcoming, RSVP Now, Tonight!" />
        </FormCard>
      )}

      {loading ? <Spinner /> : (
        <div className="space-y-3">
          {events.map(event => (
            <div key={event.id} className="flex items-start gap-4 p-4 rounded-xl bg-white/5
                                           border border-white/10 hover:border-white/20 transition-all">
              <div className="flex-1 min-w-0">
                <p className="font-medium">{event.title}</p>
                <p className="text-white/40 text-xs mt-0.5">
                  {event.date && new Date(event.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  {event.location && ` · ${event.location}`}
                </p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => openEdit(event)}
                        className="px-3 py-1.5 text-xs rounded-lg bg-white/8 hover:bg-white/14 transition-all">
                  Edit
                </button>
                <button onClick={() => handleDelete(event.id)}
                        className="px-3 py-1.5 text-xs rounded-lg bg-red-500/10 hover:bg-red-500/25
                                   text-red-400 transition-all">
                  Delete
                </button>
              </div>
            </div>
          ))}
          {events.length === 0 && <EmptyState message="No events yet. Add your first event!" />}
        </div>
      )}
    </div>
  )
}

/* ─── Analytics Tab ─── */
function AnalyticsTab() {
  const { links } = useLinks()
  const totalClicks = links.reduce((sum, l) => sum + (l.clicks || 0), 0)
  const sorted = [...links].sort((a, b) => (b.clicks || 0) - (a.clicks || 0))
  const max = sorted[0]?.clicks || 1

  return (
    <div>
      <h2 className="font-display text-xl font-bold mb-6">Analytics</h2>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <StatCard label="Total Clicks" value={totalClicks} />
        <StatCard label="Total Links" value={links.length} />
      </div>

      <h3 className="font-semibold text-sm text-white/60 uppercase tracking-wider mb-4">
        Link Performance
      </h3>
      <div className="space-y-3">
        {sorted.map(link => (
          <div key={link.id} className="p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-sm flex items-center gap-2">
                <span>{link.icon || '→'}</span>
                {link.title}
              </span>
              <span className="text-nsa-gold font-semibold text-sm">{link.clicks || 0} clicks</span>
            </div>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-nsa-green to-nsa-gold rounded-full transition-all duration-500"
                   style={{ width: `${((link.clicks || 0) / max) * 100}%` }} />
            </div>
          </div>
        ))}
        {links.length === 0 && <EmptyState message="Add links to see analytics" />}
      </div>
    </div>
  )
}

/* ─── Profile Tab ─── */
function ProfileTab() {
  const { profile, updateProfile } = useProfile()
  const [form, setForm] = useState(profile)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setForm(profile)
  }, [profile])

  const handleSave = async () => {
    setSaving(true)
    try {
      await updateProfile(form)
      toast.success('Profile saved!')
    } catch {
      toast.error('Failed to save profile')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <h2 className="font-display text-xl font-bold mb-6">Organization Profile</h2>
      <div className="space-y-4 max-w-lg">
        <FormField label="Organization Name" value={form.name}
                   onChange={v => setForm(f => ({ ...f, name: v }))} />
        <FormField label="Handle (e.g. @nsa_official)" value={form.handle}
                   onChange={v => setForm(f => ({ ...f, handle: v }))} />
        <FormField label="Bio" value={form.bio}
                   onChange={v => setForm(f => ({ ...f, bio: v }))} multiline />

        <p className="text-white/40 text-xs uppercase tracking-wider pt-2 border-t border-white/10">
          Social Links (enter full URL or email)
        </p>
        <FormField label="Instagram URL" value={form.instagram || ''}
                   onChange={v => setForm(f => ({ ...f, instagram: v }))} placeholder="https://instagram.com/..." />
        <FormField label="Twitter / X URL" value={form.twitter || ''}
                   onChange={v => setForm(f => ({ ...f, twitter: v }))} placeholder="https://twitter.com/..." />
        <FormField label="Facebook URL" value={form.facebook || ''}
                   onChange={v => setForm(f => ({ ...f, facebook: v }))} placeholder="https://facebook.com/..." />
        <FormField label="WhatsApp Link" value={form.whatsapp || ''}
                   onChange={v => setForm(f => ({ ...f, whatsapp: v }))} placeholder="https://wa.me/..." />
        <FormField label="YouTube URL" value={form.youtube || ''}
                   onChange={v => setForm(f => ({ ...f, youtube: v }))} placeholder="https://youtube.com/..." />
        <FormField label="Email Address" value={form.email || ''}
                   onChange={v => setForm(f => ({ ...f, email: v }))} placeholder="nsa@university.edu" />

        <button onClick={handleSave} disabled={saving}
                className="w-full py-3 rounded-xl bg-nsa-green font-medium
                           hover:bg-nsa-green/80 transition-all disabled:opacity-50
                           shadow-[0_4px_20px_rgba(0,135,81,0.3)]">
          {saving ? 'Saving…' : 'Save Profile'}
        </button>
      </div>
    </div>
  )
}

/* ─── Shared UI Components ─── */
function FormCard({ title, children, onCancel, onSave }) {
  return (
    <div className="mb-6 p-5 rounded-2xl bg-white/5 border border-nsa-gold/30 space-y-4">
      <h3 className="font-semibold text-nsa-gold">{title}</h3>
      {children}
      <div className="flex gap-3 pt-2">
        <button onClick={onSave}
                className="flex-1 py-2.5 bg-nsa-green rounded-xl text-sm font-medium
                           hover:bg-nsa-green/80 transition-all">
          Save
        </button>
        <button onClick={onCancel}
                className="flex-1 py-2.5 bg-white/8 rounded-xl text-sm hover:bg-white/14 transition-all">
          Cancel
        </button>
      </div>
    </div>
  )
}

function FormField({ label, value, onChange, placeholder, type = 'text', multiline }) {
  const cls = `w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3
               text-white placeholder-white/25 outline-none text-sm
               focus:border-nsa-gold/50 focus:bg-white/8 transition-all`
  return (
    <div>
      <label className="block text-white/50 text-xs uppercase tracking-wider mb-1.5">{label}</label>
      {multiline ? (
        <textarea value={value} onChange={e => onChange(e.target.value)}
                  placeholder={placeholder} rows={3}
                  className={cls + ' resize-none'} />
      ) : (
        <input type={type} value={value} onChange={e => onChange(e.target.value)}
               placeholder={placeholder} className={cls} />
      )}
    </div>
  )
}

function EmojiPicker({ value, onChange }) {
  return (
    <div>
      <label className="block text-white/50 text-xs uppercase tracking-wider mb-1.5">Icon</label>
      <div className="flex flex-wrap gap-2">
        {EMOJI_OPTIONS.map(e => (
          <button key={e} onClick={() => onChange(e)}
                  className={`w-10 h-10 rounded-lg text-xl transition-all
                    ${value === e
                      ? 'bg-nsa-green border-2 border-nsa-gold scale-110'
                      : 'bg-white/5 border border-white/10 hover:bg-white/15'}`}>
            {e}
          </button>
        ))}
      </div>
    </div>
  )
}

function StatCard({ label, value }) {
  return (
    <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
      <p className="text-3xl font-display font-bold text-nsa-gold">{value}</p>
      <p className="text-white/50 text-sm">{label}</p>
    </div>
  )
}

function Spinner() {
  return (
    <div className="flex justify-center py-12">
      <div className="w-8 h-8 border-2 border-nsa-green border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

function EmptyState({ message }) {
  return (
    <div className="text-center py-12 text-white/30 text-sm">{message}</div>
  )
}

function ImageUpload({ value, onUpload, uploading }) {
  return (
    <div>
      <label className="block text-white/50 text-xs uppercase tracking-wider mb-1.5">Event Flyer (optional)</label>
      {value && (
        <div className="mb-2">
          <img src={value} alt="Flyer preview" className="w-full h-32 object-cover rounded-lg" />
        </div>
      )}
      <input
        type="file"
        accept="image/*"
        onChange={(e) => onUpload(e.target.files[0])}
        disabled={uploading}
        className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3
                   text-white text-sm outline-none
                   focus:border-nsa-gold/50 focus:bg-white/8 transition-all
                   file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0
                   file:bg-nsa-green file:text-white file:text-sm file:font-medium
                   hover:file:bg-nsa-green/80 disabled:opacity-50"
      />
      {uploading && <p className="text-white/40 text-xs mt-1">Uploading...</p>}
    </div>
  )
}
