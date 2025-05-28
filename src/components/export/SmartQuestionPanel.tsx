
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { Brain, Zap, Clock, Target } from 'lucide-react'

interface SmartQuestionPanelProps {
  smartQuestions: any
  isLoading: boolean
  answeredQuestions: Array<{
    questionId: string
    answer: string
    category: string
  }>
  onAnswerQuestion: (questionId: string, answer: string) => void
  isProcessingQuestion: boolean
  isProcessing: boolean
}

export default function SmartQuestionPanel({
  smartQuestions,
  isLoading,
  answeredQuestions,
  onAnswerQuestion,
  isProcessingQuestion,
  isProcessing
}: SmartQuestionPanelProps) {
  const [currentAnswer, setCurrentAnswer] = React.useState('')

  const handleSubmitAnswer = () => {
    if (smartQuestions?.nextBestQuestion && currentAnswer.trim()) {
      onAnswerQuestion(smartQuestions.nextBestQuestion.id, currentAnswer)
      setCurrentAnswer('')
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 animate-pulse" />
            <span>Analyzing smart questions...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!smartQuestions) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center space-y-2">
            <Brain className="h-8 w-8 mx-auto text-muted-foreground" />
            <p className="text-muted-foreground">No smart questions available</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Smart Enhancement Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Questions Answered</span>
            <span className="text-sm text-muted-foreground">
              {answeredQuestions.length} / {smartQuestions.totalQuestions || 10}
            </span>
          </div>
          <Progress 
            value={(answeredQuestions.length / (smartQuestions.totalQuestions || 10)) * 100} 
            className="h-2" 
          />
          
          {smartQuestions.completionStrategy && (
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Strategy:</strong> {smartQuestions.completionStrategy}
              </p>
              {smartQuestions.estimatedTimeToComplete && (
                <p className="text-xs text-blue-600 mt-1">
                  <Clock className="inline h-3 w-3 mr-1" />
                  Estimated time: {smartQuestions.estimatedTimeToComplete} minutes
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Next Best Question */}
      {smartQuestions.nextBestQuestion && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              Next Best Question
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="default">{smartQuestions.nextBestQuestion.priority}</Badge>
                <Badge variant="outline">{smartQuestions.nextBestQuestion.category}</Badge>
              </div>
              <h4 className="font-medium">{smartQuestions.nextBestQuestion.question}</h4>
              <p className="text-sm text-muted-foreground">
                {smartQuestions.nextBestQuestion.purpose}
              </p>
            </div>
            
            <div className="space-y-3">
              <Textarea
                placeholder="Enter your detailed answer..."
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                rows={4}
                disabled={isProcessingQuestion}
              />
              <Button
                onClick={handleSubmitAnswer}
                disabled={!currentAnswer.trim() || isProcessingQuestion}
                className="flex items-center gap-2"
              >
                {isProcessingQuestion ? (
                  <>
                    <Brain className="h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4" />
                    Submit & Enhance
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Answered Questions Summary */}
      {answeredQuestions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Answers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {answeredQuestions.slice(-3).map((qa, index) => (
                <div key={index} className="border-l-2 border-green-200 pl-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className="text-xs">
                      {qa.category}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {qa.answer.substring(0, 100)}
                    {qa.answer.length > 100 ? '...' : ''}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
