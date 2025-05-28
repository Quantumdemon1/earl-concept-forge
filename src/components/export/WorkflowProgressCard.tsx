
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, Circle, Brain, Zap } from 'lucide-react'

interface WorkflowStep {
  id: string
  label: string
  completed: boolean
  description: string
}

interface WorkflowProgressCardProps {
  workflowSteps: WorkflowStep[]
  overallReadiness: number
  hasSmartEnhancement: boolean
  onSmartEnhancement: () => void
  isProcessing: boolean
}

export default function WorkflowProgressCard({
  workflowSteps,
  overallReadiness,
  hasSmartEnhancement,
  onSmartEnhancement,
  isProcessing
}: WorkflowProgressCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Smart Export Workflow
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant={overallReadiness >= 75 ? 'default' : 'outline'}>
              {Math.round(overallReadiness)}% Ready
            </Badge>
            {hasSmartEnhancement && (
              <Button
                size="sm"
                onClick={onSmartEnhancement}
                className="flex items-center gap-1"
                disabled={isProcessing}
              >
                <Zap className="h-3 w-3" />
                Smart Enhance
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {workflowSteps.map((step, index) => (
            <div
              key={step.id}
              className={`p-4 rounded-lg border ${
                step.completed 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                {step.completed ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <Circle className="h-5 w-5 text-gray-400" />
                )}
                <span className="font-medium text-sm">{step.label}</span>
              </div>
              <p className="text-xs text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
