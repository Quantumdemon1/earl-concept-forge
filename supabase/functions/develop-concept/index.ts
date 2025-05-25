
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface RequestBody {
  conceptId: string
  sessionId?: string
  action?: 'iterate'
  config?: {
    maxIterations?: number
    autoRun?: boolean
    qualityThresholds?: {
      completeness: number
      confidence: number
      feasibility: number
    }
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Get the authorization header
    const authHeader = req.headers.get('Authorization')
    if (authHeader) {
      supabase.auth.setSession({
        access_token: authHeader.replace('Bearer ', ''),
        refresh_token: ''
      })
    }

    const { conceptId, sessionId, action, config }: RequestBody = await req.json()

    console.log('Processing request:', { conceptId, sessionId, action })

    if (action === 'iterate' && sessionId) {
      // Handle iteration request
      const { data: session, error: sessionError } = await supabase
        .from('concept_development_sessions')
        .select('*')
        .eq('id', sessionId)
        .single()

      if (sessionError) {
        throw new Error(`Session not found: ${sessionError.message}`)
      }

      // Simulate development iteration with mock data
      const newIteration = (session.iteration_count || 0) + 1
      const mockScores = {
        completeness: Math.min(0.95, (session.completeness_score || 0) + Math.random() * 0.1),
        confidence: Math.min(0.95, (session.confidence_score || 0) + Math.random() * 0.1),
        feasibility: Math.min(0.95, (session.feasibility_score || 0) + Math.random() * 0.1),
        novelty: Math.min(0.95, (session.novelty_score || 0) + Math.random() * 0.05),
      }

      const stages = ['initial', 'expanding', 'researching', 'validating', 'refining', 'implementing', 'complete']
      const currentStageIndex = stages.indexOf(session.stage || 'initial')
      const newStage = newIteration > 15 ? 'complete' : stages[Math.min(currentStageIndex + Math.floor(newIteration / 3), stages.length - 1)]

      // Generate mock LLM interaction data
      const mockPrompt = `Develop the concept "${conceptId}" further in the ${newStage} stage. 
      
Current iteration: ${newIteration}
Previous scores: 
- Completeness: ${(session.completeness_score || 0).toFixed(2)}
- Confidence: ${(session.confidence_score || 0).toFixed(2)}
- Feasibility: ${(session.feasibility_score || 0).toFixed(2)}
- Novelty: ${(session.novelty_score || 0).toFixed(2)}

Focus on improving these metrics while maintaining the concept's core integrity.`

      const mockResponse = generateMockLLMResponse(newStage, newIteration, mockScores)

      const newInteraction = {
        iteration: newIteration,
        stage: newStage,
        timestamp: new Date().toISOString(),
        scores: mockScores,
        prompt: mockPrompt,
        response: mockResponse.content,
        extractedComponents: mockResponse.extractedComponents,
        extractedResearch: mockResponse.extractedResearch,
        extractedValidations: mockResponse.extractedValidations,
        extractedRefinements: mockResponse.extractedRefinements,
        summary: mockResponse.summary
      }

      // Update session in database
      const { error: updateError } = await supabase
        .from('concept_development_sessions')
        .update({
          iteration_count: newIteration,
          stage: newStage,
          completeness_score: mockScores.completeness,
          confidence_score: mockScores.confidence,
          feasibility_score: mockScores.feasibility,
          novelty_score: mockScores.novelty,
          llm_interactions: [...(session.llm_interactions || []), newInteraction],
          updated_at: new Date().toISOString()
        })
        .eq('id', sessionId)

      if (updateError) {
        throw new Error(`Failed to update session: ${updateError.message}`)
      }

      return new Response(
        JSON.stringify({
          stage: newStage,
          iteration: newIteration,
          scores: mockScores
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    } else {
      // Handle session creation
      const sessionId = crypto.randomUUID()
      const initialScores = {
        completeness: 0.1 + Math.random() * 0.1,
        confidence: 0.1 + Math.random() * 0.1,
        feasibility: 0.1 + Math.random() * 0.1,
        novelty: 0.1 + Math.random() * 0.1,
      }

      // Create new session in database
      const { error: insertError } = await supabase
        .from('concept_development_sessions')
        .insert({
          id: sessionId,
          concept_id: conceptId,
          stage: 'initial',
          iteration_count: 0,
          completeness_score: initialScores.completeness,
          confidence_score: initialScores.confidence,
          feasibility_score: initialScores.feasibility,
          novelty_score: initialScores.novelty,
          config: config || {},
          llm_interactions: [],
          is_active: true,
          started_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })

      if (insertError) {
        throw new Error(`Failed to create session: ${insertError.message}`)
      }

      console.log('Created new session:', sessionId)

      return new Response(
        JSON.stringify({
          sessionId,
          stage: 'initial',
          iteration: 0,
          scores: initialScores
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }
  } catch (error) {
    console.error('Edge function error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})

function generateMockLLMResponse(stage: string, iteration: number, scores: any) {
  const stageTemplates = {
    initial: {
      content: `# Initial Concept Analysis

Based on the concept provided, I'll begin the initial analysis and framework setup.

## Core Components Identified:
1. Primary functionality framework
2. User interaction patterns
3. System architecture considerations
4. Initial feasibility assessment

## Initial Assessment:
The concept shows promise with a completeness score of ${(scores.completeness * 100).toFixed(1)}%. 

Key areas for development:
- Component structure definition
- User workflow mapping
- Technical requirement analysis
- Market validation preparation`,
      extractedComponents: [
        { name: "Core Framework", description: "Primary system architecture and functionality" },
        { name: "User Interface", description: "User interaction and experience components" }
      ],
      extractedResearch: [
        { finding: "Market analysis indicates potential demand for this type of solution" },
        { finding: "Technical feasibility appears strong based on current technologies" }
      ],
      summary: "Initial concept framework established with core components identified"
    },
    expanding: {
      content: `# Concept Expansion - Iteration ${iteration}

Expanding the concept with detailed component breakdown and enhanced functionality mapping.

## Enhanced Component Structure:
1. **Core System Architecture**
   - Main processing engine
   - Data management layer
   - Integration interfaces

2. **User Experience Layer**
   - Interface design patterns
   - Interaction workflows
   - Accessibility considerations

3. **Business Logic Components**
   - Process automation
   - Decision-making algorithms
   - Performance optimization

## Feasibility Analysis:
Current feasibility score: ${(scores.feasibility * 100).toFixed(1)}%

The concept demonstrates strong potential with well-defined components and clear implementation pathways.`,
      extractedComponents: [
        { name: "Processing Engine", description: "Core computational and logic processing system" },
        { name: "Data Layer", description: "Information storage and retrieval management" },
        { name: "API Interface", description: "External system integration capabilities" }
      ],
      extractedResearch: [
        { finding: "Similar solutions in market showing 70% adoption rate" },
        { finding: "Technology stack compatibility confirmed for proposed architecture" }
      ],
      summary: "Concept expanded with detailed architecture and enhanced component definition"
    },
    researching: {
      content: `# Research Phase - Iteration ${iteration}

Conducting comprehensive research to validate assumptions and gather market intelligence.

## Research Findings:

### Market Analysis:
- Target market size: Substantial opportunity identified
- Competitive landscape: Moderate competition with differentiation opportunities
- User demand: Strong indicators of market need

### Technical Validation:
- Implementation complexity: Moderate to high
- Resource requirements: Within reasonable bounds
- Technology readiness: Available and mature

### Risk Assessment:
- Market risks: Low to moderate
- Technical risks: Manageable with proper planning
- Resource risks: Standard development considerations

## Confidence Level: ${(scores.confidence * 100).toFixed(1)}%

Research validates the concept's viability and market potential.`,
      extractedComponents: [
        { name: "Market Interface", description: "Components for market interaction and user acquisition" },
        { name: "Analytics Engine", description: "Data collection and analysis capabilities" }
      ],
      extractedResearch: [
        { finding: "Primary research indicates 65% potential user interest" },
        { finding: "Technical benchmarking shows competitive performance possibilities" },
        { finding: "Cost analysis reveals sustainable business model potential" }
      ],
      summary: "Research phase completed with positive market and technical validation"
    },
    validating: {
      content: `# Validation Phase - Iteration ${iteration}

Testing concept assumptions and validating core hypotheses through systematic analysis.

## Validation Results:

### Technical Validation:
✅ Core functionality: Technically feasible
✅ Scalability: Architecture supports growth
✅ Integration: Compatible with existing systems
⚠️ Performance: Requires optimization in key areas

### Market Validation:
✅ User need: Confirmed through research
✅ Market size: Adequate for sustainable business
✅ Competitive position: Differentiation opportunities exist
⚠️ Pricing model: Needs refinement

### Business Model Validation:
✅ Value proposition: Clear and compelling
✅ Revenue streams: Multiple opportunities identified
⚠️ Cost structure: Requires optimization

## Overall Validation Score: ${((scores.completeness + scores.feasibility + scores.confidence) / 3 * 100).toFixed(1)}%`,
      extractedComponents: [
        { name: "Validation Framework", description: "Testing and validation infrastructure" },
        { name: "Metrics Collection", description: "Performance and usage measurement systems" }
      ],
      extractedValidations: [
        { result: "Technical architecture validated through prototype testing" },
        { result: "Market demand confirmed via user interviews and surveys" },
        { result: "Business model sustainability verified through financial modeling" }
      ],
      summary: "Validation phase shows strong concept viability with minor optimization needs"
    },
    refining: {
      content: `# Refinement Phase - Iteration ${iteration}

Optimizing the concept based on validation feedback and research insights.

## Refinement Areas:

### Technical Refinements:
1. **Performance Optimization**
   - Algorithm efficiency improvements
   - Resource utilization optimization
   - Scalability enhancements

2. **Architecture Refinements**
   - Modular design improvements
   - Interface standardization
   - Security enhancement

### User Experience Refinements:
1. **Interface Optimization**
   - Streamlined user workflows
   - Enhanced accessibility
   - Mobile-first design considerations

2. **Feature Prioritization**
   - Core feature focus
   - Advanced feature roadmap
   - User feedback integration

## Quality Metrics:
- Completeness: ${(scores.completeness * 100).toFixed(1)}%
- Confidence: ${(scores.confidence * 100).toFixed(1)}%
- Feasibility: ${(scores.feasibility * 100).toFixed(1)}%

The concept shows significant improvement through systematic refinement.`,
      extractedComponents: [
        { name: "Optimization Engine", description: "Performance and efficiency optimization systems" },
        { name: "Quality Assurance", description: "Testing and quality control mechanisms" }
      ],
      extractedRefinements: [
        { improvement: "Enhanced algorithm efficiency reducing processing time by 30%" },
        { improvement: "Improved user interface based on usability testing feedback" },
        { improvement: "Strengthened security architecture with advanced protection measures" }
      ],
      summary: "Concept significantly refined with improved performance and user experience"
    },
    implementing: {
      content: `# Implementation Phase - Iteration ${iteration}

Creating detailed implementation plans and actionable development roadmap.

## Implementation Strategy:

### Phase 1: Core Development
- **Duration**: 3-4 months
- **Focus**: Essential functionality
- **Resources**: 3-4 developers
- **Deliverables**: MVP with core features

### Phase 2: Enhanced Features
- **Duration**: 2-3 months  
- **Focus**: Advanced functionality
- **Resources**: 5-6 developers
- **Deliverables**: Feature-complete application

### Phase 3: Optimization & Launch
- **Duration**: 1-2 months
- **Focus**: Performance and deployment
- **Resources**: Full team
- **Deliverables**: Production-ready system

## Technology Stack:
- Frontend: Modern web technologies
- Backend: Scalable cloud architecture
- Database: Distributed data management
- Integration: RESTful APIs and microservices

## Success Metrics:
- Novelty: ${(scores.novelty * 100).toFixed(1)}%
- Overall Readiness: ${((scores.completeness + scores.confidence + scores.feasibility + scores.novelty) / 4 * 100).toFixed(1)}%`,
      extractedComponents: [
        { name: "Implementation Manager", description: "Project coordination and development oversight" },
        { name: "Deployment Pipeline", description: "Automated build, test, and deployment systems" }
      ],
      extractedRefinements: [
        { improvement: "Detailed project timeline with clear milestones and deliverables" },
        { improvement: "Risk mitigation strategies for common implementation challenges" },
        { improvement: "Quality gates and testing protocols for reliable deployment" }
      ],
      summary: "Comprehensive implementation plan developed with clear roadmap and success metrics"
    }
  }

  const template = stageTemplates[stage as keyof typeof stageTemplates] || stageTemplates.initial
  return template
}
