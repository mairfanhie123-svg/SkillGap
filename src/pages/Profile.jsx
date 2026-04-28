import { useState } from 'react'
import useStore from '../store/useStore'

export default function Profile() {
  const { profile, setProfile } = useStore()
  const [isEditing, setIsEditing] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [form, setForm] = useState(profile || {
    name: '',
    email: '',
    phone: '',
    linkedin: '',
    github: '',
    portfolio: '',
  })

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    // Apply theme to document
    if (!darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  const handleSave = () => {
    setProfile({ ...profile, ...form })
    setIsEditing(false)
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <main className="min-h-screen pt-14 bg-bg">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header with Profile Picture */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8 mb-12">
          <div className="flex items-center gap-6">
            {/* Profile Picture */}
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-accent to-indigo flex items-center justify-center text-3xl font-bold text-bg shadow-lg">
                {profile?.name?.charAt(0)?.toUpperCase() || '👤'}
              </div>
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-accent text-bg rounded-full flex items-center justify-center text-xs font-bold shadow-md hover:bg-accent/90 transition-colors">
                📷
              </button>
            </div>

            {/* User Info */}
            <div>
              <p className="section-label">Your Profile</p>
              <h1 className="font-syne font-extrabold text-4xl text-text tracking-tight">
                {profile?.name || 'Profile'}
              </h1>
              <p className="text-base text-muted mt-2">{profile?.email || 'Complete your profile'}</p>
              <p className="text-sm text-muted mt-1">Authenticated User</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="btn-ghost text-xs"
            >
              {isEditing ? '✕ Cancel' : '✎ Edit Profile'}
            </button>
            {isEditing && (
              <button
                onClick={handleSave}
                className="btn-primary text-xs"
              >
                ✓ Save
              </button>
            )}
            <button
              onClick={handlePrint}
              className="btn-primary text-xs"
            >
              ⬇ Print
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Profile Content */}
          <div className="md:col-span-2 space-y-8">
            {/* Profile Card */}
            <div className="card">
              {isEditing ? (
                // Edit Mode
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-xs text-muted uppercase tracking-widest block mb-2 font-semibold">Full Name</label>
                      <input
                        type="text"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full px-4 py-3 text-sm bg-surface border border-border rounded-lg focus:border-accent focus:outline-none transition-colors"
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted uppercase tracking-widest block mb-2 font-semibold">Email</label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full px-4 py-3 text-sm bg-surface border border-border rounded-lg focus:border-accent focus:outline-none transition-colors"
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-xs text-muted uppercase tracking-widest block mb-2 font-semibold">Phone</label>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="w-full px-4 py-3 text-sm bg-surface border border-border rounded-lg focus:border-accent focus:outline-none transition-colors"
                        placeholder="+1 (234) 567-8900"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted uppercase tracking-widest block mb-2 font-semibold">LinkedIn</label>
                      <input
                        type="url"
                        value={form.linkedin}
                        onChange={(e) => setForm({ ...form, linkedin: e.target.value })}
                        className="w-full px-4 py-3 text-sm bg-surface border border-border rounded-lg focus:border-accent focus:outline-none transition-colors"
                        placeholder="https://linkedin.com/in/yourname"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-xs text-muted uppercase tracking-widest block mb-2 font-semibold">GitHub</label>
                      <input
                        type="url"
                        value={form.github}
                        onChange={(e) => setForm({ ...form, github: e.target.value })}
                        className="w-full px-4 py-3 text-sm bg-surface border border-border rounded-lg focus:border-accent focus:outline-none transition-colors"
                        placeholder="https://github.com/yourname"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted uppercase tracking-widest block mb-2 font-semibold">Portfolio</label>
                      <input
                        type="url"
                        value={form.portfolio}
                        onChange={(e) => setForm({ ...form, portfolio: e.target.value })}
                        className="w-full px-4 py-3 text-sm bg-surface border border-border rounded-lg focus:border-accent focus:outline-none transition-colors"
                        placeholder="https://yourportfolio.com"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                // View Mode
                <div className="space-y-8">
                  <div>
                    <p className="text-xs text-muted uppercase tracking-widest font-semibold mb-3">Personal Information</p>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-muted">Full Name</p>
                        <p className="text-base text-text font-medium">{profile?.name || '—'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted">Email</p>
                        <p className="text-base text-text font-medium">{profile?.email || '—'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted">Phone</p>
                        <p className="text-base text-text font-medium">{profile?.phone || '—'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-border pt-8">
                    <p className="text-xs text-muted uppercase tracking-widest font-semibold mb-3">Online Presence</p>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-muted">LinkedIn</p>
                        {profile?.linkedin ? (
                          <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="text-base text-accent hover:underline font-medium">
                            View Profile →
                          </a>
                        ) : (
                          <p className="text-base text-text font-medium">—</p>
                        )}
                      </div>
                      <div>
                        <p className="text-xs text-muted">GitHub</p>
                        {profile?.github ? (
                          <a href={profile.github} target="_blank" rel="noopener noreferrer" className="text-base text-accent hover:underline font-medium">
                            View Profile →
                          </a>
                        ) : (
                          <p className="text-base text-text font-medium">—</p>
                        )}
                      </div>
                      <div>
                        <p className="text-xs text-muted">Portfolio</p>
                        {profile?.portfolio ? (
                          <a href={profile.portfolio} target="_blank" rel="noopener noreferrer" className="text-base text-accent hover:underline font-medium">
                            View Portfolio →
                          </a>
                        ) : (
                          <p className="text-base text-text font-medium">—</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-border pt-8">
                    <p className="text-xs text-muted uppercase tracking-widest font-semibold mb-3">Academic Details</p>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-muted">Country</p>
                        <p className="text-base text-text font-medium">{profile?.country || '—'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted">College</p>
                        <p className="text-base text-text font-medium">{profile?.collegeName || '—'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted">Branch</p>
                        <p className="text-base text-text font-medium">{profile?.branch || '—'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted">Semester</p>
                        <p className="text-base text-text font-medium">{profile?.semester || '—'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-border pt-8">
                    <p className="text-xs text-muted uppercase tracking-widest font-semibold mb-3">Career</p>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-muted">Target Role</p>
                        <p className="text-base text-text font-medium">{profile?.targetRole || '—'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted">Interests</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {profile?.interests && profile.interests.length > 0 ? (
                            profile.interests.map((i) => (
                              <span key={i} className="text-xs bg-accent/15 text-accent border border-accent/20 px-3 py-1 rounded-full font-medium">
                                {i}
                              </span>
                            ))
                          ) : (
                            <p className="text-base text-text font-medium">—</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Settings Sidebar */}
          <div className="space-y-6">
            {/* Settings Card */}
            <div className="card">
              <p className="text-xs text-muted uppercase tracking-widest font-semibold mb-4">Settings</p>

              {/* Dark Mode Toggle */}
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-muted uppercase tracking-widest block mb-2 font-semibold">Appearance</label>
                  <div className="flex items-center justify-between p-3 bg-surface rounded-lg border border-border">
                    <div className="flex items-center gap-3">
                      <span className="text-base text-text">🌙</span>
                      <span className="text-sm text-text">Dark Mode</span>
                    </div>
                    <button
                      onClick={toggleDarkMode}
                      className={`relative w-12 h-6 rounded-full transition-colors ${darkMode ? 'bg-accent' : 'bg-border'
                        }`}
                    >
                      <div
                        className={`absolute top-1 w-4 h-4 bg-bg rounded-full transition-transform ${darkMode ? 'translate-x-7' : 'translate-x-1'
                          }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Other Settings Options */}
                <div className="space-y-3">
                  <button className="w-full text-left px-4 py-3 text-base text-text hover:bg-accent/20 hover:text-accent transition-colors rounded-lg border border-border">
                    📊 My Activity
                  </button>
                  <button className="w-full text-left px-4 py-3 text-base text-text hover:bg-accent/20 hover:text-accent transition-colors rounded-lg border border-border">
                    🔔 Notifications
                  </button>
                  <button className="w-full text-left px-4 py-3 text-base text-text hover:bg-accent/20 hover:text-accent transition-colors rounded-lg border border-border">
                    🔒 Privacy Settings
                  </button>
                  <button className="w-full text-left px-4 py-3 text-base text-text hover:bg-accent/20 hover:text-accent transition-colors rounded-lg border border-border">
                    💾 Export Data
                  </button>
                  <button className="w-full text-left px-4 py-3 text-base text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors rounded-lg border border-border">
                    🗑️ Delete Account
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="card">
              <p className="text-xs text-muted uppercase tracking-widest font-semibold mb-4">Quick Stats</p>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted">Profile Completion</span>
                  <span className="text-sm font-medium text-accent">85%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted">Member Since</span>
                  <span className="text-sm font-medium text-text">Today</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted">Last Active</span>
                  <span className="text-sm font-medium text-text">Now</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media print {
          nav, button { display: none !important; }
          .max-w-4xl { box-shadow: none; }
          a { color: inherit; text-decoration: none; }
        }
      `}</style>
    </main>
  )
}
