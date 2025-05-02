
import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DataTable, StatusBadge } from "@/components/shared/data-table"
import { Eye, Pencil, Trash2, Upload } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
interface Partner {
  id: string
  customerName: string
  phoneNumber: string
  emailAddress: string
  propertyType: string
  location: string
  contactMethod: string
  timeOfContact: string
  whenSale: string
  status: string
}

const initialPartners: Partner[] = [
  {
    id: "1",
    customerName: "Stephani",
    phoneNumber: "(308) 555-0121",
    emailAddress: "alma@example.com",
    propertyType: "Bungalow",
    location: "Straight 22th London 51256",
    contactMethod: "Call",
    timeOfContact: "11:00AM",
    whenSale: "1 month",
    status: "Active",
  },
  {
    id: "2",
    customerName: "Sanji Fujiwara",
    phoneNumber: "(225) 555-0118",
    emailAddress: "jessica@example.com",
    propertyType: "Apartment",
    location: "Flat 2551 Center London 287223",
    contactMethod: "Message",
    timeOfContact: "10:00AM",
    whenSale: "15 days",
    status: "Active",
  },
  {
    id: "3",
    customerName: "Hawkins",
    phoneNumber: "(405) 555-0128",
    emailAddress: "debbie@example.com",
    propertyType: "Duplex",
    location: "Waves Street 1st London 2441",
    contactMethod: "Email",
    timeOfContact: "12:00PM",
    whenSale: "20 days",
    status: "Pending",
  },
  {
    id: "4",
    customerName: "Ilham Supriadi",
    phoneNumber: "(252) 555-0126",
    emailAddress: "georgia@example.com",
    propertyType: "Apartment",
    location: "Waves Street 1st London 2441",
    contactMethod: "Rendy",
    timeOfContact: "09:30AM",
    whenSale: "3 months",
    status: "In Progress",
  },
  {
    id: "5",
    customerName: "Samantha Jr.",
    phoneNumber: "(316) 555-0116",
    emailAddress: "michelle@example.com",
    propertyType: "Duplex",
    location: "Corner Street 5th London 126623",
    contactMethod: "Message",
    timeOfContact: "11:00AM",
    whenSale: "2 months",
    status: "In Progress",
  },
  {
    id: "6",
    customerName: "Yun-Yun",
    phoneNumber: "(907) 555-0101",
    emailAddress: "tanya@example.com",
    propertyType: "Bungalow",
    location: "Corner Street 5th London 126623",
    contactMethod: "Call",
    timeOfContact: "04:00PM",
    whenSale: "15 days",
    status: "Pending",
  },
  {
    id: "7",
    customerName: "James Witcwicky",
    phoneNumber: "(684) 555-0102",
    emailAddress: "michael@example.com",
    propertyType: "Apartment",
    location: "Flat 2551 Center London 287223",
    contactMethod: "Email",
    timeOfContact: "11:15AM",
    whenSale: "1 month",
    status: "In Progress",
  },
]

const PartnerWithUsPage = () => {
  const [partners, setPartners] = useState<Partner[]>(initialPartners)
  const [activeTab, setActiveTab] = useState("individual")
  const [showAddPartner, setShowAddPartner] = useState(false)
  const [newPartner, setNewPartner] = useState({
    name: "",
    type: "",
    description: "",
    logo: null as File | null,
  })
  const handleDelete = (partner: Partner) => {
    setPartners(partners.filter((p) => p.id !== partner.id))
  }

  const handleEdit = (partner: Partner) => {
    console.log("Edit partner:", partner)
    // Implement edit functionality
  }

  const handleView = (partner: Partner) => {
    console.log("View partner:", partner)
    // Implement view functionality
  }

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
  const columns = [
    {
      id: "customerName",
      header: "Customer name",
      accessorKey: "customerName",
      enableSorting: true,
    },
    {
      id: "phoneNumber",
      header: "Phone number",
      accessorKey: "phoneNumber",
    },
    {
      id: "emailAddress",
      header: "Email address",
      accessorKey: "emailAddress",
    },
    {
      id: "propertyType",
      header: "Property type",
      accessorKey: "propertyType",
    },
    {
      id: "location",
      header: "Location",
      accessorKey: "location",
    },
    {
      id: "contactMethod",
      header: "Contact method",
      accessorKey: "contactMethod",
    },
    {
      id: "timeOfContact",
      header: "Time of contact",
      accessorKey: "timeOfContact",
    },
    {
      id: "whenSale",
      header: "When sale",
      accessorKey: "whenSale",
    },
    {
      id: "status",
      header: "Status",
      accessorKey: "status",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      cell: (info: any) => <StatusBadge status={info.status} />,
    },
  ]

  const actionMenu = {
    items: [
      {
        label: "View details",
        icon: <Eye className="h-4 w-4" />,
        onClick: handleView,
      },
      {
        label: "Edit property",
        icon: <Pencil className="h-4 w-4" />,
        onClick: handleEdit,
      },
      {
        label: "Delete",
        icon: <Trash2 className="h-4 w-4" />,
        onClick: handleDelete,
        className: "text-red-600",
      },
    ],
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Partner With Us</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="individual" className="flex-1">
            Sell as an Individual
          </TabsTrigger>
          <TabsTrigger value="company" className="flex-1">
            Sell as a Company
          </TabsTrigger>
        </TabsList>

        <TabsContent value="individual">
          <DataTable
            columns={columns}
            data={partners}
            actionMenu={actionMenu}
            pagination={{ pageSize: 10, totalItems: partners.length }}
            searchable={true}
            selectable={true}
          />
        </TabsContent>

        <TabsContent value="company">
          <DataTable
            columns={columns}
            data={partners.filter((p) => p.status === "Active")}
            actionMenu={actionMenu}
            pagination={{ pageSize: 10, totalItems: partners.filter((p) => p.status === "Active").length }}
            searchable={true}
            selectable={true}
          />
        </TabsContent>
      </Tabs>

      <Dialog open={showAddPartner} onOpenChange={setShowAddPartner}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add partner</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
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
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Partner image/logo</label>
              <div className="border border-dashed border-gray-300 rounded-md p-4">
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
            <Button onClick={handleAddPartner}>
              Create partner
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default PartnerWithUsPage
