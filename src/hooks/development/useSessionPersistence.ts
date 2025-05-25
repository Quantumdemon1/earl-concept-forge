
import { useEffect } from 'react'
import { useDevelopmentStore } from '@/stores/core/developmentStore'
import type { DevelopmentSession } from '@/types/development'

export function useSessionPersistence() {
  const { activeSessions, currentSessionId, addSession, setCurrentSession } = useDevelopmentStore()

  // Save to localStorage when sessions change
  useEffect(() => {
    try {
      const sessionData = {
        activeSessions: Array.from(activeSessions.entries()),
        currentSessionId,
      }
      localStorage.setItem('development-storage', JSON.stringify(sessionData))
    } catch (error) {
      console.warn('Failed to save development sessions to localStorage:', error)
    }
  }, [activeSessions, currentSessionId])

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('development-storage')
      if (stored) {
        const data = JSON.parse(stored)
        if (data.activeSessions && Array.isArray(data.activeSessions)) {
          // Restore sessions
          data.activeSessions.forEach(([id, session]: [string, DevelopmentSession]) => {
            addSession(session)
          })
          
          // Restore current session
          if (data.currentSessionId) {
            setCurrentSession(data.currentSessionId)
          }
        }
      }
    } catch (error) {
      console.warn('Failed to load development sessions from localStorage:', error)
    }
  }, [addSession, setCurrentSession])

  return {
    // This hook primarily handles side effects for persistence
    // Returns empty object as it's used for its effects
  }
}
