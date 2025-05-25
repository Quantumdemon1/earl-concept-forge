
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Play, Pause, Square, Settings } from 'lucide-react'
import { useDevelopment } from '@/hooks/useDevelopment'
import { useDevelopmentProgress } from '@/hooks/useDevelopmentProgress'
import DevelopmentProgress from './DevelopmentProgress'
import DevelopmentHistory from './DevelopmentHistory'
import DevelopmentConfig from './DevelopmentConfig'

interface DevelopmentPanelProps {
  conceptId: string
  conceptName: string
}

export default function DevelopmentPanel({ conceptId, conceptName }: DevelopmentPanelProps) {
  const [activeTab, setActiveTab] = useState('progress')
  
  const {
    start,
    pause,
    resume,
    isRunning,
    isStarting,
    progress,
    currentSession,
    canStart,
    canPause,
    canResume,
  } = useDevelopment(conceptId, {
    autoRun: true,
    maxIterations: 20,
    onProgress: (session) => {
      console.log('Development progress:', session)
    },
    onComplete: (result) => {
      console.log('Development complete:', result)
    },
  })
  
  const developmentProgress = useDevelopmentProgress(currentSession)
  
  const getStageColor = (stage: string) => {
    const colors = {
      initial: 'bg-gray-500',
      expanding: 'bg-blue-500',
      researching: 'bg-purple-500',
      validating: 'bg-yellow-500',
      refining: 'bg-orange-500',
      implementing: 'bg-green-500',
      complete: 'bg-emerald-500',
    }
    return colors[stage as keyof typeof colors] || 'bg-gray-500'
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Automated Development</h2>
          <p className="text-muted-foreground">{conceptName}</p>
        </div>
        <div className="flex gap-2">
          {canStart && (
            <Button 
              onClick={start} 
              disabled={isStarting}
              className="bg-green-600 hover:bg-green-700"
            >
              <Play className="h-4 w-4 mr-2" />
              {isStarting ? 'Starting...' : 'Start Development'}
            </Button>
          )}
          {canPause && (
            <Button onClick={pause} variant="outline">
              <Pause className="h-4 w-4 mr-2" />
              Pause
            </Button>
          )}
          {canResume && (
            <Button onClick={resume} className="bg-blue-600 hover:bg-blue-700">
              <Play className="h-4 w-4 mr-2" />
              Resume
            </Button>
          )}
        </div>
      </div>
      
      {/* Status Overview */}
      {currentSession && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Badge className={getStageColor(progress.stage)}>
                  {progress.stage}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Stage {progress.iteration}/20
                </span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">
                {developmentProgress.overallProgress}%
              </div>
              <p className="text-sm text-muted-foreground">Overall Progress</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">
                {developmentProgress.qualityScore}%
              </div>
              <p className="text-sm text-muted-foreground">Quality Score</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="text-sm font-medium">
                {developmentProgress.nextMilestone}
              </div>
              <p className="text-sm text-muted-foreground">Next Milestone</p>
            </CardContent>
          </Card>
        </div>
      )}
      
      {/* Quality Metrics */}
      {currentSession && (
        <Card>
          <CardHeader>
            <CardTitle>Quality Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Completeness</span>
                <span>{Math.round(progress.scores.completeness * 100)}%</span>
              </div>
              <Progress value={progress.scores.completeness * 100} />
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Confidence</span>
                <span>{Math.round(progress.scores.confidence * 100)}%</span>
              </div>
              <Progress value={progress.scores.confidence * 100} />
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Feasibility</span>
                <span>{Math.round(progress.scores.feasibility * 100)}%</span>
              </div>
              <Progress value={progress.scores.feasibility * 100} />
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Novelty</span>
                <span>{Math.round(progress.scores.novelty * 100)}%</span>
              </div>
              <Progress value={progress.scores.novelty * 100} />
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Detailed Views */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="config">Configuration</TabsTrigger>
        </TabsList>
        
        <TabsContent value="progress">
          <DevelopmentProgress session={currentSession} />
        </TabsContent>
        
        <TabsContent value="history">
          <DevelopmentHistory session={currentSession} />
        </TabsContent>
        
        <TabsContent value="config">
          <DevelopmentConfig conceptId={conceptId} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
