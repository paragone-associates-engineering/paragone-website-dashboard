
import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreVertical, Eye, PenSquare, Trash2, Phone } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface Booking {
  id: string
  date: string
  customer: string
  property: {
    address: string
    location: string
  }
  location: string
  price: string
  bookingType: string
  status: "In person" | "Video Chat" | "Pending"
}

const bookingsData: Booking[] = [
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
    bookingType: "In person",
    status: "In person",
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
    bookingType: "Video Chat",
    status: "Video Chat",
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
    bookingType: "In person",
    status: "Pending",
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
    bookingType: "In person",
    status: "Pending",
  },
  {
    id: "#0001234",
    date: "26/04/2020, 12:42 AM",
    customer: "Samantha Jr.",
    property: {
      address: "65SM Alexander Court",
      location: "New York",
    },
    location: "Corner Street 5th London 126623",
    price: "$116k",
    bookingType: "Video Chat",
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
    bookingType: "Video Chat",
    status: "Pending",
  },
]

const InspectionBookings = () => {
  const [selectedBookings, setSelectedBookings] = useState<string[]>([])

  const toggleBooking = (bookingId: string) => {
    setSelectedBookings((prev) =>
      prev.includes(bookingId) ? prev.filter((id) => id !== bookingId) : [...prev, bookingId],
    )
  }

  const toggleAllBookings = () => {
    setSelectedBookings(
      selectedBookings.length === bookingsData.length ? [] : bookingsData.map((booking) => booking.id),
    )
  }

  return (
    <div className="p-3 md:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Inspection Bookings</h1>
      </div>

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedBookings.length === bookingsData.length && bookingsData.length > 0}
                  onCheckedChange={toggleAllBookings}
                />
              </TableHead>
              <TableHead>Booking ID</TableHead>
              <TableHead>Date & Time</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Property</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Booking type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookingsData.map((booking) => (
              <TableRow key={`${booking.id}-${booking.customer}`}>
                <TableCell>
                  <Checkbox
                    checked={selectedBookings.includes(booking.id)}
                    onCheckedChange={() => toggleBooking(booking.id)}
                  />
                </TableCell>
                <TableCell>{booking.id}</TableCell>
                <TableCell>{booking.date}</TableCell>
                <TableCell>{booking.customer}</TableCell>
                <TableCell>
                  <div>
                    <div>{booking.property.address}</div>
                    <div className="text-sm text-gray-500">{booking.property.location}</div>
                  </div>
                </TableCell>
                <TableCell>{booking.location}</TableCell>
                <TableCell>{booking.price}</TableCell>
                <TableCell>{booking.bookingType}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      booking.status === "Pending"
                        ? "secondary"
                        : booking.status === "Video Chat"
                          ? "outline"
                          : "default"
                    }
                    className={
                      booking.status === "Pending"
                        ? "bg-gray-500 hover:bg-gray-600"
                        : booking.status === "Video Chat"
                          ? "border-gray-200 text-gray-800"
                          : ""
                    }
                  >
                    {booking.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">More</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className="flex items-center">
                        <Eye className="mr-2 h-4 w-4" />
                        <span>View details</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex items-center">
                        <PenSquare className="mr-2 h-4 w-4" />
                        <span>Change status</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex items-center">
                        <Phone className="mr-2 h-4 w-4" />
                        <span>Contact</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex items-center text-red-600">
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="flex items-center justify-between px-4 py-2 border-t">
          <div>Showing 4 of 74 results</div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon" disabled>
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
            <Button variant="default" size="sm" >
              1
            </Button>
            <Button variant="outline" size="sm">
              2
            </Button>
            <Button variant="outline" size="sm">
              3
            </Button>
            <Button variant="outline" size="icon">
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

export default InspectionBookings
