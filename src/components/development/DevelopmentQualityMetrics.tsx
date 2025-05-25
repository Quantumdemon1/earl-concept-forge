
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

interface DevelopmentQualityMetricsProps {
  scores: {
    completeness: number
    confidence: number
    feasibility: number
    novelty: number
  }
}

export default function DevelopmentQualityMetrics({ scores }: DevelopmentQualityMetricsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quality Metrics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Completeness</span>
            <span>{Math.round(scores.completeness * 100)}%</span>
          </div>
          <Progress value={scores.completeness * 100} />
        </div>
        
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Confidence</span>
            <span>{Math.round(scores.confidence * 100)}%</span>
          </div>
          <Progress value={scores.confidence * 100} />
        </div>
        
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Feasibility</span>
            <span>{Math.round(scores.feasibility * 100)}%</span>
          </div>
          <Progress value={scores.feasibility * 100} />
        </div>
        
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Novelty</span>
            <span>{Math.round(scores.novelty * 100)}%</span>
          </div>
          <Progress value={scores.novelty * 100} />
        </div>
      </CardContent>
    </Card>
  )
}
