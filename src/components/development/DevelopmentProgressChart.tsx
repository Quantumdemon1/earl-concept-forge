
import { useMemo } from 'react'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface DevelopmentProgressChartProps {
  session: any
}

export default function DevelopmentProgressChart({ session }: DevelopmentProgressChartProps) {
  const progressData = useMemo(() => {
    if (!session?.history) return []
    
    return session.history.map((item: any, index: number) => ({
      iteration: index + 1,
      completeness: (item.scores?.completeness || 0) * 100,
      confidence: (item.scores?.confidence || 0) * 100,
      feasibility: (item.scores?.feasibility || 0) * 100,
      novelty: (item.scores?.novelty || 0) * 100,
    }))
  }, [session?.history])

  if (!session || progressData.length === 0) return null
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Progress Over Time</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={progressData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="iteration" 
              label={{ value: 'Iteration', position: 'insideBottom', offset: -5 }}
            />
            <YAxis 
              label={{ value: 'Score (%)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="completeness"
              stroke="#10b981"
              strokeWidth={2}
              name="Completeness"
            />
            <Line
              type="monotone"
              dataKey="confidence"
              stroke="#3b82f6"
              strokeWidth={2}
              name="Confidence"
            />
            <Line
              type="monotone"
              dataKey="feasibility"
              stroke="#f59e0b"
              strokeWidth={2}
              name="Feasibility"
            />
            <Line
              type="monotone"
              dataKey="novelty"
              stroke="#8b5cf6"
              strokeWidth={2}
              name="Novelty"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
