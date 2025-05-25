
import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { 
  Play, 
  Pause, 
  ArrowLeft, 
  Download,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  TrendingUp
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";

const AnalysisView = () => {
  const { id, stage } = useParams();
  const [isRunning, setIsRunning] = useState(false);
  const [currentProgress, setCurrentProgress] = useState(65);

  // Mock real-time updates
  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => {
        setCurrentProgress(prev => Math.min(prev + Math.random() * 5, 100));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isRunning]);

  const stages = [
    { key: "evaluate", name: "Evaluate", status: "completed", progress: 100 },
    { key: "analyze", name: "Analyze", status: "active", progress: 65 },
    { key: "refine", name: "Refine", status: "pending", progress: 0 },
    { key: "reiterate", name: "Reiterate", status: "pending", progress: 0 }
  ];

  const metrics = [
    { name: "Clarity", value: 85 },
    { name: "Completeness", value: 72 },
    { name: "Consistency", value: 90 },
    { name: "Relevance", value: 88 },
    { name: "Accuracy", value: 76 },
  ];

  const confidenceData = [
    { step: 1, confidence: 45 },
    { step: 2, confidence: 52 },
    { step: 3, confidence: 61 },
    { step: 4, confidence: 68 },
    { step: 5, confidence: 74 },
    { step: 6, confidence: 78 },
  ];

  const currentStage = stages.find(s => s.key === stage) || stages[1];

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" asChild>
              <Link to={`/concepts/${id}`}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Concept
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Analysis View</h1>
              <p className="text-muted-foreground">AI Ethics Concept Analysis</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export Results
            </Button>
            <Button 
              onClick={() => setIsRunning(!isRunning)}
              disabled={currentProgress >= 100}
            >
              {isRunning ? (
                <>
                  <Pause className="mr-2 h-4 w-4" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Resume
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Stage Pipeline */}
        <Card>
          <CardHeader>
            <CardTitle>EARL Analysis Pipeline</CardTitle>
            <CardDescription>Progress through the four analysis stages</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              {stages.map((stageItem, index) => (
                <Link
                  key={stageItem.key}
                  to={`/concepts/${id}/analysis/${stageItem.key}`}
                  className="block"
                >
                  <div className={`p-4 rounded-lg border-2 transition-all hover:shadow-md ${
                    stageItem.key === stage
                      ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                      : stageItem.status === 'completed' 
                        ? 'border-green-500 bg-green-50' 
                        : stageItem.status === 'active'
                          ? 'border-primary bg-primary/5'
                          : 'border-muted bg-muted/20'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{stageItem.name}</h4>
                      {stageItem.status === 'completed' ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : stageItem.status === 'active' ? (
                        <RefreshCw className="h-5 w-5 text-primary animate-spin" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                    <Progress 
                      value={stageItem.key === stage ? currentProgress : stageItem.progress} 
                      className="h-2 mb-2" 
                    />
                    <p className="text-xs text-muted-foreground">
                      {stageItem.key === stage ? currentProgress : stageItem.progress}% complete
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Real-time Status */}
        {isRunning && (
          <Card className="border-primary bg-primary/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <RefreshCw className="h-5 w-5 text-primary animate-spin" />
                <div className="flex-1">
                  <h4 className="font-medium">Analysis in Progress</h4>
                  <p className="text-sm text-muted-foreground">
                    Currently processing {currentStage.name.toLowerCase()} stage...
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">{currentProgress.toFixed(1)}%</div>
                  <p className="text-xs text-muted-foreground">Complete</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="visualizations">Visualizations</TabsTrigger>
            <TabsTrigger value="raw">Raw Data</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Current Confidence</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold mb-2">78%</div>
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <TrendingUp className="h-4 w-4" />
                    +12% from last iteration
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Processing Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold mb-2">2.4h</div>
                  <p className="text-sm text-muted-foreground">
                    Estimated 45min remaining
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Iterations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold mb-2">6</div>
                  <p className="text-sm text-muted-foreground">
                    Current analysis cycle
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Key Insights</CardTitle>
                <CardDescription>Primary findings from the current analysis stage</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Ethical Framework Identification</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Successfully identified 5 core ethical principles relevant to AI development
                    </p>
                    <Badge variant="secondary">High Confidence: 92%</Badge>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Stakeholder Impact Analysis</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Mapped potential impacts across 8 stakeholder groups
                    </p>
                    <Badge variant="secondary">Medium Confidence: 74%</Badge>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Implementation Challenges</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Identified 3 major implementation barriers requiring further analysis
                    </p>
                    <Badge variant="outline">Pending Refinement</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="details" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Detailed Metrics</CardTitle>
                <CardDescription>Comprehensive analysis metrics for the current stage</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <h4 className="font-medium mb-4">Quality Metrics</h4>
                    <div className="space-y-3">
                      {metrics.map((metric) => (
                        <div key={metric.name} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>{metric.name}</span>
                            <span className="font-medium">{metric.value}%</span>
                          </div>
                          <Progress value={metric.value} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-4">Analysis Components</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Core Concepts Identified:</span>
                        <span className="font-medium">23</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Relationships Mapped:</span>
                        <span className="font-medium">45</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Sources Referenced:</span>
                        <span className="font-medium">18</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Validation Points:</span>
                        <span className="font-medium">12</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="visualizations" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Confidence Progression</CardTitle>
                  <CardDescription>How confidence has evolved through iterations</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={confidenceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="step" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="confidence" 
                        stroke="#8b5cf6" 
                        strokeWidth={2}
                        dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quality Assessment</CardTitle>
                  <CardDescription>Multi-dimensional quality evaluation</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <RadarChart data={metrics}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="name" />
                      <PolarRadiusAxis domain={[0, 100]} />
                      <Radar
                        name="Quality"
                        dataKey="value"
                        stroke="#8b5cf6"
                        fill="#8b5cf6"
                        fillOpacity={0.2}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="raw" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Raw Analysis Data</CardTitle>
                <CardDescription>Complete data output from the analysis engine</CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted p-4 rounded-lg text-xs overflow-auto max-h-96">
{`{
  "analysisId": "earl-ai-ethics-001",
  "stage": "analyze",
  "timestamp": "2024-01-20T14:30:00Z",
  "confidence": 0.78,
  "metrics": {
    "clarity": 0.85,
    "completeness": 0.72,
    "consistency": 0.90,
    "relevance": 0.88,
    "accuracy": 0.76
  },
  "concepts": [
    {
      "id": "ethical-principle-1",
      "name": "Beneficence",
      "weight": 0.92,
      "relationships": ["non-maleficence", "autonomy"]
    },
    {
      "id": "ethical-principle-2", 
      "name": "Non-maleficence",
      "weight": 0.89,
      "relationships": ["beneficence", "justice"]
    }
  ],
  "recommendations": [
    {
      "type": "refinement",
      "priority": "high",
      "description": "Clarify stakeholder definitions"
    }
  ]
}`}
                </pre>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default AnalysisView;
