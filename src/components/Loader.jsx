export default function Loader({ message = 'Analyzing your profile...' }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8">
      {/* Animated orb */}
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 rounded-full border-2 border-accent opacity-20 animate-ping" />
        <div className="absolute inset-2 rounded-full border-2 border-accent opacity-40 animate-ping [animation-delay:0.3s]" />
        <div className="absolute inset-4 rounded-full bg-accent opacity-60 animate-pulse" />
      </div>

      {/* Message */}
      <div className="text-center space-y-2">
        <p className="text-sm font-mono text-text">{message}</p>
        <p className="text-xs text-muted">Gemini is thinking...</p>
      </div>

      {/* Animated dots */}
      <div className="flex gap-2">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  )
}
