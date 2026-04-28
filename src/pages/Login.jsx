// src/pages/Login.jsx
import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { signInWithGoogle, signUpWithEmail, signInWithEmail, upsertUser, loadUserData } from '../services/firebase'
import useStore from '../store/useStore'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { setProfile, setAnalysis, setRoadmap } = useStore()

  const [tab, setTab] = useState('login') // 'login' or 'signup'
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Login form
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')

  // Sign up form
  const [signupName, setSignupName] = useState('')
  const [signupEmail, setSignupEmail] = useState('')
  const [signupPassword, setSignupPassword] = useState('')
  const [signupConfirm, setSignupConfirm] = useState('')



  const handleGoogleAuth = async () => {
    setLoading(true)
    setError('')

    // Timeout after 15 seconds
    const timeoutId = setTimeout(() => {
      setLoading(false)
      setError('Google sign-in is taking too long. Check your internet connection and try again.')
    }, 15000)

    try {
      const user = await signInWithGoogle()

      await upsertUser(user)
      const saved = await loadUserData(user.uid)

      if (saved.profile) setProfile(saved.profile)
      if (saved.analysis) setAnalysis(saved.analysis)
      if (saved.roadmap) setRoadmap(saved.roadmap)

      navigate('/dashboard', { replace: true })
    } catch (err) {
      clearTimeout(timeoutId)
      console.error(err)
      setError(`Google sign-in failed: ${err.message || err.code || 'Unknown error'}`)
    } finally {
      setLoading(false)
      clearTimeout(timeoutId)
    }
  }

  const handleEmailLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!loginEmail || !loginPassword) {
      setError('Please fill in all fields')
      setLoading(false)
      return
    }

    // Timeout after 15 seconds
    const timeoutId = setTimeout(() => {
      setLoading(false)
      setError('Login is taking too long. Check your internet connection and try again.')
    }, 15000)

    try {
      const user = await signInWithEmail(loginEmail, loginPassword)

      await upsertUser(user)
      const saved = await loadUserData(user.uid)

      if (saved.profile) setProfile(saved.profile)
      if (saved.analysis) setAnalysis(saved.analysis)
      if (saved.roadmap) setRoadmap(saved.roadmap)

      navigate('/dashboard', { replace: true })
    } catch (err) {
      clearTimeout(timeoutId)
      console.error(err)
      if (err.code === 'auth/operation-not-allowed') {
        setError('⚠️ Email/Password authentication is not enabled in Firebase. Admin needs to enable it in Firebase Console → Authentication → Sign-in method → Enable Email/Password')
      } else if (err.code === 'auth/user-not-found') {
        setError('Email not found. Please sign up first.')
      } else if (err.code === 'auth/wrong-password') {
        setError('Invalid password. Please try again.')
      } else if (err.code === 'auth/invalid-email') {
        setError('Invalid email address.')
      } else {
        setError(`Login failed: ${err.message || 'Unknown error'}`)
      }
    } finally {
      setLoading(false)
      clearTimeout(timeoutId)
    }
  }

  const handleEmailSignup = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!signupName || !signupEmail || !signupPassword || !signupConfirm) {
      setError('Please fill in all fields')
      setLoading(false)
      return
    }

    if (signupPassword !== signupConfirm) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (signupPassword.length < 6) {
      setError('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    // Timeout after 15 seconds
    const timeoutId = setTimeout(() => {
      setLoading(false)
      setError('Sign up is taking too long. Check your internet connection and try again.')
    }, 15000)

    try {
      const user = await signUpWithEmail(signupEmail, signupPassword, signupName)

      await upsertUser(user)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      clearTimeout(timeoutId)
      console.error(err)
      if (err.code === 'auth/operation-not-allowed') {
        setError('⚠️ Email/Password authentication is not enabled in Firebase. Admin needs to enable it in Firebase Console → Authentication → Sign-in method → Enable Email/Password')
      } else if (err.code === 'auth/email-already-in-use') {
        setError('Email already registered. Please log in instead.')
      } else if (err.code === 'auth/weak-password') {
        setError('Password is too weak. Use at least 6 characters.')
      } else if (err.code === 'auth/invalid-email') {
        setError('Invalid email address.')
      } else {
        setError(`Sign up failed: ${err.message || 'Unknown error'}`)
      }
    } finally {
      setLoading(false)
      clearTimeout(timeoutId)
    }
  }

  return (
    <main className="min-h-screen pt-14 flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-8 sm:mb-10">
          <h1 className="font-syne font-extrabold text-3xl sm:text-4xl text-accent tracking-tight">
            Skill<span className="text-text font-serif italic font-normal">Gap</span>
          </h1>
          <p className="text-sm sm:text-base text-muted mt-3 sm:mt-4">
            {tab === 'login' ? 'Welcome back' : 'Join us today'}
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex gap-2 mb-6 sm:mb-8 bg-surface p-1 rounded-lg border border-border">
          <button
            onClick={() => { setTab('login'); setError(''); }}
            className={`flex-1 py-2 px-3 sm:px-4 rounded-md text-xs sm:text-sm font-semibold transition-all ${tab === 'login'
              ? 'bg-accent text-bg'
              : 'text-muted hover:text-text'
              }`}
          >
            Login
          </button>
          <button
            onClick={() => { setTab('signup'); setError(''); }}
            className={`flex-1 py-2 px-3 sm:px-4 rounded-md text-xs sm:text-sm font-semibold transition-all ${tab === 'signup'
              ? 'bg-accent text-bg'
              : 'text-muted hover:text-text'
              }`}
          >
            Sign Up
          </button>
        </div>

        {/* Card */}
        <div className="card space-y-4 sm:space-y-6 p-4 sm:p-6">

          {/* LOGIN TAB */}
          {tab === 'login' && (
            <form onSubmit={handleEmailLogin} className="space-y-3 sm:space-y-4">
              <div>
                <label className="text-xs text-muted uppercase tracking-widest block mb-2 font-semibold">Email</label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  disabled={loading}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-surface border border-border rounded-lg focus:border-accent focus:outline-none transition-colors disabled:opacity-50"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="text-xs text-muted uppercase tracking-widest block mb-2 font-semibold">Password</label>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  disabled={loading}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-surface border border-border rounded-lg focus:border-accent focus:outline-none transition-colors disabled:opacity-50"
                  placeholder="••••••••"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-accent hover:bg-accent/90 text-bg text-sm sm:text-base font-semibold py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg transition-all disabled:opacity-50"
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>
          )}

          {/* SIGN UP TAB */}
          {tab === 'signup' && (
            <form onSubmit={handleEmailSignup} className="space-y-3 sm:space-y-4">
              <div>
                <label className="text-xs text-muted uppercase tracking-widest block mb-2 font-semibold">Full Name</label>
                <input
                  type="text"
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                  disabled={loading}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-surface border border-border rounded-lg focus:border-accent focus:outline-none transition-colors disabled:opacity-50"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="text-xs text-muted uppercase tracking-widest block mb-2 font-semibold">Email</label>
                <input
                  type="email"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  disabled={loading}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-surface border border-border rounded-lg focus:border-accent focus:outline-none transition-colors disabled:opacity-50"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="text-xs text-muted uppercase tracking-widest block mb-2 font-semibold">Password</label>
                <input
                  type="password"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  disabled={loading}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-surface border border-border rounded-lg focus:border-accent focus:outline-none transition-colors disabled:opacity-50"
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label className="text-xs text-muted uppercase tracking-widest block mb-2 font-semibold">Confirm Password</label>
                <input
                  type="password"
                  value={signupConfirm}
                  onChange={(e) => setSignupConfirm(e.target.value)}
                  disabled={loading}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-surface border border-border rounded-lg focus:border-accent focus:outline-none transition-colors disabled:opacity-50"
                  placeholder="••••••••"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-accent hover:bg-accent/90 text-bg text-sm sm:text-base font-semibold py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg transition-all disabled:opacity-50"
              >
                {loading ? 'Creating account...' : 'Sign Up'}
              </button>
            </form>
          )}

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Google Auth */}
          <button
            onClick={handleGoogleAuth}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 sm:gap-3 border border-border
              bg-surface hover:border-accent/40 hover:bg-accent/5
              text-text text-sm sm:text-base font-semibold py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg
              transition-all duration-200 disabled:opacity-50"
          >
            {/* Google icon */}
            <svg width="16" height="16" sm:w="18" sm:h="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            {loading ? 'Connecting...' : 'Continue with Google'}
          </button>

          {/* Error */}
          {error && (
            <p className="text-xs sm:text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-2.5 sm:p-3 text-center">
              {error}
            </p>
          )}

          <p className="text-xs text-muted text-center">
            Your data is saved securely. <br />
            No spam. Privacy protected.
          </p>
        </div>

        {/* Skip option */}
        <p className="text-center mt-6 sm:mt-8 text-xs text-muted">
          Just exploring?{' '}
          <button
            onClick={() => navigate('/onboarding')}
            className="text-accent hover:underline font-semibold"
          >
            Continue without signing in
          </button>
        </p>

      </div>
    </main>
  )
}
