// src/components/ProtectedRoute.jsx
// ─────────────────────────────────────────────
// Blocks access to Dashboard/Roadmap if:
//   1. User is not logged in (no Firebase user)
//   2. User hasn't completed onboarding (no profile)
// ─────────────────────────────────────────────

import { useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { onAuthChange } from '../services/firebase'
import useStore from '../store/useStore'
import Loader from './Loader'

export default function ProtectedRoute({ children }) {
  const [authUser, setAuthUser] = useState(undefined) // undefined = still checking
  const { profile } = useStore()
  const location = useLocation()

  // Listen to Firebase auth state once on mount
  useEffect(() => {
    const unsub = onAuthChange((user) => setAuthUser(user))
    return () => unsub()
  }, [])

  // Still checking auth — show spinner
  if (authUser === undefined) {
    return (
      <main className="min-h-screen pt-14 flex items-center justify-center">
        <Loader message="Checking your session..." />
      </main>
    )
  }

  // Not logged in → send to login, remember where they came from
  if (!authUser) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Logged in but no onboarding done → send to onboarding (only for roadmap)
  if (!profile && location.pathname === '/roadmap') {
    return <Navigate to="/onboarding" replace />
  }

  // All good — render the page
  return children
}
