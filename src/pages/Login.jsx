import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login(email, password)
      navigate('/admin')
      toast.success('Welcome back!')
    } catch (err) {
      toast.error('Invalid credentials. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-mesh bg-nsa-dark flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-nsa-green to-nsa-gold
                          flex items-center justify-center font-display text-2xl font-black
                          mx-auto mb-4 shadow-[0_0_30px_rgba(0,135,81,0.3)]">
            NSA
          </div>
          <h1 className="font-display text-2xl font-bold text-gradient">Admin Portal</h1>
          <p className="text-white/40 text-sm mt-1">Sign in to manage your page</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-white/60 text-xs uppercase tracking-wider mb-1.5">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="admin@nsa.org"
              className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3
                         text-white placeholder-white/25 outline-none
                         focus:border-nsa-gold/50 focus:bg-white/8 transition-all"
            />
          </div>
          <div>
            <label className="block text-white/60 text-xs uppercase tracking-wider mb-1.5">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3
                         text-white placeholder-white/25 outline-none
                         focus:border-nsa-gold/50 focus:bg-white/8 transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-medium bg-nsa-green hover:bg-nsa-green/80
                       transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                       shadow-[0_4px_20px_rgba(0,135,81,0.3)] hover:shadow-[0_4px_24px_rgba(0,135,81,0.5)]
                       hover:-translate-y-0.5 active:translate-y-0"
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <a href="/" className="block text-center text-white/25 text-xs mt-6 hover:text-white/50 transition-colors">
          ← Back to public page
        </a>
      </div>
    </div>
  )
}
