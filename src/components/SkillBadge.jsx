const priorityColors = {
  High: 'border-red-500/30 text-red-400 bg-red-500/10',
  Medium: 'border-amber/30 text-amber bg-amber/10',
  Low: 'border-indigo/30 text-indigo bg-indigo/10',
}

export default function SkillBadge({ skill, priority, level }) {
  if (priority) {
    return (
      <span className={`inline-flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded-full border ${priorityColors[priority] || priorityColors.Medium}`}>
        <span>{skill}</span>
        <span className="opacity-60 text-[10px]">{priority}</span>
      </span>
    )
  }

  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded-full border border-border text-text bg-surface">
      {skill}
      {level !== undefined && (
        <span className="text-accent text-[10px]">{level}%</span>
      )}
    </span>
  )
}
