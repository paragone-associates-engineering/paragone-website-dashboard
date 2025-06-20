

import { Loader2 } from "lucide-react"
//import { toast } from "sonner"
import { AnalyticsResponse} from "@/services/analytics-service"
import { ListingTypeCards } from "./listing-type-cards"
import { RegionStatsChart } from "./region-stats-chart"
import { CountryStatsChart } from "./country-stats-chart"

interface AnalyticsData {
    analyticsData:  AnalyticsResponse | null,
    isLoading: boolean,
    isError: boolean,
    error: Error | null,
}
export default function Analytics({analyticsData,isLoading, isError, error}: AnalyticsData) {
  
  if (isLoading) {
    return (
      <div className="p-6 max-w-full">
        <div className="mb-6">
          <h1 className="text-2xl font-bold"> Dashboard</h1>
          <p className="text-gray-600">Property listings insights and statistics</p>
        </div>
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading analytics...</span>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="p-6 max-w-full">
        <div className="mb-6">
          <h1 className="text-2xl font-bold"> Dashboard</h1>
        </div>
        <div className="text-center text-red-500 py-12">
          <p>Error loading analytics data. Please try again.</p>
          {error instanceof Error && <p className="text-sm text-gray-500 mt-2">{error.message}</p>}
        </div>
      </div>
    )
  }

//   const formatNumber = (num: number) => {
//     return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
//   }

  return (
    <div className=" max-w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-gray-600">Property listings insights and statistics</p>
      </div>

      
      <div className="mb-6">
        {/* <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-4xl font-bold mb-2">{formatNumber(analyticsData?.totalListings || 0)}</h2>
                <p className="text-purple-100">Total Property Listings</p>
              </div>
              <div className="bg-white bg-opacity-20 p-4 rounded-full">
                <TrendingUp className="h-8 w-8" />
              </div>
            </div>
          </CardContent>
        </Card> */}
      </div>

    
      <ListingTypeCards
        listingTypeStats={analyticsData?.listingTypeStats || []}
        totalListings={analyticsData?.totalListings || 0}
      />

    
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <RegionStatsChart regionStats={analyticsData?.regionStats || []} />
        <CountryStatsChart countryStats={analyticsData?.countryStats || []} />
      </div>
 
    </div>
  )
}
