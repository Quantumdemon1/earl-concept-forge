
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface ConceptOverviewTabProps {
  concept: {
    description: string
    status: string
    domains?: string[]
  }
}

export default function ConceptOverviewTab({ concept }: ConceptOverviewTabProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm">{concept.description}</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="text-sm font-medium">Status</h4>
            <Badge variant={
              concept.status === 'completed' ? 'default' :
              concept.status === 'draft' ? 'secondary' :
              'outline'
            }>
              {concept.status}
            </Badge>
          </div>
          
          {concept.domains && concept.domains.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2">Domains</h4>
              <div className="flex flex-wrap gap-1">
                {concept.domains.map((domain: string) => (
                  <Badge key={domain} variant="secondary" className="text-xs">
                    {domain}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
