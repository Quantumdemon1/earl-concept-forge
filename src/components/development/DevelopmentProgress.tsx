
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import DevelopmentCurrentStatus from './DevelopmentCurrentStatus'
import DevelopmentQualityRadar from './DevelopmentQualityRadar'
import DevelopmentProgressChart from './DevelopmentProgressChart'
import DevelopmentLLMInteraction from './DevelopmentLLMInteraction'

interface DevelopmentProgressProps {
  session: any
}

export default function DevelopmentProgress({ session }: DevelopmentProgressProps) {
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
      <DevelopmentCurrentStatus session={session} />
      {currentIteration && <DevelopmentLLMInteraction currentIteration={currentIteration} />}
      <DevelopmentQualityRadar session={session} />
      <DevelopmentProgressChart session={session} />
    </div>
  )
}
