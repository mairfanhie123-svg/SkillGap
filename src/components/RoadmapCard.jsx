import { useState } from 'react'

const weekColors = ['border-accent', 'border-indigo', 'border-amber', 'border-green-400']
const weekAccents = ['text-accent', 'text-indigo', 'text-amber', 'text-green-400']
const weekShadows = ['shadow-[6px_6px_0px_#6EE7B7]', 'shadow-[6px_6px_0px_#818CF8]', 'shadow-[6px_6px_0px_#F59E0B]', 'shadow-[6px_6px_0px_#4ade80]']
const weekBgs = ['bg-accent', 'bg-indigo', 'bg-amber', 'bg-green-400']

export default function RoadmapCard({ weekData, index }) {
  const [open, setOpen] = useState(true)
  const color = weekColors[index % weekColors.length]
  const accent = weekAccents[index % weekAccents.length]
  const shadow = weekShadows[index % weekShadows.length]
  const bg = weekBgs[index % weekBgs.length]
  
  const totalHours = weekData.tasks?.reduce((sum, t) => sum + (t.hours || 0), 0) || 0

  return (
    <div className={`relative bg-card border ${color}/30 rounded-xl p-6 sm:p-8 transition-all duration-500 hover:-translate-y-1 mb-10`}>
      
      {/* Huge floating background number */}
      <div className={`absolute -right-6 -top-10 font-syne font-extrabold text-[100px] leading-none opacity-[0.03] pointer-events-none select-none ${accent} z-0`}>
        {String(weekData.week).padStart(2, '0')}
      </div>

      {/* Header */}
      <button
        className="relative z-10 w-full flex items-start justify-between gap-4 text-left"
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-start gap-4">
          <div className={`font-syne font-extrabold text-3xl leading-none ${accent}`}>
            {String(weekData.week).padStart(2, '0')}
          </div>
          <div className="mt-1">
            <div className="font-syne font-bold text-text text-lg md:text-xl">{weekData.theme}</div>
            <div className="text-sm text-muted mt-2 font-medium flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${bg}`}></span>
              {weekData.focus} · ~{totalHours}h total
            </div>
          </div>
        </div>
        <div className={`w-10 h-10 rounded-full border border-border flex items-center justify-center transition-transform duration-300 ${open ? 'rotate-180 bg-surface' : ''}`}>
          <span className="text-xs text-muted">▼</span>
        </div>
      </button>

      {/* Expanded content */}
      <div className={`relative z-10 grid transition-all duration-500 ease-in-out ${open ? 'grid-rows-[1fr] opacity-100 mt-8' : 'grid-rows-[0fr] opacity-0 mt-0 pointer-events-none'}`}>
        <div className="overflow-hidden space-y-10">
          
          {/* Tasks Section */}
          <div className="pl-2 sm:pl-16">
            <p className="text-xs text-muted uppercase tracking-widest font-bold mb-5 flex items-center gap-3">
              <span className={`w-6 h-[1px] ${bg}`}></span> Tasks
            </p>
            <div className="space-y-4">
              {weekData.tasks?.map((task, i) => (
                <div key={i} className="flex items-start gap-4 text-sm group">
                  <div className={`mt-1.5 w-1.5 h-1.5 rounded-full ${bg} opacity-50 group-hover:opacity-100 transition-opacity`}></div>
                  <div className="flex-1">
                    <span className="text-text font-medium text-base">{task.task}</span>
                    <div className="flex items-center gap-3 mt-2">
                      <a
                        href={task.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`text-sm ${accent} hover:underline underline-offset-4 font-medium flex items-center gap-1`}
                      >
                        {task.resource} <span className="text-[10px]">↗</span>
                      </a>
                      <span className="text-sm text-muted/50 font-bold">|</span>
                      <span className="text-sm text-muted font-medium bg-surface px-2 py-0.5 rounded border border-border">
                        {task.hours} hrs
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Project Box - "Popping Out" */}
          <div className="relative z-20 sm:-mx-6 lg:-mx-12 lg:ml-8 translate-y-2 hover:-translate-y-0 transition-transform duration-300">
            <div className={`bg-[#181824] p-6 sm:p-8 rounded-xl border-2 ${color} ${shadow} relative overflow-hidden`}>
              {/* Decorative accent bar */}
              <div className={`absolute top-0 left-0 w-2 h-full ${bg}`}></div>
              
              <div className="pl-4">
                <div className="flex items-center gap-3 mb-3">
                  <span className={`text-xl ${accent}`}>✦</span>
                  <p className="text-xs uppercase tracking-widest font-bold text-muted">Build This Week</p>
                </div>
                <p className="text-lg sm:text-xl font-syne font-bold text-text leading-tight max-w-lg">
                  {weekData.project}
                </p>
              </div>
            </div>
          </div>

          {/* Milestone */}
          <div className="pl-2 sm:pl-16 pt-2 flex items-start gap-4">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full border border-border bg-surface flex-shrink-0 mt-1`}>
              <span className={`text-lg ${accent}`}>✓</span>
            </div>
            <div>
              <p className="text-xs text-muted uppercase tracking-widest font-bold mb-2">Milestone</p>
              <p className="text-base text-text font-medium">{weekData.milestone}</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
