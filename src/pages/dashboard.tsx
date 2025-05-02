
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MoreHorizontal, MoreVertical } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Progress } from "@/components/ui/progress"
import CircleProgress from "@/components/shared/circle-progress"
import PropertyMapChart from "@/components/shared/location-chart"
import PropertyOverviewChart from "@/components/shared/property-overview"

const Dashboard = () => {
  const [sortBy, setSortBy] = useState("Most views")

  return (
    <div className="p-3 md:p-6">
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

      {/* Middle Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* Property Stats */}
        <Card className="lg:col-span-1">
          <CardContent className="p-6">
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">Property Viewed</h3>
                <span className="text-sm text-gray-500">561/days</span>
              </div>
              <Progress value={75} className="h-2 bg-gray-200">
                <div className="h-full bg-primary rounded-full"></div>
              </Progress>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">Property Listed</h3>
                <span className="text-sm text-gray-500">3,456 Unit</span>
              </div>
              <Progress value={60} className="h-2 bg-gray-200">
                <div className="h-full bg-primary rounded-full"></div>
              </Progress>
            </div>
          </CardContent>
        </Card>

        {/* Map */}
       <PropertyMapChart />
      </div>

      {/* Reviews and Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Customer Reviews */}
        <Card className="lg:col-span-1">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-medium">Customer Review</h3>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-6">
              {/* Review 1 */}
              <div className="border-b pb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Avatar>
                    <AvatarImage src="/placeholder.svg" alt="Bella Smith" />
                    <AvatarFallback>BS</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-medium">Bella Smith</h4>
                    <p className="text-xs text-gray-500">20m ago</p>
                  </div>
                  <div className="ml-auto flex">
                    {[1, 2, 3, 4].map((star) => (
                      <svg key={star} className="w-4 h-4 text-primary fill-current" viewBox="0 0 24 24">
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                    <svg className="w-4 h-4 text-gray-300 fill-current" viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  Dealing with Syamsudin and Bakri was a joy. I got in touch with Just Property after viewing a property
                  online. Both Syamsudin and Bakri strive to deliver a professional service and surpassed my
                  expectations. I found them both to be extremely approachable and not at all bombastic...
                </p>
              </div>

              {/* Review 2 */}
              <div className="border-b pb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Avatar>
                    <AvatarImage src="/placeholder.svg" alt="Samantha William" />
                    <AvatarFallback>SW</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-medium">Samantha William</h4>
                    <p className="text-xs text-gray-500">5m ago</p>
                  </div>
                  <div className="ml-auto flex">
                    {[1, 2, 3, 4].map((star) => (
                      <svg key={star} className="w-4 h-4 text-primary fill-current" viewBox="0 0 24 24">
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                    <svg className="w-4 h-4 text-gray-300 fill-current" viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  I viewed a number of properties with Just Property and found them to be professional, efficient,
                  patient, courteous and helpful every time.
                </p>
              </div>

              {/* Review 3 */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Avatar>
                    <AvatarImage src="/placeholder.svg" alt="John Doe" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-medium">John Doe</h4>
                    <p className="text-xs text-gray-500">4h ago</p>
                  </div>
                  <div className="ml-auto flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} className="w-4 h-4 text-primary fill-current" viewBox="0 0 24 24">
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  Friendly service. Josh, Lunar and everyone at Just Property in Hastings deserved a big thank you for
                  helping me move from Jakarta to Medan during the lockdown.
                </p>
              </div>
            </div>

            <Button variant="default" className="w-full mt-6 bg-primary hover:bg-primary/90">
              See More Reviews
            </Button>
          </CardContent>
        </Card>

        {/* Overview Charts */}
       <PropertyOverviewChart />
      </div>

      {/* Property Stats Cards */}
      {/* <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
        <Card className="bg-white">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-3xl font-bold">2,356</h2>
                <p className="text-gray-500">Properties for Sale</p>
                <p className="text-xs text-gray-400">Target 3k/month</p>
              </div>
              <div className="relative h-20 w-20">
                <svg viewBox="0 0 36 36" className="h-20 w-20 -rotate-90">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#eee"
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#4338ca"
                    strokeWidth="3"
                    strokeDasharray="71, 100"
                  />
                  <text x="18" y="20.5" textAnchor="middle" className="text-xs font-medium">
                    71%
                  </text>
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-3xl font-bold">2,206</h2>
                <p className="text-gray-500">Properties for Rent</p>
                <p className="text-xs text-gray-400">Target 3k/month</p>
              </div>
              <div className="relative h-20 w-20">
                <svg viewBox="0 0 36 36" className="h-20 w-20 -rotate-90">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#eee"
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="3"
                    strokeDasharray="33, 100"
                  />
                  <text x="18" y="20.5" textAnchor="middle" className="text-xs font-medium">
                    33%
                  </text>
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-3xl font-bold">1,721</h2>
                <p className="text-gray-500">Properties for Short stay</p>
                <p className="text-xs text-gray-400">Target 3k/month</p>
              </div>
              <div className="relative h-20 w-20">
                {/* <svg viewBox="0 0 36 36" className="h-20 w-20 -rotate-90">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#eee"
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#8b5cf6"
                    strokeWidth="3"
                    strokeDasharray="41, 100"
                  />
                  <text x="18" y="20.5" textAnchor="middle" className="text-xs font-medium">
                    41%
                  </text>
                </svg> 
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-3xl font-bold">778</h2>
                <p className="text-gray-500">Land</p>
                <p className="text-xs text-gray-400">Target 3k/month</p>
              </div>
              <div className="relative h-20 w-20">
                <svg viewBox="0 0 36 36" className="h-20 w-20 -rotate-90">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#eee"
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="3"
                    strokeDasharray="24, 100"
                  />
                  <text x="18" y="20.5" textAnchor="middle" className="text-xs font-medium">
                    24%
                  </text>
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>
      </div> */}

      {/* Property Overview Table */}
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-medium">Property Overview</h3>
            <div className="flex items-center gap-2">
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
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Order No.</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Customer</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Property</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Date</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Type</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-500"></th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-3 px-4">#841254</td>
                  <td className="py-3 px-4">Fleece Marigold</td>
                  <td className="py-3 px-4">4291 Lunetta Street,Tampa</td>
                  <td className="py-3 px-4">25/03/2018</td>
                  <td className="py-3 px-4">
                    <Badge className="bg-green-500 hover:bg-green-600">Paid</Badge>
                  </td>
                  <td className="py-3 px-4">Sold</td>
                  <td className="py-3 px-4 text-right">
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4">#854525</td>
                  <td className="py-3 px-4">Theodore Handle</td>
                  <td className="py-3 px-4">2315 Browning Lane,Corning</td>
                  <td className="py-3 px-4">04/06/2018</td>
                  <td className="py-3 px-4">
                    <Badge className="bg-green-500 hover:bg-green-600">Paid</Badge>
                  </td>
                  <td className="py-3 px-4">On Rent</td>
                  <td className="py-3 px-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View details</DropdownMenuItem>
                        <DropdownMenuItem>Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4">#826548</td>
                  <td className="py-3 px-4">Archibald Northbottom</td>
                  <td className="py-3 px-4">3946 Coburn Hollow Road,South Pekin</td>
                  <td className="py-3 px-4">18/06/2018</td>
                  <td className="py-3 px-4">
                    <Badge className="bg-primary hover:bg-primary/90">Pending</Badge>
                  </td>
                  <td className="py-3 px-4">On Rent</td>
                  <td className="py-3 px-4 text-right">
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4">#862145</td>
                  <td className="py-3 px-4">Carnegie Mondover</td>
                  <td className="py-3 px-4">3292 Lindale Avenue,Oakland</td>
                  <td className="py-3 px-4">26/06/2018</td>
                  <td className="py-3 px-4">
                    <Badge className="bg-red-500 hover:bg-red-600">Failed</Badge>
                  </td>
                  <td className="py-3 px-4">Sold</td>
                  <td className="py-3 px-4 text-right">
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4">#872645</td>
                  <td className="py-3 px-4">Ursula Gurnmeister</td>
                  <td className="py-3 px-4">3893 Melm Street,Providence</td>
                  <td className="py-3 px-4">03/07/2018</td>
                  <td className="py-3 px-4">
                    <Badge className="bg-green-500 hover:bg-green-600">Paid</Badge>
                  </td>
                  <td className="py-3 px-4">On Rent</td>
                  <td className="py-3 px-4 text-right">
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4">#874125</td>
                  <td className="py-3 px-4">Ingredia Nutrisha</td>
                  <td className="py-3 px-4">1553 Heritage Road,Visalia</td>
                  <td className="py-3 px-4">14/07/2018</td>
                  <td className="py-3 px-4">
                    <Badge className="bg-primay hover:bg-primary/90">Pending</Badge>
                  </td>
                  <td className="py-3 px-4">Sold</td>
                  <td className="py-3 px-4 text-right">
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      
    </div>
  )
}

export default Dashboard
