
import { useMemo } from 'react'
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { MessageSquare, Brain, Zap } from 'lucide-react'

interface DevelopmentProgressProps {
  session: any
}

export default function DevelopmentProgress({ session }: DevelopmentProgressProps) {
  const radarData = useMemo(() => {
    if (!session) return []
    
    return [
      {
        metric: 'Completeness',
        value: session.scores.completeness * 100,
        fullMark: 100,
      },
      {
        metric: 'Confidence',
        value: session.scores.confidence * 100,
        fullMark: 100,
      },
      {
        metric: 'Feasibility',
        value: session.scores.feasibility * 100,
        fullMark: 100,
      },
      {
        metric: 'Novelty',
        value: session.scores.novelty * 100,
        fullMark: 100,
      },
    ]
  }, [session])
  
  const progressData = useMemo(() => {
    if (!session?.history) return []
    
    return session.history.map((item: any, index: number) => ({
      iteration: index + 1,
      completeness: (item.scores?.completeness || 0) * 100,
      confidence: (item.scores?.confidence || 0) * 100,
      feasibility: (item.scores?.feasibility || 0) * 100,
      novelty: (item.scores?.novelty || 0) * 100,
    }))
  }, [session?.history])

  const currentIteration = session?.history?.[session.history.length - 1]
  
  if (!session) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Development Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              No active development session. Start development to see progress.
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }
  
  return (
    <div className="space-y-6">
      {/* Current Status */}
      <Card>
        <CardHeader>
          <CardTitle>Current Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="text-sm">
              Stage: {session.stage}
            </Badge>
            <Badge variant="outline" className="text-sm">
              Iteration: {session.iteration}
            </Badge>
            <Badge 
              variant={session.isActive ? "default" : "secondary"}
              className="text-sm"
            >
              {session.isActive ? 'Active' : 'Paused'}
            </Badge>
          </div>
          
          <div className="mt-4">
            <p className="text-sm text-muted-foreground">
              {getStageDescription(session.stage)}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Current LLM Interaction */}
      {currentIteration && (
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
                      Iteration {currentIteration.iteration || session.iteration}
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
      )}
      
      {/* Quality Metrics Radar */}
      <Card>
        <CardHeader>
          <CardTitle>Current Quality Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="metric" />
              <PolarRadiusAxis 
                angle={90} 
                domain={[0, 100]} 
                tick={false}
              />
              <Radar
                name="Quality"
                dataKey="value"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.3}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      
      {/* Progress Over Time */}
      {progressData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Progress Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="iteration" 
                  label={{ value: 'Iteration', position: 'insideBottom', offset: -5 }}
                />
                <YAxis 
                  label={{ value: 'Score (%)', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="completeness"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="Completeness"
                />
                <Line
                  type="monotone"
                  dataKey="confidence"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="Confidence"
                />
                <Line
                  type="monotone"
                  dataKey="feasibility"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  name="Feasibility"
                />
                <Line
                  type="monotone"
                  dataKey="novelty"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  name="Novelty"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function getStageDescription(stage: string): string {
  const descriptions = {
    initial: 'Setting up the development framework and initial analysis.',
    expanding: 'Breaking down the concept into core components and identifying key areas.',
    researching: 'Gathering external information and validating assumptions.',
    validating: 'Testing concept viability and checking for consistency.',
    refining: 'Improving the concept based on research and validation results.',
    implementing: 'Creating actionable implementation plans and next steps.',
    complete: 'Development process completed successfully.',
  }
  
  return descriptions[stage as keyof typeof descriptions] || 'Processing current development stage.'
}
