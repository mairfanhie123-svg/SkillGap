import { useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import useStore from '../store/useStore'
import GapChart from '../components/GapChart'
import SkillBadge from '../components/SkillBadge'
import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts'

export default function Dashboard() {
  const navigate = useNavigate()
  const { profile, analysis } = useStore()

  if (!profile || !analysis) {
    return (
      <main className="min-h-screen pt-14 flex items-center justify-center px-4 sm:px-6">
        <div className="card text-center max-w-md mx-auto p-6 sm:p-8">
          <h2 className="font-syne font-bold text-xl sm:text-2xl text-text mb-3 sm:mb-4">Welcome to your Dashboard</h2>
          <p className="text-xs sm:text-sm text-muted mb-6 sm:mb-8">
            You need to complete your profile and AI analysis to see your personalized insights and roadmap.
          </p>
          <button onClick={() => navigate('/onboarding')} className="btn-primary w-full">
            Start AI Analysis
          </button>
        </div>
      </main>
    )
  }

  const gapScore = analysis.overallGapScore || 0
  const fillColor = gapScore > 70 ? '#ef4444' : gapScore > 40 ? '#F59E0B' : '#6EE7B7'

  return (
    <main className="min-h-screen pt-14">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">

        {/* Header */}
        <div className="mb-8 sm:mb-12">
          <p className="section-label">Your Analysis</p>
          <h1 className="font-syne font-extrabold text-2xl sm:text-3xl md:text-4xl text-text tracking-tight">
            Here's your honest picture.
          </h1>
          <p className="text-xs sm:text-sm text-muted mt-2 sm:mt-3 max-w-xl">{analysis.summary}</p>
        </div>

        {/* Top Row — Gap Score + Quick Wins */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6">

          {/* Gap Score */}
          <div className="card flex flex-col items-center justify-center text-center py-6 sm:py-8">
            <p className="text-xs text-muted uppercase tracking-widest mb-3 sm:mb-4">Overall Gap Score</p>
            <div className="relative w-28 h-28 sm:w-36 sm:h-36">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart
                  innerRadius="70%"
                  outerRadius="100%"
                  data={[{ value: gapScore, fill: fillColor }]}
                  startAngle={90}
                  endAngle={90 + (gapScore / 100) * 360}
                >
                  <RadialBar dataKey="value" cornerRadius={8} background={{ fill: '#1e1e2e' }} />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-syne font-extrabold text-2xl sm:text-3xl" style={{ color: fillColor }}>
                  {gapScore}%
                </span>
                <span className="text-xs text-muted">gap</span>
              </div>
            </div>
            <p className="text-xs text-muted mt-3 sm:mt-4 max-w-[160px]">
              {gapScore > 70 ? 'Large gap — but fixable with focus' : gapScore > 40 ? 'Moderate gap — you\'re closer than you think' : 'Small gap — you\'re in good shape!'}
            </p>
          </div>

          {/* Quick Wins */}
          <div className="card md:col-span-2">
            <p className="section-label">Quick Wins</p>
            <h3 className="font-syne font-bold text-base sm:text-lg text-text mb-4 sm:mb-5">Start this week</h3>
            <div className="space-y-2 sm:space-y-3">
              {analysis.quickWins?.map((win, i) => (
                <div key={i} className="flex items-start gap-2 sm:gap-3">
                  <span className="text-accent text-xs sm:text-sm mt-0.5 flex-shrink-0">✦</span>
                  <p className="text-xs sm:text-sm text-muted">{win}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Radar Chart + Missing Skills */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
          <GapChart currentSkills={analysis.currentSkills} />

          {/* Missing Skills */}
          <div className="card">
            <p className="section-label">Missing Skills</p>
            <h3 className="font-syne font-bold text-base sm:text-lg text-text mb-4 sm:mb-5">What the market wants</h3>
            <div className="space-y-3 sm:space-y-4">
              {analysis.missingSkills?.map((s, i) => (
                <div key={i} className="bg-surface rounded-lg p-3 sm:p-4 border border-border">
                  <div className="flex items-start gap-2 sm:gap-3 mb-2 sm:mb-3">
                    <SkillBadge skill={s.skill} priority={s.priority} />
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs sm:text-sm text-muted">• {s.reason}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Market Demand */}
        <div className="card mb-4 sm:mb-6">
          <p className="section-label">Market Demand</p>
          <h3 className="font-syne font-bold text-base sm:text-lg text-text mb-4 sm:mb-6">How you match to real roles</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
            {analysis.marketDemand?.map((role, i) => (
              <div key={i} className="bg-surface rounded-lg p-3 sm:p-5 border border-border">
                <div className="font-syne font-bold text-text text-xs sm:text-sm mb-2 sm:mb-3">{role.role}</div>

                {/* Match bar */}
                <div className="mb-2 sm:mb-3">
                  <div className="flex justify-between text-xs text-muted mb-1.5">
                    <span>Match</span>
                    <span className="text-accent">{role.match}%</span>
                  </div>
                  <div className="h-1.5 bg-border rounded-full overflow-hidden">
                    <div
                      className="h-full bg-accent rounded-full transition-all duration-1000"
                      style={{ width: `${role.match}%` }}
                    />
                  </div>
                </div>

                {/* Top skills */}
                <div className="flex flex-wrap gap-1 sm:gap-1.5">
                  {role.topSkills?.map((skill) => (
                    <span key={skill} className="text-xs text-muted bg-card px-1.5 sm:px-2 py-1 rounded border border-border">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Career Paths (if undecided) */}
        {analysis.careerPaths && (
          <div className="card mb-4 sm:mb-6">
            <p className="section-label">Suggested Paths</p>
            <h3 className="font-syne font-bold text-base sm:text-lg text-text mb-4 sm:mb-6">Gemini recommends these for you</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
              {analysis.careerPaths.map((path, i) => (
                <div key={i} className="bg-surface rounded-lg p-3 sm:p-5 border border-border hover:border-accent/30 transition-colors">
                  <div className="font-syne font-bold text-accent text-xs sm:text-sm mb-1 sm:mb-2">{path.title}</div>
                  <p className="text-xs text-muted mb-2 sm:mb-3">{path.description}</p>
                  <p className="text-xs text-text mb-2 sm:mb-3 italic">"{path.whyItFitsYou}"</p>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs gap-1 sm:gap-0">
                    <span className="text-muted">First income: <span className="text-amber">{path.firstEarningTimeline}</span></span>
                    <span className={`px-2 py-0.5 rounded-full border text-[10px] ${path.demandLevel === 'High' ? 'border-green-500/30 text-green-400' :
                      path.demandLevel === 'Medium' ? 'border-amber/30 text-amber' :
                        'border-border text-muted'
                      }`}>{path.demandLevel}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA to Roadmap */}
        <div className="card border-accent/20 bg-accent/5 flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6 py-6 sm:py-8 px-4 sm:px-8">
          <div>
            <h3 className="font-syne font-bold text-lg sm:text-xl text-text mb-1 sm:mb-2">Ready to close the gap?</h3>
            <p className="text-xs sm:text-sm text-muted">Your personalised 4-week roadmap is ready.</p>
          </div>
          <Link to="/roadmap" className="btn-primary whitespace-nowrap text-sm sm:text-base">
            View my roadmap →
          </Link>
        </div>

      </div>
    </main>
  )
}
