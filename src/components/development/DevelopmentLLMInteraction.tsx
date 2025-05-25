
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { MessageSquare, Brain, Zap } from 'lucide-react'

interface DevelopmentLLMInteractionProps {
  currentIteration: any
}

export default function DevelopmentLLMInteraction({ currentIteration }: DevelopmentLLMInteractionProps) {
  if (!currentIteration) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          Latest LLM Interaction
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="response" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="response">Response</TabsTrigger>
            <TabsTrigger value="prompt">Prompt</TabsTrigger>
            <TabsTrigger value="extracted">Extracted Data</TabsTrigger>
          </TabsList>

          <TabsContent value="response" className="space-y-3">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <MessageSquare className="h-4 w-4 text-green-600" />
                <span className="font-medium text-green-900">AI Generated Content</span>
                <Badge variant="outline">
                  Iteration {currentIteration.iteration}
                </Badge>
              </div>
              <ScrollArea className="h-64">
                <div className="text-sm text-green-800">
                  {currentIteration.response ? (
                    <pre className="whitespace-pre-wrap">
                      {typeof currentIteration.response === 'string' 
                        ? currentIteration.response 
                        : JSON.stringify(currentIteration.response, null, 2)
                      }
                    </pre>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No LLM response available for this iteration
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          </TabsContent>

          <TabsContent value="prompt" className="space-y-3">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-blue-900">Prompt Template Used</span>
              </div>
              <ScrollArea className="h-64">
                <pre className="text-sm text-blue-800 whitespace-pre-wrap">
                  {currentIteration.prompt || 'No prompt data available'}
                </pre>
              </ScrollArea>
            </div>
          </TabsContent>

          <TabsContent value="extracted" className="space-y-3">
            <div className="grid gap-3">
              {currentIteration.extractedComponents && currentIteration.extractedComponents.length > 0 && (
                <div className="p-3 border rounded-lg">
                  <h4 className="font-medium mb-2">Components Identified</h4>
                  <div className="space-y-2">
                    {currentIteration.extractedComponents.map((comp: any, i: number) => (
                      <div key={i} className="p-2 bg-muted/50 rounded text-sm">
                        <strong>{comp.name || `Component ${i + 1}`}:</strong> {comp.description || comp.content}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {currentIteration.extractedResearch && currentIteration.extractedResearch.length > 0 && (
                <div className="p-3 border rounded-lg">
                  <h4 className="font-medium mb-2">Research Findings</h4>
                  <div className="space-y-2">
                    {currentIteration.extractedResearch.map((research: any, i: number) => (
                      <div key={i} className="p-2 bg-muted/50 rounded text-sm">
                        {research.finding || research.content || research}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {(!currentIteration.extractedComponents || currentIteration.extractedComponents.length === 0) &&
               (!currentIteration.extractedResearch || currentIteration.extractedResearch.length === 0) && (
                <div className="text-center py-8 text-muted-foreground">
                  No extracted data available for this iteration
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
