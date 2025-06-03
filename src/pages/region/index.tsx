import type React from "react"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Pencil, Trash2, Loader2 } from "lucide-react"
import { DataTable } from "@/components/shared/data-table"
import { FormContainer, FormField } from "@/components/shared/form-container"
import { listingsService, type Region, type CreateRegionDTO, type UpdateRegionDTO } from "@/services/listings-service"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const RegionPage = () => {
  const queryClient = useQueryClient()
  const [isEditing, setIsEditing] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  // Pagination and search state
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [searchQuery, setSearchQuery] = useState("")

  const [formData, setFormData] = useState({
    country: "Nigeria",
    region: "",
    postalCode: "",
    city: "",
    status: "active"
  })

  const {
    data: regionsData,
    isLoading,
    isError,
    isFetching,
  } = useQuery({
    queryKey: ["regions", currentPage, pageSize, searchQuery],
    queryFn: () => listingsService.getRegions({
      page: currentPage,
      limit: pageSize,
      searchString: searchQuery || undefined
    }),
    staleTime: 1000 * 60 * 5,
   // keepPreviousData: true, // Keep previous data while fetching new data
  })

  const regions = regionsData?.results || []
  const metadata = regionsData?.metadata?.[0] || { total: 0, totalPages: 0 }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const createRegionMutation = useMutation({
    mutationFn: (data: CreateRegionDTO) => {
      return listingsService.createRegion(data)
    },
    onSuccess: () => {
      toast.success("Region created successfully")
      queryClient.invalidateQueries({ queryKey: ["regions"] })
      setFormData({ country: "Nigeria", region: "", postalCode: "", city: "", status: "active" })
    },
    onError: (error) => {
      console.error("Error creating region:", error)
      toast.error("Failed to create region")
    },
  })

  const updateRegionMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateRegionDTO }) => listingsService.updateRegion(id, data),
    onSuccess: () => {
      toast.success("Region updated successfully")
      queryClient.invalidateQueries({ queryKey: ["regions"] })
      setIsEditing(false)
      setEditingId(null)
      setFormData({ country: "Nigeria", region: "", postalCode: "", city: "", status: "active" })
    },
    onError: () => {
      toast.error("Failed to update region")
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.region || !formData.country) {
      toast.error("Please fill in required fields")
      return
    }

    if (isEditing && editingId) {
      updateRegionMutation.mutate({
        id: editingId,
        data: {
          region: formData.region,
          country: formData.country,
          postalCode: formData.postalCode,
          city: formData.city,
          status: formData.status
        },
      })
    } else {
      createRegionMutation.mutate({
        region: formData.region,
        country: formData.country,
        postalCode: formData.postalCode,
        city: formData.city,
        status: formData.status
      })
    }
  }

  const handleStatusChange = (region: Region, newStatus: string) => {
    updateRegionMutation.mutate({
      id: region.id,
      data: {
        status: newStatus,
      },
    })
  }

  const handleDelete = (region: Region) => {
    updateRegionMutation.mutate({
      id: region.id,
      data: {
        isActive: false,
      },
    })
  }

  const handleEdit = (region: Region) => {
    setFormData({
      country: region.country,
      region: region.region,
      postalCode: region.postalCode,
      city: region.city,
      status: region.status
    })
    setIsEditing(true)
    setEditingId(region.id)

    const formSection = document.getElementById("region-form")
    formSection?.scrollIntoView({ behavior: "smooth" })
  }

  const handleCancel = () => {
    setFormData({
      country: "Nigeria",
      region: "",
      postalCode: "",
      city: "",
      status: "active"
    })
    setIsEditing(false)
    setEditingId(null)
  }

  // Handle pagination change
  const handlePageChange = (page: number, newPageSize: number) => {
    setCurrentPage(page)
    if (newPageSize !== pageSize) {
      setPageSize(newPageSize)
      setCurrentPage(1) 
    }
  }

 
  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setCurrentPage(1) 
  }

  const columns = [
    {
      id: "region",
      header: "Region",
      accessorKey: "region",
      enableSorting: true,
    },
    {
      id: "country",
      header: "Country",
      accessorKey: "country",
      enableSorting: true,
    },
    {
      id: "city",
      header: "City",
      accessorKey: "city",
      enableSorting: true,
    },
    {
      id: "status",
      header: "Status",
      accessorKey: "status",
      cell: (row: Region) => {
        const currentStatus = row.status.toLowerCase()

        return (
          <Select
            value={currentStatus}
            onValueChange={(value) => handleStatusChange(row, value)}
            disabled={updateRegionMutation.isPending}
          >
            <SelectTrigger className="w-32">
              <SelectValue>
                <Badge
                  variant={currentStatus === "active" ? "default" : "secondary"}
                  className={currentStatus === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
                >
                  {currentStatus === "active" ? "Active" : "Inactive"}
                </Badge>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">
                <Badge className="bg-green-100 text-green-800">Active</Badge>
              </SelectItem>
              <SelectItem value="inactive">
                <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>
              </SelectItem>
            </SelectContent>
          </Select>
        )
      },
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
        <h1 className="text-2xl font-bold">Region Management</h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-[60%]">
          <div className="bg-white rounded-lg border">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold">All Regions</h2>
              <p className="text-sm text-gray-500">Total: {metadata.total} regions</p>
            </div>

            {isLoading && !isFetching ? (
              <div className="flex justify-center items-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2">Loading Regions...</span>
              </div>
            ) : isError ? (
              <div className="p-8 text-center text-red-500">Error loading regions. Please try again.</div>
            ) : (
              <DataTable
                columns={columns}
                data={regions}
                actionMenu={actionMenu}
                pagination={{
                  pageSize: pageSize,
                  totalItems: metadata.total,
                  initialPage: currentPage,
                  serverSide: true,
                  onPageChange: handlePageChange,
                }}
                searchable={true}
                selectable={true}
                onSearch={handleSearch}
                loading={isFetching}
              />
            )}
          </div>
        </div>

        <div className="lg:w-[40%]" id="region-form">
          <FormContainer
            title={isEditing ? "Edit Region" : "Add Region"}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            submitLabel={isEditing ? "Update Region" : "Update Region"}
            isLoading={createRegionMutation.isPending || updateRegionMutation.isPending}
            className="w-full"
          >
            <div className="w-full grid grid-cols-2 gap-x-2">
              <FormField label="Country" required className="w-full">
                <Input
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  placeholder="Enter country"
                />
              </FormField>

              <FormField label="Region name" required className="w-full">
                <Input
                  name="region"
                  value={formData.region}
                  onChange={handleInputChange}
                  placeholder="Enter region name"
                />
              </FormField>

              <FormField label="City" className="mt-4">
                <Input name="city" value={formData.city} onChange={handleInputChange} placeholder="Enter city" />
              </FormField>

              <FormField label="Postal code" className="mt-4">
                <Input
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  placeholder="Enter postal code"
                />
              </FormField>
            </div>
          </FormContainer>
        </div>
      </div>
    </div>
  )
}

export default RegionPage