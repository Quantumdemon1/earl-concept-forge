
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface ExportOptions {
  overview: boolean
  earlAnalysis: boolean
  developmentHistory: boolean
  implementationPlan: boolean
  visualizations: boolean
}

interface ExportOptionsSelectorProps {
  options: ExportOptions
  onChange: (key: string, value: boolean) => void
}

export default function ExportOptionsSelector({ options, onChange }: ExportOptionsSelectorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Include in Export</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {Object.entries(options).map(([key, value]) => (
          <div key={key} className="flex items-center space-x-2">
            <Checkbox
              id={key}
              checked={value}
              onCheckedChange={(checked) => onChange(key, checked as boolean)}
            />
            <Label htmlFor={key} className="capitalize cursor-pointer">
              {key.replace(/([A-Z])/g, ' $1').trim()}
            </Label>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
