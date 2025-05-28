
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
    
    // Extract all components across iterations
    const allComponents = this.extractAndConsolidateComponents(developmentData)
    
    // Synthesize research findings
    const marketInsights = this.synthesizeResearchFindings(developmentData)
    
    // Compile validation results
    const validationSummary = this.compileValidationResults(developmentData)
    
    // Generate implementation roadmap
    const implementationStrategy = this.generateImplementationPlan(allComponents, developmentData)
    
    // Calculate quality metrics
    const qualityAssessment = this.calculateQualityMetrics(developmentData)
    
    return {
      projectOverview: {
        name: concept.name,
        description: concept.description,
        problemStatement: this.extractProblemStatement(developmentData),
        solutionSummary: this.extractSolutionSummary(allComponents),
        targetAudience: this.identifyTargetAudience(marketInsights)
      },
      marketAnalysis: marketInsights,
      technicalSpecification: {
        components: allComponents,
        architecture: this.inferArchitecture(allComponents),
        technicalRequirements: this.consolidateTechnicalRequirements(developmentData),
        integrations: this.identifyIntegrations(allComponents)
      },
      implementationPlan: implementationStrategy,
      validationResults: validationSummary,
      nextSteps: this.generateNextSteps(validationSummary, implementationStrategy),
      qualityMetrics: qualityAssessment
    }
  }
  
  private static extractAndConsolidateComponents(developmentData: any): DeliverableComponent[] {
    const componentMap = new Map<string, DeliverableComponent>()
    
    developmentData?.development?.forEach((session: any) => {
      session.llm_interactions?.forEach((interaction: any) => {
        interaction.extractedComponents?.forEach((comp: any) => {
          const key = comp.name || comp.title || `Component-${Math.random().toString(36).substr(2, 9)}`
          
          if (componentMap.has(key)) {
            // Merge with existing component
            const existing = componentMap.get(key)!
            existing.description = this.mergeDescriptions(existing.description, comp.description || comp.content)
          } else {
            // Add new component
            componentMap.set(key, {
              name: key,
              description: comp.description || comp.content || 'No description available',
              type: this.inferComponentType(comp),
              priority: this.inferPriority(comp),
              dependencies: comp.dependencies || [],
              technicalRequirements: comp.requirements || []
            })
          }
        })
      })
    })
    
    return Array.from(componentMap.values())
  }
  
  private static synthesizeResearchFindings(developmentData: any): any {
    const findings: string[] = []
    const opportunities: string[] = []
    const risks: string[] = []
    const advantages: string[] = []
    
    developmentData?.development?.forEach((session: any) => {
      session.llm_interactions?.forEach((interaction: any) => {
        interaction.extractedResearch?.forEach((research: any) => {
          const finding = research.finding || research.content || research
          if (typeof finding === 'string') {
            if (finding.toLowerCase().includes('opportunity') || finding.toLowerCase().includes('market')) {
              opportunities.push(finding)
            } else if (finding.toLowerCase().includes('risk') || finding.toLowerCase().includes('challenge')) {
              risks.push(finding)
            } else if (finding.toLowerCase().includes('advantage') || finding.toLowerCase().includes('benefit')) {
              advantages.push(finding)
            } else {
              findings.push(finding)
            }
          }
        })
      })
    })
    
    return {
      findings: [...new Set(findings)],
      opportunities: [...new Set(opportunities)],
      risks: [...new Set(risks)],
      competitiveAdvantages: [...new Set(advantages)]
    }
  }
  
  private static compileValidationResults(developmentData: any): any {
    const marketValidation: string[] = []
    const technicalValidation: string[] = []
    const riskAssessment: string[] = []
    const recommendations: string[] = []
    
    developmentData?.development?.forEach((session: any) => {
      session.llm_interactions?.forEach((interaction: any) => {
        interaction.extractedValidations?.forEach((validation: any) => {
          const result = validation.result || validation.content || validation
          if (typeof result === 'string') {
            if (result.toLowerCase().includes('market') || result.toLowerCase().includes('user')) {
              marketValidation.push(result)
            } else if (result.toLowerCase().includes('technical') || result.toLowerCase().includes('feasible')) {
              technicalValidation.push(result)
            } else if (result.toLowerCase().includes('risk')) {
              riskAssessment.push(result)
            } else {
              recommendations.push(result)
            }
          }
        })
      })
    })
    
    return {
      marketValidation: [...new Set(marketValidation)],
      technicalValidation: [...new Set(technicalValidation)],
      riskAssessment: [...new Set(riskAssessment)],
      recommendations: [...new Set(recommendations)]
    }
  }
  
  private static generateImplementationPlan(components: DeliverableComponent[], developmentData: any): any {
    const highPriorityComponents = components.filter(c => c.priority === 'high')
    const mediumPriorityComponents = components.filter(c => c.priority === 'medium')
    const lowPriorityComponents = components.filter(c => c.priority === 'low')
    
    return {
      phases: [
        {
          name: 'Foundation Phase',
          duration: '4-6 weeks',
          deliverables: highPriorityComponents.slice(0, 3).map(c => c.name),
          dependencies: ['Team setup', 'Infrastructure setup']
        },
        {
          name: 'Core Development Phase',
          duration: '8-12 weeks',
          deliverables: [...highPriorityComponents.slice(3), ...mediumPriorityComponents.slice(0, 3)].map(c => c.name),
          dependencies: ['Foundation Phase completion']
        },
        {
          name: 'Enhancement Phase',
          duration: '4-8 weeks',
          deliverables: [...mediumPriorityComponents.slice(3), ...lowPriorityComponents].map(c => c.name),
          dependencies: ['Core Development Phase completion']
        }
      ],
      timeline: '16-26 weeks total',
      resources: ['Development team', 'Design resources', 'Infrastructure'],
      milestones: ['MVP completion', 'Beta release', 'Production deployment']
    }
  }
  
  private static calculateQualityMetrics(developmentData: any): any {
    const latestSession = developmentData?.development?.[0]
    
    return {
      completeness: Math.round((latestSession?.completeness_score || 0) * 100),
      feasibility: Math.round((latestSession?.feasibility_score || 0) * 100),
      marketViability: Math.round((latestSession?.confidence_score || 0) * 100),
      technicalReadiness: Math.round((latestSession?.novelty_score || 0) * 100)
    }
  }
  
  private static extractProblemStatement(developmentData: any): string {
    const firstInteraction = developmentData?.development?.[0]?.llm_interactions?.[0]
    return firstInteraction?.summary || 'Problem statement needs to be defined'
  }
  
  private static extractSolutionSummary(components: DeliverableComponent[]): string {
    if (components.length === 0) return 'Solution needs to be developed'
    return `A comprehensive solution comprising ${components.length} key components: ${components.slice(0, 3).map(c => c.name).join(', ')}${components.length > 3 ? ' and more' : ''}.`
  }
  
  private static identifyTargetAudience(marketInsights: any): string[] {
    const audiences = new Set<string>()
    
    marketInsights.findings.forEach((finding: string) => {
      if (finding.toLowerCase().includes('user') || finding.toLowerCase().includes('customer')) {
        audiences.add('End users')
      }
      if (finding.toLowerCase().includes('business') || finding.toLowerCase().includes('enterprise')) {
        audiences.add('Business customers')
      }
      if (finding.toLowerCase().includes('developer') || finding.toLowerCase().includes('technical')) {
        audiences.add('Technical users')
      }
    })
    
    return audiences.size > 0 ? Array.from(audiences) : ['Target audience to be defined']
  }
  
  private static inferArchitecture(components: DeliverableComponent[]): string {
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
  
  private static consolidateTechnicalRequirements(developmentData: any): string[] {
    const requirements = new Set<string>()
    
    developmentData?.development?.forEach((session: any) => {
      session.llm_interactions?.forEach((interaction: any) => {
        interaction.extractedComponents?.forEach((comp: any) => {
          if (comp.requirements) {
            comp.requirements.forEach((req: string) => requirements.add(req))
          }
          if (comp.technicalRequirements) {
            comp.technicalRequirements.forEach((req: string) => requirements.add(req))
          }
        })
      })
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
  
  private static generateNextSteps(validationResults: any, implementationPlan: any): any {
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
