
import { DataExtractionService } from './dataExtractionService'

export interface DeliverableComponent {
  name: string
  description: string
  type: 'feature' | 'module' | 'service' | 'interface'
  priority: 'high' | 'medium' | 'low'
  dependencies: string[]
  technicalRequirements: string[]
}

export interface DeliverableSection {
  title: string
  content: string
  priority: number
  completeness: number
}

export interface CompiledDeliverable {
  projectOverview: {
    name: string
    description: string
    problemStatement: string
    solutionSummary: string
    targetAudience: string[]
  }
  marketAnalysis: {
    findings: string[]
    opportunities: string[]
    risks: string[]
    competitiveAdvantages: string[]
  }
  technicalSpecification: {
    components: DeliverableComponent[]
    architecture: string
    technicalRequirements: string[]
    integrations: string[]
  }
  implementationPlan: {
    phases: Array<{
      name: string
      duration: string
      deliverables: string[]
      dependencies: string[]
    }>
    timeline: string
    resources: string[]
    milestones: string[]
  }
  validationResults: {
    marketValidation: string[]
    technicalValidation: string[]
    riskAssessment: string[]
    recommendations: string[]
  }
  nextSteps: {
    immediate: string[]
    shortTerm: string[]
    longTerm: string[]
  }
  qualityMetrics: {
    completeness: number
    feasibility: number
    marketViability: number
    technicalReadiness: number
  }
}

export class DeliverableCompilerService {
  static compileFromDevelopmentData(concept: any, developmentData: any): CompiledDeliverable {
    console.log('Compiling deliverable from development data:', { concept, developmentData })
    
    // Enhanced data extraction
    const extractedData = DataExtractionService.extractFromDevelopmentData(developmentData)
    console.log('Extracted data:', extractedData)
    
    // Synthesize insights
    const insights = DataExtractionService.synthesizeProjectInsights(extractedData)
    console.log('Synthesized insights:', insights)
    
    // Extract and consolidate components with better logic
    const allComponents = this.extractAndConsolidateComponents(extractedData)
    
    // Enhanced research synthesis
    const marketInsights = this.synthesizeResearchFindings(extractedData)
    
    // Enhanced validation compilation
    const validationSummary = this.compileValidationResults(extractedData)
    
    // Generate enhanced implementation roadmap
    const implementationStrategy = this.generateImplementationPlan(allComponents, extractedData, insights)
    
    // Calculate quality metrics with better logic
    const qualityAssessment = this.calculateQualityMetrics(developmentData, extractedData)
    
    return {
      projectOverview: {
        name: concept.name,
        description: concept.description,
        problemStatement: this.extractProblemStatement(extractedData, concept),
        solutionSummary: this.extractSolutionSummary(allComponents, insights),
        targetAudience: this.identifyTargetAudience(marketInsights, extractedData)
      },
      marketAnalysis: marketInsights,
      technicalSpecification: {
        components: allComponents,
        architecture: this.inferArchitecture(allComponents, extractedData),
        technicalRequirements: this.consolidateTechnicalRequirements(extractedData),
        integrations: this.identifyIntegrations(allComponents)
      },
      implementationPlan: implementationStrategy,
      validationResults: validationSummary,
      nextSteps: this.generateNextSteps(validationSummary, implementationStrategy, insights),
      qualityMetrics: qualityAssessment
    }
  }
  
  private static extractAndConsolidateComponents(extractedData: any): DeliverableComponent[] {
    const componentMap = new Map<string, DeliverableComponent>()
    
    extractedData.components.forEach((comp: any) => {
      const key = comp.name || comp.title || `Component-${Math.random().toString(36).substr(2, 9)}`
      
      if (componentMap.has(key)) {
        // Merge with existing component
        const existing = componentMap.get(key)!
        existing.description = this.mergeDescriptions(existing.description, comp.description || comp.content)
        // Update with more recent data
        if (comp.dependencies) existing.dependencies = [...new Set([...existing.dependencies, ...comp.dependencies])]
        if (comp.requirements) existing.technicalRequirements = [...new Set([...existing.technicalRequirements, ...comp.requirements])]
      } else {
        // Add new component
        componentMap.set(key, {
          name: key,
          description: comp.description || comp.content || 'No description available',
          type: this.inferComponentType(comp),
          priority: this.inferPriority(comp),
          dependencies: comp.dependencies || [],
          technicalRequirements: comp.requirements || comp.technicalRequirements || []
        })
      }
    })
    
    return Array.from(componentMap.values())
  }
  
  private static synthesizeResearchFindings(extractedData: any): any {
    const findings: string[] = []
    const opportunities: string[] = []
    const risks: string[] = []
    const advantages: string[] = []
    
    // Process research data
    extractedData.research.forEach((research: any) => {
      const finding = research.finding || research.content || research
      if (typeof finding === 'string') {
        if (finding.toLowerCase().includes('opportunity') || finding.toLowerCase().includes('market potential')) {
          opportunities.push(finding)
        } else if (finding.toLowerCase().includes('risk') || finding.toLowerCase().includes('challenge') || finding.toLowerCase().includes('threat')) {
          risks.push(finding)
        } else if (finding.toLowerCase().includes('advantage') || finding.toLowerCase().includes('benefit') || finding.toLowerCase().includes('competitive')) {
          advantages.push(finding)
        } else {
          findings.push(finding)
        }
      }
    })
    
    // Process insights
    extractedData.insights.forEach((insight: any) => {
      const content = insight.content || insight
      if (typeof content === 'string') {
        if (content.toLowerCase().includes('market') || content.toLowerCase().includes('user')) {
          findings.push(content)
        }
      }
    })
    
    return {
      findings: [...new Set(findings)],
      opportunities: [...new Set(opportunities)],
      risks: [...new Set(risks)],
      competitiveAdvantages: [...new Set(advantages)]
    }
  }
  
  private static compileValidationResults(extractedData: any): any {
    const marketValidation: string[] = []
    const technicalValidation: string[] = []
    const riskAssessment: string[] = []
    const recommendations: string[] = []
    
    // Process validation data
    extractedData.validations.forEach((validation: any) => {
      const result = validation.result || validation.content || validation
      if (typeof result === 'string') {
        if (result.toLowerCase().includes('market') || result.toLowerCase().includes('user') || result.toLowerCase().includes('customer')) {
          marketValidation.push(result)
        } else if (result.toLowerCase().includes('technical') || result.toLowerCase().includes('feasible') || result.toLowerCase().includes('implementation')) {
          technicalValidation.push(result)
        } else if (result.toLowerCase().includes('risk') || result.toLowerCase().includes('concern')) {
          riskAssessment.push(result)
        } else {
          recommendations.push(result)
        }
      }
    })
    
    // Process refinements as recommendations
    extractedData.refinements.forEach((refinement: any) => {
      const improvement = refinement.improvement || refinement.content || refinement
      if (typeof improvement === 'string') {
        recommendations.push(improvement)
      }
    })
    
    return {
      marketValidation: [...new Set(marketValidation)],
      technicalValidation: [...new Set(technicalValidation)],
      riskAssessment: [...new Set(riskAssessment)],
      recommendations: [...new Set(recommendations)]
    }
  }
  
  private static generateImplementationPlan(components: DeliverableComponent[], extractedData: any, insights: any): any {
    const highPriorityComponents = components.filter(c => c.priority === 'high')
    const mediumPriorityComponents = components.filter(c => c.priority === 'medium')
    const lowPriorityComponents = components.filter(c => c.priority === 'low')
    
    // Use insights to enhance phase planning
    const coreComponents = insights.coreComponents || []
    const implementationGuidance = insights.implementationGuidance || []
    
    return {
      phases: [
        {
          name: 'Foundation Phase',
          duration: '4-6 weeks',
          deliverables: [
            ...coreComponents.slice(0, 2),
            ...highPriorityComponents.slice(0, 2).map(c => c.name)
          ].filter((item, index, arr) => arr.indexOf(item) === index),
          dependencies: ['Team setup', 'Infrastructure setup', 'Requirements finalization']
        },
        {
          name: 'Core Development Phase',
          duration: '8-12 weeks',
          deliverables: [
            ...highPriorityComponents.slice(2).map(c => c.name),
            ...mediumPriorityComponents.slice(0, 3).map(c => c.name)
          ].filter((item, index, arr) => arr.indexOf(item) === index),
          dependencies: ['Foundation Phase completion', 'User feedback collection']
        },
        {
          name: 'Enhancement Phase',
          duration: '4-8 weeks',
          deliverables: [
            ...mediumPriorityComponents.slice(3).map(c => c.name),
            ...lowPriorityComponents.slice(0, 2).map(c => c.name)
          ].filter((item, index, arr) => arr.indexOf(item) === index),
          dependencies: ['Core Development Phase completion', 'Beta testing']
        }
      ],
      timeline: '16-26 weeks total',
      resources: [
        'Development team (2-4 developers)',
        'Design resources (1 designer)',
        'Infrastructure and hosting',
        'Testing and QA resources'
      ],
      milestones: [
        'MVP completion and internal testing',
        'Beta release and user feedback',
        'Production deployment and launch',
        'Post-launch optimization'
      ]
    }
  }
  
  private static calculateQualityMetrics(developmentData: any, extractedData: any): any {
    const latestSession = developmentData?.development?.[0]
    
    // Enhanced scoring based on extracted data quality
    let completenessBonus = 0
    let feasibilityBonus = 0
    let marketViabilityBonus = 0
    let technicalReadinessBonus = 0
    
    // Bonus for having substantial extracted data
    if (extractedData.components.length > 5) completenessBonus += 0.1
    if (extractedData.research.length > 3) marketViabilityBonus += 0.1
    if (extractedData.validations.length > 3) feasibilityBonus += 0.1
    if (extractedData.refinements.length > 2) technicalReadinessBonus += 0.1
    
    return {
      completeness: Math.min(100, Math.round(((latestSession?.completeness_score || 0) + completenessBonus) * 100)),
      feasibility: Math.min(100, Math.round(((latestSession?.feasibility_score || 0) + feasibilityBonus) * 100)),
      marketViability: Math.min(100, Math.round(((latestSession?.confidence_score || 0) + marketViabilityBonus) * 100)),
      technicalReadiness: Math.min(100, Math.round(((latestSession?.novelty_score || 0) + technicalReadinessBonus) * 100))
    }
  }
  
  private static extractProblemStatement(extractedData: any, concept: any): string {
    // Look for problem statements in research or insights
    const problemStatements = extractedData.research
      .filter((r: any) => (r.content || r.finding || '').toLowerCase().includes('problem'))
      .map((r: any) => r.content || r.finding)
    
    if (problemStatements.length > 0) {
      return problemStatements[0]
    }
    
    // Fallback to concept description or generic statement
    return concept.description || 'A comprehensive solution to address identified market needs and user requirements'
  }
  
  private static extractSolutionSummary(components: DeliverableComponent[], insights: any): string {
    if (components.length === 0) return 'Solution needs to be developed'
    
    const coreComponents = insights.coreComponents || components.slice(0, 3).map(c => c.name)
    const componentCount = components.length
    
    return `A comprehensive solution comprising ${componentCount} key components including ${coreComponents.slice(0, 3).join(', ')}${coreComponents.length > 3 ? ' and additional supporting features' : ''}. The solution addresses core user needs through an integrated approach combining ${components.filter(c => c.type === 'service').length > 0 ? 'backend services, ' : ''}${components.filter(c => c.type === 'interface').length > 0 ? 'user interfaces, ' : ''}and ${components.filter(c => c.type === 'feature').length} specialized features.`
  }
  
  private static identifyTargetAudience(marketInsights: any, extractedData: any): string[] {
    const audiences = new Set<string>()
    
    // Check market insights
    marketInsights.findings.forEach((finding: string) => {
      if (finding.toLowerCase().includes('business') || finding.toLowerCase().includes('enterprise')) {
        audiences.add('Business customers')
      }
      if (finding.toLowerCase().includes('consumer') || finding.toLowerCase().includes('individual')) {
        audiences.add('Individual consumers')
      }
      if (finding.toLowerCase().includes('developer') || finding.toLowerCase().includes('technical')) {
        audiences.add('Technical users')
      }
      if (finding.toLowerCase().includes('small business') || finding.toLowerCase().includes('startup')) {
        audiences.add('Small businesses')
      }
    })
    
    // Check research data
    extractedData.research.forEach((research: any) => {
      const content = research.content || research.finding || ''
      if (content.toLowerCase().includes('user') || content.toLowerCase().includes('customer')) {
        audiences.add('End users')
      }
    })
    
    return audiences.size > 0 ? Array.from(audiences) : ['Target audience to be defined through market research']
  }
  
  private static inferArchitecture(components: DeliverableComponent[], extractedData: any): string {
    const hasAPI = components.some(c => c.name.toLowerCase().includes('api'))
    const hasUI = components.some(c => c.name.toLowerCase().includes('ui') || c.name.toLowerCase().includes('interface'))
    const hasDatabase = components.some(c => c.name.toLowerCase().includes('database') || c.name.toLowerCase().includes('storage'))
    
    if (hasAPI && hasUI && hasDatabase) {
      return 'Full-stack web application with API, frontend, and database layers'
    } else if (hasAPI && hasDatabase) {
      return 'Backend service with API and data persistence'
    } else if (hasUI) {
      return 'Frontend application with user interface'
    } else {
      return 'Architecture to be determined based on requirements'
    }
  }
  
  private static consolidateTechnicalRequirements(extractedData: any): string[] {
    const requirements = new Set<string>()
    
    extractedData.components.forEach((comp: any) => {
      if (comp.requirements) {
        comp.requirements.forEach((req: string) => requirements.add(req))
      }
      if (comp.technicalRequirements) {
        comp.technicalRequirements.forEach((req: string) => requirements.add(req))
      }
    })
    
    return Array.from(requirements)
  }
  
  private static identifyIntegrations(components: DeliverableComponent[]): string[] {
    const integrations = new Set<string>()
    
    components.forEach(comp => {
      comp.dependencies.forEach(dep => {
        if (dep.toLowerCase().includes('api') || dep.toLowerCase().includes('service')) {
          integrations.add(dep)
        }
      })
    })
    
    return Array.from(integrations)
  }
  
  private static generateNextSteps(validationResults: any, implementationStrategy: any, insights: any): any {
    return {
      immediate: [
        'Finalize technical requirements',
        'Assemble development team',
        'Set up development environment'
      ],
      shortTerm: [
        'Begin foundation phase development',
        'Conduct user research validation',
        'Create detailed technical specifications'
      ],
      longTerm: [
        'Scale development team',
        'Plan market launch strategy',
        'Develop go-to-market plan'
      ]
    }
  }
  
  private static inferComponentType(comp: any): 'feature' | 'module' | 'service' | 'interface' {
    const name = (comp.name || comp.title || '').toLowerCase()
    const desc = (comp.description || comp.content || '').toLowerCase()
    
    if (name.includes('api') || name.includes('service') || desc.includes('service')) return 'service'
    if (name.includes('ui') || name.includes('interface') || desc.includes('interface')) return 'interface'
    if (name.includes('module') || desc.includes('module')) return 'module'
    return 'feature'
  }
  
  private static inferPriority(comp: any): 'high' | 'medium' | 'low' {
    const text = `${comp.name || ''} ${comp.description || comp.content || ''}`.toLowerCase()
    
    if (text.includes('core') || text.includes('essential') || text.includes('critical')) return 'high'
    if (text.includes('nice to have') || text.includes('optional') || text.includes('enhancement')) return 'low'
    return 'medium'
  }
  
  private static mergeDescriptions(existing: string, newDesc: string): string {
    if (!newDesc || existing.includes(newDesc)) return existing
    return `${existing}\n\nAdditional details: ${newDesc}`
  }
}
