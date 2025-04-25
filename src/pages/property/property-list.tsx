
import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MoreVertical, ChevronDown, Star } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Link } from "react-router-dom"

interface Property {
  id: string
  date: string
  customer: string
  property: {
    address: string
    location: string
  }
  location: string
  price: string
  type: string
  agent: string
  status: "Pending" | "Negotiation" | "Ends in 60 days" | "Ends in 05 days"
  featured?: boolean
}

const properties: Property[] = [
  {
    id: "#0001234",
    date: "26/04/2020, 12:42 AM",
    customer: "Stephani",
    property: {
      address: "TY35 Avenue GG",
      location: "London Center",
    },
    location: "Straight 22th London 51256",
    price: "$235k",
    type: "Apartment",
    agent: "Louis",
    status: "Ends in 60 days",
    featured: true,
  },
  {
    id: "#0001234",
    date: "26/04/2020, 12:42 AM",
    customer: "Sanji Fujiwara",
    property: {
      address: "5122 Franklin Court",
      location: "New York",
    },
    location: "Flat 2551 Center London 287223",
    price: "$245k",
    type: "Duplex",
    agent: "Robinson",
    status: "Ends in 60 days",
    featured: true,
  },
  {
    id: "#0001234",
    date: "26/04/2020, 12:42 AM",
    customer: "Hawkins",
    property: {
      address: "TY35 Avenue GG",
      location: "London Center",
    },
    location: "Waves Street 1st London 2441",
    price: "$763k",
    type: "Bungalow",
    agent: "Peter P.",
    status: "Negotiation",
    featured: true,
  },
  {
    id: "#0001234",
    date: "26/04/2020, 12:42 AM",
    customer: "Ilham Supriadi",
    property: {
      address: "TY35 Avenue GG",
      location: "London Center",
    },
    location: "Waves Street 1st London 2441",
    price: "$765k",
    type: "Maisonette",
    agent: "Randy",
    status: "Ends in 60 days",
  },
  {
    id: "#0001234",
    date: "26/04/2020, 12:42 AM",
    customer: "Smantha Jr.",
    property: {
      address: "65SM Alexander Court",
      location: "New York",
    },
    location: "Corner Street 5th London 126623",
    price: "$116k",
    type: "Apartment",
    agent: "Melinda S.",
    status: "Pending",
  },
  {
    id: "#0001234",
    date: "26/04/2020, 12:42 AM",
    customer: "Yun-Yun",
    property: {
      address: "5122 Franklin Court",
      location: "New York",
    },
    location: "Corner Street 5th London 126623",
    price: "$521k",
    type: "Bungalow",
    agent: "Thomas",
    status: "Ends in 60 days",
  },
  {
    id: "#0001234",
    date: "26/04/2020, 12:42 AM",
    customer: "James Witcwicky",
    property: {
      address: "TY35 Avenue GG",
      location: "London Center",
    },
    location: "Flat 2551 Center London 287223",
    price: "$521k",
    type: "Duplex",
    agent: "Kevin Jr.",
    status: "Ends in 05 days",
  },
]

const PropertyListing = () => {
  const [selectedProperties, setSelectedProperties] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const propertiesPerPage = 7

  // Get current properties
  const indexOfLastProperty = currentPage * propertiesPerPage
  const indexOfFirstProperty = indexOfLastProperty - propertiesPerPage
  const currentProperties = properties.slice(indexOfFirstProperty, indexOfLastProperty)
  const totalPages = Math.ceil(properties.length / propertiesPerPage)

  const toggleProperty = (id: string) => {
    setSelectedProperties((prev) => (prev.includes(id) ? prev.filter((propId) => propId !== id) : [...prev, id]))
  }

  const toggleAllProperties = () => {
    setSelectedProperties(
      selectedProperties.length === currentProperties.length ? [] : currentProperties.map((property) => property.id),
    )
  }

  const getStatusBadge = (status: string) => {
    if (status === "Negotiation") {
      return <Badge className="bg-gray-600 hover:bg-gray-700">Negotiation</Badge>
    } else if (status === "Pending") {
      return <Badge className="bg-yellow-500 hover:bg-yellow-600">Pending</Badge>
    } else if (status.includes("60 days")) {
      return <span className="text-green-600 text-sm font-medium">{status}</span>
    } else {
      return <span className="text-red-600 text-sm font-medium">{status}</span>
    }
  }

  return (
    <div className="p-6 w-full ">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Property Listing</h1>
        <div className="flex items-center gap-4">
          <Input type="search" placeholder="Search here..." className="w-[300px]" />
          <Button className="bg-yellow-500 hover:bg-yellow-600">Add Property</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardContent className="p-6 flex items-center">
            <div className="flex-1">
              <h2 className="text-4xl font-bold">623</h2>
              <p className="text-gray-500">Total Customers</p>
            </div>
            <div className="bg-gray-100 p-4 rounded-full">
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
                className="h-6 w-6"
              >
                <circle cx="12" cy="8" r="5" />
                <path d="M20 21a8 8 0 0 0-16 0" />
              </svg>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center">
            <div className="flex-1">
              <h2 className="text-4xl font-bold">982</h2>
              <p className="text-gray-500">Total Properties</p>
            </div>
            <div className="bg-gray-100 p-4 rounded-full">
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
                className="h-6 w-6"
              >
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-white rounded-lg border ">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedProperties.length === currentProperties.length && currentProperties.length > 0}
                  onCheckedChange={toggleAllProperties}
                />
              </TableHead>
              <TableHead className="w-12"></TableHead>
              <TableHead>
                Order ID <ChevronDown className="inline-block h-4 w-4" />
              </TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Property</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Agent</TableHead>
              <TableHead>Subscription</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentProperties.map((property, index) => (
              <TableRow key={`${property.id}-${index}`}>
                <TableCell>
                  <Checkbox
                    checked={selectedProperties.includes(property.id)}
                    onCheckedChange={() => toggleProperty(property.id)}
                  />
                </TableCell>
                <TableCell>
                  {property.featured && <Star className="h-5 w-5 text-yellow-500" fill="currentColor" />}
                </TableCell>
                <TableCell>{property.id}</TableCell>
                <TableCell>{property.date}</TableCell>
                <TableCell>{property.customer}</TableCell>
                <TableCell>
                  <div>{property.property.address}</div>
                  <div className="text-sm text-gray-500">{property.property.location}</div>
                </TableCell>
                <TableCell>{property.location}</TableCell>
                <TableCell>{property.price}</TableCell>
                <TableCell>{property.type}</TableCell>
                <TableCell>{property.agent}</TableCell>
                <TableCell>
                  {property.status === "Pending" ? (
                    <Badge className="bg-yellow-500 hover:bg-yellow-600">Pending</Badge>
                  ) : property.status === "Negotiation" ? (
                    <Badge className="bg-gray-600 hover:bg-gray-700">Negotiation</Badge>
                  ) : (
                    getStatusBadge(property.status)
                  )}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                     <Link to='/property/detail/1'><DropdownMenuItem>View details</DropdownMenuItem></Link> 
                      <DropdownMenuItem>Edit property</DropdownMenuItem>
                      <DropdownMenuItem>Make featured</DropdownMenuItem>
                      <DropdownMenuItem>Change status</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="flex items-center justify-between p-4 border-t">
          <div className="text-sm text-gray-500">
            Showing {indexOfFirstProperty + 1} to {Math.min(indexOfLastProperty, properties.length)} of{" "}
            {properties.length} results
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
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
                <path d="m15 18-6-6 6-6" />
              </svg>
            </Button>
            <Button
              variant={currentPage === 1 ? "default" : "outline"}
              size="sm"
              className={currentPage === 1 ? "bg-yellow-500 hover:bg-yellow-600" : ""}
              onClick={() => setCurrentPage(1)}
            >
              1
            </Button>
            {totalPages > 1 && (
              <Button
                variant={currentPage === 2 ? "default" : "outline"}
                size="sm"
                className={currentPage === 2 ? "bg-yellow-500 hover:bg-yellow-600" : ""}
                onClick={() => setCurrentPage(2)}
              >
                2
              </Button>
            )}
            {totalPages > 2 && (
              <Button
                variant={currentPage === 3 ? "default" : "outline"}
                size="sm"
                className={currentPage === 3 ? "bg-yellow-500 hover:bg-yellow-600" : ""}
                onClick={() => setCurrentPage(3)}
              >
                3
              </Button>
            )}
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
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
                <path d="m9 18 6-6-6-6" />
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PropertyListing
