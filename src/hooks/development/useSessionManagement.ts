
import { useCallback } from 'react'
import { useDevelopmentStore } from '@/stores/core/developmentStore'
import { DevelopmentApiService } from '@/services/developmentApi'
import type { DevelopmentSession, DevelopmentConfig } from '@/types/development'

export function useSessionManagement() {
  const { 
    addSession, 
    updateSession, 
    getSession, 
    setCurrentSession,
    removeSession,
    currentSessionId 
  } = useDevelopmentStore()

  const startSession = useCallback(async (conceptId: string, config?: DevelopmentConfig): Promise<string> => {
    try {
      const data = await DevelopmentApiService.startSession(conceptId, config)
      
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
        startedAt: new Date().toISOString(),
      }
      
      addSession(session)
      return data.sessionId
    } catch (error) {
      console.error('Error starting session:', error)
      throw error
    }
  }, [addSession])

  const runIteration = useCallback(async (sessionId: string): Promise<void> => {
    const session = getSession(sessionId)
    if (!session || !session.isActive) return
    
    try {
      const data = await DevelopmentApiService.runIteration(session.conceptId, sessionId)
      
      updateSession(sessionId, {
        stage: data.stage || session.stage,
        iteration: data.iteration || session.iteration + 1,
        scores: data.scores || session.scores,
        history: [...session.history, data],
      })
    } catch (error) {
      console.error('Error running iteration:', error)
      throw error
    }
  }, [getSession, updateSession])

  const pauseSession = useCallback((sessionId: string) => {
    updateSession(sessionId, { isActive: false })
  }, [updateSession])

  const resumeSession = useCallback((sessionId: string) => {
    updateSession(sessionId, { isActive: true })
    setCurrentSession(sessionId)
  }, [updateSession, setCurrentSession])

  const loadSession = useCallback(async (sessionId: string): Promise<void> => {
    try {
      const session = await DevelopmentApiService.loadSessionFromDb(sessionId)
      addSession(session)
    } catch (error) {
      console.error('Error loading session:', error)
      throw error
    }
  }, [addSession])

  return {
    startSession,
    runIteration,
    pauseSession,
    resumeSession,
    loadSession,
    getSession,
    updateSession,
    currentSessionId,
  }
}
