
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface EnhancementRequest {
  conceptId: string
  deliverable: any
  questionAnswers: Array<{
    questionId: string
    question: string
    answer: string
    category: string
    section: string
  }>
  targetSections?: string[]
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    const authHeader = req.headers.get('Authorization')
    if (authHeader) {
      supabase.auth.setSession({
        access_token: authHeader.replace('Bearer ', ''),
        refresh_token: ''
      })
    }

    const { conceptId, deliverable, questionAnswers, targetSections }: EnhancementRequest = await req.json()

    console.log('Auto-enhancing deliverable:', { conceptId, questionCount: questionAnswers.length })

    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')
    if (!OPENAI_API_KEY) {
      throw new Error('OpenAI API key not configured')
    }

    // Generate enhanced content for each section
    const enhancedSections: Record<string, any> = {}
    
    for (const qa of questionAnswers) {
      const sectionToEnhance = qa.section || qa.category
      
      if (targetSections && !targetSections.includes(sectionToEnhance)) {
        continue
      }

      const currentContent = getCurrentSectionContent(deliverable, sectionToEnhance)
      
      const enhancementPrompt = `You are an expert business analyst and technical writer. Your task is to enhance a specific section of a project deliverable based on user input.

SECTION TO ENHANCE: ${sectionToEnhance}
CURRENT CONTENT: ${JSON.stringify(currentContent, null, 2)}

ENHANCEMENT QUESTION: ${qa.question}
USER ANSWER: ${qa.answer}

INSTRUCTIONS:
1. Analyze the user's answer and identify specific improvements needed
2. Enhance the current content by incorporating the user's insights
3. Maintain the existing structure but add depth, clarity, and actionable details
4. Focus on making the content more professional, comprehensive, and implementable
5. Return ONLY a JSON object with the enhanced content in the same structure as the input

ENHANCED CONTENT (JSON only):
`

      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4o',
            messages: [
              {
                role: 'system',
                content: 'You are an expert business analyst who enhances project deliverables. Always respond with valid JSON that matches the input structure.'
              },
              {
                role: 'user',
                content: enhancementPrompt
              }
            ],
            temperature: 0.3,
            max_tokens: 2000
          }),
        })

        if (!response.ok) {
          console.error('OpenAI API error:', await response.text())
          continue
        }

        const aiResult = await response.json()
        const enhancedContent = aiResult.choices[0].message.content

        try {
          const parsedContent = JSON.parse(enhancedContent)
          enhancedSections[sectionToEnhance] = parsedContent
          console.log(`Enhanced section: ${sectionToEnhance}`)
        } catch (parseError) {
          console.error('Failed to parse enhanced content:', parseError)
          // Fallback: try to extract JSON from the response
          const jsonMatch = enhancedContent.match(/\{[\s\S]*\}/)
          if (jsonMatch) {
            try {
              const parsedContent = JSON.parse(jsonMatch[0])
              enhancedSections[sectionToEnhance] = parsedContent
            } catch (fallbackError) {
              console.error('Fallback parsing failed:', fallbackError)
            }
          }
        }
      } catch (error) {
        console.error(`Error enhancing section ${sectionToEnhance}:`, error)
      }
    }

    // Merge enhanced sections back into the deliverable
    const enhancedDeliverable = mergeEnhancedSections(deliverable, enhancedSections)

    // Calculate new quality scores
    const qualityAnalysis = analyzeEnhancedQuality(enhancedDeliverable, questionAnswers)

    // Store the enhancement iteration
    const { error: insertError } = await supabase
      .from('enhancement_iterations')
      .insert({
        concept_id: conceptId,
        original_deliverable: deliverable,
        enhanced_deliverable: enhancedDeliverable,
        question_answers: questionAnswers,
        enhanced_sections: Object.keys(enhancedSections),
        quality_improvement: qualityAnalysis.improvement,
        created_at: new Date().toISOString()
      })

    if (insertError) {
      console.error('Failed to store enhancement iteration:', insertError)
    }

    return new Response(
      JSON.stringify({
        enhancedDeliverable,
        enhancedSections: Object.keys(enhancedSections),
        qualityAnalysis,
        improvementSummary: generateImprovementSummary(questionAnswers, enhancedSections)
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Auto-enhancement error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})

function getCurrentSectionContent(deliverable: any, section: string): any {
  const sectionMappings: Record<string, string> = {
    'Project Overview': 'projectOverview',
    'Technical Specification': 'technicalSpecification',
    'Market Analysis': 'marketAnalysis',
    'Implementation Plan': 'implementationPlan',
    'Validation Results': 'validationResults',
    'Next Steps': 'nextSteps',
    'technical': 'technicalSpecification',
    'market': 'marketAnalysis',
    'business': 'implementationPlan',
    'implementation': 'implementationPlan'
  }

  const mappedSection = sectionMappings[section] || section
  return deliverable[mappedSection] || {}
}

function mergeEnhancedSections(originalDeliverable: any, enhancedSections: Record<string, any>): any {
  const enhanced = { ...originalDeliverable }

  for (const [section, content] of Object.entries(enhancedSections)) {
    const sectionMappings: Record<string, string> = {
      'Project Overview': 'projectOverview',
      'Technical Specification': 'technicalSpecification',
      'Market Analysis': 'marketAnalysis',
      'Implementation Plan': 'implementationPlan',
      'Validation Results': 'validationResults',
      'Next Steps': 'nextSteps',
      'technical': 'technicalSpecification',
      'market': 'marketAnalysis',
      'business': 'implementationPlan',
      'implementation': 'implementationPlan'
    }

    const mappedSection = sectionMappings[section] || section
    if (enhanced[mappedSection]) {
      enhanced[mappedSection] = { ...enhanced[mappedSection], ...content }
    }
  }

  return enhanced
}

function analyzeEnhancedQuality(enhancedDeliverable: any, questionAnswers: any[]): any {
  // Simple quality analysis - in a real implementation, this would be more sophisticated
  const baseScore = 60
  const improvementPerQuestion = 8
  const maxScore = 95

  const improvement = Math.min(
    questionAnswers.length * improvementPerQuestion,
    maxScore - baseScore
  )

  return {
    completenessScore: Math.min(95, baseScore + improvement),
    actionabilityScore: Math.min(95, baseScore + improvement * 0.9),
    clarityScore: Math.min(95, baseScore + improvement * 1.1),
    marketReadinessScore: Math.min(95, baseScore + improvement * 0.8),
    improvement: improvement,
    questionsProcessed: questionAnswers.length
  }
}

function generateImprovementSummary(questionAnswers: any[], enhancedSections: Record<string, any>): string {
  const sectionsEnhanced = Object.keys(enhancedSections)
  const categoryCounts = questionAnswers.reduce((acc, qa) => {
    acc[qa.category] = (acc[qa.category] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  let summary = `Enhanced ${sectionsEnhanced.length} sections based on ${questionAnswers.length} answered questions. `
  
  if (categoryCounts.technical) {
    summary += `Improved technical specifications (${categoryCounts.technical} questions). `
  }
  if (categoryCounts.market) {
    summary += `Strengthened market analysis (${categoryCounts.market} questions). `
  }
  if (categoryCounts.business) {
    summary += `Enhanced business planning (${categoryCounts.business} questions). `
  }
  if (categoryCounts.implementation) {
    summary += `Refined implementation approach (${categoryCounts.implementation} questions). `
  }

  return summary
}
