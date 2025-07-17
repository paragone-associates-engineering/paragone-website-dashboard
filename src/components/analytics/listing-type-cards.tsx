import { Card, CardContent } from "@/components/ui/card"
import { CircleProgress } from "./circle-progress"
import { Home, Building, Calendar } from "lucide-react"
import type { ListingTypeStats } from "@/services/analytics-service"

interface ListingTypeCardsProps {
  listingTypeStats: ListingTypeStats[]
  totalListings: number
}

export function ListingTypeCards({ listingTypeStats}: ListingTypeCardsProps) {
  
  const listingTypeConfigs = [
    {
      type: "For Sale",
      label: "Properties for Sale",
      bgColor: "bg-blue-500",
      textColor: "text-blue-100",
      icon: <Home className="h-8 w-8" />,
    },
    {
      type: "For Rent",
      label: "Properties for Rent",
      bgColor: "bg-green-500",
      textColor: "text-green-100",
      icon: <Building className="h-8 w-8" />,
    },
    {
      type: "Short Stay",
      label: "Properties for Short Stay",
      bgColor: "bg-orange-500",
      textColor: "text-orange-100",
      icon: <Calendar className="h-8 w-8" />,
    },
   
  ]

  // Get stats for each listing type, defaulting to 0 if not found
  const getStatsForType = (type: string) => {
    const stats = listingTypeStats.find((stat) => stat.listingType === type)
    return {
      count: stats?.count || 0,
      percentage: stats?.percentage || 0,
    }
  }

  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {listingTypeConfigs.map((config) => {
        const stats = getStatsForType(config.type)

        return (
          <Card key={config.type} className={`${config.bgColor} text-white overflow-hidden`}>
            <CardContent className="p-2 px-5">
              <div className="flex items-center justify-between mb-2">
                {/* <div className="opacity-80">{config.icon}</div> */}
                <div>
                 <h2 className="text-3xl font-bold mb-1">{formatNumber(stats.count)}</h2>
                <p className={config.textColor}>{config.label}</p>
                </div>
              
              <div>
                <CircleProgress percentage={stats.percentage} size={70} strokeWidth={15} />
                
              </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
