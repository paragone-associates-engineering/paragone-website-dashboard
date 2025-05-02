
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {MoreVertical, Upload} from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"

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
  const [showAddPartner, setShowAddPartner] = useState(false)
  const [newPartner, setNewPartner] = useState({
    name: "",
    type: "",
    description: "",
    logo: null as File | null,
  })
  // Get current partners
  const indexOfLastPartner = currentPage * partnersPerPage
  const indexOfFirstPartner = indexOfLastPartner - partnersPerPage
  const currentPartners = partnersData.slice(indexOfFirstPartner, indexOfLastPartner)

  const handleAddPartner = () => {
    console.log("Adding partner:", newPartner)
    setShowAddPartner(false)
    setNewPartner({
      name: "",
      type: "",
      description: "",
      logo: null,
    })
   
  }
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
            <Button onClick={() => setShowAddPartner(true)} >Add partner</Button>
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
              className={currentPage === 1 ? "bg-primary hover:bg-primary/90" : ""}
              onClick={() => setCurrentPage(1)}
            >
              1
            </Button>
            <Button
              variant={currentPage === 2 ? "default" : "outline"}
              size="sm"
              className={currentPage === 2 ? "bg-primary hover:bg-primary/90" : ""}
              onClick={() => setCurrentPage(2)}
            >
              2
            </Button>
            <Button
              variant={currentPage === 3 ? "default" : "outline"}
              size="sm"
              className={currentPage === 3 ? "bg-primary hover:bg-primary/90" : ""}
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

      <Dialog open={showAddPartner} onOpenChange={setShowAddPartner}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add partner</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <div className="space-y-2">
              <label htmlFor="partner-name" className="text-sm font-medium">
                Partner name
              </label>
              <Input
                id="partner-name"
                placeholder="Affiliate or discount codes"
                value={newPartner.name}
                onChange={(e) => setNewPartner({ ...newPartner, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="partner-type" className="text-sm font-medium">
                Partner type
              </label>
              <Select value={newPartner.type} onValueChange={(value) => setNewPartner({ ...newPartner, type: value })}>
                <SelectTrigger id="partner-type">
                  <SelectValue placeholder="Select partner type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="affiliate">Affiliate</SelectItem>
                  <SelectItem value="vendor">Vendor</SelectItem>
                  <SelectItem value="reseller">Reseller</SelectItem>
                  <SelectItem value="agency">Agency</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description
              </label>
              <Textarea
                id="description"
                placeholder="Write description..."
                value={newPartner.description}
                onChange={(e) => setNewPartner({ ...newPartner, description: e.target.value })}
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Partner image/logo</label>
              <div className="border border-dashed border-gray-300 rounded-md px-4 py-2">
                <div
                  className="w-24 h-24 flex flex-col items-center justify-center bg-gray-50 rounded-md cursor-pointer"
                  onClick={() => document.getElementById("logo-upload")?.click()}
                >
                  <Upload className="h-6 w-6 text-gray-500" />
                  <span className="text-sm text-gray-500 mt-2">Upload</span>
                  <input
                    type="file"
                    id="logo-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setNewPartner({ ...newPartner, logo: e.target.files[0] })
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setShowAddPartner(false)}>
              Cancel
            </Button>
            <Button className="bg-primary hover:bg-primary/90 text-white" onClick={handleAddPartner}>
              Create partner
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default PartnerList
