
import { useState, useEffect, useCallback, useRef } from 'react'
import { useDevelopmentStore } from '@/stores/developmentStore'
import { useToast } from '@/hooks/use-toast'

interface UseDevelopmentOptions {
  autoRun?: boolean
  maxIterations?: number
  qualityThresholds?: {
    completeness: number
    confidence: number
    feasibility: number
  }
  onComplete?: (result: any) => void
  onProgress?: (progress: any) => void
  onError?: (error: Error) => void
  iterationDelay?: number
}

export function useDevelopment(conceptId: string, options: UseDevelopmentOptions = {}) {
  const { toast } = useToast()
  const {
    startSession,
    runIteration,
    pauseSession,
    resumeSession,
    getSession,
    currentSessionId,
    loadSession,
  } = useDevelopmentStore()
  
  const [isRunning, setIsRunning] = useState(false)
  const [isStarting, setIsStarting] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const runningRef = useRef(false)
  
  const [progress, setProgress] = useState({
    stage: 'initial',
    iteration: 0,
    scores: { completeness: 0, confidence: 0, feasibility: 0, novelty: 0 },
    isComplete: false,
  })
  
  // Default options
  const defaultThresholds = {
    completeness: 0.8,
    confidence: 0.75,
    feasibility: 0.7,
  }
  
  const thresholds = { ...defaultThresholds, ...options.qualityThresholds }
  const maxIterations = options.maxIterations || 20
  const iterationDelay = options.iterationDelay || 2000
  
  // Update progress when session changes
  useEffect(() => {
    if (currentSessionId) {
      const session = getSession(currentSessionId)
      if (session) {
        const isComplete = 
          session.iteration >= maxIterations ||
          (session.scores.completeness >= thresholds.completeness &&
           session.scores.confidence >= thresholds.confidence &&
           session.scores.feasibility >= thresholds.feasibility)
        
        setProgress({
          stage: session.stage,
          iteration: session.iteration,
          scores: session.scores,
          isComplete,
        })
        
        options.onProgress?.(session)
      }
    }
  }, [currentSessionId, getSession, maxIterations, thresholds, options])
  
  // Run development loop
  const runDevelopment = useCallback(async (sessionId: string) => {
    if (runningRef.current) return
    
    runningRef.current = true
    setIsRunning(true)
    setError(null)
    
    console.log('Starting development loop for session:', sessionId)
    
    try {
      while (runningRef.current) {
        const session = getSession(sessionId)
        if (!session || !session.isActive) {
          console.log('Session inactive, stopping development loop')
          break
        }
        
        // Check completion criteria
        const shouldStop = 
          session.iteration >= maxIterations ||
          (session.scores.completeness >= thresholds.completeness &&
           session.scores.confidence >= thresholds.confidence &&
           session.scores.feasibility >= thresholds.feasibility)
        
        if (shouldStop) {
          console.log('Development complete - criteria met')
          setIsRunning(false)
          runningRef.current = false
          
          const updatedSession = getSession(sessionId)
          options.onComplete?.(updatedSession)
          
          toast({
            title: 'Development Complete',
            description: 'Your concept has been successfully developed and is ready for implementation!',
          })
          break
        }
        
        // Run next iteration
        try {
          console.log(`Running iteration ${session.iteration + 1} for session ${sessionId}`)
          await runIteration(sessionId)
          
          // Wait between iterations
          await new Promise(resolve => setTimeout(resolve, iterationDelay))
        } catch (iterationError) {
          console.error('Iteration error:', iterationError)
          setError(iterationError as Error)
          options.onError?.(iterationError as Error)
          
          toast({
            title: 'Development Error',
            description: `Error in iteration: ${(iterationError as Error).message}`,
            variant: 'destructive',
          })
          break
        }
      }
    } catch (error) {
      console.error('Development loop error:', error)
      setError(error as Error)
      options.onError?.(error as Error)
      
      toast({
        title: 'Development Failed',
        description: `Development process failed: ${(error as Error).message}`,
        variant: 'destructive',
      })
    } finally {
      setIsRunning(false)
      runningRef.current = false
    }
  }, [getSession, runIteration, maxIterations, thresholds, iterationDelay, options, toast])
  
  // Start development
  const start = useCallback(async () => {
    if (isStarting || isRunning) return
    
    setIsStarting(true)
    setError(null)
    
    try {
      console.log('Starting development for concept:', conceptId)
      
      const sessionId = await startSession(conceptId, {
        maxIterations,
        qualityThresholds: thresholds,
        autoRun: options.autoRun,
      })
      
      toast({
        title: 'Development Started',
        description: 'Automated concept development is now running.',
      })
      
      if (options.autoRun !== false) {
        // Small delay to allow state to update
        setTimeout(() => {
          runDevelopment(sessionId)
        }, 500)
      }
    } catch (error) {
      console.error('Error starting development:', error)
      setError(error as Error)
      options.onError?.(error as Error)
      
      toast({
        title: 'Failed to Start',
        description: `Could not start development: ${(error as Error).message}`,
        variant: 'destructive',
      })
    } finally {
      setIsStarting(false)
    }
  }, [
    conceptId, 
    startSession, 
    maxIterations, 
    thresholds, 
    options, 
    runDevelopment, 
    isStarting, 
    isRunning,
    toast
  ])
  
  // Pause development
  const pause = useCallback(() => {
    if (currentSessionId) {
      console.log('Pausing development session:', currentSessionId)
      runningRef.current = false
      pauseSession(currentSessionId)
      setIsRunning(false)
      
      toast({
        title: 'Development Paused',
        description: 'You can resume development at any time.',
      })
    }
  }, [currentSessionId, pauseSession, toast])
  
  // Resume development
  const resume = useCallback(() => {
    if (currentSessionId) {
      console.log('Resuming development session:', currentSessionId)
      resumeSession(currentSessionId)
      runDevelopment(currentSessionId)
      
      toast({
        title: 'Development Resumed',
        description: 'Continuing automated concept development.',
      })
    }
  }, [currentSessionId, resumeSession, runDevelopment, toast])
  
  // Load existing session
  const loadExistingSession = useCallback(async (sessionId: string) => {
    try {
      await loadSession(sessionId)
      toast({
        title: 'Session Loaded',
        description: 'Previous development session has been restored.',
      })
    } catch (error) {
      console.error('Error loading session:', error)
      setError(error as Error)
      
      toast({
        title: 'Failed to Load Session',
        description: `Could not load session: ${(error as Error).message}`,
        variant: 'destructive',
      })
    }
  }, [loadSession, toast])
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      runningRef.current = false
    }
  }, [])
  
  return {
    // Actions
    start,
    pause,
    resume,
    loadExistingSession,
    
    // State
    isRunning,
    isStarting,
    progress,
    error,
    currentSession: currentSessionId ? getSession(currentSessionId) : null,
    
    // Computed values
    canStart: !isStarting && !isRunning && !currentSessionId,
    canPause: isRunning,
    canResume: !isRunning && currentSessionId && getSession(currentSessionId)?.isActive === false,
  }
}
