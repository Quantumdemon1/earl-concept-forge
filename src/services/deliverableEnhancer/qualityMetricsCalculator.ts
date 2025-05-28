
import type { CompiledDeliverable } from '../deliverableCompiler'

export class QualityMetricsCalculator {
  static calculateCompletenessScore(deliverable: CompiledDeliverable): number {
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

  static calculateClarityScore(deliverable: CompiledDeliverable): number {
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

  static calculateActionabilityScore(deliverable: CompiledDeliverable): number {
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

  static calculateMarketReadinessScore(deliverable: CompiledDeliverable): number {
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
}
