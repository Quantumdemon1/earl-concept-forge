
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import CreateConceptDialog from '@/components/concepts/CreateConceptDialog'

export default function CreateConcept() {
  const navigate = useNavigate()
  const [showDialog, setShowDialog] = useState(true)

  const handleDialogClose = (open: boolean) => {
    setShowDialog(open)
    if (!open) {
      // Navigate back to concepts list when dialog is closed
      navigate('/concepts/list')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Create New Concept</h1>
          <p className="text-muted-foreground">
            Define a new concept for EARL framework analysis
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Getting Started</CardTitle>
          <CardDescription>
            Create a concept to begin your analysis with the EARL framework
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            The concept creation dialog will guide you through defining your concept with a name, 
            description, and relevant domains. Once created, you can begin analyzing and developing 
            your concept using our AI-powered tools.
          </p>
        </CardContent>
      </Card>

      <CreateConceptDialog
        open={showDialog}
        onOpenChange={handleDialogClose}
      />
    </div>
  )
}
