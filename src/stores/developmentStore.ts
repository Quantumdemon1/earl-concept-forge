
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { supabase } from '@/lib/supabase'

interface DevelopmentSession {
  id: string
  conceptId: string
  stage: string
  iteration: number
  scores: {
    completeness: number
    confidence: number
    feasibility: number
    novelty: number
  }
  isActive: boolean
  history: any[]
  config: any
  startedAt: string
  lastUpdated: string
}

interface DevelopmentStore {
  // State
  activeSessions: Map<string, DevelopmentSession>
  currentSessionId: string | null
  
  // Actions
  startSession: (conceptId: string, config?: any) => Promise<string>
  runIteration: (sessionId: string) => Promise<any>
  pauseSession: (sessionId: string) => void
  resumeSession: (sessionId: string) => void
  getSession: (sessionId: string) => DevelopmentSession | undefined
  updateSession: (sessionId: string, updates: Partial<DevelopmentSession>) => void
  loadSession: (sessionId: string) => Promise<void>
  deleteSession: (sessionId: string) => void
}

export const useDevelopmentStore = create<DevelopmentStore>()(
  devtools(
    persist(
      (set, get) => ({
        activeSessions: new Map(),
        currentSessionId: null,
        
        startSession: async (conceptId, config = {}) => {
          try {
            console.log('Starting development session for concept:', conceptId)
            
            // Call edge function to start session
            const { data, error } = await supabase.functions.invoke('develop-concept', {
              body: { conceptId, config },
            })
            
            if (error) throw error
            
            const session: DevelopmentSession = {
              id: data.sessionId,
              conceptId,
              stage: data.stage || 'initial',
              iteration: data.iteration || 0,
              scores: data.scores || {
                completeness: 0,
                confidence: 0,
                feasibility: 0,
                novelty: 0,
              },
              isActive: true,
              history: [],
              config,
              startedAt: new Date().toISOString(),
              lastUpdated: new Date().toISOString(),
            }
            
            set((state) => ({
              activeSessions: new Map(state.activeSessions).set(data.sessionId, session),
              currentSessionId: data.sessionId,
            }))
            
            console.log('Development session started:', data.sessionId)
            return data.sessionId
          } catch (error) {
            console.error('Error starting development session:', error)
            throw error
          }
        },
        
        runIteration: async (sessionId) => {
          const session = get().activeSessions.get(sessionId)
          if (!session || !session.isActive) {
            throw new Error('Session not found or inactive')
          }
          
          try {
            console.log('Running iteration for session:', sessionId)
            
            const { data, error } = await supabase.functions.invoke('develop-concept', {
              body: { 
                conceptId: session.conceptId,
                sessionId,
              },
            })
            
            if (error) throw error
            
            set((state) => {
              const sessions = new Map(state.activeSessions)
              const updatedSession = {
                ...session,
                stage: data.stage || session.stage,
                iteration: data.iteration || session.iteration + 1,
                scores: data.scores || session.scores,
                history: [...session.history, {
                  iteration: data.iteration || session.iteration + 1,
                  stage: data.stage || session.stage,
                  timestamp: new Date().toISOString(),
                  result: data,
                }],
                lastUpdated: new Date().toISOString(),
              }
              sessions.set(sessionId, updatedSession)
              return { activeSessions: sessions }
            })
            
            console.log('Iteration completed:', data)
            return data
          } catch (error) {
            console.error('Error running iteration:', error)
            throw error
          }
        },
        
        pauseSession: (sessionId) => {
          console.log('Pausing session:', sessionId)
          set((state) => {
            const sessions = new Map(state.activeSessions)
            const session = sessions.get(sessionId)
            if (session) {
              sessions.set(sessionId, { 
                ...session, 
                isActive: false,
                lastUpdated: new Date().toISOString(),
              })
            }
            return { activeSessions: sessions }
          })
        },
        
        resumeSession: (sessionId) => {
          console.log('Resuming session:', sessionId)
          set((state) => {
            const sessions = new Map(state.activeSessions)
            const session = sessions.get(sessionId)
            if (session) {
              sessions.set(sessionId, { 
                ...session, 
                isActive: true,
                lastUpdated: new Date().toISOString(),
              })
            }
            return { activeSessions: sessions, currentSessionId: sessionId }
          })
        },
        
        getSession: (sessionId) => {
          return get().activeSessions.get(sessionId)
        },
        
        updateSession: (sessionId, updates) => {
          set((state) => {
            const sessions = new Map(state.activeSessions)
            const session = sessions.get(sessionId)
            if (session) {
              sessions.set(sessionId, { 
                ...session, 
                ...updates,
                lastUpdated: new Date().toISOString(),
              })
            }
            return { activeSessions: sessions }
          })
        },
        
        loadSession: async (sessionId) => {
          try {
            const { data, error } = await supabase
              .from('concept_development_sessions')
              .select('*')
              .eq('id', sessionId)
              .single()
            
            if (error) throw error
            
            const session: DevelopmentSession = {
              id: data.id,
              conceptId: data.concept_id,
              stage: data.stage,
              iteration: data.iteration_count,
              scores: {
                completeness: data.completeness_score,
                confidence: data.confidence_score,
                feasibility: data.feasibility_score,
                novelty: data.novelty_score,
              },
              isActive: data.is_active,
              history: data.llm_interactions || [],
              config: data.config || {},
              startedAt: data.started_at,
              lastUpdated: data.updated_at,
            }
            
            set((state) => ({
              activeSessions: new Map(state.activeSessions).set(sessionId, session),
            }))
          } catch (error) {
            console.error('Error loading session:', error)
            throw error
          }
        },
        
        deleteSession: (sessionId) => {
          set((state) => {
            const sessions = new Map(state.activeSessions)
            sessions.delete(sessionId)
            return { 
              activeSessions: sessions,
              currentSessionId: state.currentSessionId === sessionId ? null : state.currentSessionId,
            }
          })
        },
      }),
      {
        name: 'development-storage',
        partialize: (state) => ({
          activeSessions: Array.from(state.activeSessions.entries()),
          currentSessionId: state.currentSessionId,
        }),
        onRehydrateStorage: () => (state) => {
          if (state && Array.isArray(state.activeSessions)) {
            state.activeSessions = new Map(state.activeSessions as [string, DevelopmentSession][])
          }
        },
      }
    ),
    { name: 'development-store' }
  )
)
