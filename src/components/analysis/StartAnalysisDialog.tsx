
import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/hooks/useAuth'

interface StartAnalysisDialogProps {
  conceptId: string
  conceptName: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function StartAnalysisDialog({
  conceptId,
  conceptName,
  open,
  onOpenChange,
}: StartAnalysisDialogProps) {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { user } = useAuth()
  
  const [config, setConfig] = useState({
    enableAI: true,
    skipStages: [] as string[],
  })
  
  const startAnalysisMutation = useMutation({
    mutationFn: async () => {
      console.log('Starting analysis for concept:', conceptId)
      
      // Create analysis job record
      const { data, error } = await supabase
        .from('analysis_jobs')
        .insert({
          concept_id: conceptId,
          status: 'pending',
          current_stage: 'evaluate',
          progress: 0,
          config: config,
        })
        .select()
        .single()
      
      if (error) {
        console.error('Error creating analysis job:', error)
        throw error
      }
      
      console.log('Analysis job created:', data)
      return data
    },
    onSuccess: (data) => {
      toast({
        title: 'Analysis started',
        description: 'EARL framework analysis has begun.',
      })
      onOpenChange(false)
      navigate(`/concepts/${conceptId}/analysis/${data.id}`)
    },
    onError: (error) => {
      console.error('Analysis mutation error:', error)
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      })
    },
  })
  
  const stages = ['evaluate', 'analyze', 'refine', 'reiterate']
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Start EARL Analysis</DialogTitle>
          <DialogDescription>
            Configure and start the analysis for "{conceptName}"
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="ai-toggle">Enable AI Assistance</Label>
              <p className="text-sm text-muted-foreground">
                Use AI to enhance analysis quality
              </p>
            </div>
            <Switch
              id="ai-toggle"
              checked={config.enableAI}
              onCheckedChange={(checked) =>
                setConfig({ ...config, enableAI: checked })
              }
            />
          </div>
          
          <div className="space-y-3">
            <Label>Analysis Stages</Label>
            <p className="text-sm text-muted-foreground">
              Select which stages to include
            </p>
            {stages.map((stage) => (
              <div key={stage} className="flex items-center space-x-2">
                <Checkbox
                  id={stage}
                  checked={!config.skipStages.includes(stage)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setConfig({
                        ...config,
                        skipStages: config.skipStages.filter(s => s !== stage),
                      })
                    } else {
                      setConfig({
                        ...config,
                        skipStages: [...config.skipStages, stage],
                      })
                    }
                  }}
                />
                <Label
                  htmlFor={stage}
                  className="text-sm font-normal capitalize cursor-pointer"
                >
                  {stage}
                </Label>
              </div>
            ))}
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => startAnalysisMutation.mutate()}
            disabled={startAnalysisMutation.isPending}
          >
            {startAnalysisMutation.isPending ? 'Starting...' : 'Start Analysis'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
