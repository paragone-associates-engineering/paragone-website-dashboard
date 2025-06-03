
import { useState } from "react"
import {useNavigate} from "react-router-dom"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { DataTable } from "@/components/shared/data-table"
import { Badge } from "@/components/ui/badge"
import { Eye, Pencil, Trash2, RefreshCw, Loader2} from "lucide-react"
import { toast } from "sonner"
import { listingsService, type Listing } from "@/services/listings-service"
import { StatusChangeModal } from "@/components/listings/status-change"
//import { ViewDetailsModal } from "@/components/listings/view-details-modal"
import { DeleteConfirmation } from "@/components/listings/delete-confirmation"

export default function PropertyListings() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const [statusChangeListing, setStatusChangeListing] = useState<Listing | null>(null)
 // const [viewDetailsListing, setViewDetailsListing] = useState<Listing | null>(null)
  const [deletingListing, setDeletingListing] = useState<Listing | null>(null)
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false)
  //const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const {
    data: listingsData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["listings"],
    queryFn: () => listingsService.getListings(),
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

 

  const handleChangeStatus = (listing: Listing) => {
    setStatusChangeListing(listing)
    setIsStatusModalOpen(true)
  }

  const handleEdit = (listing: Listing) => {
   navigate(`/property/edit/${listing.id}`)
  }

  
  const handleViewDetails = (listing: Listing) => {
   // setViewDetailsListing(listing)
    navigate(`/property/detail/${listing.id}`)
   // setIsViewModalOpen(true)
  }
  const handleDelete = (listing: Listing) => {
    setDeletingListing(listing)
    setIsDeleteDialogOpen(true)
  }

  const handleSaveStatus = (id: string, isActive: boolean) => {
    updateMutation.mutate({ id, data: { isActive } })
  }

  const handleConfirmDelete = () => {
    if (deletingListing) {
      updateMutation.mutate({ id: deletingListing.id, data: { isActive: false } })
    }
  }

  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }

  const getStatusBadge = (isActive: boolean) => {
    return (
      <Badge
        variant={isActive ? "default" : "secondary"}
        className={isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
      >
        {isActive ? "Active" : "Inactive"}
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
      cell: ( row: Listing ) => getStatusBadge(row.isActive),
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

  //const activeListings = listings.filter((listing) => listing.isActive).length

  return (
    <div className="">
     
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
              pagination={{ pageSize: 10, totalItems: metadata.total }}
              searchable={true}
              selectable={true}
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
