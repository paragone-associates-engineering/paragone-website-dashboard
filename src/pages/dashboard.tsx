import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star } from "lucide-react"
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
// import { Progress } from "@/components/ui/progress"
import CircleProgress from "@/components/shared/circle-progress"
//import PropertyMapChart from "@/components/shared/location-chart"
import PropertyOverviewChart from "@/components/shared/property-overview"
import PropertyListings from "@/components/listings/all-properties"
import { useQuery } from "@tanstack/react-query"
import { reviewService } from "@/services/review-service"
import { cn } from "@/lib/utils"
import { Link } from "react-router-dom"

const Dashboard = () => {
 
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
    <div className="p-3 md:p-6 lg:max-w-[980px] 2xl:max-w-full overflow-x-hidden">
      {/* Property Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="bg-blue-500 text-white overflow-hidden">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <h2 className="text-4xl font-bold">684</h2>
              <p className="text-blue-100">Properties for Sale</p>
            </div>
            <div>
            <CircleProgress percentage={50} size={70} />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-green-500 text-white overflow-hidden">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <h2 className="text-4xl font-bold">546</h2>
              <p className="text-green-100">Properties for Rent</p>
            </div>
            <div>
            <CircleProgress percentage={80} size={70} />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-orange-500 text-white overflow-hidden">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <h2 className="text-4xl font-bold">3,672</h2>
              <p className="text-orange-100">Properties for Short Stay</p>
            </div>
            <div>
            <CircleProgress percentage={40} size={70} />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-700 text-white overflow-hidden">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <h2 className="text-4xl font-bold">75</h2>
              <p className="text-gray-300">Total Land</p>
            </div>
            <div>
            <CircleProgress percentage={50} size={70} />
            </div>
          </CardContent>
        </Card>
      </div>

    {/* Reviews and Overview */}
<div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
  {/* Customer Reviews */}
  <Card>
    <CardContent className="p-6">
      <h3 className="font-medium mb-4">Customer Review</h3>
      <div className="grid grid-cols-1 gap-6 mb-6 mt-12">
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
        <Button variant="default" className="w-full bg-primary mt-6 hover:bg-primary/90">
          See More Reviews
        </Button>
      </Link>
    </CardContent>
  </Card>
<div className="lg:col-span-2">
  {/* Overview Chart */}
  <PropertyOverviewChart />
  </div>
</div>

     
      {/* Property Overview Table */}
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-medium">Property Overview</h3>
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
