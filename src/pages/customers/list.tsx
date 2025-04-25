
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { MoreVertical, ChevronDown, ChevronUp, Trash2, Eye } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"

interface Customer {
  id: string
  name: string
  joinDate: string
  location: string
  phoneNumber: string
  email: string
  image: string
}

const customers: Customer[] = [
  {
    id: "#CD1234",
    name: "James Sitepu",
    joinDate: "26/04/2020, 12:42 AM",
    location: "TY35 Avenue GG London Center",
    phoneNumber: "+51 1234 5678",
    email: "jamesitepu@mail.com",
    image: "/placeholder.svg",
  },
  {
    id: "#CD1234",
    name: "Olivia Simbolon",
    joinDate: "26/04/2020, 12:42 AM",
    location: "Connor St. 24th GG New York",
    phoneNumber: "+515 124515",
    email: "oliviasimbolon@mail.com",
    image: "/placeholder.svg",
  },
  {
    id: "#CD1234",
    name: "Robert Patilson",
    joinDate: "26/04/2020, 12:42 AM",
    location: "South Market 1st London 24512",
    phoneNumber: "+51 151 5125",
    email: "robertpatilson@mail.com",
    image: "/placeholder.svg",
  },
  {
    id: "#CD1234",
    name: "Dia Lupa Marpaung",
    joinDate: "26/04/2020, 12:42 AM",
    location: "TY35 Avenue GG London Center",
    phoneNumber: "+51 1 23412 512",
    email: "dialupa@mail.com",
    image: "/placeholder.svg",
  },
  {
    id: "#CD1234",
    name: "Peter Parkur",
    joinDate: "26/04/2020, 12:42 AM",
    location: "Connor St. 24th GG New York",
    phoneNumber: "+51 1234 5678",
    email: "peterparkur@mail.com",
    image: "/placeholder.svg",
  },
  {
    id: "#CD1234",
    name: "Louis Ali",
    joinDate: "26/04/2020, 12:42 AM",
    location: "South Market 1st London 24512",
    phoneNumber: "+51 512 51255",
    email: "louisali@mail.com",
    image: "/placeholder.svg",
  },
]

const CustomerList = () => {
  const [expandedCustomers, setExpandedCustomers] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const customersPerPage = 6

  // Get current customers
  const indexOfLastCustomer = currentPage * customersPerPage
  const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage
  const currentCustomers = customers.slice(indexOfFirstCustomer, indexOfLastCustomer)
  const totalPages = Math.ceil(customers.length / customersPerPage)

  const toggleOrderHistory = (customerId: string) => {
    setExpandedCustomers((prev) =>
      prev.includes(customerId) ? prev.filter((id) => id !== customerId) : [...prev, customerId],
    )
  }

  return (
    <div className="p-3 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Customer list</h1>
        <div className="flex items-center gap-4">
          <Input type="search" placeholder="Search here..." className="w-[300px]" />
          <Button className="bg-yellow-500 hover:bg-yellow-600">+ Add New Customer</Button>
        </div>
      </div>

      <div className="bg-white rounded-lg border">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Customer list</h2>
        </div>

        <div className="divide-y">
          {currentCustomers.map((customer, index) => (
            <div key={index} className="p-4">
              <div className="flex items-start">
                <Avatar className="h-16 w-16 mr-4">
                  <AvatarImage src={customer.image || "/placeholder.svg"} alt={customer.name} />
                  <AvatarFallback>{customer.name.substring(0, 2)}</AvatarFallback>
                </Avatar>

                <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-yellow-500 font-medium">{customer.id}</div>
                    <div className="font-semibold">{customer.name}</div>
                    <div className="text-sm text-gray-500">Join on {customer.joinDate}</div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-500">Location</div>
                    <div>{customer.location}</div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-500">Phone Number</div>
                    <div>{customer.phoneNumber}</div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-500">Email Address</div>
                    <div>{customer.email}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleOrderHistory(customer.id)}
                    className="flex items-center gap-1"
                  >
                    Show Order History
                    {expandedCustomers.includes(customer.id) ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className="flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                        View details
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex items-center gap-2 text-red-600">
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {expandedCustomers.includes(customer.id) && (
                <div className="mt-4 ml-20 bg-gray-50 p-4 rounded-md">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-gray-200 rounded-md w-20 h-20 flex items-center justify-center">
                      <img src="/placeholder.svg" alt="Property" className="w-16 h-16 object-cover" />
                    </div>
                    <div>
                      <div className="font-medium">98AB Alexander Court, London</div>
                      <div className="text-sm text-gray-500">2 June 2018 - 4 June 2019</div>
                      <div className="flex items-center mt-1">
                        {[1, 2].map((star) => (
                          <svg key={star} className="w-4 h-4 text-yellow-500 fill-current" viewBox="0 0 24 24">
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                          </svg>
                        ))}
                        {[3, 4, 5].map((star) => (
                          <svg key={star} className="w-4 h-4 text-gray-300 fill-current" viewBox="0 0 24 24">
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="bg-gray-200 rounded-md w-20 h-20 flex items-center justify-center">
                      <img src="/placeholder.svg" alt="Property" className="w-16 h-16 object-cover" />
                    </div>
                    <div>
                      <div className="font-medium">TY345 Franklin Garden, New York</div>
                      <div className="text-sm text-gray-500">2 June 2018 - 4 June 2019</div>
                      <div className="flex items-center mt-1">
                        {[1, 2, 3, 4].map((star) => (
                          <svg key={star} className="w-4 h-4 text-yellow-500 fill-current" viewBox="0 0 24 24">
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                          </svg>
                        ))}
                        {[5].map((star) => (
                          <svg key={star} className="w-4 h-4 text-gray-300 fill-current" viewBox="0 0 24 24">
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between p-4 border-t">
          <div className="text-sm text-gray-500">
            Showing {indexOfFirstCustomer + 1} to {Math.min(indexOfLastCustomer, customers.length)} of{" "}
            {customers.length} results
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

export default CustomerList
