
// Re-export everything from the new modular structure for backward compatibility
export { useDevelopmentStore } from '@/stores/core/developmentStore'
export { useSessionManagement } from '@/hooks/development/useSessionManagement'
export { useSessionPersistence } from '@/hooks/development/useSessionPersistence'
export type { DevelopmentSession, DevelopmentConfig } from '@/types/development'

// For components that need the complete functionality, provide a combined hook
import { useSessionManagement } from '@/hooks/development/useSessionManagement'
import { useSessionPersistence } from '@/hooks/development/useSessionPersistence'

export function useDevelopmentStoreComplete() {
  // Initialize persistence
  useSessionPersistence()
  
  // Return session management functions
  return useSessionManagement()
}
