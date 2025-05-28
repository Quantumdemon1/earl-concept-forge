import type { CompiledDeliverable } from './deliverableCompiler'
import type { EnhancementSuggestion, QualityAnalysis } from './deliverableEnhancer'
import { DeliverableEnhancerService } from './deliverableEnhancer'

// Export the QualityAnalysis type so it can be imported by other files
export type { QualityAnalysis } from './deliverableEnhancer'

export interface GapAnalysisResult {
  missingComponents: string[]
  weakSections: string[]
  enhancementPrompts: string[]
  qualityAnalysis: QualityAnalysis
  recommendedActions: string[]
}

export interface EnhancementQuestion {
  id: string
  category: 'technical' | 'market' | 'business' | 'implementation'
  question: string
  purpose: string
  priority: 'high' | 'medium' | 'low'
}

export class GapAnalysisService {
  static analyzeDeliverableGaps(deliverable: CompiledDeliverable): GapAnalysisResult {
    console.log('Analyzing deliverable gaps:', deliverable)

    // Get quality analysis
    const qualityAnalysis = DeliverableEnhancerService.analyzeQuality(deliverable)

    // Identify missing components
    const missingComponents = this.identifyMissingComponents(deliverable)

    // Identify weak sections
    const weakSections = this.identifyWeakSections(deliverable, qualityAnalysis)

    // Generate enhancement prompts
    const enhancementPrompts = DeliverableEnhancerService.generateEnhancementPrompts(deliverable, qualityAnalysis)

    // Generate recommended actions
    const recommendedActions = this.generateRecommendedActions(qualityAnalysis, missingComponents)

    return {
      missingComponents,
      weakSections,
      enhancementPrompts,
      qualityAnalysis,
      recommendedActions
    }
  }

  static generateEnhancementQuestions(deliverable: CompiledDeliverable): EnhancementQuestion[] {
    const questions: EnhancementQuestion[] = []

    // Technical questions
    if (deliverable.technicalSpecification.components.length < 3) {
      questions.push({
        id: 'tech-components',
        category: 'technical',
        question: 'What are the core technical components needed to build this solution? Please list at least 5 specific modules, services, or features.',
        purpose: 'Identify comprehensive technical requirements',
        priority: 'high'
      })
    }

    if (deliverable.technicalSpecification.architecture.includes('to be determined')) {
      questions.push({
        id: 'tech-architecture',
        category: 'technical',
        question: 'What technical architecture would you recommend for this solution? Consider scalability, performance, and maintenance requirements.',
        purpose: 'Define system architecture',
        priority: 'high'
      })
    }

    // Market questions
    if (deliverable.marketAnalysis.opportunities.length === 0) {
      questions.push({
        id: 'market-opportunity',
        category: 'market',
        question: 'What specific market opportunities does this solution address? Who are the potential customers and what problems do they currently face?',
        purpose: 'Validate market opportunity',
        priority: 'high'
      })
    }

    if (deliverable.projectOverview.targetAudience.some(audience => audience.includes('to be defined'))) {
      questions.push({
        id: 'target-users',
        category: 'market',
        question: 'Who exactly would use this solution? Please describe 2-3 specific user personas with their needs, behaviors, and pain points.',
        purpose: 'Define target audience',
        priority: 'high'
      })
    }

    // Business questions
    if (deliverable.implementationPlan.resources.length === 0) {
      questions.push({
        id: 'business-resources',
        category: 'business',
        question: 'What resources (team size, skills, budget, timeline) would be needed to build and launch this solution?',
        purpose: 'Estimate resource requirements',
        priority: 'medium'
      })
    }

    if (deliverable.marketAnalysis.competitiveAdvantages.length === 0) {
      questions.push({
        id: 'business-advantage',
        category: 'business',
        question: 'What makes this solution unique compared to existing alternatives? What competitive advantages does it have?',
        purpose: 'Identify differentiation',
        priority: 'medium'
      })
    }

    // Implementation questions
    if (deliverable.nextSteps.immediate.length === 0) {
      questions.push({
        id: 'impl-next-steps',
        category: 'implementation',
        question: 'What are the first 5 concrete actions that should be taken to move this project forward in the next 30 days?',
        purpose: 'Define immediate action plan',
        priority: 'high'
      })
    }

    if (deliverable.validationResults.riskAssessment.length === 0) {
      questions.push({
        id: 'impl-risks',
        category: 'implementation',
        question: 'What are the main risks and challenges for this project? How could they be mitigated?',
        purpose: 'Assess and plan for risks',
        priority: 'medium'
      })
    }

    return questions.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 }
      return priorityOrder[b.priority] - priorityOrder[a.priority]
    })
  }

  private static identifyMissingComponents(deliverable: CompiledDeliverable): string[] {
    const missing: string[] = []

    // Technical components
    if (deliverable.technicalSpecification.components.length === 0) {
      missing.push('Core technical components and features')
    }

    if (deliverable.technicalSpecification.technicalRequirements.length === 0) {
      missing.push('Technical requirements and constraints')
    }

    if (deliverable.technicalSpecification.integrations.length === 0) {
      missing.push('External system integrations')
    }

    // Market components
    if (deliverable.marketAnalysis.opportunities.length === 0) {
      missing.push('Market opportunity analysis')
    }

    if (deliverable.marketAnalysis.competitiveAdvantages.length === 0) {
      missing.push('Competitive advantage definition')
    }

    // Business components
    if (deliverable.implementationPlan.resources.length === 0) {
      missing.push('Resource requirements planning')
    }

    if (deliverable.implementationPlan.milestones.length === 0) {
      missing.push('Project milestones and timeline')
    }

    // Validation components
    if (deliverable.validationResults.riskAssessment.length === 0) {
      missing.push('Risk assessment and mitigation')
    }

    if (deliverable.validationResults.recommendations.length === 0) {
      missing.push('Actionable recommendations')
    }

    return missing
  }

  private static identifyWeakSections(deliverable: CompiledDeliverable, analysis: QualityAnalysis): string[] {
    const weak: string[] = []

    if (analysis.completenessScore < 70) {
      weak.push('Overall project completeness needs improvement')
    }

    if (analysis.actionabilityScore < 60) {
      weak.push('Implementation plan lacks actionable details')
    }

    if (analysis.clarityScore < 70) {
      weak.push('Project description and goals need clarification')
    }

    if (analysis.marketReadinessScore < 60) {
      weak.push('Market validation and business case need strengthening')
    }

    // Check specific sections
    if (deliverable.projectOverview.problemStatement.length < 50) {
      weak.push('Problem statement is too brief or vague')
    }

    if (deliverable.technicalSpecification.components.filter(c => c.priority === 'high').length === 0) {
      weak.push('No high-priority technical components identified')
    }

    if (deliverable.implementationPlan.phases.length < 2) {
      weak.push('Implementation plan lacks sufficient detail')
    }

    return weak
  }

  private static generateRecommendedActions(analysis: QualityAnalysis, missingComponents: string[]): string[] {
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
