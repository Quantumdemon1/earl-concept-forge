
import type { CompiledDeliverable } from './deliverableCompiler'
import { QualityMetricsCalculator } from './deliverableEnhancer/qualityMetricsCalculator'
import { EnhancementSuggestionsGenerator } from './deliverableEnhancer/enhancementSuggestionsGenerator'
import { EnhancementPromptsGenerator } from './deliverableEnhancer/enhancementPromptsGenerator'

// Re-export types
export type { EnhancementSuggestion, QualityAnalysis } from './deliverableEnhancer/types'

export class DeliverableEnhancerService {
  static analyzeQuality(deliverable: CompiledDeliverable) {
    console.log('Analyzing deliverable quality:', deliverable)

    // Calculate all quality scores
    const completenessScore = QualityMetricsCalculator.calculateCompletenessScore(deliverable)
    const clarityScore = QualityMetricsCalculator.calculateClarityScore(deliverable)
    const actionabilityScore = QualityMetricsCalculator.calculateActionabilityScore(deliverable)
    const marketReadinessScore = QualityMetricsCalculator.calculateMarketReadinessScore(deliverable)
    
    // Calculate overall score
    const overallScore = Math.round(
      (completenessScore + clarityScore + actionabilityScore + marketReadinessScore) / 4
    )

    // Generate suggestions
    const suggestions = EnhancementSuggestionsGenerator.generateSuggestions(deliverable, {
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

  static generateEnhancementPrompts(deliverable: CompiledDeliverable, analysis: any): string[] {
    return EnhancementPromptsGenerator.generateEnhancementPrompts(deliverable, analysis)
  }
}
