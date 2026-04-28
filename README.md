# SkillGap 🎯
## 🎯 What is SkillGap?
SkillGap is an AI-powered platform that analyzes the 
gap between a student's college syllabus and real job 
market requirements. Input your branch, semester, and 
target role — get a personalized roadmap to your 
first paycheck.
### Bridge the gap between what colleges teach and what jobs need.

**Google Solution Challenge 2026** · SDG #4 Quality Education · SDG #8 Decent Work

Built solo by Mohammed Abdul Irfan · Hyderabad · CSD 2nd Year

---

## � Mobile Access

### Option 1: Local Network
```bash
npm run dev-host
```
Access via: `http://192.168.1.10:5173`

### Option 2: LocalTunnel (Public URL - No Auth)
```bash
npx localtunnel --port 5173
```
Get public URL for mobile testing (free, no auth required)

### Option 3: Serveo (Public URL - No Auth)
```bash
npx serveo
```
Alternative public URL option

---

## � Setup in 5 Minutes

### 1. Install dependencies
```bash
npm install
```

### 2. Get your Gemini API Key
- Go to https://aistudio.google.com
- Click **"Get API Key"** → Create a free key
- Copy the key

### 3. Add the API key
Open `.env` and replace the placeholder:
```
VITE_GEMINI_API_KEY=''
```

### 4. Run the app
```bash
npm run dev
```

Open http://localhost:5173 → done! 🎉

---

## 📁 Project Structure

```
skillgap/
├── src/
│   ├── pages/
│   │   ├── Landing.jsx       ← Hero page
│   │   ├── Login.jsx        ← Authentication
│   │   ├── Onboarding.jsx   ← 5-step form with enhanced UI
│   │   ├── Dashboard.jsx    ← Gap analysis results
│   │   ├── Roadmap.jsx      ← 4-week roadmap
│   │   └── Profile.jsx      ← Enhanced profile with settings
│   ├── components/
│   │   ├── Navbar.jsx       ← Enhanced navigation
│   │   ├── GapChart.jsx     ← Radar chart
│   │   ├── RoadmapCard.jsx  ← Expandable week card
│   │   ├── SkillBadge.jsx
│   │   ├── Loader.jsx
│   │   └── ProtectedRoute.jsx
│   ├── services/
│   │   ├── firebase.js      ← Firebase auth & database
│   │   └── gemini.js       ← Enhanced API with fallbacks
│   └── store/
│       └── useStore.js       ← Zustand global state
```

---

## 🧠 How AI Works

All intelligence lives in `src/services/gemini.js` with enhanced error handling:

| Function | What it does |
|----------|-------------|
| `analyzeSkillGap()` | Compares syllabus vs job market, returns gap score + missing skills (with fallback data) |
| `generateRoadmap()` | Builds a 4-week week-by-week earning roadmap (with fallback data) |
| `suggestCareerPaths()` | Suggests 3 roles for undecided students |

### ✅ Enhanced Features:
- **Rate Limiting:** 2-second minimum between API calls
- **Exponential Backoff:** Smart retries for 429 errors
- **Fallback Data:** Complete mock data when API is exhausted
- **Error Recovery:** Always proceeds to dashboard with meaningful data |

---

## 🛠 Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18 + Vite |
| Styling | Tailwind CSS (enhanced visibility) |
| Charts | Recharts |
| Animation | Framer Motion |
| State | Zustand (persisted) |
| AI | Gemini 1.5 Flash API (with fallbacks) |
| Authentication | Firebase Auth |
| Database | Firebase Firestore |
| Routing | React Router v6 |

---

## 📦 Build for Production
```bash
npm run build
```
Deploy the `dist/` folder to **Firebase Hosting**, Vercel, or Netlify.

---

## 📞 Support

For issues or questions:
1. Check console for detailed error messages
2. Verify API keys in `.env.local`
3. Ensure Firebase configuration is correct
4. Check network connectivity for mobile access

Built with ❤️ using React, Firebase, and Gemini AI

## 👨‍💻 Builder
Mohammed Abdul Irfan
2nd Year, Hyderabad
Built solo for Google Solution Challenge 2026

