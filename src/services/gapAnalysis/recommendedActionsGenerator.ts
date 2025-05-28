
import type { QualityAnalysis } from '../deliverableEnhancer'

export class RecommendedActionsGenerator {
  static generateRecommendedActions(analysis: QualityAnalysis, missingComponents: string[]): string[] {
    const actions: string[] = []

    // Actions based on quality scores
    if (analysis.completenessScore < 70) {
      actions.push('Complete missing project sections and provide more detailed specifications')
    }

    if (analysis.actionabilityScore < 60) {
      actions.push('Create specific, actionable implementation steps with clear deliverables')
    }

    if (analysis.marketReadinessScore < 60) {
      actions.push('Conduct market research and validate the business case')
    }

    // Actions based on high-priority suggestions
    const highPrioritySuggestions = analysis.suggestions.filter(s => s.priority === 'high')
    highPrioritySuggestions.slice(0, 3).forEach(suggestion => {
      actions.push(suggestion.suggestion)
    })

    // Actions based on missing components
    if (missingComponents.length > 0) {
      actions.push(`Address missing components: ${missingComponents.slice(0, 2).join(', ')}`)
    }

    return actions.slice(0, 5) // Limit to top 5 actions
  }
}
