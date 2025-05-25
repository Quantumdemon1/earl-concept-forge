
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { DevelopmentSession } from '@/types/development'

interface DevelopmentStoreState {
  activeSessions: Map<string, DevelopmentSession>
  currentSessionId: string | null
}

interface DevelopmentStoreActions {
  setCurrentSession: (sessionId: string | null) => void
  addSession: (session: DevelopmentSession) => void
  updateSession: (sessionId: string, updates: Partial<DevelopmentSession>) => void
  getSession: (sessionId: string) => DevelopmentSession | undefined
  removeSession: (sessionId: string) => void
  clearSessions: () => void
}

export type DevelopmentStore = DevelopmentStoreState & DevelopmentStoreActions

export const useDevelopmentStore = create<DevelopmentStore>()(
  devtools(
    (set, get) => ({
      // State
      activeSessions: new Map(),
      currentSessionId: null,
      
      // Actions
      setCurrentSession: (sessionId) => {
        set({ currentSessionId: sessionId })
      },
      
      addSession: (session) => {
        set((state) => ({
          activeSessions: new Map(state.activeSessions).set(session.id, session),
          currentSessionId: session.id,
        }))
      },
      
      updateSession: (sessionId, updates) => {
        set((state) => {
          const sessions = new Map(state.activeSessions)
          const session = sessions.get(sessionId)
          if (session) {
            sessions.set(sessionId, { ...session, ...updates })
          }
          return { activeSessions: sessions }
        })
      },
      
      getSession: (sessionId) => {
        return get().activeSessions.get(sessionId)
      },
      
      removeSession: (sessionId) => {
        set((state) => {
          const sessions = new Map(state.activeSessions)
          sessions.delete(sessionId)
          return { 
            activeSessions: sessions,
            currentSessionId: state.currentSessionId === sessionId ? null : state.currentSessionId
          }
        })
      },
      
      clearSessions: () => {
        set({ activeSessions: new Map(), currentSessionId: null })
      },
    }),
    { name: 'development-store' }
  )
)
