import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { CategoryStats } from "@/services/analytics-service"

interface CategoryStatsChartProps {
  categoryStats: CategoryStats[]
}

export function CategoryStatsChart({ categoryStats }: CategoryStatsChartProps) {
  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Properties by Categories</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {categoryStats.length > 0 ? (
            categoryStats.map((category, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{category.propertyCategory}</span>
                  <div className="text-right">
                    <span className="text-sm font-semibold">{formatNumber(category.count)}</span>
                    <span className="text-xs text-gray-500 ml-1">({category.percentage}%)</span>
                  </div>
                </div>
                <Progress value={category.percentage} className="h-2" />
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
