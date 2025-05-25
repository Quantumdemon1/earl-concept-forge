
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface DevelopmentStatusOverviewProps {
  stage: string
  iteration: number
  overallProgress: number
  qualityScore: number
  nextMilestone: string
}

export default function DevelopmentStatusOverview({
  stage,
  iteration,
  overallProgress,
  qualityScore,
  nextMilestone,
}: DevelopmentStatusOverviewProps) {
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
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Badge className={getStageColor(stage)}>
              {stage}
            </Badge>
            <span className="text-sm text-muted-foreground">
              Stage {iteration}/20
            </span>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="text-2xl font-bold">
            {overallProgress}%
          </div>
          <p className="text-sm text-muted-foreground">Overall Progress</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="text-2xl font-bold">
            {qualityScore}%
          </div>
          <p className="text-sm text-muted-foreground">Quality Score</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="text-sm font-medium">
            {nextMilestone}
          </div>
          <p className="text-sm text-muted-foreground">Next Milestone</p>
        </CardContent>
      </Card>
    </div>
  )
}
