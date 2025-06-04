import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { RegionStats } from "@/services/analytics-service"

interface RegionStatsChartProps {
  regionStats: RegionStats[]
}

export function RegionStatsChart({ regionStats }: RegionStatsChartProps) {
  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Properties by Region</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {regionStats.length > 0 ? (
            regionStats.map((region, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{region.region}</span>
                  <div className="text-right">
                    <span className="text-sm font-semibold">{formatNumber(region.count)}</span>
                    <span className="text-xs text-gray-500 ml-1">({region.percentage}%)</span>
                  </div>
                </div>
                <Progress value={region.percentage} className="h-2" />
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 py-4">No regional data available</div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
