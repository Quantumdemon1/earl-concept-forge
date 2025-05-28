
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, Code, Briefcase, TrendingUp } from 'lucide-react'
import { DeliverableTemplateService } from '@/services/deliverableTemplates'

interface DeliverableTemplateSelectorProps {
  value: string
  onChange: (value: string) => void
}

export default function DeliverableTemplateSelector({ value, onChange }: DeliverableTemplateSelectorProps) {
  const templates = DeliverableTemplateService.getAvailableTemplates()
  
  const getIcon = (templateName: string) => {
    switch (templateName) {
      case 'Executive Summary':
        return <TrendingUp className="h-4 w-4" />
      case 'Technical Specification':
        return <Code className="h-4 w-4" />
      case 'Implementation Guide':
        return <FileText className="h-4 w-4" />
      case 'Business Plan':
        return <Briefcase className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Deliverable Template</CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup value={value} onValueChange={onChange}>
          {templates.map((template) => (
            <div key={template.name} className="flex items-start space-x-2 p-3 border rounded-lg hover:bg-muted/50">
              <RadioGroupItem value={template.name} id={template.name} className="mt-1" />
              <div className="flex-1">
                <Label htmlFor={template.name} className="flex items-center gap-2 cursor-pointer font-medium">
                  {getIcon(template.name)}
                  {template.name}
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  {template.description}
                </p>
              </div>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  )
}
