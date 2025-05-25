
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import {
  Brain,
  TrendingUp,
  Clock,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react'

export default function Dashboard() {
  const { user } = useAuth()
  
  const { data: stats } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      // Fetch various statistics
      const [concepts, jobs, analyses] = await Promise.all([
        supabase
          .from('concepts')
          .select('status', { count: 'exact' })
          .eq('owner_id', user?.id),
        supabase
          .from('analysis_jobs')
          .select('status, created_at', { count: 'exact' })
          .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()),
        supabase
          .from('concept_analyses')
          .select('stage, confidence_scores')
          .order('created_at', { ascending: false })
          .limit(10),
      ])
      
      return {
        totalConcepts: concepts.count || 0,
        conceptsByStatus: concepts.data || [],
        recentJobs: jobs.data || [],
        recentAnalyses: analyses.data || [],
      }
    },
  })
  
  const { data: recentConcepts } = useQuery({
    queryKey: ['recent-concepts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('concepts')
        .select('*')
        .eq('owner_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(5)
      
      if (error) throw error
      return data
    },
  })
  
  const statusColors = {
    draft: '#6b7280',
    evaluating: '#3b82f6',
    analyzing: '#8b5cf6',
    refining: '#f59e0b',
    reiterating: '#10b981',
    completed: '#059669',
  }
  
  const statusData = Object.entries(
    stats?.conceptsByStatus.reduce((acc: Record<string, number>, item: any) => {
      acc[item.status] = (acc[item.status] || 0) + 1
      return acc
    }, {} as Record<string, number>) || {}
  ).map(([status, count]) => ({
    name: status,
    value: count,
    fill: statusColors[status as keyof typeof statusColors] || '#6b7280',
  }))
  
  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        {/* Welcome Header */}
        <div>
          <h1 className="text-3xl font-bold">Welcome back!</h1>
          <p className="text-muted-foreground">
            Here's an overview of your EARL framework analyses
          </p>
        </div>
        
        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Concepts
              </CardTitle>
              <Brain className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalConcepts || 0}</div>
              <p className="text-xs text-muted-foreground">
                +12% from last month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Analyses
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats?.recentJobs.filter((j: any) => j.status === 'running').length || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Currently processing
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Avg. Processing Time
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4.2m</div>
              <p className="text-xs text-muted-foreground">
                -23% from last week
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Completion Rate
              </CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">94%</div>
              <Progress value={94} className="mt-2" />
            </CardContent>
          </Card>
        </div>
        
        {/* Charts */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Concepts by Status</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => 
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Analysis Confidence Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={[
                    { stage: 'Evaluate', confidence: 0.82 },
                    { stage: 'Analyze', confidence: 0.78 },
                    { stage: 'Refine', confidence: 0.85 },
                    { stage: 'Reiterate', confidence: 0.91 },
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="stage" />
                  <YAxis domain={[0, 1]} />
                  <Tooltip />
                  <Bar dataKey="confidence" fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
        
        {/* Recent Concepts */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Concepts</CardTitle>
              <Button asChild variant="ghost" size="sm">
                <Link to="/concepts">
                  View all
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentConcepts?.map((concept) => (
                <div
                  key={concept.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div>
                    <p className="font-medium">{concept.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {concept.domains?.join(', ') || 'No domains'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        concept.status === 'completed' ? 'default' : 'secondary'
                      }
                    >
                      {concept.status}
                    </Badge>
                    <Button asChild size="sm" variant="outline">
                      <Link to={`/concepts/${concept.id}`}>View</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
