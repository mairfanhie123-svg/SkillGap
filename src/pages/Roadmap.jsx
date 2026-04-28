import { useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import useStore from '../store/useStore'
import RoadmapCard from '../components/RoadmapCard'

export default function Roadmap() {
  const navigate = useNavigate()
  const { profile, roadmap } = useStore()

  useEffect(() => {
    if (!profile || !roadmap) navigate('/onboarding')
  }, [profile, roadmap])

  if (!profile || !roadmap) return null

  const totalHours = roadmap.weeks?.reduce(
    (sum, w) => sum + w.tasks?.reduce((s, t) => s + (t.hours || 0), 0),
    0
  ) || 0

  return (
    <main className="min-h-screen pt-14">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">

        {/* Header */}
        <div className="mb-8 sm:mb-12">
          <p className="section-label">Your Roadmap</p>
          <h1 className="font-syne font-extrabold text-3xl sm:text-4xl md:text-5xl text-text tracking-tight mb-3 sm:mb-4">
            {roadmap.title}
          </h1>
          <p className="text-sm sm:text-base text-muted max-w-xl font-medium">{roadmap.goal}</p>

          {/* Meta */}
          <div className="flex flex-wrap gap-2 sm:gap-4 mt-4 sm:mt-8">
            <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium text-text bg-surface border border-border px-3 sm:px-5 py-2 sm:py-3 rounded-full">
              <span className="text-accent text-base sm:text-lg">◆</span>
              4 weeks
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium text-text bg-surface border border-border px-3 sm:px-5 py-2 sm:py-3 rounded-full">
              <span className="text-amber text-base sm:text-lg">◆</span>
              ~{totalHours} total hours
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium text-text bg-surface border border-border px-3 sm:px-5 py-2 sm:py-3 rounded-full">
              <span className="text-indigo text-base sm:text-lg">◆</span>
              Free resources only
            </div>
          </div>
        </div>

        {/* Week Cards */}
        <div className="space-y-3 sm:space-y-4 mb-12 sm:mb-16">
          {roadmap.weeks?.map((week, i) => (
            <RoadmapCard key={i} weekData={week} index={i} />
          ))}
        </div>

        {/* Earning Opportunities */}
        {roadmap.earningOpportunities?.length > 0 && (
          <div className="mb-8 sm:mb-12">
            <p className="section-label">Earning Opportunities</p>
            <h2 className="font-syne font-bold text-2xl sm:text-3xl text-text mb-4 sm:mb-8">
              How to start earning — before graduation.
            </h2>
            <div className="space-y-3 sm:space-y-4">
              {roadmap.earningOpportunities.map((opp, i) => (
                <div key={i} className="card flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 p-4 sm:p-5 md:p-6">
                  <div>
                    <div className="font-syne font-bold text-text text-base sm:text-lg mb-1">{opp.platform}</div>
                    <div className="text-xs sm:text-sm text-muted font-medium">{opp.type}</div>
                  </div>
                  <div className="flex flex-wrap sm:flex-nowrap items-center gap-4 sm:gap-6 md:gap-8 flex-shrink-0">
                    <div className="text-left sm:text-right">
                      <div className="text-[10px] sm:text-xs text-muted uppercase tracking-widest font-bold mb-0.5">Estimated</div>
                      <div className="text-sm sm:text-base font-mono text-accent font-bold">{opp.estimatedEarning}</div>
                    </div>
                    <div className="text-left sm:text-right">
                      <div className="text-[10px] sm:text-xs text-muted uppercase tracking-widest font-bold mb-0.5">Ready after</div>
                      <div className="text-sm sm:text-base font-mono text-amber font-bold">{opp.readyAfter}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom nav */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <Link to="/dashboard" className="btn-ghost text-center text-sm sm:text-base">
            ← Back to Dashboard
          </Link>
          <Link to="/profile" className="btn-primary flex-1 text-center text-sm sm:text-base">
            Update Profile
          </Link>
        </div>

      </div>
    </main>
  )
}
