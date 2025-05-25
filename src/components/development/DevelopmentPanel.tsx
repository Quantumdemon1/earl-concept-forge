
import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useDevelopment } from '@/hooks/useDevelopment'
import { useDevelopmentProgress } from '@/hooks/useDevelopmentProgress'
import DevelopmentControls from './DevelopmentControls'
import DevelopmentStatusOverview from './DevelopmentStatusOverview'
import DevelopmentQualityMetrics from './DevelopmentQualityMetrics'
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
    error,
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
  
  return (
    <div className="space-y-6">
      <DevelopmentControls
        canStart={canStart}
        canPause={canPause}
        canResume={canResume}
        isStarting={isStarting}
        onStart={start}
        onPause={pause}
        onResume={resume}
        error={error}
        conceptName={conceptName}
      />

      {/* Status Overview */}
      {currentSession && (
        <DevelopmentStatusOverview
          stage={progress.stage}
          iteration={progress.iteration}
          overallProgress={developmentProgress.overallProgress}
          qualityScore={developmentProgress.qualityScore}
          nextMilestone={developmentProgress.nextMilestone}
        />
      )}
      
      {/* Quality Metrics */}
      {currentSession && (
        <DevelopmentQualityMetrics scores={progress.scores} />
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
