
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface AnalysisState {
  // Current analysis
  currentConceptId: string | null
  currentJobId: string | null
  currentStage: string | null
  
  // Analysis data cache
  analysisCache: Record<string, any>
  
  // Real-time updates
  realtimeUpdates: any[]
  
  // Actions
  setCurrentAnalysis: (conceptId: string, jobId: string) => void
  updateStage: (stage: string) => void
  addRealtimeUpdate: (update: any) => void
  cacheAnalysisData: (key: string, data: any) => void
  clearCache: () => void
}

export const useAnalysisStore = create<AnalysisState>()(
  devtools(
    persist(
      (set) => ({
        currentConceptId: null,
        currentJobId: null,
        currentStage: null,
        analysisCache: {},
        realtimeUpdates: [],
        
        setCurrentAnalysis: (conceptId, jobId) =>
          set({ currentConceptId: conceptId, currentJobId: jobId }),
          
        updateStage: (stage) =>
          set({ currentStage: stage }),
          
        addRealtimeUpdate: (update) =>
          set((state) => ({
            realtimeUpdates: [...state.realtimeUpdates, update],
          })),
          
        cacheAnalysisData: (key, data) =>
          set((state) => ({
            analysisCache: { ...state.analysisCache, [key]: data },
          })),
          
        clearCache: () =>
          set({ analysisCache: {}, realtimeUpdates: [] }),
      }),
      {
        name: 'analysis-storage',
        partialize: (state) => ({ analysisCache: state.analysisCache }),
      }
    )
  )
)
