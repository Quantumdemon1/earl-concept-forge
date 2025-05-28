
import type { CompiledDeliverable } from './deliverableCompiler'

export interface EnhancementSuggestion {
  section: string
  suggestion: string
  priority: 'high' | 'medium' | 'low'
  impact: string
}

export interface QualityAnalysis {
  completenessScore: number
  clarityScore: number
  actionabilityScore: number
  marketReadinessScore: number
  overallScore: number
  suggestions: EnhancementSuggestion[]
}

export class DeliverableEnhancerService {
  static analyzeQuality(deliverable: CompiledDeliverable): QualityAnalysis {
    console.log('Analyzing deliverable quality:', deliverable)

    // Calculate completeness score
    const completenessScore = this.calculateCompletenessScore(deliverable)
    
    // Calculate clarity score
    const clarityScore = this.calculateClarityScore(deliverable)
    
    // Calculate actionability score
    const actionabilityScore = this.calculateActionabilityScore(deliverable)
    
    // Calculate market readiness score
    const marketReadinessScore = this.calculateMarketReadinessScore(deliverable)
    
    // Calculate overall score
    const overallScore = Math.round(
      (completenessScore + clarityScore + actionabilityScore + marketReadinessScore) / 4
    )

    // Generate suggestions
    const suggestions = this.generateSuggestions(deliverable, {
      completenessScore,
      clarityScore,
      actionabilityScore,
      marketReadinessScore
    })

    return {
      completenessScore,
      clarityScore,
      actionabilityScore,
      marketReadinessScore,
      overallScore,
      suggestions
    }
  }

  static generateEnhancementPrompts(deliverable: CompiledDeliverable, analysis: QualityAnalysis): string[] {
    const prompts: string[] = []

    // Based on low scores, generate specific prompts
    if (analysis.completenessScore < 70) {
      prompts.push('Add more detailed technical specifications and implementation details')
    }

    if (analysis.clarityScore < 70) {
      prompts.push('Improve clarity of problem statement and solution description')
    }

    if (analysis.actionabilityScore < 70) {
      prompts.push('Provide more specific and actionable implementation steps')
    }

    if (analysis.marketReadinessScore < 70) {
      prompts.push('Enhance market analysis and business case validation')
    }

    // Component-specific prompts
    if (deliverable.technicalSpecification.components.length < 3) {
      prompts.push('Define more technical components and their relationships')
    }

    if (deliverable.implementationPlan.phases.length < 2) {
      prompts.push('Create a more detailed phased implementation plan')
    }

    if (deliverable.validationResults.recommendations.length < 3) {
      prompts.push('Provide more actionable recommendations based on analysis')
    }

    return prompts.slice(0, 5) // Limit to top 5 prompts
  }

  private static calculateCompletenessScore(deliverable: CompiledDeliverable): number {
    let score = 0
    let maxScore = 0

    // Project overview completeness (20 points)
    maxScore += 20
    if (deliverable.projectOverview.description.length > 50) score += 5
    if (deliverable.projectOverview.problemStatement.length > 50) score += 5
    if (deliverable.projectOverview.solutionSummary.length > 50) score += 5
    if (deliverable.projectOverview.targetAudience.length > 0) score += 5

    // Technical specification completeness (25 points)
    maxScore += 25
    if (deliverable.technicalSpecification.components.length >= 3) score += 8
    if (deliverable.technicalSpecification.components.length >= 5) score += 3
    if (deliverable.technicalSpecification.architecture.length > 30) score += 7
    if (deliverable.technicalSpecification.technicalRequirements.length >= 3) score += 7

    // Market analysis completeness (20 points)
    maxScore += 20
    if (deliverable.marketAnalysis.opportunities.length >= 2) score += 7
    if (deliverable.marketAnalysis.findings.length >= 3) score += 6
    if (deliverable.marketAnalysis.competitiveAdvantages.length >= 2) score += 7

    // Implementation plan completeness (20 points)
    maxScore += 20
    if (deliverable.implementationPlan.phases.length >= 2) score += 7
    if (deliverable.implementationPlan.milestones.length >= 3) score += 6
    if (deliverable.implementationPlan.resources.length >= 3) score += 7

    // Validation and next steps (15 points)
    maxScore += 15
    if (deliverable.validationResults.recommendations.length >= 3) score += 8
    if (deliverable.nextSteps.immediate.length >= 3) score += 7

    return Math.round((score / maxScore) * 100)
  }

  private static calculateClarityScore(deliverable: CompiledDeliverable): number {
    let score = 75 // Base score

    // Check for clear problem statement
    if (deliverable.projectOverview.problemStatement.length > 100) score += 5
    if (deliverable.projectOverview.problemStatement.includes('problem') || 
        deliverable.projectOverview.problemStatement.includes('challenge')) score += 5

    // Check for clear solution description
    if (deliverable.projectOverview.solutionSummary.length > 100) score += 5

    // Check for well-defined components
    const hasWellDefinedComponents = deliverable.technicalSpecification.components
      .filter(c => c.description.length > 30).length >= 3
    if (hasWellDefinedComponents) score += 10

    return Math.min(100, score)
  }

  private static calculateActionabilityScore(deliverable: CompiledDeliverable): number {
    let score = 60 // Base score

    // Implementation phases with specific deliverables
    const phasesWithDeliverables = deliverable.implementationPlan.phases
      .filter(p => p.deliverables.length >= 2).length
    score += phasesWithDeliverables * 8

    // Specific next steps
    if (deliverable.nextSteps.immediate.length >= 3) score += 10
    if (deliverable.nextSteps.shortTerm.length >= 3) score += 10

    // Actionable recommendations
    const actionableRecommendations = deliverable.validationResults.recommendations
      .filter(r => r.includes('should') || r.includes('need') || r.includes('implement')).length
    score += actionableRecommendations * 3

    return Math.min(100, score)
  }

  private static calculateMarketReadinessScore(deliverable: CompiledDeliverable): number {
    let score = 50 // Base score

    // Market analysis depth
    if (deliverable.marketAnalysis.opportunities.length >= 3) score += 15
    if (deliverable.marketAnalysis.findings.length >= 3) score += 10
    if (deliverable.marketAnalysis.competitiveAdvantages.length >= 2) score += 10

    // Target audience definition
    if (deliverable.projectOverview.targetAudience.length >= 2) score += 10

    // Risk assessment
    if (deliverable.validationResults.riskAssessment.length >= 3) score += 15

    return Math.min(100, score)
  }

  private static generateSuggestions(deliverable: CompiledDeliverable, scores: any): EnhancementSuggestion[] {
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
