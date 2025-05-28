
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { CheckCircle, AlertCircle, Clock, TrendingUp } from 'lucide-react'
import type { QualityAnalysis, GapAnalysisResult } from '@/services/gapAnalysisService'

interface DeliverableQualityDashboardProps {
  qualityAnalysis: QualityAnalysis
  gapAnalysis: GapAnalysisResult
  conceptName: string
}

export default function DeliverableQualityDashboard({
  qualityAnalysis,
  gapAnalysis,
  conceptName
}: DeliverableQualityDashboardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 80) return 'default'
    if (score >= 60) return 'secondary'
    return 'destructive'
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Quality Overview for {conceptName}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Completeness</span>
                <Badge variant={getScoreBadgeVariant(qualityAnalysis.completenessScore)}>
                  {qualityAnalysis.completenessScore}%
                </Badge>
              </div>
              <Progress value={qualityAnalysis.completenessScore} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Clarity</span>
                <Badge variant={getScoreBadgeVariant(qualityAnalysis.clarityScore)}>
                  {qualityAnalysis.clarityScore}%
                </Badge>
              </div>
              <Progress value={qualityAnalysis.clarityScore} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Actionability</span>
                <Badge variant={getScoreBadgeVariant(qualityAnalysis.actionabilityScore)}>
                  {qualityAnalysis.actionabilityScore}%
                </Badge>
              </div>
              <Progress value={qualityAnalysis.actionabilityScore} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Market Readiness</span>
                <Badge variant={getScoreBadgeVariant(qualityAnalysis.marketReadinessScore)}>
                  {qualityAnalysis.marketReadinessScore}%
                </Badge>
              </div>
              <Progress value={qualityAnalysis.marketReadinessScore} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {gapAnalysis.missingComponents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-600">
              <AlertCircle className="h-5 w-5" />
              Missing Components
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {gapAnalysis.missingComponents.slice(0, 5).map((component, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-amber-500" />
                  <span>{component}</span>
                </div>
              ))}
              {gapAnalysis.missingComponents.length > 5 && (
                <p className="text-sm text-muted-foreground">
                  +{gapAnalysis.missingComponents.length - 5} more components
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {gapAnalysis.recommendedActions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Recommended Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {gapAnalysis.recommendedActions.slice(0, 3).map((action, index) => (
                <div key={index} className="flex items-start gap-2 text-sm">
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-green-600 text-xs font-medium">{index + 1}</span>
                  </div>
                  <span>{action}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
