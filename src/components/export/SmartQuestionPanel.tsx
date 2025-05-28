
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { Brain, Target, Clock, TrendingUp, Loader2, CheckCircle } from 'lucide-react'
import type { SmartQuestion, QuestionPrioritizationResult } from '@/services/smartQuestionService'

interface SmartQuestionPanelProps {
  smartQuestions: QuestionPrioritizationResult | null
  isLoading: boolean
  answeredQuestions: Array<{ questionId: string; answer: string; category: string }>
  onAnswerQuestion: (questionId: string, answer: string) => void
  isProcessingQuestion: (questionId: string) => boolean
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
  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null)
  const [currentAnswer, setCurrentAnswer] = useState('')

  const answeredIds = new Set(answeredQuestions.map(q => q.questionId))

  const handleSubmitAnswer = async (questionId: string) => {
    if (!currentAnswer.trim()) return

    await onAnswerQuestion(questionId, currentAnswer)
    setActiveQuestionId(null)
    setCurrentAnswer('')
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'hard': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'technical': return '⚙️'
      case 'market': return '📊'
      case 'business': return '💼'
      case 'implementation': return '🚀'
      default: return '❓'
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Analyzing and prioritizing questions...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!smartQuestions) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-gray-500">
          Failed to load smart questions. Please try again.
        </CardContent>
      </Card>
    )
  }

  const { prioritizedQuestions, nextBestQuestion, completionStrategy, estimatedTimeToComplete } = smartQuestions

  return (
    <div className="space-y-6">
      {/* Strategy Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Smart Enhancement Strategy
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-blue-600" />
              <div>
                <div className="font-medium text-sm">Next Best Question</div>
                <div className="text-xs text-gray-600">
                  {nextBestQuestion ? `${getCategoryIcon(nextBestQuestion.category)} ${nextBestQuestion.category}` : 'All complete'}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-green-600" />
              <div>
                <div className="font-medium text-sm">Est. Time</div>
                <div className="text-xs text-gray-600">{estimatedTimeToComplete} minutes</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-purple-600" />
              <div>
                <div className="font-medium text-sm">Progress</div>
                <div className="text-xs text-gray-600">
                  {answeredQuestions.length} / {Math.min(10, prioritizedQuestions.length)} answered
                </div>
              </div>
            </div>
          </div>
          
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span>Enhancement Progress</span>
              <span>{Math.round((answeredQuestions.length / Math.min(10, prioritizedQuestions.length)) * 100)}%</span>
            </div>
            <Progress value={(answeredQuestions.length / Math.min(10, prioritizedQuestions.length)) * 100} />
          </div>

          <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
            <strong>Strategy:</strong> {completionStrategy}
          </p>
        </CardContent>
      </Card>

      {/* Next Best Question Highlight */}
      {nextBestQuestion && !answeredIds.has(nextBestQuestion.id) && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-600" />
                <span className="text-blue-900">Recommended Next Question</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={getDifficultyColor(nextBestQuestion.difficultyLevel)}>
                  {nextBestQuestion.difficultyLevel}
                </Badge>
                <Badge variant="outline">
                  Score: {nextBestQuestion.score}
                </Badge>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{getCategoryIcon(nextBestQuestion.category)}</span>
                  <Badge variant="outline">{nextBestQuestion.category}</Badge>
                  <Badge variant="outline" className="text-xs">
                    {nextBestQuestion.estimatedImpact}% impact
                  </Badge>
                </div>
                <p className="font-medium text-blue-900 mb-2">{nextBestQuestion.question}</p>
                <p className="text-sm text-blue-700 mb-3">
                  <strong>Why this matters:</strong> {nextBestQuestion.reasoning}
                </p>
              </div>

              {activeQuestionId === nextBestQuestion.id ? (
                <div className="space-y-3">
                  <Textarea
                    placeholder="Enter your detailed answer..."
                    value={currentAnswer}
                    onChange={(e) => setCurrentAnswer(e.target.value)}
                    rows={4}
                    className="bg-white"
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleSubmitAnswer(nextBestQuestion.id)}
                      disabled={!currentAnswer.trim() || isProcessingQuestion(nextBestQuestion.id)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {isProcessingQuestion(nextBestQuestion.id) ? (
                        <>
                          <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        'Submit & Enhance'
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setActiveQuestionId(null)
                        setCurrentAnswer('')
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  onClick={() => setActiveQuestionId(nextBestQuestion.id)}
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={isProcessing}
                >
                  Answer This Question
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Prioritized Questions */}
      <Card>
        <CardHeader>
          <CardTitle>All Enhancement Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {prioritizedQuestions.slice(0, 10).map((question) => {
              const isAnswered = answeredIds.has(question.id)
              const isActive = activeQuestionId === question.id
              const isProcessingThis = isProcessingQuestion(question.id)

              return (
                <div
                  key={question.id}
                  className={`p-4 border rounded-lg ${
                    isAnswered ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {isAnswered && <CheckCircle className="h-4 w-4 text-green-600" />}
                        <span className="text-lg">{getCategoryIcon(question.category)}</span>
                        <Badge variant="outline">{question.category}</Badge>
                        <Badge className={getDifficultyColor(question.difficultyLevel)}>
                          {question.difficultyLevel}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          Score: {question.score}
                        </Badge>
                      </div>
                      <p className="font-medium text-sm mb-1">{question.question}</p>
                      <p className="text-xs text-gray-500">{question.reasoning}</p>
                    </div>
                  </div>

                  {!isAnswered && (
                    <>
                      {isActive ? (
                        <div className="space-y-3">
                          <Textarea
                            placeholder="Enter your detailed answer..."
                            value={currentAnswer}
                            onChange={(e) => setCurrentAnswer(e.target.value)}
                            rows={3}
                          />
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleSubmitAnswer(question.id)}
                              disabled={!currentAnswer.trim() || isProcessingThis}
                            >
                              {isProcessingThis ? (
                                <>
                                  <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                  Processing...
                                </>
                              ) : (
                                'Submit Answer'
                              )}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setActiveQuestionId(null)
                                setCurrentAnswer('')
                              }}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setActiveQuestionId(question.id)}
                          disabled={isProcessing}
                        >
                          Answer Question
                        </Button>
                      )}
                    </>
                  )}

                  {isAnswered && (
                    <div className="mt-2 p-2 bg-green-100 rounded text-sm">
                      <strong>Answered:</strong> {answeredQuestions.find(a => a.questionId === question.id)?.answer.substring(0, 100)}...
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
