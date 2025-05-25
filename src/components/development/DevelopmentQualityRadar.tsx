
import { useMemo } from 'react'
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface DevelopmentQualityRadarProps {
  session: any
}

export default function DevelopmentQualityRadar({ session }: DevelopmentQualityRadarProps) {
  const radarData = useMemo(() => {
    if (!session) return []
    
    return [
      {
        metric: 'Completeness',
        value: session.scores.completeness * 100,
        fullMark: 100,
      },
      {
        metric: 'Confidence',
        value: session.scores.confidence * 100,
        fullMark: 100,
      },
      {
        metric: 'Feasibility',
        value: session.scores.feasibility * 100,
        fullMark: 100,
      },
      {
        metric: 'Novelty',
        value: session.scores.novelty * 100,
        fullMark: 100,
      },
    ]
  }, [session])

  if (!session) return null
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Current Quality Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart data={radarData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="metric" />
            <PolarRadiusAxis 
              angle={90} 
              domain={[0, 100]} 
              tick={false}
            />
            <Radar
              name="Quality"
              dataKey="value"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.3}
              strokeWidth={2}
            />
          </RadarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
