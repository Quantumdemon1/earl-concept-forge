
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import DeliverableQualityDashboard from './DeliverableQualityDashboard'
import EnhancementSuggestions from './EnhancementSuggestions'
import SmartQuestionPanel from './SmartQuestionPanel'
import ExportActionsCard from './ExportActionsCard'
import type { CompiledDeliverable } from '@/services/deliverableCompiler'
import type { GapAnalysisResult } from '@/services/gapAnalysisService'
import type { EnhancementQuestion } from '@/services/gapAnalysisService'

interface WorkflowTabsContentProps {
  activeTab: string
  onTabChange: (value: string) => void
  compiledDeliverable: CompiledDeliverable
  gapAnalysis: GapAnalysisResult
  enhancementQuestions: EnhancementQuestion[]
  conceptName: string
  smartQuestions: any
  isLoadingSmartQuestions: boolean
  answeredQuestions: Array<{
    questionId: string
    answer: string
    category: string
  }>
  appliedEnhancements: string[]
  onAnswerQuestion: (questionId: string, answer: string) => Promise<void>
  onApplyEnhancement: (enhancement: any) => void
  isQuestionProcessing: (questionId: string) => boolean
  isProcessing: boolean
  onRecompile: () => void
  onExport: () => void
  isRecompiling: boolean
  isExporting: boolean
  overallReadiness: number
}

export default function WorkflowTabsContent({
  activeTab,
  onTabChange,
  compiledDeliverable,
  gapAnalysis,
  enhancementQuestions,
  conceptName,
  smartQuestions,
  isLoadingSmartQuestions,
  answeredQuestions,
  appliedEnhancements,
  onAnswerQuestion,
  onApplyEnhancement,
  isQuestionProcessing,
  isProcessing,
  onRecompile,
  onExport,
  isRecompiling,
  isExporting,
  overallReadiness
}: WorkflowTabsContentProps) {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange}>
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="overview">Quality Overview</TabsTrigger>
        <TabsTrigger value="smart-questions">
          Smart Questions
          {smartQuestions?.nextBestQuestion && (
            <Badge className="ml-1 h-4 w-4 p-0 text-xs">!</Badge>
          )}
        </TabsTrigger>
        <TabsTrigger value="enhancement">Manual Enhancements</TabsTrigger>
        <TabsTrigger value="export">Export Options</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-4">
        <DeliverableQualityDashboard
          qualityAnalysis={gapAnalysis.qualityAnalysis}
          gapAnalysis={gapAnalysis}
          conceptName={conceptName}
        />
      </TabsContent>

      <TabsContent value="smart-questions" className="space-y-4">
        <SmartQuestionPanel
          smartQuestions={smartQuestions}
          isLoading={isLoadingSmartQuestions}
          answeredQuestions={answeredQuestions}
          onAnswerQuestion={onAnswerQuestion}
          isProcessingQuestion={smartQuestions?.nextBestQuestion ? isQuestionProcessing(smartQuestions.nextBestQuestion.id) : false}
          isProcessing={isProcessing}
        />
      </TabsContent>

      <TabsContent value="enhancement" className="space-y-4">
        <EnhancementSuggestions
          suggestions={gapAnalysis.qualityAnalysis.suggestions}
          questions={enhancementQuestions}
          onApplySuggestion={onApplyEnhancement}
          onAnswerQuestion={onAnswerQuestion}
        />
        
        {appliedEnhancements.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Applied Enhancements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {appliedEnhancements.map((enhancement, index) => (
                  <Badge key={index} variant="outline">
                    {enhancement}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </TabsContent>

      <TabsContent value="export" className="space-y-4">
        <ExportActionsCard
          onRecompile={onRecompile}
          onExport={onExport}
          isRecompiling={isRecompiling}
          isExporting={isExporting}
          overallReadiness={overallReadiness}
          smartQuestions={smartQuestions}
        />
      </TabsContent>
    </Tabs>
  )
}
