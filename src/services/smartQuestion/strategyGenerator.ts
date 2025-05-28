
import type { QualityAnalysis } from '../deliverableEnhancer'

export class StrategyGenerator {
  static generateCompletionStrategy(analysis: QualityAnalysis, answeredCount: number): string {
    if (analysis.overallScore >= 85) {
      return 'Focus on final refinements and validation before export'
    }
    
    if (analysis.overallScore >= 70) {
      return 'Address remaining gaps in weak areas to achieve export readiness'
    }
    
    if (answeredCount < 3) {
      return 'Answer foundational questions to establish core project elements'
    }
    
    if (analysis.completenessScore < 60) {
      return 'Focus on completing missing project components and specifications'
    }
    
    if (analysis.actionabilityScore < 60) {
      return 'Develop specific implementation plans and actionable next steps'
    }
    
    return 'Systematically address quality gaps through targeted enhancements'
  }

  static estimateCompletionTime(questionsRemaining: number, analysis: QualityAnalysis): number {
    // Base time per question (in minutes)
    const baseTimePerQuestion = 3
    
    // Adjust based on complexity
    let complexityMultiplier = 1
    if (analysis.overallScore < 50) complexityMultiplier = 1.5
    else if (analysis.overallScore < 70) complexityMultiplier = 1.2
    
    // Factor in diminishing returns for later questions
    const adjustedQuestions = questionsRemaining <= 5 
      ? questionsRemaining 
      : 5 + (questionsRemaining - 5) * 0.7
    
    return Math.round(adjustedQuestions * baseTimePerQuestion * complexityMultiplier)
  }
}
