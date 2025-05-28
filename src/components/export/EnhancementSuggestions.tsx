
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Lightbulb, MessageSquare, Check, X } from 'lucide-react'
import type { EnhancementSuggestion } from '@/services/deliverableEnhancer'
import type { EnhancementQuestion } from '@/services/gapAnalysisService'

interface EnhancementSuggestionsProps {
  suggestions: EnhancementSuggestion[]
  questions: EnhancementQuestion[]
  onApplySuggestion?: (suggestion: EnhancementSuggestion) => void
  onAnswerQuestion?: (questionId: string, answer: string) => void
}

export default function EnhancementSuggestions({
  suggestions,
  questions,
  onApplySuggestion,
  onAnswerQuestion
}: EnhancementSuggestionsProps) {
  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null)
  const [questionAnswer, setQuestionAnswer] = useState('')
  const [appliedSuggestions, setAppliedSuggestions] = useState<Set<string>>(new Set())

  const handleApplySuggestion = (suggestion: EnhancementSuggestion) => {
    setAppliedSuggestions(prev => new Set([...prev, suggestion.section + suggestion.issue]))
    onApplySuggestion?.(suggestion)
  }

  const handleSubmitAnswer = (questionId: string) => {
    if (questionAnswer.trim()) {
      onAnswerQuestion?.(questionId, questionAnswer)
      setActiveQuestionId(null)
      setQuestionAnswer('')
    }
  }

  const getPriorityColor = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200'
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'technical': return 'bg-purple-100 text-purple-800'
      case 'market': return 'bg-green-100 text-green-800'
      case 'business': return 'bg-orange-100 text-orange-800'
      case 'implementation': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {suggestions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5" />
              Enhancement Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {suggestions.slice(0, 6).map((suggestion, index) => {
                const suggestionKey = suggestion.section + suggestion.issue
                const isApplied = appliedSuggestions.has(suggestionKey)
                
                return (
                  <div
                    key={index}
                    className={`p-4 border rounded-lg ${isApplied ? 'bg-green-50 border-green-200' : 'bg-white'}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className={getPriorityColor(suggestion.priority)}>
                            {suggestion.priority}
                          </Badge>
                          <span className="font-medium text-sm">{suggestion.section}</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{suggestion.issue}</p>
                        <p className="text-sm">{suggestion.suggestion}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {isApplied ? (
                          <div className="flex items-center gap-1 text-green-600">
                            <Check className="h-4 w-4" />
                            <span className="text-xs">Applied</span>
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleApplySuggestion(suggestion)}
                          >
                            Apply
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
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
          <CardContent>
            <div className="space-y-4">
              {questions.slice(0, 5).map((question) => (
                <div key={question.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={getCategoryColor(question.category)}>
                          {question.category}
                        </Badge>
                        <Badge variant="outline" className={getPriorityColor(question.priority)}>
                          {question.priority}
                        </Badge>
                      </div>
                      <p className="font-medium text-sm mb-1">{question.question}</p>
                      <p className="text-xs text-gray-500">{question.purpose}</p>
                    </div>
                  </div>

                  {activeQuestionId === question.id ? (
                    <div className="space-y-3">
                      <Textarea
                        placeholder="Enter your answer..."
                        value={questionAnswer}
                        onChange={(e) => setQuestionAnswer(e.target.value)}
                        rows={3}
                      />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleSubmitAnswer(question.id)}
                          disabled={!questionAnswer.trim()}
                        >
                          Submit Answer
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setActiveQuestionId(null)
                            setQuestionAnswer('')
                          }}
                        >
                          <X className="h-3 w-3 mr-1" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setActiveQuestionId(question.id)}
                    >
                      Answer Question
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
