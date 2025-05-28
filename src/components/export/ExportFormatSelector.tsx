
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, FileJson, FileCode, Sparkles } from 'lucide-react'

interface ExportFormatSelectorProps {
  value: string
  onChange: (value: string) => void
  hasCompletedDevelopment?: boolean
}

export default function ExportFormatSelector({ value, onChange, hasCompletedDevelopment }: ExportFormatSelectorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Export Format</CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup value={value} onValueChange={onChange}>
          {hasCompletedDevelopment && (
            <div className="flex items-center space-x-2 p-2 border-2 border-primary/20 rounded-lg bg-primary/5">
              <RadioGroupItem value="deliverable" id="deliverable" />
              <Label htmlFor="deliverable" className="flex items-center gap-2 cursor-pointer font-medium">
                <Sparkles className="h-4 w-4 text-primary" />
                Smart Deliverable (Recommended)
              </Label>
            </div>
          )}
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="json" id="json" />
            <Label htmlFor="json" className="flex items-center gap-2 cursor-pointer">
              <FileJson className="h-4 w-4" />
              JSON (Complete Data)
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="markdown" id="markdown" />
            <Label htmlFor="markdown" className="flex items-center gap-2 cursor-pointer">
              <FileText className="h-4 w-4" />
              Markdown (Documentation)
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="pdf" id="pdf" />
            <Label htmlFor="pdf" className="flex items-center gap-2 cursor-pointer">
              <FileCode className="h-4 w-4" />
              PDF (Presentation) - Coming Soon
            </Label>
          </div>
        </RadioGroup>
        
        {hasCompletedDevelopment && (
          <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800">
              <strong>Smart Deliverable available!</strong> Your concept has completed AI development. 
              Export as a professional deliverable with compiled components, market analysis, and implementation roadmap.
            </p>
          </div>
        )}
        
        {!hasCompletedDevelopment && (
          <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-800">
              Complete AI development to unlock Smart Deliverable templates with compiled project specifications.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
