
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Play, Pause, AlertCircle } from 'lucide-react'

interface DevelopmentControlsProps {
  canStart: boolean
  canPause: boolean
  canResume: boolean
  isStarting: boolean
  onStart: () => void
  onPause: () => void
  onResume: () => void
  error: Error | null
  conceptName: string
}

export default function DevelopmentControls({
  canStart,
  canPause,
  canResume,
  isStarting,
  onStart,
  onPause,
  onResume,
  error,
  conceptName,
}: DevelopmentControlsProps) {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Automated Development</h2>
          <p className="text-muted-foreground">{conceptName}</p>
        </div>
        <div className="flex gap-2">
          {canStart && (
            <Button 
              onClick={onStart} 
              disabled={isStarting}
              className="bg-green-600 hover:bg-green-700"
            >
              <Play className="h-4 w-4 mr-2" />
              {isStarting ? 'Starting...' : 'Start Development'}
            </Button>
          )}
          {canPause && (
            <Button onClick={onPause} variant="outline">
              <Pause className="h-4 w-4 mr-2" />
              Pause
            </Button>
          )}
          {canResume && (
            <Button onClick={onResume} className="bg-blue-600 hover:bg-blue-700">
              <Play className="h-4 w-4 mr-2" />
              Resume
            </Button>
          )}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Development Error</AlertTitle>
          <AlertDescription>
            {error.message}
          </AlertDescription>
        </Alert>
      )}

      {/* Ready State */}
      {!error && canStart && !isStarting && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Ready to Start</AlertTitle>
          <AlertDescription>
            Click "Start Development" to begin automated concept development using AI.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
