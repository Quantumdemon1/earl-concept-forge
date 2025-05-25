
import { CheckCircle2, Circle, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StageProgressProps {
  stages: {
    name: string
    status: 'pending' | 'running' | 'completed' | 'error'
    confidence?: number
  }[]
  currentStage?: string
}

export default function StageProgress({ stages, currentStage }: StageProgressProps) {
  return (
    <div className="flex items-center justify-between">
      {stages.map((stage, index) => (
        <div key={stage.name} className="flex items-center">
          <div className="flex flex-col items-center">
            <div className={cn(
              "flex h-10 w-10 items-center justify-center rounded-full border-2",
              stage.status === 'completed' && "border-green-500 bg-green-50",
              stage.status === 'running' && "border-blue-500 bg-blue-50",
              stage.status === 'pending' && "border-gray-300",
              stage.status === 'error' && "border-red-500 bg-red-50"
            )}>
              {stage.status === 'completed' && (
                <CheckCircle2 className="h-6 w-6 text-green-500" />
              )}
              {stage.status === 'running' && (
                <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
              )}
              {stage.status === 'pending' && (
                <Circle className="h-6 w-6 text-gray-300" />
              )}
            </div>
            <span className="mt-2 text-xs font-medium capitalize">
              {stage.name}
            </span>
            {stage.confidence !== undefined && (
              <span className="text-xs text-muted-foreground">
                {(stage.confidence * 100).toFixed(0)}%
              </span>
            )}
          </div>
          {index < stages.length - 1 && (
            <div className={cn(
              "mx-4 h-0.5 w-20 bg-gray-300",
              stages[index + 1].status !== 'pending' && "bg-primary"
            )} />
          )}
        </div>
      ))}
    </div>
  )
}
