
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
import { Skeleton } from '@/components/ui/skeleton'

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
