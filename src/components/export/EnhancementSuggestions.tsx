
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Lightbulb, MessageSquare } from 'lucide-react'
import type { EnhancementSuggestion } from '@/services/deliverableEnhancer'
import type { EnhancementQuestion } from '@/services/gapAnalysisService'

interface EnhancementSuggestionsProps {
  suggestions: EnhancementSuggestion[]
  questions: EnhancementQuestion[]
  onApplySuggestion: (suggestion: EnhancementSuggestion) => void
  onAnswerQuestion: (questionId: string, answer: string) => void
}

export default function EnhancementSuggestions({
  suggestions,
  questions,
  onApplySuggestion,
  onAnswerQuestion
}: EnhancementSuggestionsProps) {
  const [answers, setAnswers] = React.useState<Record<string, string>>({})

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }))
  }

  const handleSubmitAnswer = (questionId: string) => {
    const answer = answers[questionId]
    if (answer?.trim()) {
      onAnswerQuestion(questionId, answer)
      setAnswers(prev => ({ ...prev, [questionId]: '' }))
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive'
      case 'medium': return 'secondary'
      case 'low': return 'outline'
      default: return 'outline'
    }
  }

  return (
    <div className="space-y-4">
      {suggestions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5" />
              Enhancement Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {suggestions.slice(0, 5).map((suggestion, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h4 className="font-medium">{suggestion.section}</h4>
                    <p className="text-sm text-muted-foreground">{suggestion.suggestion}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={getPriorityColor(suggestion.priority)}>
                      {suggestion.priority}
                    </Badge>
                    <Button
                      size="sm"
                      onClick={() => onApplySuggestion(suggestion)}
                    >
                      Apply
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {questions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Enhancement Questions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {questions.slice(0, 3).map((question) => (
              <div key={question.id} className="border rounded-lg p-4 space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant={getPriorityColor(question.priority)}>
                      {question.priority}
                    </Badge>
                    <Badge variant="outline">{question.category}</Badge>
                  </div>
                  <h4 className="font-medium">{question.question}</h4>
                  <p className="text-sm text-muted-foreground">{question.purpose}</p>
                </div>
                <div className="space-y-2">
                  <Textarea
                    placeholder="Enter your answer..."
                    value={answers[question.id] || ''}
                    onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                    rows={3}
                  />
                  <Button
                    size="sm"
                    onClick={() => handleSubmitAnswer(question.id)}
                    disabled={!answers[question.id]?.trim()}
                  >
                    Submit Answer
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
