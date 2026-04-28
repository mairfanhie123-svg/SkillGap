import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useStore = create(
  persist(
    (set) => ({
      // User profile from onboarding
      profile: null,
      setProfile: (profile) => set({ profile }),

      // Gemini analysis results
      analysis: null,
      setAnalysis: (analysis) => set({ analysis }),

      // Roadmap data
      roadmap: null,
      setRoadmap: (roadmap) => set({ roadmap }),

      // Loading states
      isAnalyzing: false,
      setIsAnalyzing: (val) => set({ isAnalyzing: val }),

      // Reset everything
      reset: () => set({ profile: null, analysis: null, roadmap: null }),
    }),
    {
      name: 'skillgap-storage', // persists to localStorage
    }
  )
)

export default useStore
