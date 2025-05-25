
import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link, useParams } from "react-router-dom";
import { 
  Play, 
  Edit, 
  Share, 
  Download,
  Clock,
  User,
  Calendar,
  BarChart3
} from "lucide-react";

const ConceptDetail = () => {
  const { id } = useParams();

  // Mock data - would be fetched based on ID
  const concept = {
    id: 1,
    name: "Artificial Intelligence Ethics",
    description: "Exploring the moral implications and guidelines for AI development and deployment in modern society. This comprehensive analysis examines various ethical frameworks and their application to artificial intelligence systems.",
    domain: "Technology",
    subdomain: "Ethics & Philosophy",
    status: "analyze",
    progress: 65,
    confidence: 78,
    createdAt: "2024-01-15",
    updatedAt: "2024-01-20",
    author: "Dr. Sarah Chen",
    tags: ["AI", "Ethics", "Philosophy", "Technology Policy"],
    metadata: {
      complexity: "High",
      priority: "Medium",
      estimatedHours: 12,
      actualHours: 8
    }
  };

  const analysisHistory = [
    {
      stage: "evaluate",
      completedAt: "2024-01-16",
      confidence: 72,
      keyFindings: ["Identified 5 core ethical principles", "Mapped stakeholder concerns"]
    },
    {
      stage: "analyze", 
      completedAt: "2024-01-18",
      confidence: 78,
      keyFindings: ["Deep analysis of principle conflicts", "Stakeholder impact assessment"]
    }
  ];

  const stageProgress = [
    { stage: "Evaluate", status: "completed", progress: 100 },
    { stage: "Analyze", status: "active", progress: 65 },
    { stage: "Refine", status: "pending", progress: 0 },
    { stage: "Reiterate", status: "pending", progress: 0 }
  ];

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{concept.name}</h1>
            <p className="text-muted-foreground mb-4">{concept.description}</p>
            
            <div className="flex gap-2 mb-4">
              {concept.tags.map((tag) => (
                <Badge key={tag} variant="secondary">{tag}</Badge>
              ))}
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Share className="mr-2 h-4 w-4" />
              Share
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
            <Button asChild>
              <Link to={`/concepts/${id}/analysis`}>
                <Play className="mr-2 h-4 w-4" />
                Continue Analysis
              </Link>
            </Button>
          </div>
        </div>

        {/* Status Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-2">{concept.progress}%</div>
              <Progress value={concept.progress} className="h-2" />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Confidence Level</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-2">{concept.confidence}%</div>
              <Progress value={concept.confidence} className="h-2" />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Current Stage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold capitalize">{concept.status}</div>
              <p className="text-xs text-muted-foreground">Active analysis phase</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Time Invested</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{concept.metadata.actualHours}h</div>
              <p className="text-xs text-muted-foreground">
                of {concept.metadata.estimatedHours}h estimated
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Stage Progress */}
        <Card>
          <CardHeader>
            <CardTitle>EARL Analysis Pipeline</CardTitle>
            <CardDescription>Progress through the four analysis stages</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              {stageProgress.map((stage, index) => (
                <div key={stage.stage} className="relative">
                  <div className={`p-4 rounded-lg border-2 transition-colors ${
                    stage.status === 'completed' 
                      ? 'border-green-500 bg-green-50' 
                      : stage.status === 'active'
                        ? 'border-primary bg-primary/5'
                        : 'border-muted bg-muted/20'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{stage.stage}</h4>
                      <Badge 
                        variant={stage.status === 'completed' ? 'default' : 'secondary'}
                        className="capitalize"
                      >
                        {stage.status}
                      </Badge>
                    </div>
                    <Progress value={stage.progress} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1">
                      {stage.progress}% complete
                    </p>
                  </div>
                  
                  {index < stageProgress.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-2 w-4 h-0.5 bg-muted transform -translate-y-1/2" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="history">Analysis History</TabsTrigger>
            <TabsTrigger value="metadata">Metadata</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Concept Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Domain:</span>
                      <span className="font-medium">{concept.domain}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subdomain:</span>
                      <span className="font-medium">{concept.subdomain}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Complexity:</span>
                      <Badge variant="outline">{concept.metadata.complexity}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Priority:</span>
                      <Badge variant="outline">{concept.metadata.priority}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Project Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-2">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Author: {concept.author}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Created: {concept.createdAt}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Updated: {concept.updatedAt}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Analysis Timeline</CardTitle>
                <CardDescription>Complete history of analysis stages</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analysisHistory.map((entry, index) => (
                    <div key={index} className="border-l-2 border-primary pl-4 pb-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium capitalize">{entry.stage} Stage</h4>
                        <span className="text-sm text-muted-foreground">{entry.completedAt}</span>
                      </div>
                      <div className="mb-2">
                        <span className="text-sm text-muted-foreground">Confidence: </span>
                        <span className="font-medium">{entry.confidence}%</span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-sm font-medium">Key Findings:</span>
                        <ul className="text-sm text-muted-foreground ml-4 space-y-1">
                          {entry.keyFindings.map((finding, i) => (
                            <li key={i} className="list-disc">{finding}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="metadata" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Technical Metadata</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <h4 className="font-medium">Analysis Parameters</h4>
                    <div className="text-sm space-y-1">
                      <div>Confidence Threshold: 75%</div>
                      <div>Analysis Depth: Comprehensive</div>
                      <div>Validation Method: Peer Review</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Performance Metrics</h4>
                    <div className="text-sm space-y-1">
                      <div>Processing Time: 2.4 hours</div>
                      <div>Memory Usage: 85MB</div>
                      <div>Iterations: 3</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default ConceptDetail;
