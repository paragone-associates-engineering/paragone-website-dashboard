
import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, Pencil, Trash2 } from "lucide-react"
import { DataTable, StatusBadge } from "@/components/shared/data-table"
import { FormContainer, FormField } from "@/components/shared/form-container"

interface Region {
  id: string
  name: string
  status: string
}

const initialRegions: Region[] = [
  { id: "1", name: "Ikoyi", status: "Active" },
  { id: "2", name: "Victoria Island", status: "Active" },
  { id: "3", name: "Gbagada", status: "Inactive" },
  { id: "4", name: "Maryland", status: "Active" },
  { id: "5", name: "Osapa", status: "Active" },
]

const RegionPage = () => {
  const [regions, setRegions] = useState<Region[]>(initialRegions)
  const [isAddingRegion, setIsAddingRegion] = useState(false)
  const [formData, setFormData] = useState({
    country: "Nigeria",
    regionName: "",
    postalCode: "",
    city: "",
  })
 console.log(isAddingRegion)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newRegion: Region = {
      id: (regions.length + 1).toString(),
      name: formData.regionName,
      status: "Active",
    }
    setRegions([...regions, newRegion])
    setFormData({
      country: "Nigeria",
      regionName: "",
      postalCode: "",
      city: "",
    })
    setIsAddingRegion(false)
  }

  const handleDelete = (region: Region) => {
    setRegions(regions.filter((r) => r.id !== region.id))
  }

  const handleEdit = (region: Region) => {
    console.log("Edit region:", region)
    // Implement edit functionality
  }

  const handleView = (region: Region) => {
    console.log("View region:", region)
    // Implement view functionality
  }

  const columns = [
    {
      id: "name",
      header: "Name",
      accessorKey: "name",
      enableSorting: true,
    },
    {
      id: "status",
      header: "Status",
      accessorKey: "status",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      cell: (info: any) => <StatusBadge status={info.status} />,
    },
    {
      id: "action",
      header: "",
      accessorKey: "id",
      cell: () => null, 
    },
  ]

  const actionMenu = {
    items: [
      {
        label: "Edit region",
        icon: <Pencil className="h-4 w-4" />,
        onClick: handleEdit,
      },
      {
        label: "View details",
        icon: <Eye className="h-4 w-4" />,
        onClick: handleView,
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
        <h1 className="text-2xl font-bold">Region</h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-[60%]">
          <div className="bg-white rounded-lg border">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold">All region</h2>
            </div>

            <DataTable
              columns={columns}
              data={regions}
              actionMenu={actionMenu}
              pagination={{ pageSize: 10, totalItems: regions.length }}
              searchable={true}
              selectable={true}
            />
          </div>
        </div>

        <div className="lg:w-[40%]">
          <FormContainer
            title="Add region"
            onSubmit={handleSubmit}
            onCancel={() => setIsAddingRegion(false)}
            submitLabel="Add region"
            className="w-full"
          >
            <div className='w-full grid grid-cols-2 gap-x-2'>
            <FormField label="Country" required className='w-full'>
              <Select value={formData.country}  onValueChange={(value) => handleSelectChange("country", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Nigeria">Nigeria</SelectItem>
                  <SelectItem value="Ghana">Ghana</SelectItem>
                  <SelectItem value="Kenya">Kenya</SelectItem>
                </SelectContent>
              </Select>
            </FormField>

            <FormField label="Region name" required className="w-full">
              <Select onValueChange={(value) => handleSelectChange("regionName", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Lagos">Lagos</SelectItem>
                  <SelectItem value="Abuja">Abuja</SelectItem>
                  <SelectItem value="Port Harcourt">Port Harcourt</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
           
            <FormField label="Postal code" className="mt-4">
              <Input
                name="postalCode"
                value={formData.postalCode}
                onChange={handleInputChange}
                placeholder="Enter code"
              />
            </FormField>

            <FormField label="Enter city" className="mt-4">
              <Select onValueChange={(value) => handleSelectChange("city", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Enter city" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Lagos">Lagos</SelectItem>
                  <SelectItem value="Ikeja">Ikeja</SelectItem>
                  <SelectItem value="Lekki">Lekki</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
            </div>
          </FormContainer>
        </div>
      </div>
    </div>
  )
}

export default RegionPage
