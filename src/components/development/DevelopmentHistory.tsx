
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { MessageSquare, Brain, FileText, CheckCircle2 } from 'lucide-react'

interface DevelopmentHistoryProps {
  session: any
}

export default function DevelopmentHistory({ session }: DevelopmentHistoryProps) {
  if (!session?.history || session.history.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Development History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            No development history available yet. Start development to see LLM interactions.
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Development History ({session.history.length} iterations)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-6">
              {session.history.map((item: any, index: number) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">
                        Iteration {item.iteration || index + 1}
                      </Badge>
                      <Badge className="capitalize">
                        {item.stage || 'Unknown'}
                      </Badge>
                      {item.timestamp && (
                        <span className="text-sm text-muted-foreground">
                          {new Date(item.timestamp).toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>

                  <Tabs defaultValue="overview" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="overview">Overview</TabsTrigger>
                      <TabsTrigger value="prompt">Prompt</TabsTrigger>
                      <TabsTrigger value="response">Response</TabsTrigger>
                      <TabsTrigger value="extracted">Extracted</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-3">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-3 bg-muted/50 rounded">
                          <div className="text-lg font-semibold">
                            {Math.round((item.scores?.completeness || 0) * 100)}%
                          </div>
                          <div className="text-sm text-muted-foreground">Completeness</div>
                        </div>
                        <div className="text-center p-3 bg-muted/50 rounded">
                          <div className="text-lg font-semibold">
                            {Math.round((item.scores?.confidence || 0) * 100)}%
                          </div>
                          <div className="text-sm text-muted-foreground">Confidence</div>
                        </div>
                        <div className="text-center p-3 bg-muted/50 rounded">
                          <div className="text-lg font-semibold">
                            {Math.round((item.scores?.feasibility || 0) * 100)}%
                          </div>
                          <div className="text-sm text-muted-foreground">Feasibility</div>
                        </div>
                        <div className="text-center p-3 bg-muted/50 rounded">
                          <div className="text-lg font-semibold">
                            {Math.round((item.scores?.novelty || 0) * 100)}%
                          </div>
                          <div className="text-sm text-muted-foreground">Novelty</div>
                        </div>
                      </div>

                      {item.summary && (
                        <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                          <h4 className="font-medium text-blue-900 mb-1">Iteration Summary</h4>
                          <p className="text-sm text-blue-800">{item.summary}</p>
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="prompt" className="space-y-3">
                      <div className="p-4 bg-muted rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Brain className="h-4 w-4" />
                          <span className="font-medium">Prompt Sent to LLM</span>
                        </div>
                        <ScrollArea className="h-48">
                          <pre className="text-sm whitespace-pre-wrap">
                            {item.prompt || 'No prompt data available'}
                          </pre>
                        </ScrollArea>
                      </div>
                    </TabsContent>

                    <TabsContent value="response" className="space-y-3">
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <MessageSquare className="h-4 w-4 text-green-600" />
                          <span className="font-medium text-green-900">LLM Response</span>
                        </div>
                        <ScrollArea className="h-64">
                          <div className="text-sm">
                            {item.response ? (
                              <pre className="whitespace-pre-wrap text-green-800">
                                {typeof item.response === 'string' 
                                  ? item.response 
                                  : JSON.stringify(item.response, null, 2)
                                }
                              </pre>
                            ) : (
                              <span className="text-green-700">No response data available</span>
                            )}
                          </div>
                        </ScrollArea>
                      </div>
                    </TabsContent>

                    <TabsContent value="extracted" className="space-y-3">
                      <div className="grid gap-3">
                        {item.extractedComponents && (
                          <div className="p-3 border rounded">
                            <div className="flex items-center gap-2 mb-2">
                              <CheckCircle2 className="h-4 w-4 text-blue-600" />
                              <span className="font-medium">Components</span>
                              <Badge variant="secondary">{item.extractedComponents.length}</Badge>
                            </div>
                            <div className="text-sm space-y-1">
                              {item.extractedComponents.map((comp: any, i: number) => (
                                <div key={i} className="p-2 bg-muted/50 rounded">
                                  <strong>{comp.name || `Component ${i + 1}`}:</strong> {comp.description || comp.content}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {item.extractedResearch && (
                          <div className="p-3 border rounded">
                            <div className="flex items-center gap-2 mb-2">
                              <FileText className="h-4 w-4 text-purple-600" />
                              <span className="font-medium">Research</span>
                              <Badge variant="secondary">{item.extractedResearch.length}</Badge>
                            </div>
                            <div className="text-sm space-y-1">
                              {item.extractedResearch.map((research: any, i: number) => (
                                <div key={i} className="p-2 bg-muted/50 rounded">
                                  {research.finding || research.content || research}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {item.extractedValidations && (
                          <div className="p-3 border rounded">
                            <div className="flex items-center gap-2 mb-2">
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                              <span className="font-medium">Validations</span>
                              <Badge variant="secondary">{item.extractedValidations.length}</Badge>
                            </div>
                            <div className="text-sm space-y-1">
                              {item.extractedValidations.map((validation: any, i: number) => (
                                <div key={i} className="p-2 bg-muted/50 rounded">
                                  {validation.result || validation.content || validation}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {item.extractedRefinements && (
                          <div className="p-3 border rounded">
                            <div className="flex items-center gap-2 mb-2">
                              <Brain className="h-4 w-4 text-orange-600" />
                              <span className="font-medium">Refinements</span>
                              <Badge variant="secondary">{item.extractedRefinements.length}</Badge>
                            </div>
                            <div className="text-sm space-y-1">
                              {item.extractedRefinements.map((refinement: any, i: number) => (
                                <div key={i} className="p-2 bg-muted/50 rounded">
                                  {refinement.improvement || refinement.content || refinement}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </TabsContent>
                  </Tabs>

                  {index < session.history.length - 1 && (
                    <Separator className="mt-6" />
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
