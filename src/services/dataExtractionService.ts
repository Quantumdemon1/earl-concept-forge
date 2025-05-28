
export interface ExtractedData {
  components: any[]
  research: any[]
  validations: any[]
  refinements: any[]
  insights: any[]
}

export class DataExtractionService {
  static extractFromDevelopmentData(developmentData: any): ExtractedData {
    console.log('Extracting data from development sessions:', developmentData)

    const components: any[] = []
    const research: any[] = []
    const validations: any[] = []
    const refinements: any[] = []
    const insights: any[] = []

    // Process development sessions
    developmentData?.development?.forEach((session: any) => {
      // Extract from LLM interactions
      session.llm_interactions?.forEach((interaction: any) => {
        // Extract components
        if (interaction.extractedComponents) {
          interaction.extractedComponents.forEach((comp: any) => {
            components.push({
              ...comp,
              sessionId: session.id,
              stage: interaction.stage,
              iteration: interaction.iteration,
              timestamp: interaction.timestamp
            })
          })
        }

        // Extract research
        if (interaction.extractedResearch) {
          interaction.extractedResearch.forEach((research_item: any) => {
            research.push({
              ...research_item,
              sessionId: session.id,
              stage: interaction.stage,
              iteration: interaction.iteration,
              timestamp: interaction.timestamp
            })
          })
        }

        // Extract validations
        if (interaction.extractedValidations) {
          interaction.extractedValidations.forEach((validation: any) => {
            validations.push({
              ...validation,
              sessionId: session.id,
              stage: interaction.stage,
              iteration: interaction.iteration,
              timestamp: interaction.timestamp
            })
          })
        }

        // Extract refinements
        if (interaction.extractedRefinements) {
          interaction.extractedRefinements.forEach((refinement: any) => {
            refinements.push({
              ...refinement,
              sessionId: session.id,
              stage: interaction.stage,
              iteration: interaction.iteration,
              timestamp: interaction.timestamp
            })
          })
        }

        // Extract insights from response content
        if (interaction.response && typeof interaction.response === 'string') {
          const extractedInsights = this.extractInsightsFromText(interaction.response)
          extractedInsights.forEach(insight => {
            insights.push({
              ...insight,
              sessionId: session.id,
              stage: interaction.stage,
              iteration: interaction.iteration,
              timestamp: interaction.timestamp
            })
          })
        }
      })

      // Extract from development iterations if available
      session.development_iterations?.forEach((iteration: any) => {
        if (iteration.extracted_components) {
          iteration.extracted_components.forEach((comp: any) => {
            components.push({
              ...comp,
              sessionId: session.id,
              iterationId: iteration.id,
              stage: iteration.stage,
              iteration: iteration.iteration_number,
              timestamp: iteration.created_at
            })
          })
        }

        if (iteration.extracted_research) {
          iteration.extracted_research.forEach((research_item: any) => {
            research.push({
              ...research_item,
              sessionId: session.id,
              iterationId: iteration.id,
              stage: iteration.stage,
              iteration: iteration.iteration_number,
              timestamp: iteration.created_at
            })
          })
        }

        if (iteration.extracted_validations) {
          iteration.extracted_validations.forEach((validation: any) => {
            validations.push({
              ...validation,
              sessionId: session.id,
              iterationId: iteration.id,
              stage: iteration.stage,
              iteration: iteration.iteration_number,
              timestamp: iteration.created_at
            })
          })
        }

        if (iteration.extracted_refinements) {
          iteration.extracted_refinements.forEach((refinement: any) => {
            refinements.push({
              ...refinement,
              sessionId: session.id,
              iterationId: iteration.id,
              stage: iteration.stage,
              iteration: iteration.iteration_number,
              timestamp: iteration.created_at
            })
          })
        }
      })
    })

    return {
      components: this.deduplicateAndRank(components),
      research: this.deduplicateAndRank(research),
      validations: this.deduplicateAndRank(validations),
      refinements: this.deduplicateAndRank(refinements),
      insights: this.deduplicateAndRank(insights)
    }
  }

  private static extractInsightsFromText(text: string): any[] {
    const insights: any[] = []
    
    // Look for key insight patterns
    const insightPatterns = [
      /key insight[s]?[:\-\s]+(.*?)(?:\n|$)/gi,
      /important[:\-\s]+(.*?)(?:\n|$)/gi,
      /recommendation[s]?[:\-\s]+(.*?)(?:\n|$)/gi,
      /conclusion[s]?[:\-\s]+(.*?)(?:\n|$)/gi,
      /finding[s]?[:\-\s]+(.*?)(?:\n|$)/gi
    ]

    insightPatterns.forEach(pattern => {
      let match
      while ((match = pattern.exec(text)) !== null) {
        if (match[1] && match[1].trim().length > 10) {
          insights.push({
            type: 'insight',
            content: match[1].trim(),
            source: 'llm_response'
          })
        }
      }
    })

    return insights
  }

  private static deduplicateAndRank(items: any[]): any[] {
    if (items.length === 0) return []

    // Group similar items
    const grouped = new Map<string, any[]>()
    
    items.forEach(item => {
      const key = this.generateItemKey(item)
      if (!grouped.has(key)) {
        grouped.set(key, [])
      }
      grouped.get(key)!.push(item)
    })

    // For each group, select the best item (most recent with highest quality)
    const deduplicated: any[] = []
    
    grouped.forEach(group => {
      // Sort by timestamp (most recent first)
      group.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      
      // Take the most recent item, but merge content from others if valuable
      const best = group[0]
      
      // Merge additional content from other items in the group
      if (group.length > 1) {
        const additionalContent = group.slice(1)
          .map(item => item.content || item.description)
          .filter(content => content && !best.content?.includes(content) && !best.description?.includes(content))
          .join(' ')
        
        if (additionalContent && best.content) {
          best.content += ` ${additionalContent}`
        } else if (additionalContent && best.description) {
          best.description += ` ${additionalContent}`
        }
      }
      
      deduplicated.push(best)
    })

    // Sort by relevance/importance
    return deduplicated.sort((a, b) => {
      // Prioritize by stage progression
      const stageOrder = { 'initial': 1, 'research': 2, 'analysis': 3, 'refinement': 4, 'validation': 5 }
      const aStage = stageOrder[a.stage as keyof typeof stageOrder] || 0
      const bStage = stageOrder[b.stage as keyof typeof stageOrder] || 0
      
      if (aStage !== bStage) return bStage - aStage
      
      // Then by iteration (higher is better)
      return (b.iteration || 0) - (a.iteration || 0)
    })
  }

  private static generateItemKey(item: any): string {
    // Generate a key for grouping similar items
    const name = item.name || item.title || ''
    const content = item.content || item.description || item.finding || item.result || ''
    
    // Normalize text for comparison
    const normalized = (name + ' ' + content)
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
    
    // Use first 50 characters as the key
    return normalized.substring(0, 50)
  }

  static synthesizeProjectInsights(extractedData: ExtractedData): {
    coreComponents: string[]
    keyFindings: string[]
    validatedConcepts: string[]
    implementationGuidance: string[]
  } {
    const coreComponents = extractedData.components
      .filter(comp => comp.priority === 'high' || comp.type === 'core')
      .map(comp => comp.name || comp.title)
      .slice(0, 5)

    const keyFindings = extractedData.research
      .filter(research => research.confidence > 0.7 || research.importance === 'high')
      .map(research => research.finding || research.content)
      .slice(0, 5)

    const validatedConcepts = extractedData.validations
      .filter(validation => validation.result?.includes('valid') || validation.status === 'confirmed')
      .map(validation => validation.result || validation.content)
      .slice(0, 5)

    const implementationGuidance = extractedData.refinements
      .filter(refinement => refinement.type === 'implementation' || refinement.category === 'next_steps')
      .map(refinement => refinement.improvement || refinement.content)
      .slice(0, 5)

    return {
      coreComponents,
      keyFindings,
      validatedConcepts,
      implementationGuidance
    }
  }
}
