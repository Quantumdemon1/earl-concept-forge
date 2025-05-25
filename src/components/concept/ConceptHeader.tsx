
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Brain, Zap } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface ConceptHeaderProps {
  concept: {
    id: string
    name: string
    created_at: string
  }
  developmentSession?: any
  onStartAnalysis: () => void
  onOpenDevelopment: () => void
}

export default function ConceptHeader({
  concept,
  developmentSession,
  onStartAnalysis,
  onOpenDevelopment,
}: ConceptHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/concepts/list">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Concepts
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{concept.name}</h1>
          <p className="text-muted-foreground">
            Created {formatDistanceToNow(new Date(concept.created_at))} ago
          </p>
        </div>
      </div>
      <div className="flex gap-2">
        <Button 
          onClick={onStartAnalysis}
          variant="outline"
        >
          <Brain className="h-4 w-4 mr-2" />
          EARL Analysis
        </Button>
        <Button
          onClick={onOpenDevelopment}
          className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
        >
          <Zap className="h-4 w-4 mr-2" />
          AI Development
          {developmentSession && (
            <span className="ml-2 flex h-2 w-2 rounded-full bg-green-400" />
          )}
        </Button>
      </div>
    </div>
  )
}
