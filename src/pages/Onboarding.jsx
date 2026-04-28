import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { auth } from '../services/firebase'
import { saveProfile, saveAnalysis, saveRoadmap } from '../services/firebase'
import useStore from '../store/useStore'
import { analyzeSkillGap, generateRoadmap, suggestCareerPaths } from '../services/gemini'
import Loader from '../components/Loader'

const BRANCHES = ['Computer Science (CS)', 'Computer Science & Design (CSD)', 'IT', 'ECE', 'EEE', 'Mechanical', 'Civil', 'Other']
const SEMESTERS = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th']
const COUNTRIES = ['India', 'USA', 'UK', 'Canada', 'Australia', 'Germany', 'Singapore', 'UAE', 'Other']

// Colleges by country (sample data - AI will supplement)
const COLLEGES_BY_COUNTRY = {
  'India': [
    'IIT Delhi', 'IIT Bombay', 'IIT Madras', 'IIT Kanpur', 'IIT Kharagpur',
    'NIT Trichy', 'NIT Surathkal', 'NIT Warangal', 'BITS Pilani', 'IIIT Hyderabad',
    'Anna University', 'Jadavpur University', 'Delhi University', 'JNU',
    'VIT Vellore', 'SRM University', 'Amrita University', 'Manipal University'
  ],
  'USA': [
    'MIT', 'Stanford University', 'Harvard University', 'Caltech', 'UC Berkeley',
    'Carnegie Mellon', 'University of Michigan', 'Georgia Tech', 'UIUC', 'Cornell',
    'Princeton University', 'Yale University', 'Columbia University', 'UCLA'
  ],
  'UK': [
    'University of Cambridge', 'University of Oxford', 'Imperial College London',
    'UCL', 'University of Edinburgh', 'King\'s College London', 'University of Manchester',
    'University of Bristol', 'University of Warwick', 'University of Birmingham'
  ],
  'Canada': [
    'University of Toronto', 'University of British Columbia', 'McGill University',
    'University of Montreal', 'University of Alberta', 'University of Waterloo',
    'McMaster University', 'University of Calgary', 'Queen\'s University', 'Western University'
  ],
  'Australia': [
    'University of Melbourne', 'University of Sydney', 'University of Queensland',
    'Monash University', 'University of New South Wales', 'Australian National University',
    'University of Adelaide', 'University of Western Australia', 'University of Technology Sydney'
  ],
  'Germany': [
    'Technical University of Munich', 'RWTH Aachen', 'University of Stuttgart',
    'Karlsruhe Institute of Technology', 'Technical University of Berlin', 'University of Freiburg'
  ],
  'Singapore': [
    'National University of Singapore', 'Nanyang Technological University',
    'Singapore Management University', 'Singapore University of Technology and Design'
  ],
  'UAE': [
    'UAE University', 'American University of Sharjah', 'University of Dubai',
    'Khalifa University', 'New York University Abu Dhabi'
  ],
  'Other': ['Other']
}

const INTEREST_OPTIONS = [
  'Web Development', 'Mobile Apps', 'Data Science', 'Machine Learning / AI',
  'UI/UX Design', 'Cybersecurity', 'Cloud Computing', 'Game Development',
  'DevOps', 'Embedded Systems', 'Freelancing', 'Open Source',
]
const ROLES = [
  'Software Development Engineer (SDE)',
  'Data Analyst',
  'ML Engineer',
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'UI/UX Designer',
  'DevOps Engineer',
  'Not sure yet',
]

export default function Onboarding() {
  const navigate = useNavigate()
  const { setProfile, setAnalysis, setRoadmap, setIsAnalyzing } = useStore()

  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    country: '',
    collegeName: '',
    branch: '',
    semester: '',
    interests: [],
    targetRole: '',
  })

  const [collegeError, setCollegeError] = useState('')

  const toggleInterest = (item) => {
    setForm((f) => ({
      ...f,
      interests: f.interests.includes(item)
        ? f.interests.filter((i) => i !== item)
        : [...f.interests, item],
    }))
  }

  const canProceed = () => {
    if (step === 1) return form.country
    if (step === 2) return form.collegeName && !collegeError
    if (step === 3) return form.branch && form.semester
    if (step === 4) return form.interests.length >= 2
    if (step === 5) return form.targetRole
    return true
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError('')
    setCollegeError('')

    const user = auth.currentUser
    if (!user) {
      setError('Not authenticated. Please log in first.')
      setLoading(false)
      return
    }

    // Validate college name if country is "Other"
    if (form.country === 'Other' && form.collegeName !== 'Other') {
      // Check if college name is too short or seems invalid
      if (form.collegeName.length < 3 || !form.collegeName.includes(' ')) {
        setCollegeError('Please enter a valid college name')
        setStep(2) // Go back to college selection step
        setLoading(false)
        return
      }
    }

    try {
      // Set profile in store immediately
      setProfile(form)

      // Run analysis first to get missing skills
      const analysis = await analyzeSkillGap(form)

      // Add delay before next API calls to prevent rate limiting
      await new Promise(resolve => setTimeout(resolve, 3000))

      // Run the other two sequentially to prevent rate limiting
      const paths = form.targetRole === 'Not sure yet' ? await suggestCareerPaths(form) : null
      await new Promise(resolve => setTimeout(resolve, 3000))
      const roadmap = await generateRoadmap(form, analysis)

      const analysisWithPaths = { ...analysis, careerPaths: paths?.paths || null }

      // Set in store
      setAnalysis(analysisWithPaths)
      setRoadmap(roadmap)

      // Save to Firestore
      await Promise.all([
        saveProfile(user.uid, form),
        saveAnalysis(user.uid, analysisWithPaths),
        saveRoadmap(user.uid, roadmap),
      ])

      navigate('/dashboard')
    } catch (err) {
      console.error('Onboarding error:', err)
      setError(err.message || 'AI Analysis failed. Please try again.')
      setLoading(false)
      return
    } finally {
      setLoading(false)
    }
  }

  if (loading) return (
    <main className="min-h-screen pt-14 flex items-center justify-center">
      <Loader message="Gemini is analyzing your profile..." />
    </main>
  )

  return (
    <main className="min-h-screen pt-14">
      <div className="max-w-xl mx-auto px-6 py-16">

        {/* Progress bar */}
        <div className="flex gap-2 mb-12">
          {[1, 2, 3, 4, 5].map((s) => (
            <div
              key={s}
              className={`h-1 flex-1 rounded-full transition-all duration-500 ${s <= step ? 'bg-accent' : 'bg-border'
                }`}
            />
          ))}
        </div>

        {/* Step 1 — Country Selection */}
        {step === 1 && (
          <div className="space-y-8 animate-fade-up">
            <div>
              <p className="section-label">Step 1 of 5</p>
              <h2 className="font-syne font-bold text-3xl text-text">Where are you studying?</h2>
              <p className="text-sm text-muted mt-2">Select your country to see available colleges.</p>
            </div>

            <div className="space-y-5">
              <div>
                <label className="text-xs text-muted uppercase tracking-widest block mb-2">Country</label>
                <div className="space-y-2">
                  {COUNTRIES.map((country) => (
                    <button
                      key={country}
                      onClick={() => setForm({ ...form, country })}
                      className={`w-full text-left px-4 py-3 text-base font-mono rounded-lg border transition-all ${form.country === country
                        ? 'border-accent bg-accent/20 text-accent'
                        : 'border-border text-text hover:border-accent/60 hover:bg-accent/10'
                        }`}
                    >
                      {country}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2 — College Selection */}
        {step === 2 && (
          <div className="space-y-8 animate-fade-up">
            <div>
              <p className="section-label">Step 2 of 5</p>
              <h2 className="font-syne font-bold text-3xl text-text">Which college are you attending?</h2>
              <p className="text-sm text-muted mt-2">Select your college from {form.country}.</p>
            </div>

            <div className="space-y-5">
              <div>
                <label className="text-xs text-muted uppercase tracking-widest block mb-2">College/University</label>
                <div className="max-h-64 overflow-y-auto space-y-2">
                  {COLLEGES_BY_COUNTRY[form.country]?.map((college) => (
                    <button
                      key={college}
                      onClick={() => setForm({ ...form, collegeName: college })}
                      className={`w-full text-left px-4 py-3 text-base font-mono rounded-lg border transition-all ${form.collegeName === college
                        ? 'border-accent bg-accent/20 text-accent'
                        : 'border-border text-text hover:border-accent/60 hover:bg-accent/10'
                        }`}
                    >
                      {college}
                    </button>
                  ))}
                  {form.country !== 'Other' && (
                    <button
                      key="other"
                      onClick={() => setForm({ ...form, collegeName: 'Other' })}
                      className={`w-full text-left px-4 py-3 text-base font-mono rounded-lg border transition-all ${form.collegeName === 'Other'
                        ? 'border-accent bg-accent/20 text-accent'
                        : 'border-border text-text hover:border-accent/60 hover:bg-accent/10'
                        }`}
                    >
                      Other
                    </button>
                  )}
                </div>
                {form.country === 'Other' && (
                  <div>
                    <input
                      type="text"
                      className={`input-field mt-3 ${collegeError ? 'border-red-500 focus:border-red-500' : ''}`}
                      placeholder="Enter your college name"
                      value={form.collegeName}
                      onChange={(e) => {
                        const collegeName = e.target.value
                        setForm({ ...form, collegeName })
                        setCollegeError('') // Clear error when typing

                        // Real-time college validation
                        if (collegeName && collegeName !== 'Other') {
                          console.log('College name entered:', collegeName)
                          // Future: Add API call to validate college existence
                        }
                      }}
                    />
                    {collegeError && (
                      <p className="text-red-500 text-sm mt-1">{collegeError}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 3 — Academic Info */}
        {step === 3 && (
          <div className="space-y-8 animate-fade-up">
            <div>
              <p className="section-label">Step 3 of 5</p>
              <h2 className="font-syne font-bold text-3xl text-text">Tell us about your studies.</h2>
              <p className="text-sm text-muted mt-2">Your academic background helps us analyze your curriculum.</p>
            </div>

            <div className="space-y-5">
              <div>
                <label className="text-xs text-muted uppercase tracking-widest block mb-2">Branch</label>
                <select
                  className="input-field"
                  value={form.branch}
                  onChange={(e) => setForm({ ...form, branch: e.target.value })}
                >
                  <option value="">Select your branch</option>
                  {BRANCHES.map((b) => <option key={b}>{b}</option>)}
                </select>
              </div>

              <div>
                <label className="text-xs text-muted uppercase tracking-widest block mb-2">Current Semester</label>
                <div className="grid grid-cols-4 gap-2">
                  {SEMESTERS.map((s) => (
                    <button
                      key={s}
                      onClick={() => setForm({ ...form, semester: s })}
                      className={`py-2.5 text-sm font-mono rounded-lg border transition-all ${form.semester === s
                        ? 'border-accent bg-accent/20 text-accent'
                        : 'border-border text-text hover:border-accent/60 hover:bg-accent/10'
                        }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 4 — Interests */}
        {step === 4 && (
          <div className="space-y-8 animate-fade-up">
            <div>
              <p className="section-label">Step 4 of 5</p>
              <h2 className="font-syne font-bold text-3xl text-text">What excites you?</h2>
              <p className="text-sm text-muted mt-2">Pick at least 2. This shapes your gap analysis.</p>
            </div>

            <div className="flex flex-wrap gap-2">
              {INTEREST_OPTIONS.map((item) => (
                <button
                  key={item}
                  onClick={() => toggleInterest(item)}
                  className={`text-sm font-mono px-4 py-2 rounded-full border transition-all ${form.interests.includes(item)
                    ? 'border-accent bg-accent/25 text-accent'
                    : 'border-border text-text hover:border-accent/60 hover:bg-accent/10'
                    }`}
                >
                  {item}
                </button>
              ))}
            </div>

            <p className="text-xs text-muted">
              {form.interests.length} selected{form.interests.length < 2 ? ' (pick at least 2)' : ' ✓'}
            </p>
          </div>
        )}

        {/* Step 5 — Target role */}
        {step === 5 && (
          <div className="space-y-8 animate-fade-up">
            <div>
              <p className="section-label">Step 5 of 5</p>
              <h2 className="font-syne font-bold text-3xl text-text">What role are you aiming for?</h2>
              <p className="text-sm text-muted mt-2">Not sure? That's okay — we'll suggest paths for you.</p>
            </div>

            <div className="space-y-2">
              {ROLES.map((r) => (
                <button
                  key={r}
                  onClick={() => setForm({ ...form, targetRole: r })}
                  className={`w-full text-left px-4 py-3 text-base font-mono rounded-lg border transition-all ${form.targetRole === r
                    ? 'border-accent bg-accent/20 text-accent'
                    : 'border-border text-text hover:border-accent/60 hover:bg-accent/10'
                    }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Navigation */}
        <div className="flex gap-3 mt-10">
          {step > 1 && (
            <button onClick={() => setStep(step - 1)} className="btn-ghost flex-1">
              ← Back
            </button>
          )}
          {step < 5 ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={!canProceed()}
              className={`btn-primary flex-1 ${!canProceed() ? 'opacity-40 cursor-not-allowed hover:translate-y-0' : ''}`}
            >
              Continue →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!canProceed()}
              className={`btn-primary flex-1 ${!canProceed() ? 'opacity-40 cursor-not-allowed hover:translate-y-0' : ''}`}
            >
              Analyze my gap →
            </button>
          )}
        </div>
      </div>
    </main>
  )
}
