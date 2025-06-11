
import { useState } from "react"
import {useNavigate} from "react-router-dom"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { DataTable } from "@/components/shared/data-table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Eye, Pencil, Trash2, RefreshCw, Loader2, Home, CheckCircle, Star } from "lucide-react"
import { toast } from "sonner"
import { listingsService, STATUS, type Listing } from "@/services/listings-service"
import { StatusChangeModal } from "@/components/listings/status-change"
import { DeleteConfirmation } from "@/components/listings/delete-confirmation"

export default function PropertyListingPage() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const [statusChangeListing, setStatusChangeListing] = useState<Listing | null>(null)
  const [deletingListing, setDeletingListing] = useState<Listing | null>(null)
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [searchQuery, setSearchQuery] = useState("")
  const {
    data: listingsData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["listings", currentPage, pageSize, searchQuery],
    queryFn: () =>
      listingsService.getListings({
        page: currentPage,
        limit: pageSize,
        searchString: searchQuery || undefined,
      }),
    staleTime: 1000 * 60 * 5,
  })

  const listings = listingsData?.results || []
  const metadata = listingsData?.metadata?.[0] || { total: 0, totalPages: 0 }

  const updateMutation = useMutation({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutationFn: ({ id, data }: { id: string; data: any }) => listingsService.updateListing(id, data),
    onSuccess: () => {
      toast.success("Listing updated successfully")
      queryClient.invalidateQueries({ queryKey: ["listings"] })
      setIsStatusModalOpen(false)
      setIsDeleteDialogOpen(false)
      setStatusChangeListing(null)
      setDeletingListing(null)
    },
    onError: () => {
      toast.error("Failed to update listing")
    },
  })

   const updateStatusMutation = useMutation({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutationFn: ({ id, data }: { id: string; data: any }) => listingsService.updateListingStatus(id, data),
    onSuccess: () => {
      toast.success("Listing updated successfully")
      queryClient.invalidateQueries({ queryKey: ["listings"] })
      setIsStatusModalOpen(false)
      setIsDeleteDialogOpen(false)
      setStatusChangeListing(null)
      setDeletingListing(null)
    },
    onError: () => {
      toast.error("Failed to update listing")
    },
  })
 

  const handleChangeStatus = (listing: Listing) => {
    setStatusChangeListing(listing)
    setIsStatusModalOpen(true)
  }

  const handleEdit = (listing: Listing) => {
   navigate(`/property/edit/${listing.id}`)
  }

  
  const handleViewDetails = (listing: Listing) => {
    navigate(`/property/detail/${listing.id}`)
   
  }
  const handleDelete = (listing: Listing) => {
    setDeletingListing(listing)
    setIsDeleteDialogOpen(true)
  }

  const handleSaveStatus = (id: string, status: STATUS) => {
     updateStatusMutation.mutate({ id, data: { status } })
  }
 const handleMakeFeatured = (listing: Listing) => {
  const id = listing?.id
     updateStatusMutation.mutate({ id, data: { featured: true } })
  }
  const handleRemoveFeatured = (id:string) => {
     updateStatusMutation.mutate({ id, data: { featured: false } })
  }

  const handleConfirmDelete = () => {
    if (deletingListing) {
      updateStatusMutation.mutate({ id: deletingListing.id, data: { isActive: false } })
    }
  }

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

  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }

  const getStatusBadge = (status?: string) => {
     const statusColors = {
       Pending: "bg-yellow-100 text-yellow-800",
       Negotiation: "bg-blue-100 text-blue-800",
       Inspection: "bg-blue-100 text-green-800",
      "Off Market": "bg-red-100 text-green-800",
        Paid: "bg-green-100 text-green-800",
       Closed: "bg-gray-100 text-gray-800",
     }
 
     const displayStatus = status || "Pending"
 
     return (
       <Badge className={statusColors[displayStatus as keyof typeof statusColors] || "bg-gray-100 text-gray-800"}>
         {displayStatus}
       </Badge>
     )
   }

  const getListingTypeBadge = (listingType: string) => {
    const colors = {
      "For Sale": "bg-blue-100 text-blue-800",
      "For Rent": "bg-green-100 text-green-800",
      "Short Stay": "bg-purple-100 text-purple-800",
      Land: "bg-orange-100 text-orange-800",
    }

    return (
      <Badge variant="outline" className={colors[listingType as keyof typeof colors] || "bg-gray-100 text-gray-800"}>
        {listingType}
      </Badge>
    )
  }

  const columns = [
    {
      id: "id",
      header: "ID",
      accessorKey: "id",
      enableSorting: true,
    },
    {
      id: "propertyName",
      header: "Property Name",
      accessorKey: "propertyName",
      enableSorting: true,
    },
    {
      id: "propertyType",
      header: "Type",
      accessorKey: "propertyType",
      cell: ( row: Listing ) => (
        <div>
          <div className="font-medium">{row.propertyType}</div>
          <div className="text-sm text-gray-500">{row.propertyCategory}</div>
        </div>
      ),
      enableSorting: true,
    },
    {
      id: "location",
      header: "Location",
      accessorKey: "location",
      cell: (row: Listing ) => (
        <div>
          <div className="font-medium">{row.location.region}</div>
          <div className="text-sm text-gray-500">
            {row.location.city}, {row.location.country}
          </div>
        </div>
      ),
    },
    {
      id: "amount",
      header: "Price",
      accessorKey: "amount",
      cell: (row: Listing ) => `₦${formatNumber(row.amount)}`,
      enableSorting: true,
    },
    {
      id: "listingType",
      header: "Listing Type",
      accessorKey: "listingType",
      cell: (row: Listing ) => getListingTypeBadge(row.listingType),
      enableSorting: true,
    },
    {
      id: "area",
      header: "Area (sqft)",
      accessorKey: "area",
      cell: (row: Listing ) => row.area.toLocaleString(),
      enableSorting: true,
    },
    {
      id: "status",
      header: "Status",
      accessorKey: "isActive",
      cell: ( row: Listing ) => getStatusBadge(row?.status),
      enableSorting: true,
    },
    {
      id: "createdAt",
      header: "Created",
      accessorKey: "createdAt",
      cell: ( row: Listing ) => {
        return new Date(row.createdAt).toLocaleDateString()
      },
      enableSorting: true,
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
        label: "View details",
        icon: <Eye className="h-4 w-4" />,
        onClick:handleViewDetails,
      },
      {
        label: "Edit property",
        icon: <Pencil className="h-4 w-4" />,
        onClick: handleEdit,
      },
       {
        label: "Make Featured",
        icon: <Star className="h-4 w-4" />,
        onClick:  handleMakeFeatured,
      },
      {
        label: "Change status",
        icon: <RefreshCw className="h-4 w-4" />,
        onClick: handleChangeStatus,
      },
      {
        label: "Delete",
        icon: <Trash2 className="h-4 w-4" />,
        onClick: handleDelete,
        className: "text-red-600",
      },
    ],
  }

  const activeListings = listings.filter((listing) => listing.isActive).length

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Property Listing</h1>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardContent className="p-6 flex items-center">
            <div className="flex-1">
              <h2 className="text-4xl font-bold">{metadata.total}</h2>
              <p className="text-gray-500">Total Properties</p>
            </div>
            <div className="bg-gray-100 p-4 rounded-full">
              <Home className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center">
            <div className="flex-1">
              <h2 className="text-4xl font-bold">{activeListings}</h2>
              <p className="text-gray-500">Active Properties</p>
            </div>
            <div className="bg-gray-100 p-4 rounded-full">
              <CheckCircle className="h-6 w-6 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-white rounded-lg border overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Loading Properties...</span>
          </div>
        ) : isError ? (
          <div className="p-8 text-center text-red-500">Error loading properties. Please try again.</div>
        ) : (
          <div className="overflow-x-auto">
            <DataTable
              columns={columns}
              data={listings}
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
              removeFeatured={handleRemoveFeatured}
              isFeatured={true}
              onSearch={handleSearch}
              loading={isLoading}
            />
          </div>
        )}
      </div>

      <StatusChangeModal
        isOpen={isStatusModalOpen}
        onClose={() => {
          setIsStatusModalOpen(false)
          setStatusChangeListing(null)
        }}
        listing={statusChangeListing}
        onSave={handleSaveStatus}
        isLoading={updateMutation.isPending}
      />


      <DeleteConfirmation
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false)
          setDeletingListing(null)
        }}
        listing={deletingListing}
        onConfirm={handleConfirmDelete}
        isLoading={updateMutation.isPending}
      />
    </div>
  )
}
