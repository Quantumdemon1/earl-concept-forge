
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'

const conceptSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  domains: z.string().transform((val) => 
    val.split(',').map(d => d.trim()).filter(Boolean)
  ),
})

type ConceptFormData = z.infer<typeof conceptSchema>

interface CreateConceptDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function CreateConceptDialog({
  open,
  onOpenChange,
}: CreateConceptDialogProps) {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const { user } = useAuth()
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ConceptFormData>({
    resolver: zodResolver(conceptSchema),
  })
  
  const createMutation = useMutation({
    mutationFn: async (data: ConceptFormData) => {
      const { data: concept, error } = await supabase
        .from('concepts')
        .insert({
          name: data.name,
          description: data.description,
          domains: data.domains,
          owner_id: user?.id,
        })
        .select()
        .single()
      
      if (error) throw error
      return concept
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['concepts'] })
      toast({
        title: 'Concept created',
        description: 'Your concept has been created successfully.',
      })
      reset()
      onOpenChange(false)
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      })
    },
  })
  
  const onSubmit = (data: ConceptFormData) => {
    createMutation.mutate(data)
  }
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Create New Concept</DialogTitle>
          <DialogDescription>
            Define a new concept for EARL framework analysis
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Concept Name</Label>
              <Input
                id="name"
                placeholder="e.g., Machine Learning Ethics"
                {...register('name')}
              />
              {errors.name && (
                <p className="text-sm text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe the concept in detail..."
                rows={4}
                {...register('description')}
              />
              {errors.description && (
                <p className="text-sm text-destructive">
                  {errors.description.message}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="domains">Domains (comma-separated)</Label>
              <Input
                id="domains"
                placeholder="e.g., technology, ethics, AI"
                {...register('domains')}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Concept'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
