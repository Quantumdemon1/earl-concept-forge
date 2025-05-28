
import type { CompiledDeliverable } from './deliverableCompiler'
import { DeliverableEnhancerService } from './deliverableEnhancer'
import { MissingComponentsAnalyzer } from './gapAnalysis/missingComponentsAnalyzer'
import { WeakSectionsAnalyzer } from './gapAnalysis/weakSectionsAnalyzer'
import { EnhancementQuestionsGenerator } from './gapAnalysis/enhancementQuestionsGenerator'
import { RecommendedActionsGenerator } from './gapAnalysis/recommendedActionsGenerator'

// Re-export types from the types module
export type { GapAnalysisResult, EnhancementQuestion, QualityAnalysis } from './gapAnalysis/types'

export class GapAnalysisService {
  static analyzeDeliverableGaps(deliverable: CompiledDeliverable) {
    console.log('Analyzing deliverable gaps:', deliverable)

    // Get quality analysis
    const qualityAnalysis = DeliverableEnhancerService.analyzeQuality(deliverable)

    // Identify missing components
    const missingComponents = MissingComponentsAnalyzer.identifyMissingComponents(deliverable)

    // Identify weak sections
    const weakSections = WeakSectionsAnalyzer.identifyWeakSections(deliverable, qualityAnalysis)

    // Generate enhancement prompts
    const enhancementPrompts = DeliverableEnhancerService.generateEnhancementPrompts(deliverable, qualityAnalysis)

    // Generate recommended actions
    const recommendedActions = RecommendedActionsGenerator.generateRecommendedActions(qualityAnalysis, missingComponents)

    return {
      missingComponents,
      weakSections,
      enhancementPrompts,
      qualityAnalysis,
      recommendedActions
    }
  }

  static generateEnhancementQuestions(deliverable: CompiledDeliverable) {
    return EnhancementQuestionsGenerator.generateEnhancementQuestions(deliverable)
  }
}
