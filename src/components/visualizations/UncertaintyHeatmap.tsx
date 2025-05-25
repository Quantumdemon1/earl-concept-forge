
import { useMemo } from 'react'
import {
  ResponsiveContainer,
  Treemap,
  Tooltip,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface UncertaintyData {
  components: Array<{
    name: string
    metrics: {
      probability: number
      information_base: number
      analytical_rigour: number
      complexity_volatility: number
    }
  }>
}

// Custom content component for Treemap
const TreemapContent = ({ x, y, width, height, value, name }: any) => {
  const getColor = (value: number) => {
    // Green to Red gradient based on uncertainty
    const hue = ((1 - value) * 120).toString(10)
    return `hsl(${hue}, 70%, 50%)`
  }

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        style={{
          fill: getColor(value),
          stroke: '#fff',
          strokeWidth: 2,
        }}
      />
      <text
        x={x + width / 2}
        y={y + height / 2}
        textAnchor="middle"
        dominantBaseline="central"
        className="fill-white text-sm font-medium"
      >
        {name}
      </text>
    </g>
  )
}

export default function UncertaintyHeatmap({ data }: { data: UncertaintyData }) {
  const treemapData = useMemo(() => {
    return data.components.map((component) => {
      const avgUncertainty = 
        Object.values(component.metrics).reduce((a, b) => a + b, 0) / 
        Object.values(component.metrics).length
      
      return {
        name: component.name,
        size: 100, // Equal size for all components
        value: avgUncertainty,
        metrics: component.metrics,
      }
    })
  }, [data])
  
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload[0]) {
      const data = payload[0].payload
      return (
        <div className="rounded-lg bg-popover p-3 shadow-lg">
          <p className="font-medium">{data.name}</p>
          <div className="mt-2 space-y-1 text-sm">
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Probability:</span>
              <span>{(data.metrics.probability * 100).toFixed(0)}%</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Info Base:</span>
              <span>{(data.metrics.information_base * 100).toFixed(0)}%</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Rigour:</span>
              <span>{(data.metrics.analytical_rigour * 100).toFixed(0)}%</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Complexity:</span>
              <span>{(data.metrics.complexity_volatility * 100).toFixed(0)}%</span>
            </div>
          </div>
        </div>
      )
    }
    return null
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Uncertainty Assessment Heatmap</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <Treemap
            data={treemapData}
            dataKey="size"
            aspectRatio={4 / 3}
            stroke="#fff"
            content={<TreemapContent />}
          >
            <Tooltip content={<CustomTooltip />} />
          </Treemap>
        </ResponsiveContainer>
        
        {/* Color scale legend */}
        <div className="mt-4 flex items-center justify-center gap-2">
          <span className="text-sm text-muted-foreground">Low</span>
          <div className="h-4 w-32 rounded" style={{
            background: 'linear-gradient(to right, #10b981, #f59e0b, #ef4444)',
          }} />
          <span className="text-sm text-muted-foreground">High</span>
        </div>
      </CardContent>
    </Card>
  )
}
