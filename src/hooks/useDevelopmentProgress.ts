
import { useMemo } from 'react'

interface DevelopmentSession {
  stage: string
  iteration: number
  scores: {
    completeness: number
    confidence: number
    feasibility: number
    novelty: number
  }
}

export function useDevelopmentProgress(session: DevelopmentSession | null) {
  return useMemo(() => {
    if (!session) {
      return {
        overallProgress: 0,
        stageProgress: 0,
        qualityScore: 0,
        estimatedTimeRemaining: null,
        nextMilestone: 'Start development',
      }
    }
    
    const stages = ['initial', 'expanding', 'researching', 'validating', 'refining', 'implementing', 'complete']
    const currentStageIndex = stages.indexOf(session.stage)
    const stageProgress = currentStageIndex >= 0 ? (currentStageIndex / (stages.length - 1)) * 100 : 0
    
    // Calculate overall progress based on iteration and scores
    const iterationProgress = Math.min(session.iteration / 20, 1) * 40 // 40% from iterations
    const scoresProgress = (
      session.scores.completeness + 
      session.scores.confidence + 
      session.scores.feasibility + 
      session.scores.novelty
    ) / 4 * 60 // 60% from quality scores
    
    const overallProgress = Math.min(iterationProgress + scoresProgress, 100)
    
    // Calculate quality score
    const qualityScore = (
      session.scores.completeness * 0.3 +
      session.scores.confidence * 0.25 +
      session.scores.feasibility * 0.25 +
      session.scores.novelty * 0.2
    ) * 100
    
    // Estimate time remaining (rough calculation)
    const avgIterationTime = 30 // seconds
    const remainingIterations = Math.max(0, 20 - session.iteration)
    const estimatedTimeRemaining = remainingIterations * avgIterationTime
    
    // Next milestone
    const nextMilestone = currentStageIndex >= 0 && currentStageIndex < stages.length - 1
      ? `Complete ${stages[currentStageIndex + 1]} stage`
      : 'Development complete'
    
    return {
      overallProgress: Math.round(overallProgress),
      stageProgress: Math.round(stageProgress),
      qualityScore: Math.round(qualityScore),
      estimatedTimeRemaining: estimatedTimeRemaining > 0 ? estimatedTimeRemaining : null,
      nextMilestone,
      currentStage: session.stage,
      currentIteration: session.iteration,
    }
  }, [session])
}
