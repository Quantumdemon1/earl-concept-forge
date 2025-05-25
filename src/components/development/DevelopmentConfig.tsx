
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'

interface DevelopmentConfigProps {
  conceptId: string
}

interface DevelopmentConfig {
  maxIterations: number
  autoRun: boolean
  qualityThresholds: {
    completeness: number
    confidence: number
    feasibility: number
    novelty: number
  }
  llmSettings: {
    model: string
    temperature: number
    maxTokens: number
  }
  researchSources: {
    arxiv: boolean
    github: boolean
    patents: boolean
  }
}

export default function DevelopmentConfig({ conceptId }: DevelopmentConfigProps) {
  const { toast } = useToast()
  const [config, setConfig] = useState<DevelopmentConfig>({
    maxIterations: 20,
    autoRun: true,
    qualityThresholds: {
      completeness: 0.8,
      confidence: 0.75,
      feasibility: 0.7,
      novelty: 0.6,
    },
    llmSettings: {
      model: 'gpt-4o-mini',
      temperature: 0.7,
      maxTokens: 4000,
    },
    researchSources: {
      arxiv: true,
      github: true,
      patents: false,
    },
  })
  
  const [hasChanges, setHasChanges] = useState(false)
  
  useEffect(() => {
    // Load saved config for this concept
    const savedConfig = localStorage.getItem(`dev-config-${conceptId}`)
    if (savedConfig) {
      try {
        const parsed = JSON.parse(savedConfig)
        setConfig(parsed)
      } catch (error) {
        console.error('Error loading config:', error)
      }
    }
  }, [conceptId])
  
  const handleConfigChange = (path: string[], value: any) => {
    setConfig(prev => {
      const newConfig = { ...prev }
      let current = newConfig as any
      
      for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i]]
      }
      current[path[path.length - 1]] = value
      
      return newConfig
    })
    setHasChanges(true)
  }
  
  const saveConfig = () => {
    try {
      localStorage.setItem(`dev-config-${conceptId}`, JSON.stringify(config))
      setHasChanges(false)
      toast({
        title: 'Configuration saved',
        description: 'Your development settings have been saved.',
      })
    } catch (error) {
      toast({
        title: 'Error saving configuration',
        description: 'Failed to save your settings.',
        variant: 'destructive',
      })
    }
  }
  
  const resetConfig = () => {
    setConfig({
      maxIterations: 20,
      autoRun: true,
      qualityThresholds: {
        completeness: 0.8,
        confidence: 0.75,
        feasibility: 0.7,
        novelty: 0.6,
      },
      llmSettings: {
        model: 'gpt-4o-mini',
        temperature: 0.7,
        maxTokens: 4000,
      },
      researchSources: {
        arxiv: true,
        github: true,
        patents: false,
      },
    })
    setHasChanges(true)
  }
  
  return (
    <div className="space-y-6">
      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="maxIterations">Maximum Iterations</Label>
            <Input
              id="maxIterations"
              type="number"
              min="5"
              max="50"
              value={config.maxIterations}
              onChange={(e) => handleConfigChange(['maxIterations'], parseInt(e.target.value))}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="autoRun">Auto-run Development</Label>
              <p className="text-sm text-muted-foreground">
                Automatically continue iterations until completion
              </p>
            </div>
            <Switch
              id="autoRun"
              checked={config.autoRun}
              onCheckedChange={(checked) => handleConfigChange(['autoRun'], checked)}
            />
          </div>
        </CardContent>
      </Card>
      
      {/* Quality Thresholds */}
      <Card>
        <CardHeader>
          <CardTitle>Quality Thresholds</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Completeness: {Math.round(config.qualityThresholds.completeness * 100)}%</Label>
            <Slider
              value={[config.qualityThresholds.completeness * 100]}
              onValueChange={([value]) => handleConfigChange(['qualityThresholds', 'completeness'], value / 100)}
              max={100}
              min={50}
              step={5}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Confidence: {Math.round(config.qualityThresholds.confidence * 100)}%</Label>
            <Slider
              value={[config.qualityThresholds.confidence * 100]}
              onValueChange={([value]) => handleConfigChange(['qualityThresholds', 'confidence'], value / 100)}
              max={100}
              min={50}
              step={5}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Feasibility: {Math.round(config.qualityThresholds.feasibility * 100)}%</Label>
            <Slider
              value={[config.qualityThresholds.feasibility * 100]}
              onValueChange={([value]) => handleConfigChange(['qualityThresholds', 'feasibility'], value / 100)}
              max={100}
              min={50}
              step={5}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Novelty: {Math.round(config.qualityThresholds.novelty * 100)}%</Label>
            <Slider
              value={[config.qualityThresholds.novelty * 100]}
              onValueChange={([value]) => handleConfigChange(['qualityThresholds', 'novelty'], value / 100)}
              max={100}
              min={30}
              step={5}
            />
          </div>
        </CardContent>
      </Card>
      
      {/* LLM Settings */}
      <Card>
        <CardHeader>
          <CardTitle>AI Model Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="model">Model</Label>
            <Select
              value={config.llmSettings.model}
              onValueChange={(value) => handleConfigChange(['llmSettings', 'model'], value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gpt-4o-mini">GPT-4O Mini (Fast)</SelectItem>
                <SelectItem value="gpt-4o">GPT-4O (Powerful)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Temperature: {config.llmSettings.temperature}</Label>
            <Slider
              value={[config.llmSettings.temperature * 100]}
              onValueChange={([value]) => handleConfigChange(['llmSettings', 'temperature'], value / 100)}
              max={100}
              min={0}
              step={10}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="maxTokens">Max Tokens</Label>
            <Input
              id="maxTokens"
              type="number"
              min="1000"
              max="8000"
              value={config.llmSettings.maxTokens}
              onChange={(e) => handleConfigChange(['llmSettings', 'maxTokens'], parseInt(e.target.value))}
            />
          </div>
        </CardContent>
      </Card>
      
      {/* Research Sources */}
      <Card>
        <CardHeader>
          <CardTitle>Research Sources</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>ArXiv Papers</Label>
              <p className="text-sm text-muted-foreground">
                Search academic papers and research publications
              </p>
            </div>
            <Switch
              checked={config.researchSources.arxiv}
              onCheckedChange={(checked) => handleConfigChange(['researchSources', 'arxiv'], checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>GitHub Repositories</Label>
              <p className="text-sm text-muted-foreground">
                Find relevant code implementations and projects
              </p>
            </div>
            <Switch
              checked={config.researchSources.github}
              onCheckedChange={(checked) => handleConfigChange(['researchSources', 'github'], checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Patent Database</Label>
              <p className="text-sm text-muted-foreground">
                Search existing patents and intellectual property
              </p>
            </div>
            <Switch
              checked={config.researchSources.patents}
              onCheckedChange={(checked) => handleConfigChange(['researchSources', 'patents'], checked)}
            />
          </div>
        </CardContent>
      </Card>
      
      {/* Actions */}
      <div className="flex gap-2">
        <Button onClick={saveConfig} disabled={!hasChanges}>
          Save Configuration
        </Button>
        <Button variant="outline" onClick={resetConfig}>
          Reset to Defaults
        </Button>
      </div>
    </div>
  )
}
