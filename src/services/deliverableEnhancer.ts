
import type { CompiledDeliverable } from './deliverableCompiler'

export interface EnhancementSuggestion {
  section: string
  issue: string
  suggestion: string
  priority: 'high' | 'medium' | 'low'
}

export interface QualityAnalysis {
  completenessScore: number
  actionabilityScore: number
  clarityScore: number
  marketReadinessScore: number
  suggestions: EnhancementSuggestion[]
}

export class DeliverableEnhancerService {
  static analyzeQuality(deliverable: CompiledDeliverable): QualityAnalysis {
    const suggestions: EnhancementSuggestion[] = []
    let completenessScore = 0
    let actionabilityScore = 0
    let clarityScore = 0
    let marketReadinessScore = 0

    // Analyze project overview completeness
    if (!deliverable.projectOverview.problemStatement || deliverable.projectOverview.problemStatement.includes('needs to be defined')) {
      suggestions.push({
        section: 'Project Overview',
        issue: 'Problem statement is incomplete or generic',
        suggestion: 'Define a specific, measurable problem that the solution addresses',
        priority: 'high'
      })
    } else {
      completenessScore += 15
      clarityScore += 20
    }

    if (!deliverable.projectOverview.solutionSummary || deliverable.projectOverview.solutionSummary.includes('needs to be developed')) {
      suggestions.push({
        section: 'Project Overview',
        issue: 'Solution summary is incomplete',
        suggestion: 'Provide a clear, concrete description of how the solution works',
        priority: 'high'
      })
    } else {
      completenessScore += 15
      actionabilityScore += 20
    }

    // Analyze technical specification
    if (deliverable.technicalSpecification.components.length === 0) {
      suggestions.push({
        section: 'Technical Specification',
        issue: 'No technical components identified',
        suggestion: 'Break down the solution into specific technical components and features',
        priority: 'high'
      })
    } else {
      completenessScore += 20
      actionabilityScore += 25
    }

    const highPriorityComponents = deliverable.technicalSpecification.components.filter(c => c.priority === 'high')
    if (highPriorityComponents.length === 0) {
      suggestions.push({
        section: 'Technical Specification',
        issue: 'No high-priority components identified',
        suggestion: 'Identify which components are critical for MVP functionality',
        priority: 'medium'
      })
    } else {
      actionabilityScore += 15
    }

    // Analyze market analysis
    if (deliverable.marketAnalysis.opportunities.length === 0) {
      suggestions.push({
        section: 'Market Analysis',
        issue: 'No market opportunities identified',
        suggestion: 'Research and identify specific market opportunities for this solution',
        priority: 'medium'
      })
    } else {
      marketReadinessScore += 25
    }

    if (deliverable.marketAnalysis.competitiveAdvantages.length === 0) {
      suggestions.push({
        section: 'Market Analysis',
        issue: 'No competitive advantages defined',
        suggestion: 'Identify what makes this solution unique compared to alternatives',
        priority: 'medium'
      })
    } else {
      marketReadinessScore += 25
    }

    // Analyze implementation plan
    if (deliverable.implementationPlan.phases.length === 0) {
      suggestions.push({
        section: 'Implementation Plan',
        issue: 'No implementation phases defined',
        suggestion: 'Create a phased approach to building and launching the solution',
        priority: 'high'
      })
    } else {
      actionabilityScore += 20
      completenessScore += 20
    }

    const phasesWithDeliverables = deliverable.implementationPlan.phases.filter(p => p.deliverables.length > 0)
    if (phasesWithDeliverables.length < deliverable.implementationPlan.phases.length) {
      suggestions.push({
        section: 'Implementation Plan',
        issue: 'Some phases lack specific deliverables',
        suggestion: 'Define concrete deliverables for each implementation phase',
        priority: 'medium'
      })
    } else {
      actionabilityScore += 20
    }

    // Analyze validation results
    if (deliverable.validationResults.recommendations.length === 0) {
      suggestions.push({
        section: 'Validation Results',
        issue: 'No actionable recommendations provided',
        suggestion: 'Generate specific recommendations based on analysis and validation',
        priority: 'medium'
      })
    } else {
      actionabilityScore += 10
      marketReadinessScore += 20
    }

    // Analyze next steps
    if (deliverable.nextSteps.immediate.length === 0) {
      suggestions.push({
        section: 'Next Steps',
        issue: 'No immediate action items defined',
        suggestion: 'Define 3-5 concrete actions that can be taken in the next 30 days',
        priority: 'high'
      })
    } else {
      actionabilityScore += 10
      completenessScore += 15
    }

    // Calculate final scores
    completenessScore = Math.min(100, completenessScore)
    actionabilityScore = Math.min(100, actionabilityScore)
    clarityScore = Math.min(100, clarityScore + 40) // Base clarity bonus
    marketReadinessScore = Math.min(100, marketReadinessScore + 30) // Base market bonus

    return {
      completenessScore,
      actionabilityScore,
      clarityScore,
      marketReadinessScore,
      suggestions: suggestions.sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 }
        return priorityOrder[b.priority] - priorityOrder[a.priority]
      })
    }
  }

  static generateEnhancementPrompts(deliverable: CompiledDeliverable, analysis: QualityAnalysis): string[] {
    const prompts: string[] = []

    // Generate prompts based on high-priority suggestions
    const highPrioritySuggestions = analysis.suggestions.filter(s => s.priority === 'high')

    highPrioritySuggestions.forEach(suggestion => {
      switch (suggestion.section) {
        case 'Project Overview':
          if (suggestion.issue.includes('Problem statement')) {
            prompts.push(`Analyze the project "${deliverable.projectOverview.name}" and define a specific, measurable problem statement. Consider: What pain point does this solve? Who experiences this problem? How significant is the impact?`)
          }
          if (suggestion.issue.includes('Solution summary')) {
            prompts.push(`Create a clear, concrete solution summary for "${deliverable.projectOverview.name}". Explain exactly how the solution works, what technology is used, and what the end user experience looks like.`)
          }
          break

        case 'Technical Specification':
          if (suggestion.issue.includes('No technical components')) {
            prompts.push(`Break down "${deliverable.projectOverview.name}" into specific technical components. Identify the core features, modules, services, and interfaces needed to build this solution.`)
          }
          if (suggestion.issue.includes('high-priority components')) {
            prompts.push(`Prioritize the technical components for "${deliverable.projectOverview.name}". Which components are essential for an MVP? Which are nice-to-have features?`)
          }
          break

        case 'Implementation Plan':
          if (suggestion.issue.includes('No implementation phases')) {
            prompts.push(`Create a phased implementation plan for "${deliverable.projectOverview.name}". Define 3-4 phases from initial development to market launch, with realistic timelines and dependencies.`)
          }
          break

        case 'Next Steps':
          if (suggestion.issue.includes('immediate action items')) {
            prompts.push(`Define immediate next steps for "${deliverable.projectOverview.name}". What are 5 concrete actions that can be taken in the next 30 days to move this project forward?`)
          }
          break
      }
    })

    return prompts
  }

  static suggestMissingInformation(deliverable: CompiledDeliverable): string[] {
    const missing: string[] = []

    // Check for missing technical details
    if (deliverable.technicalSpecification.architecture.includes('to be determined')) {
      missing.push('System architecture and technology stack decisions')
    }

    if (deliverable.technicalSpecification.technicalRequirements.length === 0) {
      missing.push('Specific technical requirements and constraints')
    }

    // Check for missing market information
    if (deliverable.marketAnalysis.findings.length === 0) {
      missing.push('Market research findings and user validation')
    }

    if (deliverable.projectOverview.targetAudience.some(audience => audience.includes('to be defined'))) {
      missing.push('Clear target audience definition and user personas')
    }

    // Check for missing business information
    if (deliverable.implementationPlan.resources.length === 0) {
      missing.push('Resource requirements (team, budget, tools)')
    }

    if (deliverable.validationResults.riskAssessment.length === 0) {
      missing.push('Risk assessment and mitigation strategies')
    }

    return missing
  }
}
