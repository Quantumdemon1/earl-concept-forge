
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

interface MetricsDisplayProps {
  metrics: Record<string, any>
  uncertainties: Record<string, any>
}

export default function MetricsDisplay({ metrics, uncertainties }: MetricsDisplayProps) {
  const metricEntries = Object.entries(metrics)
  const uncertaintyEntries = Object.entries(uncertainties)
  
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {metricEntries.length > 0 ? (
            metricEntries.map(([key, value]) => (
              <div key={key} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium capitalize">
                    {key.replace(/_/g, ' ')}
                  </span>
                  <Badge variant="outline">
                    {typeof value === 'number' 
                      ? (value * 100).toFixed(1) + '%'
                      : String(value)
                    }
                  </Badge>
                </div>
                {typeof value === 'number' && (
                  <Progress value={value * 100} className="h-2" />
                )}
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No metrics available</p>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Uncertainty Assessment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {uncertaintyEntries.length > 0 ? (
            uncertaintyEntries.map(([key, value]) => (
              <div key={key} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium capitalize">
                    {key.replace(/_/g, ' ')}
                  </span>
                  <Badge 
                    variant={
                      typeof value === 'number' && value > 0.7 ? 'destructive' :
                      typeof value === 'number' && value > 0.4 ? 'secondary' :
                      'default'
                    }
                  >
                    {typeof value === 'number' 
                      ? (value * 100).toFixed(1) + '%'
                      : String(value)
                    }
                  </Badge>
                </div>
                {typeof value === 'number' && (
                  <Progress 
                    value={value * 100} 
                    className="h-2"
                  />
                )}
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No uncertainty data available</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
