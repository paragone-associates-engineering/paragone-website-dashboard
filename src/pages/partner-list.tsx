
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MoreVertical } from "lucide-react"

interface Partner {
  logo: string
  name: string
  description: string
}

const partnersData: Partner[] = [
  {
    logo: "partner.png",
    name: "The Walt Disney Company",
    description: "It is a long established fact that a reader will be distracted by the readable content of a...",
  },
  {
    logo: "nestle.svg",
    name: "The Walt Disney Company",
    description: "It is a long established fact that a reader will be distracted by the readable content of a...",
  },
  {
    logo: "hp.svg",
    name: "The Walt Disney Company",
    description: "It is a long established fact that a reader will be distracted by the readable content of a...",
  },
  {
    logo: "intel.svg",
    name: "The Walt Disney Company",
    description: "It is a long established fact that a reader will be distracted by the readable content of a...",
  },
  {
    logo: "microsoft.svg",
    name: "The Walt Disney Company",
    description: "It is a long established fact that a reader will be distracted by the readable content of a...",
  },
  {
    logo: "hersheys.svg",
    name: "The Walt Disney Company",
    description: "It is a long established fact that a reader will be distracted by the readable content of a...",
  },
  {
    logo: "apple.svg",
    name: "The Walt Disney Company",
    description: "It is a long established fact that a reader will be distracted by the readable content of a...",
  },
  {
    logo: "amazon.svg",
    name: "The Walt Disney Company",
    description: "It is a long established fact that a reader will be distracted by the readable content of a...",
  },
  {
    logo: "starbucks.svg",
    name: "The Walt Disney Company",
    description: "It is a long established fact that a reader will be distracted by the readable content of a...",
  },
]

const PartnerList = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const partnersPerPage = 9

  // Get current partners
  const indexOfLastPartner = currentPage * partnersPerPage
  const indexOfFirstPartner = indexOfLastPartner - partnersPerPage
  const currentPartners = partnersData.slice(indexOfFirstPartner, indexOfLastPartner)

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Partner list</h1>
      </div>

      <div className="bg-white rounded-lg border">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">All Partners</h2>
        </div>

        <div className="p-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Select defaultValue="30">
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="30">30</SelectItem>
                <SelectItem value="40">40</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Input placeholder="Search..." className="w-[300px]" />
            </div>
            <Button>Add partner</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 ">
          {currentPartners.map((partner, index) => (
            <div key={index} className="flex border rounded-lg p-4 bg-[#DDDDDD]">
              <div className="flex-shrink-0 w-16 h-16 mr-4  rounded-md flex items-center justify-center">
                <img src={`/partner.png`} alt={partner.name} className="w-full h-full object-contain" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <h3 className="font-semibold">{partner.name}</h3>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
                <div className="mt-1">
                  <p className="text-sm text-gray-600 line-clamp-2">
                    <span className="font-medium">Description:</span> {partner.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between p-4 border-t">
          <div>Showing 4 of 74 results</div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon" disabled={currentPage === 1}>
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
            <Button
              variant={currentPage === 2 ? "default" : "outline"}
              size="sm"
              className={currentPage === 2 ? "bg-yellow-500 hover:bg-yellow-600" : ""}
              onClick={() => setCurrentPage(2)}
            >
              2
            </Button>
            <Button
              variant={currentPage === 3 ? "default" : "outline"}
              size="sm"
              className={currentPage === 3 ? "bg-yellow-500 hover:bg-yellow-600" : ""}
              onClick={() => setCurrentPage(3)}
            >
              3
            </Button>
            <Button
              variant="outline"
              size="icon"
              disabled={currentPage === Math.ceil(partnersData.length / partnersPerPage)}
              onClick={() => setCurrentPage(currentPage + 1)}
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

export default PartnerList
