
import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import { useState } from "react";
import { 
  Plus, 
  Search, 
  Filter, 
  Play,
  Eye,
  MoreVertical,
  Lightbulb
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const mockConcepts = [
  {
    id: 1,
    name: "Artificial Intelligence Ethics",
    description: "Exploring the moral implications and guidelines for AI development and deployment",
    domain: "Technology",
    status: "analyze",
    progress: 65,
    lastUpdated: "2 hours ago",
    confidence: 78
  },
  {
    id: 2,
    name: "Quantum Computing Principles",
    description: "Fundamental concepts underlying quantum computational systems",
    domain: "Physics",
    status: "refine",
    progress: 85,
    lastUpdated: "1 day ago",
    confidence: 92
  },
  {
    id: 3,
    name: "Sustainable Energy Systems",
    description: "Analysis of renewable energy infrastructure and implementation strategies",
    domain: "Environmental Science",
    status: "evaluate",
    progress: 25,
    lastUpdated: "3 hours ago",
    confidence: 45
  },
  {
    id: 4,
    name: "Neural Network Architecture",
    description: "Deep learning model structures and optimization techniques",
    domain: "Machine Learning",
    status: "reiterate",
    progress: 90,
    lastUpdated: "5 hours ago",
    confidence: 88
  },
  {
    id: 5,
    name: "Behavioral Economics",
    description: "Psychological factors influencing economic decision-making",
    domain: "Economics",
    status: "completed",
    progress: 100,
    lastUpdated: "2 days ago",
    confidence: 95
  },
  {
    id: 6,
    name: "Blockchain Technology",
    description: "Distributed ledger systems and their applications",
    domain: "Technology",
    status: "draft",
    progress: 10,
    lastUpdated: "1 week ago",
    confidence: 30
  }
];

const statusColors = {
  draft: "bg-gray-100 text-gray-800",
  evaluate: "bg-blue-100 text-blue-800",
  analyze: "bg-yellow-100 text-yellow-800",
  refine: "bg-purple-100 text-purple-800",
  reiterate: "bg-orange-100 text-orange-800",
  completed: "bg-green-100 text-green-800"
};

const Concepts = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDomain, setSelectedDomain] = useState("all");

  const filteredConcepts = mockConcepts.filter(concept => 
    concept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    concept.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Concepts</h1>
            <p className="text-muted-foreground">Manage and analyze your concepts</p>
          </div>
          <Button asChild>
            <Link to="/concepts/new">
              <Plus className="mr-2 h-4 w-4" />
              New Concept
            </Link>
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex gap-4 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search concepts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Concepts Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredConcepts.map((concept) => (
            <Card key={concept.id} className="group hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-2">{concept.name}</CardTitle>
                    <CardDescription className="mt-1 line-clamp-2">
                      {concept.description}
                    </CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-popover border">
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>Duplicate</DropdownMenuItem>
                      <DropdownMenuItem>Export</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="capitalize">
                    {concept.domain}
                  </Badge>
                  <Badge 
                    variant="secondary" 
                    className={`capitalize ${statusColors[concept.status as keyof typeof statusColors]}`}
                  >
                    {concept.status}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{concept.progress}%</span>
                  </div>
                  <Progress value={concept.progress} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Confidence</span>
                    <span className="font-medium">{concept.confidence}%</span>
                  </div>
                  <Progress value={concept.confidence} className="h-2" />
                </div>

                <div className="flex justify-between items-center pt-2">
                  <span className="text-xs text-muted-foreground">
                    Updated {concept.lastUpdated}
                  </span>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" asChild>
                      <Link to={`/concepts/${concept.id}`}>
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Link>
                    </Button>
                    {concept.status !== 'completed' && (
                      <Button size="sm" asChild>
                        <Link to={`/concepts/${concept.id}/analysis`}>
                          <Play className="h-3 w-3 mr-1" />
                          Analyze
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredConcepts.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Lightbulb className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No concepts found</h3>
              <p className="text-muted-foreground text-center mb-6">
                {searchTerm ? "Try adjusting your search terms" : "Create your first concept to get started"}
              </p>
              <Button asChild>
                <Link to="/concepts/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Concept
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
};

export default Concepts;
