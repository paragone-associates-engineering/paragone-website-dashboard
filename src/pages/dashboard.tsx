import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, BarChart3, PieChart, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
//import PropertyOverviewChart from "@/components/shared/property-overview"
import PropertyListings from "@/components/listings/all-properties"
import { useQuery } from "@tanstack/react-query"
import { reviewService } from "@/services/review-service"
import { cn } from "@/lib/utils"
import { Link } from "react-router-dom"
import Analytics from "@/components/analytics"
import { analyticsService } from "@/services/analytics-service"

const Dashboard = () => {
 const {
     data: analyticsData,
     isLoading,
     isError,
     error,
   } = useQuery({
     queryKey: ["listings-analytics"],
     queryFn: () => analyticsService.getListingsAnalytics(),
     staleTime: 1000 * 60 * 5, 
   })
   console.log('analyticsData', analyticsData)
const {data:reviews} = useQuery({
    queryKey: ["reviewsoverview"],
    queryFn: async () => reviewService.getReviews(),
     staleTime: 1000 * 60 * 5
  })
   const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn("size-4", star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300")}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="p-3 md:p-6  2xl:max-w-full overflow-x-hidden">
     
      <Analytics analyticsData={analyticsData ?? null} isError={isError} error={error} isLoading={isLoading}/>

  
<div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
  {/* Customer Reviews */}
  <Card>
    <CardContent className="px-6">
      <h3 className="font-medium mb-4">Customer Review</h3>
      <div className="grid grid-cols-1 gap-6 mb-6 ">
        {reviews?.results.slice(0, 3).map((review) => (
          <div key={review.id} className="border-b pb-4">
            <div className="flex items-center gap-2 mb-2">
              <Avatar>
                <AvatarImage src="/placeholder.svg" alt={review?.testifierName} />
                <AvatarFallback>{review.testifierName.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h4 className="font-medium">{review?.testifierName}</h4>
                <p className="text-xs text-gray-500">{review?.title}</p>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <div className="text-lg font-bold">{review.rating.toFixed(1)}</div>
                {renderStars(review.rating)}
              </div>
            </div>
            <p className="text-sm text-gray-600">{review?.content}</p>
          </div>
        ))}
      </div>
      <Link to="/reviews">
        <Button variant="default" className="w-full bg-primary  hover:bg-primary/90">
          See More Reviews
        </Button>
      </Link>
    </CardContent>
  </Card>
  
<div className=" flex flex-col gap-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Regions</CardTitle>
            <BarChart3 className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData?.regionStats?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Regions with properties</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Countries</CardTitle>
            <PieChart className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData?.countryStats?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Countries with properties</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Listing Types</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData?.listingTypeStats?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Available listing types</p>
          </CardContent>
        </Card>
      </div>
</div>

      <Card>
        <CardContent className="px-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-medium text-xl">Property Overview</h3>
            {/* <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Sort by:</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    {sortBy}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setSortBy("Most views")}>Most views</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("Newest")}>Newest</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("Oldest")}>Oldest</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("Price: High to Low")}>
                    Price: High to Low
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("Price: Low to High")}>
                    Price: Low to High
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div> */}
          </div>

          <PropertyListings />
        </CardContent>
      </Card>

      
    </div>
  )
}

export default Dashboard
