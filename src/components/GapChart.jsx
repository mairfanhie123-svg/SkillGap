import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts'

export default function GapChart({ currentSkills }) {
  const data = currentSkills?.map((s) => ({
    skill: s.skill.length > 12 ? s.skill.slice(0, 12) + '…' : s.skill,
    current: s.level,
    required: Math.min(100, s.level + 30), // Fixed required level
  })) || []

  return (
    <div className="card">
      <p className="section-label">Skill Radar</p>
      <h3 className="font-syne font-bold text-lg text-text mb-6">Your Current vs Required</h3>

      <ResponsiveContainer width="100%" height={280}>
        <RadarChart data={data}>
          <PolarGrid stroke="#1e1e2e" />
          <PolarAngleAxis
            dataKey="skill"
            tick={{ fill: '#6b6b80', fontSize: 11, fontFamily: 'DM Mono' }}
          />
          <Radar
            name="Current"
            dataKey="current"
            stroke="#6EE7B7"
            fill="#6EE7B7"
            fillOpacity={0.15}
            strokeWidth={2}
          />
          <Radar
            name="Required"
            dataKey="required"
            stroke="#818CF8"
            fill="#818CF8"
            fillOpacity={0.1}
            strokeWidth={1.5}
            strokeDasharray="4 2"
          />
          <Tooltip
            contentStyle={{
              background: '#13131c',
              border: '1px solid #1e1e2e',
              borderRadius: '8px',
              fontSize: '12px',
              fontFamily: 'DM Mono',
            }}
          />
        </RadarChart>
      </ResponsiveContainer>

      <div className="flex gap-6 mt-2 justify-center">
        <div className="flex items-center gap-2 text-xs text-muted">
          <div className="w-3 h-0.5 bg-accent rounded" />
          Current Level
        </div>
        <div className="flex items-center gap-2 text-xs text-muted">
          <div className="w-3 h-0.5 bg-indigo rounded" style={{ borderStyle: 'dashed' }} />
          Market Required
        </div>
      </div>
    </div>
  )
}
