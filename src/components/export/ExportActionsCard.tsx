
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download, RefreshCw } from 'lucide-react'

interface ExportActionsCardProps {
  onRecompile: () => void
  onExport: () => void
  isRecompiling: boolean
  isExporting: boolean
  overallReadiness: number
  smartQuestions: any
}

export default function ExportActionsCard({
  onRecompile,
  onExport,
  isRecompiling,
  isExporting,
  overallReadiness,
  smartQuestions
}: ExportActionsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Export Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-3">
          <Button
            onClick={onRecompile}
            disabled={isRecompiling}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isRecompiling ? 'animate-spin' : ''}`} />
            Recompile Deliverable
          </Button>
          
          <Button
            onClick={onExport}
            disabled={isExporting || overallReadiness < 50}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export Deliverable
          </Button>
        </div>
        
        {overallReadiness < 50 && (
          <p className="text-sm text-amber-600">
            Complete more workflow steps to enable export
          </p>
        )}

        {smartQuestions && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Completion Strategy:</strong> {smartQuestions.completionStrategy}
            </p>
            <p className="text-xs text-blue-600 mt-1">
              Estimated time: {smartQuestions.estimatedTimeToComplete} minutes
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
