import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { CountryStats } from "@/services/analytics-service"

interface CountryStatsChartProps {
  countryStats: CountryStats[]
}

export function CountryStatsChart({ countryStats }: CountryStatsChartProps) {
  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Properties by Country</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {countryStats.length > 0 ? (
            countryStats.map((country, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-6 bg-green-500 rounded-sm flex items-center justify-center">
                    <span className="text-white text-xs font-bold">{country.country.slice(0, 2).toUpperCase()}</span>
                  </div>
                  <span className="font-medium">{country.country}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">{formatNumber(country.count)} properties</Badge>
                  <Badge variant="outline">{country.percentage}%</Badge>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 py-4">No country data available</div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
