import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { onAuthChange, logOut } from '../services/firebase'
import useStore from '../store/useStore'

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { profile, reset } = useStore()
  const [authUser, setAuthUser] = useState(null)
  const isHome = location.pathname === '/'

  useEffect(() => {
    const unsub = onAuthChange((user) => setAuthUser(user))
    return () => unsub()
  }, [])

  const handleLogout = async () => {
    try {
      await logOut()
      reset()
      navigate('/', { replace: true })
    } catch (err) {
      console.error('Logout failed:', err)
    }
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-bg bg-opacity-80 backdrop-blur-md">
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="font-syne font-extrabold text-xl text-accent tracking-tight">
          Skill<span className="text-text font-serif italic font-normal">Gap</span>
        </Link>

        {/* Nav Links */}
        <div className="flex items-center gap-4">
          {authUser && (
            <>
              <Link
                to="/dashboard"
                className={`text-sm font-mono tracking-wide transition-colors ${location.pathname === '/dashboard' ? 'text-accent' : 'text-text hover:text-accent'
                  }`}
              >
                Dashboard
              </Link>
              <Link
                to="/roadmap"
                className={`text-sm font-mono tracking-wide transition-colors ${location.pathname === '/roadmap' ? 'text-accent' : 'text-text hover:text-accent'
                  }`}
              >
                Roadmap
              </Link>
              <Link
                to="/profile"
                className={`text-sm font-mono tracking-wide transition-colors ${location.pathname === '/profile' ? 'text-accent' : 'text-text hover:text-accent'
                  }`}
              >
                Profile
              </Link>
            </>
          )}

          {isHome ? (
            <Link to="/login" className="btn-primary text-sm py-2 px-4">
              Get Started →
            </Link>
          ) : !authUser ? (
            <Link to="/login" className="btn-primary text-sm py-2 px-4">
              Login →
            </Link>
          ) : (
            <button
              onClick={handleLogout}
              className="text-sm text-text hover:text-red-400 transition-colors font-mono"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  )
}
