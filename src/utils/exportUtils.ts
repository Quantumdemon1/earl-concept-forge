
export const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export const exportJSON = (data: any, filename: string) => {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json',
  })
  downloadBlob(blob, `${filename.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`)
}

export const exportMarkdown = (data: any, filename: string) => {
  let markdown = `# ${data.concept.name}\n\n`
  markdown += `${data.concept.description}\n\n`
  
  if (data.overview) {
    markdown += `## Overview\n\n`
    markdown += `**Status**: ${data.concept.status}\n\n`
    if (data.concept.domains?.length > 0) {
      markdown += `**Domains**: ${data.concept.domains.join(', ')}\n\n`
    }
    markdown += `**Created**: ${new Date(data.concept.created_at).toLocaleDateString()}\n\n`
  }
  
  if (data.development_history?.length > 0) {
    markdown += `## AI Development Sessions\n\n`
    data.development_history.forEach((session: any, sessionIndex: number) => {
      markdown += `### Development Session ${sessionIndex + 1}\n\n`
      markdown += `**Session ID**: ${session.id}\n\n`
      markdown += `**Stage**: ${session.stage}\n\n`
      markdown += `**Iterations**: ${session.iteration_count}\n\n`
      markdown += `**Started**: ${new Date(session.started_at).toLocaleDateString()}\n\n`
      if (session.completed_at) {
        markdown += `**Completed**: ${new Date(session.completed_at).toLocaleDateString()}\n\n`
      }
      
      markdown += `**Quality Scores**:\n`
      markdown += `- Completeness: ${Math.round((session.completeness_score || 0) * 100)}%\n`
      markdown += `- Confidence: ${Math.round((session.confidence_score || 0) * 100)}%\n`
      markdown += `- Feasibility: ${Math.round((session.feasibility_score || 0) * 100)}%\n`
      markdown += `- Novelty: ${Math.round((session.novelty_score || 0) * 100)}%\n\n`
      
      if (session.config && Object.keys(session.config).length > 0) {
        markdown += `**Configuration**:\n`
        markdown += `\`\`\`json\n${JSON.stringify(session.config, null, 2)}\n\`\`\`\n\n`
      }
      
      // Include detailed LLM interactions
      if (session.llm_interactions && session.llm_interactions.length > 0) {
        markdown += `#### LLM Interactions\n\n`
        session.llm_interactions.forEach((interaction: any, index: number) => {
          markdown += `##### Iteration ${interaction.iteration || index + 1}\n\n`
          markdown += `**Stage**: ${interaction.stage}\n\n`
          markdown += `**Timestamp**: ${new Date(interaction.timestamp).toLocaleString()}\n\n`
          
          if (interaction.scores) {
            markdown += `**Quality Scores**:\n`
            Object.entries(interaction.scores).forEach(([key, value]) => {
              markdown += `- ${key.charAt(0).toUpperCase() + key.slice(1)}: ${Math.round((value as number) * 100)}%\n`
            })
            markdown += `\n`
          }
          
          if (interaction.prompt) {
            markdown += `**Prompt Used**:\n`
            markdown += `\`\`\`\n${interaction.prompt}\n\`\`\`\n\n`
          }
          
          if (interaction.response) {
            markdown += `**LLM Response**:\n`
            if (typeof interaction.response === 'string') {
              markdown += `${interaction.response}\n\n`
            } else {
              markdown += `\`\`\`json\n${JSON.stringify(interaction.response, null, 2)}\n\`\`\`\n\n`
            }
          }
          
          if (interaction.extractedComponents && interaction.extractedComponents.length > 0) {
            markdown += `**Extracted Components**:\n`
            interaction.extractedComponents.forEach((comp: any, i: number) => {
              markdown += `${i + 1}. **${comp.name || `Component ${i + 1}`}**: ${comp.description || comp.content || 'No description'}\n`
            })
            markdown += `\n`
          }
          
          if (interaction.extractedResearch && interaction.extractedResearch.length > 0) {
            markdown += `**Research Findings**:\n`
            interaction.extractedResearch.forEach((research: any, i: number) => {
              const finding = research.finding || research.content || research
              markdown += `${i + 1}. ${finding}\n`
            })
            markdown += `\n`
          }
          
          if (interaction.extractedValidations && interaction.extractedValidations.length > 0) {
            markdown += `**Validation Results**:\n`
            interaction.extractedValidations.forEach((validation: any, i: number) => {
              const result = validation.result || validation.content || validation
              markdown += `${i + 1}. ${result}\n`
            })
            markdown += `\n`
          }
          
          if (interaction.extractedRefinements && interaction.extractedRefinements.length > 0) {
            markdown += `**Refinements Made**:\n`
            interaction.extractedRefinements.forEach((refinement: any, i: number) => {
              const improvement = refinement.improvement || refinement.content || refinement
              markdown += `${i + 1}. ${improvement}\n`
            })
            markdown += `\n`
          }
          
          if (interaction.summary) {
            markdown += `**Summary**: ${interaction.summary}\n\n`
          }
          
          markdown += `---\n\n`
        })
      }
      
      markdown += `\n`
    })
  }
  
  if (data.implementation_plan) {
    markdown += `## Implementation Plan\n\n`
    markdown += `**Current Stage**: ${data.implementation_plan.stage}\n\n`
    markdown += `**Progress**: ${data.implementation_plan.iteration_count} iterations completed\n\n`
    
    if (data.implementation_plan.scores) {
      markdown += `**Final Quality Scores**:\n`
      Object.entries(data.implementation_plan.scores).forEach(([key, value]) => {
        markdown += `- ${key.charAt(0).toUpperCase() + key.slice(1)}: ${Math.round((value as number) * 100)}%\n`
      })
      markdown += `\n`
    }
    
    if (data.implementation_plan.config) {
      markdown += `**Development Configuration**:\n`
      markdown += `\`\`\`json\n${JSON.stringify(data.implementation_plan.config, null, 2)}\n\`\`\`\n\n`
    }
  }
  
  if (data.earl_analysis?.length > 0) {
    markdown += `## EARL Analysis Results\n\n`
    data.earl_analysis.forEach((analysis: any, index: number) => {
      markdown += `### Analysis ${index + 1}\n\n`
      markdown += `**Stage**: ${analysis.stage}\n\n`
      markdown += `**Version**: ${analysis.version}\n\n`
      markdown += `**Created**: ${new Date(analysis.created_at).toLocaleDateString()}\n\n`
      
      if (analysis.confidence_scores) {
        markdown += `**Confidence Scores**:\n`
        Object.entries(analysis.confidence_scores).forEach(([key, value]) => {
          markdown += `- ${key}: ${value}\n`
        })
        markdown += `\n`
      }
      
      if (analysis.evaluation_output) {
        markdown += `**Evaluation Output**:\n`
        markdown += `\`\`\`json\n${JSON.stringify(analysis.evaluation_output, null, 2)}\n\`\`\`\n\n`
      }
      
      if (analysis.analysis_output) {
        markdown += `**Analysis Output**:\n`
        markdown += `\`\`\`json\n${JSON.stringify(analysis.analysis_output, null, 2)}\n\`\`\`\n\n`
      }
      
      if (analysis.refinement_output) {
        markdown += `**Refinement Output**:\n`
        markdown += `\`\`\`json\n${JSON.stringify(analysis.refinement_output, null, 2)}\n\`\`\`\n\n`
      }
      
      if (analysis.reiteration_output) {
        markdown += `**Reiteration Output**:\n`
        markdown += `\`\`\`json\n${JSON.stringify(analysis.reiteration_output, null, 2)}\n\`\`\`\n\n`
      }
    })
  }
  
  if (data.visualizations?.length > 0) {
    markdown += `## Visualizations\n\n`
    data.visualizations.forEach((viz: any, index: number) => {
      markdown += `### ${viz.type} - ${viz.stage}\n\n`
      markdown += `**Created**: ${new Date(viz.created_at).toLocaleDateString()}\n\n`
      if (viz.metadata) {
        markdown += `**Metadata**:\n`
        markdown += `\`\`\`json\n${JSON.stringify(viz.metadata, null, 2)}\n\`\`\`\n\n`
      }
      markdown += `**Data**:\n`
      markdown += `\`\`\`json\n${JSON.stringify(viz.data, null, 2)}\n\`\`\`\n\n`
    })
  }
  
  markdown += `\n---\n\n`
  markdown += `*Exported from Lovable AI Concept Development Platform on ${new Date().toLocaleDateString()}*\n`
  
  const blob = new Blob([markdown], { type: 'text/markdown' })
  downloadBlob(blob, `${filename.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`)
}

export const exportPDF = async (data: any, filename: string, toast: any) => {
  // PDF export would require a library like jsPDF or similar
  // For now, we'll export as markdown and show a message
  exportMarkdown(data, filename)
  toast({
    title: 'PDF Export',
    description: 'PDF export is not yet available. Exported as Markdown instead.',
  })
}

export const compileExportData = (concept: any, exportData: any, includeOptions: any) => {
  const compiledData: any = {
    concept: {
      id: concept.id,
      name: concept.name,
      description: concept.description,
      domains: concept.domains,
      status: concept.status,
      created_at: concept.created_at,
      updated_at: concept.updated_at,
    },
    exported_at: new Date().toISOString(),
    export_options: includeOptions,
  }
  
  if (includeOptions.overview) {
    compiledData.overview = concept
  }
  
  if (includeOptions.earlAnalysis && exportData?.analyses) {
    compiledData.earl_analysis = exportData.analyses
  }
  
  if (includeOptions.developmentHistory && exportData?.development) {
    // Include complete development session data with all LLM interactions
    compiledData.development_history = exportData.development.map((session: any) => ({
      id: session.id,
      concept_id: session.concept_id,
      stage: session.stage,
      iteration_count: session.iteration_count,
      started_at: session.started_at,
      completed_at: session.completed_at,
      is_active: session.is_active,
      completeness_score: session.completeness_score,
      confidence_score: session.confidence_score,
      feasibility_score: session.feasibility_score,
      novelty_score: session.novelty_score,
      config: session.config,
      llm_interactions: session.llm_interactions || [],
      created_at: session.created_at,
      updated_at: session.updated_at,
    }))
  }
  
  if (includeOptions.implementationPlan) {
    // Extract implementation plan from latest development session
    const latestDev = exportData?.development?.[0]
    if (latestDev) {
      compiledData.implementation_plan = {
        session_id: latestDev.id,
        stage: latestDev.stage,
        iteration_count: latestDev.iteration_count,
        scores: {
          completeness: latestDev.completeness_score,
          confidence: latestDev.confidence_score,
          feasibility: latestDev.feasibility_score,
          novelty: latestDev.novelty_score,
        },
        config: latestDev.config,
        final_llm_interactions: latestDev.llm_interactions || [],
        development_summary: {
          total_iterations: latestDev.iteration_count,
          stages_completed: latestDev.llm_interactions?.map((i: any) => i.stage).filter((s: any, i: number, arr: any[]) => arr.indexOf(s) === i) || [],
          final_stage: latestDev.stage,
        },
      }
    }
  }
  
  if (includeOptions.visualizations && exportData?.visualizations) {
    compiledData.visualizations = exportData.visualizations
  }
  
  return compiledData
}
