
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MoreVertical, Phone, Video, MessageSquare } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Customer {
  id: string
  name: string
  location: string
  image: string
  status: "active" | "inactive"
}

const customers: Customer[] = [
  {
    id: "#123125",
    name: "Kaiya Curtis",
    location: "TY35 Avenue GG London Center",
    image: "/placeholder.svg",
    status: "active",
  },
  {
    id: "#123125",
    name: "Jaydon Torff",
    location: "ABC12 Franklin Avenue London",
    image: "/placeholder.svg",
    status: "active",
  },
  {
    id: "#123125",
    name: "Jordyn Torff",
    location: "TY35 Avenue GG London Center",
    image: "/placeholder.svg",
    status: "active",
  },
  {
    id: "#123125",
    name: "Livia Vaccaro",
    location: "TY35 Avenue GG London Center",
    image: "/placeholder.svg",
    status: "active",
  },
  {
    id: "#123125",
    name: "Alfonso Calzoni",
    location: "TY35 Avenue GG London Center",
    image: "/placeholder.svg",
    status: "active",
  },
  {
    id: "#123125",
    name: "Mira Levin",
    location: "TY35 Avenue GG London Center",
    image: "/placeholder.svg",
    status: "active",
  },
  {
    id: "#123125",
    name: "Livia Baptista",
    location: "TY35 Avenue GG London Center",
    image: "/placeholder.svg",
    status: "active",
  },
  {
    id: "#123125",
    name: "Gretchen Calzoni",
    location: "TY35 Avenue GG London Center",
    image: "/placeholder.svg",
    status: "active",
  },
  {
    id: "#123125",
    name: "Jaxson Vetrovs",
    location: "TY35 Avenue GG London Center",
    image: "/placeholder.svg",
    status: "active",
  },
  {
    id: "#123125",
    name: "Jakob Donin",
    location: "TY35 Avenue GG London Center",
    image: "/placeholder.svg",
    status: "active",
  },
  {
    id: "#123125",
    name: "Ryan Bergson",
    location: "TY35 Avenue GG London Center",
    image: "/placeholder.svg",
    status: "active",
  },
  {
    id: "#123125",
    name: "Carla George",
    location: "TY35 Avenue GG London Center",
    image: "/placeholder.svg",
    status: "active",
  },
]

const CustomersGrid = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const customersPerPage = 8

  // Get current customers
  const indexOfLastCustomer = currentPage * customersPerPage
  const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage
  const currentCustomers = customers.slice(indexOfFirstCustomer, indexOfLastCustomer)
  const totalPages = Math.ceil(customers.length / customersPerPage)

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Customers</h1>
        <div className="flex items-center gap-4">
          <Input type="search" placeholder="Search here..." className="w-[300px]" />
          <Button className="bg-primary hover:bg-yellow-600">+ Add New Customer</Button>
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <Input type="search" placeholder="Search" className="w-[300px]" />
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Sort by:</span>
          <Select defaultValue="newest">
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
              <SelectItem value="name">Name (A-Z)</SelectItem>
              <SelectItem value="name-desc">Name (Z-A)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-4 gap-x-2">
        {currentCustomers.map((customer, index) => (
          <Card key={index} className="overflow-hidden">
            <div className=" px-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12 border-2 ">
                    <AvatarImage src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHx8MA%3D%3D" alt={customer.name} />
                    <AvatarFallback className="whitespace-nowrap">{customer.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{customer.name}</h3>
                    <p className="text-primary text-sm">{customer.id}</p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>View details</DropdownMenuItem>
                    <DropdownMenuItem>Edit customer</DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="flex items-center gap-3 mt-4">
                <Button variant="outline" size="icon" className="rounded-full border-none text-[#FFB000]">
                  <Phone strokeWidth='3px' className="size-5" />
                </Button>
                <Button variant="outline" size="icon" className="rounded-full border-none text-[#FFB000]">
                  <Video strokeWidth='3px' className="size-5" />
                </Button>
                <Button variant="outline" size="icon" className="rounded-full border-none text-[#FFB000]">
                  <MessageSquare strokeWidth='3px' className="size-5" />
                </Button>
              </div>

              <div className="mt-2">
                <div className="text-sm ">Location</div>
                <div className="text font-bold mt-2">{customer.location}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="flex items-center justify-between mt-6">
        <div className="text-sm text-gray-500">
          Showing {indexOfFirstCustomer + 1} to {Math.min(indexOfLastCustomer, customers.length)} of {customers.length}{" "}
          results
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
  )
}

export default CustomersGrid
