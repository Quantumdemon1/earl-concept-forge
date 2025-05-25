
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
    markdown += `## Development History\n\n`
    data.development_history.forEach((session: any) => {
      markdown += `### Session ${session.id}\n\n`
      markdown += `**Stage**: ${session.stage}\n\n`
      markdown += `**Iterations**: ${session.iteration_count}\n\n`
      markdown += `**Scores**:\n`
      markdown += `- Completeness: ${Math.round(session.completeness_score * 100)}%\n`
      markdown += `- Confidence: ${Math.round(session.confidence_score * 100)}%\n`
      markdown += `- Feasibility: ${Math.round(session.feasibility_score * 100)}%\n`
      markdown += `- Novelty: ${Math.round(session.novelty_score * 100)}%\n\n`
    })
  }
  
  if (data.implementation_plan) {
    markdown += `## Implementation Plan\n\n`
    markdown += `**Current Stage**: ${data.implementation_plan.stage}\n\n`
    markdown += `**Progress**: ${data.implementation_plan.iteration_count} iterations completed\n\n`
  }
  
  if (data.earl_analysis?.length > 0) {
    markdown += `## EARL Analysis Results\n\n`
    data.earl_analysis.forEach((analysis: any, index: number) => {
      markdown += `### Analysis ${index + 1}\n\n`
      markdown += `**Stage**: ${analysis.stage}\n\n`
      markdown += `**Version**: ${analysis.version}\n\n`
      if (analysis.confidence_scores) {
        markdown += `**Confidence Scores**: ${JSON.stringify(analysis.confidence_scores)}\n\n`
      }
    })
  }
  
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
    },
    exported_at: new Date().toISOString(),
  }
  
  if (includeOptions.overview) {
    compiledData.overview = concept
  }
  
  if (includeOptions.earlAnalysis && exportData?.analyses) {
    compiledData.earl_analysis = exportData.analyses
  }
  
  if (includeOptions.developmentHistory && exportData?.development) {
    compiledData.development_history = exportData.development
  }
  
  if (includeOptions.implementationPlan) {
    // Extract implementation plan from latest development
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
      }
    }
  }
  
  if (includeOptions.visualizations && exportData?.visualizations) {
    compiledData.visualizations = exportData.visualizations
  }
  
  return compiledData
}
