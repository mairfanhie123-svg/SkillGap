// Multiple API keys for automatic rotation
const API_KEYS = [
  import.meta.env.VITE_GEMINI_API_KEY_1,
  import.meta.env.VITE_GEMINI_API_KEY_2,
  import.meta.env.VITE_GEMINI_API_KEY_3
].filter(key => key && key.trim() !== '')

const BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent'

// Track current API key index
let currentKeyIndex = 0

// Rate limiting: prevent multiple rapid calls
let lastCallTime = 0
const MIN_CALL_INTERVAL = 5000 // 5 seconds between calls

console.log(`Loaded ${API_KEYS.length} Gemini API keys`)

// Get current API key
const getCurrentApiKey = () => {
  if (API_KEYS.length === 0) {
    console.error('No valid API keys found')
    return null
  }
  return API_KEYS[currentKeyIndex]
}

// Rotate to next API key
const rotateApiKey = () => {
  currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length
  console.log(`Rotated to API key ${currentKeyIndex + 1}/${API_KEYS.length}`)
  return getCurrentApiKey()
}

// Core fetch wrapper with automatic API key rotation
async function callGemini(prompt, retries = 0) {
  const maxKeyRotations = API_KEYS.length
  let totalAttempts = 0

  for (let keyRotation = 0; keyRotation < maxKeyRotations; keyRotation++) {
    const currentApiKey = getCurrentApiKey()
    if (!currentApiKey) {
      throw new Error('No valid API keys available')
    }

    // Rate limiting: wait if called too quickly
    const now = Date.now()
    const timeSinceLastCall = now - lastCallTime
    if (timeSinceLastCall < MIN_CALL_INTERVAL) {
      const waitTime = MIN_CALL_INTERVAL - timeSinceLastCall
      console.log(`Rate limiting: waiting ${waitTime}ms before API call`)
      await new Promise(resolve => setTimeout(resolve, waitTime))
    }
    lastCallTime = Date.now()

    for (let attempt = 0; attempt <= retries; attempt++) {
      totalAttempts++
      try {
        console.log(`Attempting API call with key ${currentKeyIndex + 1}/${API_KEYS.length} (attempt ${attempt + 1})`)

        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 30000)

        const res = await fetch(`${BASE_URL}?key=${currentApiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.9,
              maxOutputTokens: 8192,
              responseMimeType: "application/json",
            },
          }),
          signal: controller.signal,
        })

        clearTimeout(timeoutId)

        if (!res.ok) {
          const err = await res.json().catch(() => null)
          const message = err?.error?.message || `HTTP ${res.status}`
          if (res.status === 429 || /quota|exhausted/i.test(message)) {
            throw new Error('Gemini quota exhausted. Please try again later.')
          }
          if (res.status >= 400) throw new Error(`API error: ${message}`)
        }

        const data = await res.json()
        const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text
        if (!rawText) throw new Error('Empty response')

        return JSON.parse(rawText)
      } catch (error) {
        if (attempt === retries) throw error
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt)))
      }
    }
  }

  throw new Error(`All ${API_KEYS.length} API keys failed after ${totalAttempts} total attempts`)
}

export async function analyzeSkillGap(profile) {
  const prompt = `Analyze skill gap for ${profile.branch} student from ${profile.collegeName} (${profile.country}), semester ${profile.semester}, interests: ${profile.interests.join(', ')}, target: ${profile.targetRole || 'undecided'}.

Return ONLY JSON (no text):
{
  "overallGapScore": 75,
  "summary": "Assessment of their current position",
  "currentSkills": [
    {"skill": "skill1", "level": 70},
    {"skill": "skill2", "level": 60}
  ],
  "missingSkills": [
    {"skill": "skill1", "priority": "High"},
    {"skill": "skill2", "priority": "Medium"}
  ],
  "marketDemand": [
    {"role": "role1", "match": 75}
  ],
  "quickWins": ["task1", "task2", "task3"]
}`

  try {
    const result = await callGemini(prompt)
    return result
  } catch (error) {
    console.warn('Using fallback data for analyzeSkillGap:', error.message)
    return {
      overallGapScore: 65,
      summary: `Based on typical ${profile.branch} curriculum, you have foundational knowledge but need more practical industry skills.`,
      currentSkills: [
        { skill: "Programming Fundamentals", level: 70, source: `${profile.collegeName} curriculum` },
        { skill: "Data Structures", level: 60, source: `${profile.collegeName} curriculum` },
        { skill: "Algorithms", level: 55, source: `${profile.collegeName} curriculum` },
        { skill: "Database Concepts", level: 50, source: `${profile.collegeName} curriculum` },
        { skill: "Web Development Basics", level: 45, source: `${profile.collegeName} curriculum` },
        { skill: "Software Engineering", level: 40, source: `${profile.collegeName} curriculum` }
      ],
      missingSkills: [
        { skill: "Advanced Frameworks", priority: "High", reason: "Industry demands modern framework expertise" },
        { skill: "Cloud Computing", priority: "High", reason: "Most applications are cloud-based" },
        { skill: "DevOps Practices", priority: "Medium", reason: "Essential for modern development" },
        { skill: "Machine Learning Basics", priority: "Medium", reason: "Growing industry demand" },
        { skill: "System Design", priority: "High", reason: "Critical for senior roles" }
      ],
      marketDemand: [
        { role: "Full Stack Developer", match: 70, topSkills: ["React", "Node.js", "MongoDB"] },
        { role: "Software Engineer", match: 65, topSkills: ["Java", "Python", "AWS"] },
        { role: "Frontend Developer", match: 60, topSkills: ["JavaScript", "React", "CSS"] }
      ],
      quickWins: [
        "Build a portfolio project using modern frameworks",
        "Complete online certifications for cloud platforms",
        "Contribute to open source projects"
      ]
    }
  }
}

export async function generateRoadmap(profile, analysis) {
  const skills = analysis?.missingSkills?.slice(0, 3).map(s => s.skill).join(', ') || 'key skills'

  const prompt = `4-week roadmap for ${profile.branch} student from ${profile.collegeName}, interests: ${profile.interests.join(', ')}, focus: ${skills}.

Return ONLY JSON (no text):
{
  "title": "Roadmap title",
  "goal": "Goal in 4 weeks",
  "weeks": [
    {"week": 1, "theme": "Theme", "project": "Build X", "tasks": ["task1"], "hours": 8}
  ],
  "earningOpportunities": [
    {"platform": "platform", "earning": "₹X-Y"}
  ]
}`

  try {
    const result = await callGemini(prompt)
    return result
  } catch (error) {
    console.warn('Using fallback data for generateRoadmap:', error.message)
    return {
      title: `${profile.branch} to Industry Bridge Roadmap`,
      goal: "Build practical industry skills while leveraging your academic foundation",
      weeks: [
        {
          week: 1,
          theme: "Foundation Strengthening",
          focus: "Core programming and tools",
          tasks: [
            { task: "Master Git & GitHub", resource: "GitHub Docs", url: "https://docs.github.com", hours: 3 },
            { task: "Build responsive layouts", resource: "freeCodeCamp", url: "https://freecodecamp.org", hours: 5 },
            { task: "Learn modern CSS", resource: "MDN Web Docs", url: "https://developer.mozilla.org", hours: 4 }
          ],
          project: "Create a personal portfolio website with GitHub Pages",
          milestone: "Portfolio deployed and accessible via GitHub Pages"
        },
        {
          week: 2,
          theme: "Framework Fundamentals",
          focus: "Modern JavaScript frameworks",
          tasks: [
            { task: "Learn React basics", resource: "React Tutorial", url: "https://react.dev", hours: 6 },
            { task: "Build interactive components", resource: "React Docs", url: "https://react.dev", hours: 4 },
            { task: "State management", resource: "React Hooks Guide", url: "https://react.dev", hours: 3 }
          ],
          project: "Convert portfolio to React with interactive components",
          milestone: "Functional React portfolio with 3+ interactive features"
        },
        {
          week: 3,
          theme: "Backend Integration",
          focus: "APIs and databases",
          tasks: [
            { task: "Learn REST APIs", resource: "REST API Tutorial", url: "https://restfulapi.net", hours: 4 },
            { task: "Build Node.js server", resource: "Node.js Docs", url: "https://nodejs.org", hours: 5 },
            { task: "Database basics", resource: "MongoDB University", url: "https://university.mongodb.com", hours: 4 }
          ],
          project: "Add contact form and blog functionality to portfolio",
          milestone: "Full-stack portfolio with working contact form and blog"
        },
        {
          week: 4,
          theme: "Production Ready",
          focus: "Deployment and optimization",
          tasks: [
            { task: "Cloud deployment", resource: "Vercel Docs", url: "https://vercel.com/docs", hours: 3 },
            { task: "Performance optimization", resource: "Web.dev", url: "https://web.dev", hours: 4 },
            { task: "Testing basics", resource: "Jest Docs", url: "https://jestjs.io", hours: 3 }
          ],
          project: "Deploy optimized full-stack application with tests",
          milestone: "Deployed app with tests and performance optimizations"
        }
      ],
      earningOpportunities: [
        { platform: "Freelancer", type: "Frontend Development", estimatedEarning: "₹5,000-15,000 per project", readyAfter: "Week 2" },
        { platform: "Upwork", type: "React Development", estimatedEarning: "₹8,000-25,000 per project", readyAfter: "Week 3" },
        { platform: "Fiverr", type: "Portfolio Websites", estimatedEarning: "₹3,000-10,000 per project", readyAfter: "Week 1" }
      ]
    }
  }
}

export async function suggestCareerPaths(profile) {
  const prompt = `3 career paths for ${profile.branch} student from ${profile.collegeName}, interests: ${profile.interests.join(', ')}.

Return ONLY JSON (no text):
{
  "paths": [
    {"title": "Path1", "description": "Brief desc", "skills": ["skill1"], "demand": "High"}
  ]
}`

  try {
    const result = await callGemini(prompt)
    return result
  } catch (error) {
    console.warn('Using fallback data for suggestCareerPaths:', error.message)
    return {
      paths: [
        {
          title: "Full Stack Developer",
          description: "Build complete web applications from frontend to backend",
          whyItFitsYou: "Your ${profile.branch} background provides strong programming fundamentals",
          firstEarningTimeline: "2-3 months",
          topSkillsNeeded: ["React", "Node.js", "MongoDB"],
          demandLevel: "High"
        },
        {
          title: "Software Engineer",
          description: "Design and develop software systems and applications",
          whyItFitsYou: "Your engineering curriculum teaches core software principles",
          firstEarningTimeline: "3-4 months",
          topSkillsNeeded: ["Java", "Python", "System Design"],
          demandLevel: "High"
        },
        {
          title: "Frontend Developer",
          description: "Create user interfaces and web applications",
          whyItFitsYou: "Your interests in ${profile.interests.join(', ')} align with frontend development",
          firstEarningTimeline: "1-2 months",
          topSkillsNeeded: ["JavaScript", "React", "CSS"],
          demandLevel: "Medium"
        }
      ]
    }
  }
}