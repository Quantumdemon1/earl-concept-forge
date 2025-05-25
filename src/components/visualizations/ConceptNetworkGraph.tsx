
import { useEffect, useRef, useState } from 'react'
import ForceGraph2D from 'react-force-graph-2d'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ZoomIn, ZoomOut, Maximize2, Download } from 'lucide-react'

interface NetworkGraphProps {
  data: {
    nodes: Array<{
      id: string
      label: string
      confidence: number
      uncertainty: 'low' | 'moderate' | 'high'
      group?: string
    }>
    links: Array<{
      source: string
      target: string
      strength: number
      type: string
    }>
  }
}

export default function ConceptNetworkGraph({ data }: NetworkGraphProps) {
  const graphRef = useRef<any>()
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 })
  
  useEffect(() => {
    const updateDimensions = () => {
      const container = graphRef.current?.parentElement
      if (container) {
        setDimensions({
          width: container.clientWidth,
          height: 600,
        })
      }
    }
    
    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])
  
  const getNodeColor = (node: any) => {
    const colors = {
      low: '#10b981',
      moderate: '#f59e0b',
      high: '#ef4444',
    }
    return colors[node.uncertainty] || '#6b7280'
  }
  
  const handleZoomIn = () => {
    graphRef.current?.zoom(1.2, 400)
  }
  
  const handleZoomOut = () => {
    graphRef.current?.zoom(0.8, 400)
  }
  
  const handleFitView = () => {
    graphRef.current?.zoomToFit(400, 20)
  }
  
  const handleDownload = () => {
    const canvas = graphRef.current?.canvas
    if (canvas) {
      const url = canvas.toDataURL('image/png')
      const link = document.createElement('a')
      link.download = 'concept-network.png'
      link.href = url
      link.click()
    }
  }
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Concept Relationship Network</CardTitle>
          <div className="flex gap-2">
            <Button size="icon" variant="outline" onClick={handleZoomIn}>
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="outline" onClick={handleZoomOut}>
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="outline" onClick={handleFitView}>
              <Maximize2 className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="outline" onClick={handleDownload}>
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative rounded-lg border bg-muted/10">
          <ForceGraph2D
            ref={graphRef}
            graphData={data}
            width={dimensions.width}
            height={dimensions.height}
            nodeLabel="label"
            nodeColor={getNodeColor}
            nodeRelSize={8}
            linkDirectionalArrowLength={3.5}
            linkDirectionalArrowRelPos={1}
            linkCurvature={0.25}
            nodeCanvasObject={(node, ctx, globalScale) => {
              const label = node.label
              const fontSize = 12 / globalScale
              ctx.font = `${fontSize}px Sans-Serif`
              
              // Draw node
              ctx.beginPath()
              ctx.arc(node.x!, node.y!, node.confidence * 10, 0, 2 * Math.PI)
              ctx.fillStyle = getNodeColor(node)
              ctx.fill()
              
              // Draw label
              ctx.textAlign = 'center'
              ctx.textBaseline = 'middle'
              ctx.fillStyle = '#000'
              ctx.fillText(label, node.x!, node.y! + 15)
            }}
            onNodeClick={(node) => {
              console.log('Node clicked:', node)
            }}
          />
          
          {/* Legend */}
          <div className="absolute bottom-4 left-4 rounded-lg bg-background/95 p-3 shadow-lg">
            <p className="mb-2 text-xs font-medium">Uncertainty Level</p>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-green-500" />
                <span className="text-xs">Low</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-amber-500" />
                <span className="text-xs">Moderate</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500" />
                <span className="text-xs">High</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
