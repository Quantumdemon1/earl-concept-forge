
import type { CompiledDeliverable } from '../deliverableCompiler'
import type { EnhancementSuggestion, QualityScores } from './types'

export class EnhancementSuggestionsGenerator {
  static generateSuggestions(deliverable: CompiledDeliverable, scores: QualityScores): EnhancementSuggestion[] {
    const suggestions: EnhancementSuggestion[] = []

    // Completeness suggestions
    if (scores.completenessScore < 70) {
      if (deliverable.technicalSpecification.components.length < 3) {
        suggestions.push({
          section: 'Technical Specification',
          suggestion: 'Add more detailed technical components with clear descriptions and dependencies',
          priority: 'high',
          impact: 'Improves project clarity and implementation guidance'
        })
      }

      if (deliverable.implementationPlan.phases.length < 2) {
        suggestions.push({
          section: 'Implementation Plan',
          suggestion: 'Create a detailed phased approach with specific deliverables and timelines',
          priority: 'high',
          impact: 'Provides clear roadmap for project execution'
        })
      }
    }

    // Clarity suggestions
    if (scores.clarityScore < 70) {
      if (deliverable.projectOverview.problemStatement.length < 100) {
        suggestions.push({
          section: 'Problem Statement',
          suggestion: 'Expand the problem statement to clearly articulate the specific challenges being addressed',
          priority: 'medium',
          impact: 'Better stakeholder understanding and alignment'
        })
      }
    }

    // Actionability suggestions
    if (scores.actionabilityScore < 70) {
      suggestions.push({
        section: 'Next Steps',
        suggestion: 'Define specific, time-bound actions with clear owners and success criteria',
        priority: 'high',
        impact: 'Enables immediate project progression'
      })
    }

    // Market readiness suggestions
    if (scores.marketReadinessScore < 70) {
      if (deliverable.marketAnalysis.opportunities.length < 2) {
        suggestions.push({
          section: 'Market Analysis',
          suggestion: 'Conduct deeper market research to identify specific opportunities and validate demand',
          priority: 'medium',
          impact: 'Strengthens business case and reduces market risk'
        })
      }
    }

    return suggestions.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 }
      return priorityOrder[b.priority] - priorityOrder[a.priority]
    })
  }
}
