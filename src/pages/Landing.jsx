import { Link } from 'react-router-dom'

const stats = [
  { value: '40M+', label: 'Engineering students in India' },
  { value: '60%', label: 'Graduates underemployed' },
  { value: '4 yrs', label: 'Wasted on irrelevant syllabus' },
]

export default function Landing() {
  return (
    <main className="min-h-screen pt-14">
      {/* Hero */}
      <section className="relative max-w-5xl mx-auto px-4 sm:px-6 pt-16 sm:pt-20 md:pt-24 pb-16 sm:pb-20">
        {/* Glow blobs */}
        <div className="absolute top-0 left-0 w-64 h-64 sm:w-96 sm:h-96 bg-accent opacity-5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-64 h-64 sm:w-96 sm:h-96 bg-indigo opacity-5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none" />



        {/* Headline */}
        <h1
          className="font-syne font-extrabold text-[clamp(36px,8vw,72px)] sm:text-[clamp(42px,9vw,82px)] md:text-[clamp(52px,10vw,92px)] leading-[0.92] tracking-tight mb-6 sm:mb-8 animate-fade-up"
          style={{ animationDelay: '0.1s' }}
        >
          Stop waiting.
          <br />
          Start{' '}
          <span className="font-serif font-normal italic text-accent">
            earning.
          </span>
        </h1>

        <p
          className="text-sm sm:text-base text-muted max-w-xl leading-relaxed mb-8 sm:mb-12 animate-fade-up"
          style={{ animationDelay: '0.2s' }}
        >
          Your college teaches <strong className="text-text">what they've always taught.</strong>{' '}
          The job market wants something different. SkillGap shows you exactly what's missing — and
          builds your personal roadmap to your first paycheck.
        </p>

        <div
          className="flex flex-wrap gap-3 sm:gap-4 animate-fade-up"
          style={{ animationDelay: '0.3s' }}
        >
          <Link to="/login" className="btn-primary text-sm sm:text-base px-4 sm:px-6 py-2.5 sm:py-3">
            Analyze my gap →
          </Link>
          <a href="#how" className="btn-ghost text-sm sm:text-base px-4 sm:px-6 py-2.5 sm:py-3">
            See how it works
          </a>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="font-syne font-extrabold text-2xl sm:text-3xl text-accent">{s.value}</div>
              <div className="text-xs sm:text-sm text-muted mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-20 md:py-24">
        <p className="section-label">How It Works</p>
        <h2 className="font-syne font-bold text-2xl sm:text-3xl md:text-4xl text-text mb-8 sm:mb-12 md:mb-16 tracking-tight">
          Three steps. Real results.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {[
            {
              num: '01',
              title: 'Tell us where you are',
              desc: 'Branch, semester, interests. Takes 2 minutes. No fluff.',
              color: 'text-accent',
              border: 'hover:border-accent/40',
            },
            {
              num: '02',
              title: 'Gemini finds the gap',
              desc: "AI compares your syllabus against thousands of real job descriptions and shows you what's missing.",
              color: 'text-indigo',
              border: 'hover:border-indigo/40',
            },
            {
              num: '03',
              title: 'Get your roadmap',
              desc: 'Week-by-week plan using only free resources — plus how to start earning before graduation.',
              color: 'text-amber',
              border: 'hover:border-amber/40',
            },
          ].map((step) => (
            <div key={step.num} className={`card ${step.border} transition-all duration-200 p-4 sm:p-6`}>
              <div className={`font-syne font-extrabold text-4xl sm:text-5xl ${step.color} mb-4 sm:mb-6 leading-none`}>
                {step.num}
              </div>
              <h3 className="font-syne font-bold text-base sm:text-lg text-text mb-2 sm:mb-3">{step.title}</h3>
              <p className="text-xs sm:text-sm text-muted">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-16 sm:pb-20 md:pb-24">
        <div className="card border-accent/20 bg-accent/5 text-center py-12 sm:py-16">
          <h2 className="font-syne font-extrabold text-2xl sm:text-3xl md:text-4xl text-text mb-3 sm:mb-4 tracking-tight">
            Ready to stop{' '}
            <span className="font-serif font-normal italic text-accent">waiting?</span>
          </h2>
          <p className="text-xs sm:text-sm text-muted mb-6 sm:mb-8">
            Built by a 2nd year B.Tech student who felt this every day.
          </p>
          <Link to="/onboarding" className="btn-primary text-sm sm:text-base px-4 sm:px-6 py-2.5 sm:py-3">
            Start for free →
          </Link>
        </div>
      </section>
    </main>
  )
}
