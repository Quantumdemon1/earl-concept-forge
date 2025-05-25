
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, FileJson, FileCode } from 'lucide-react'

interface ExportFormatSelectorProps {
  value: string
  onChange: (value: string) => void
}

export default function ExportFormatSelector({ value, onChange }: ExportFormatSelectorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Export Format</CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup value={value} onValueChange={onChange}>
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
      </CardContent>
    </Card>
  )
}
