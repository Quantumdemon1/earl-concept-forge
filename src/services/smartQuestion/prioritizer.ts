
import type { QualityAnalysis } from '../deliverableEnhancer'
import type { SmartQuestion } from './types'

export class QuestionPrioritizer {
  static prioritizeByImpact(questions: SmartQuestion[], analysis: QualityAnalysis): SmartQuestion[] {
    return questions.sort((a, b) => {
      // First sort by priority
      const priorityOrder = { high: 3, medium: 2, low: 1 }
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority]
      
      if (priorityDiff !== 0) return priorityDiff
      
      // Then by impact score
      return b.impact - a.impact
    })
  }
}
