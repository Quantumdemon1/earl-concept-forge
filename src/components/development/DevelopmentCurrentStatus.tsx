
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface DevelopmentCurrentStatusProps {
  session: any
}

export default function DevelopmentCurrentStatus({ session }: DevelopmentCurrentStatusProps) {
  if (!session) return null

  return (
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
