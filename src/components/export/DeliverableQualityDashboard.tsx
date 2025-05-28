
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, Target, CheckCircle, AlertTriangle } from 'lucide-react'
import type { QualityAnalysis } from '@/services/deliverableEnhancer'
import type { GapAnalysisResult } from '@/services/gapAnalysisService'

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

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="h-4 w-4 text-green-600" />
    if (score >= 60) return <Target className="h-4 w-4 text-yellow-600" />
    return <AlertTriangle className="h-4 w-4 text-red-600" />
  }

  const overallScore = Math.round((
    qualityAnalysis.completenessScore +
    qualityAnalysis.actionabilityScore +
    qualityAnalysis.clarityScore +
    qualityAnalysis.marketReadinessScore
  ) / 4)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Quality Dashboard - {conceptName}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Overall Score */}
            <div className="lg:col-span-1">
              <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border">
                <div className={`text-3xl font-bold ${getScoreColor(overallScore)}`}>
                  {overallScore}%
                </div>
                <div className="text-sm text-gray-600 mt-1">Overall</div>
                <div className="mt-2">{getScoreIcon(overallScore)}</div>
              </div>
            </div>

            {/* Individual Metrics */}
            <div className="lg:col-span-4 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-white border rounded-lg">
                <div className={`text-2xl font-bold ${getScoreColor(qualityAnalysis.completenessScore)}`}>
                  {qualityAnalysis.completenessScore}%
                </div>
                <div className="text-xs text-gray-600">Completeness</div>
                <Progress value={qualityAnalysis.completenessScore} className="mt-2 h-2" />
              </div>

              <div className="text-center p-3 bg-white border rounded-lg">
                <div className={`text-2xl font-bold ${getScoreColor(qualityAnalysis.actionabilityScore)}`}>
                  {qualityAnalysis.actionabilityScore}%
                </div>
                <div className="text-xs text-gray-600">Actionability</div>
                <Progress value={qualityAnalysis.actionabilityScore} className="mt-2 h-2" />
              </div>

              <div className="text-center p-3 bg-white border rounded-lg">
                <div className={`text-2xl font-bold ${getScoreColor(qualityAnalysis.clarityScore)}`}>
                  {qualityAnalysis.clarityScore}%
                </div>
                <div className="text-xs text-gray-600">Clarity</div>
                <Progress value={qualityAnalysis.clarityScore} className="mt-2 h-2" />
              </div>

              <div className="text-center p-3 bg-white border rounded-lg">
                <div className={`text-2xl font-bold ${getScoreColor(qualityAnalysis.marketReadinessScore)}`}>
                  {qualityAnalysis.marketReadinessScore}%
                </div>
                <div className="text-xs text-gray-600">Market Ready</div>
                <Progress value={qualityAnalysis.marketReadinessScore} className="mt-2 h-2" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gap Analysis Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Missing Components</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600 mb-2">
              {gapAnalysis.missingComponents.length}
            </div>
            {gapAnalysis.missingComponents.length > 0 ? (
              <div className="space-y-1">
                {gapAnalysis.missingComponents.slice(0, 2).map((component, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {component.substring(0, 30)}...
                  </Badge>
                ))}
                {gapAnalysis.missingComponents.length > 2 && (
                  <Badge variant="outline" className="text-xs">
                    +{gapAnalysis.missingComponents.length - 2} more
                  </Badge>
                )}
              </div>
            ) : (
              <p className="text-sm text-green-600">All components identified</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Weak Sections</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600 mb-2">
              {gapAnalysis.weakSections.length}
            </div>
            {gapAnalysis.weakSections.length > 0 ? (
              <div className="space-y-1">
                {gapAnalysis.weakSections.slice(0, 2).map((section, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {section.substring(0, 30)}...
                  </Badge>
                ))}
                {gapAnalysis.weakSections.length > 2 && (
                  <Badge variant="outline" className="text-xs">
                    +{gapAnalysis.weakSections.length - 2} more
                  </Badge>
                )}
              </div>
            ) : (
              <p className="text-sm text-green-600">No weak sections detected</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Improvement Areas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600 mb-2">
              {qualityAnalysis.suggestions.filter(s => s.priority === 'high').length}
            </div>
            <p className="text-sm text-gray-600">High priority suggestions</p>
            <div className="mt-2">
              <Badge variant="outline" className="text-xs">
                {qualityAnalysis.suggestions.length} total suggestions
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
