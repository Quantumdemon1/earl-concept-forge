
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, BarChart3, Lightbulb, RefreshCw, Target } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full text-primary text-sm font-medium mb-6">
              <Target className="h-4 w-4" />
              Advanced Concept Analysis Platform
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            EARL Framework
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Transform complex concepts into structured insights using our 
            <strong className="text-foreground"> Evaluate-Analyze-Refine-Reiterate</strong> methodology
          </p>
          
          <div className="flex gap-4 justify-center">
            <Button asChild size="lg">
              <Link to="/dashboard">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/concepts">
                View Concepts
              </Link>
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-lg">Evaluate</CardTitle>
              <CardDescription>
                Assess concept clarity and identify key components
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-lg">Analyze</CardTitle>
              <CardDescription>
                Deep dive into relationships and dependencies
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <RefreshCw className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-lg">Refine</CardTitle>
              <CardDescription>
                Improve understanding through iteration
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <Lightbulb className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-lg">Reiterate</CardTitle>
              <CardDescription>
                Continuous improvement through feedback loops
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* CTA Section */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-8 text-center">
            <CardTitle className="text-2xl mb-4">Ready to Transform Your Research?</CardTitle>
            <CardDescription className="text-lg mb-6">
              Join researchers and analysts using EARL Framework for systematic concept analysis
            </CardDescription>
            <Button asChild size="lg">
              <Link to="/dashboard">
                Start Your Analysis
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
