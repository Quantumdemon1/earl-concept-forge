
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import CreateConceptDialog from '@/components/concepts/CreateConceptDialog'
import { Plus, Search, Filter } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

export default function ConceptList() {
  const [searchTerm, setSearchTerm] = useState('')
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const { user } = useAuth()
  
  const { data: concepts, isLoading, error } = useQuery({
    queryKey: ['concepts', searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('concepts')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (searchTerm) {
        query = query.or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
      }
      
      const { data, error } = await query
      if (error) {
        console.error('Error fetching concepts:', error)
        throw error
      }
      return data
    },
  })
  
  if (error) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <p className="text-destructive">Error loading concepts: {error.message}</p>
          </CardContent>
        </Card>
      </div>
    )
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Concepts</h1>
          <p className="text-muted-foreground">
            Manage and analyze your concepts using the EARL framework
          </p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Concept
        </Button>
      </div>
      
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search concepts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-16" />
              </CardContent>
            </Card>
          ))
        ) : concepts && concepts.length > 0 ? (
          concepts.map((concept) => (
            <Card key={concept.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="line-clamp-1">
                      {concept.name}
                    </CardTitle>
                    <CardDescription>
                      Created {formatDistanceToNow(new Date(concept.created_at))} ago
                      {concept.owner_id ? '' : ' (Anonymous)'}
                    </CardDescription>
                  </div>
                  <Badge variant={
                    concept.status === 'completed' ? 'default' :
                    concept.status === 'draft' ? 'secondary' :
                    'outline'
                  }>
                    {concept.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="line-clamp-3 text-sm text-muted-foreground">
                  {concept.description}
                </p>
                {concept.domains && concept.domains.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {concept.domains.map((domain) => (
                      <Badge key={domain} variant="secondary" className="text-xs">
                        {domain}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button asChild variant="outline" size="sm" className="flex-1">
                  <Link to={`/concepts/${concept.id}`}>View</Link>
                </Button>
                <Button asChild size="sm" className="flex-1">
                  <Link to={`/concepts/${concept.id}/analysis`}>Analyze</Link>
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-full">
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <h3 className="text-lg font-semibold mb-2">No concepts found</h3>
                <p className="text-muted-foreground text-center mb-6">
                  {searchTerm ? "Try adjusting your search terms" : "Create your first concept to get started"}
                </p>
                <Button onClick={() => setShowCreateDialog(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Concept
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
      
      <CreateConceptDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
      />
    </div>
  )
}
