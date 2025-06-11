
import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { DataTable } from "@/components/shared/data-table"
import { Badge } from "@/components/ui/badge"
import { Eye, PenSquare, Trash2, Phone, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { viewingsService, type Viewing } from "@/services/viewings-service"
import { StatusChangeModal } from "@/components/viewings/status-change"
import { ViewDetailsModal } from "@/components/viewings/view-details"
import { DeleteConfirmation } from "@/components/viewings/delete-confirmation"

export default function InspectionBookingsPage() {
  const queryClient = useQueryClient()
  const [statusChangeViewing, setStatusChangeViewing] = useState<Viewing | null>(null)
  const [viewDetailsViewing, setViewDetailsViewing] = useState<Viewing | null>(null)
  const [deletingViewing, setDeletingViewing] = useState<Viewing | null>(null)
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const {
    data: viewingsData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["viewings"],
    queryFn: () => viewingsService.getViewings(),
    staleTime: 1000 * 60 * 5,
  })

  const viewings = viewingsData?.results || []
  const metadata = viewingsData?.metadata?.[0] || { total: 0, totalPages: 0 }

  const updateMutation = useMutation({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutationFn: ({ id, data }: { id: string; data: any }) => viewingsService.updateViewing(id, data),
    onSuccess: () => {
      toast.success("Viewing updated successfully")
      queryClient.invalidateQueries({ queryKey: ["viewings"] })
      setIsStatusModalOpen(false)
      setStatusChangeViewing(null)
    },
    onError: () => {
      toast.error("Failed to update viewing")
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => viewingsService.updateViewing(id, { isActive: false }),
    onSuccess: () => {
      toast.success("Viewing deleted successfully")
      queryClient.invalidateQueries({ queryKey: ["viewings"] })
      setIsDeleteDialogOpen(false)
      setDeletingViewing(null)
    },
    onError: () => {
      toast.error("Failed to delete viewing")
    },
  })

  const handleViewDetails = (viewing: Viewing) => {
    setViewDetailsViewing(viewing)
    setIsViewModalOpen(true)
  }

  const handleChangeStatus = (viewing: Viewing) => {
    setStatusChangeViewing(viewing)
    setIsStatusModalOpen(true)
  }

  const handleContact = (viewing: Viewing) => {
    // Open phone dialer or email client
    window.open(`tel:${viewing.phoneNumber}`)
  }

  const handleDelete = (viewing: Viewing) => {
    setDeletingViewing(viewing)
    setIsDeleteDialogOpen(true)
  }

  const handleSaveStatus = (id: string, status: string) => {
    updateMutation.mutate({ id, data: { status } })
  }

  const handleConfirmDelete = () => {
    if (deletingViewing) {
      deleteMutation.mutate(deletingViewing.id)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusColors = {
      pending: "bg-yellow-100 text-yellow-800 capitalize",
      Confirmed: "bg-blue-100 text-blue-800 capitalize", 
      Completed: "bg-green-100 text-green-800 capitalize",
      Cancelled: "bg-red-100 text-red-800 capitalize",
      Rescheduled: "bg-purple-100 text-purple-800 capitalize",
    }

    return (
      <Badge className={statusColors[status as keyof typeof statusColors] || "bg-gray-100 text-gray-800"}>
        {status}
      </Badge>
    )
  }

  const getViewingTypeBadge = (type: string) => {
    return (
      <Badge
        variant="outline"
        className={type === "In-person" ? "border-blue-200 text-blue-800" : "border-green-200 text-green-800"}
      >
        {type}
      </Badge>
    )
  }

  const columns = [
    {
      id: "id",
      header: "Booking ID",
      accessorKey: "id",
      enableSorting: true,
    },
    {
      id: "date",
      header: "Date & Time",
      accessorKey: "date",
      cell: (row: Viewing ) => {
        return new Date(row.date).toLocaleString()
      },
      enableSorting: true,
    },
    {
      id: "customer",
      header: "Customer",
      accessorKey: "name",
      cell: ( row: Viewing ) => {
        return `${row.name.first} ${row.name.lastName}`
      },
      enableSorting: true,
    },
    {
      id: "property",
      header: "Property",
      accessorKey: "propertyDetails",
      cell: (row: Viewing ) => {
        console.log(row)
        return (
          <div>
            <div className="font-medium">{row.propertyDetails.propertyName}</div>
            <div className="text-sm text-gray-500">{row.propertyDetails.location}</div>
          </div>
        )
      },
    },
    {
      id: "price",
      header: "Price",
      accessorKey: "propertyDetails.amount",
      cell: (row: Viewing ) => {
        return `$${row.propertyDetails.amount.toLocaleString()}`
      },
      enableSorting: true,
    },
    {
      id: "viewingType",
      header: "Booking Type",
      accessorKey: "viewingType",
      cell: ( row: Viewing ) => getViewingTypeBadge(row.viewingType),
      enableSorting: true,
    },
    {
      id: "status",
      header: "Status",
      accessorKey: "status",
      cell: (row: Viewing ) => getStatusBadge(row.status),
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
        onClick: handleViewDetails,
      },
      {
        label: "Change status",
        icon: <PenSquare className="h-4 w-4" />,
        onClick: handleChangeStatus,
      },
      {
        label: "Contact",
        icon: <Phone className="h-4 w-4" />,
        onClick: handleContact,
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
    <div className="p-6 max-w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Inspection Bookings</h1>
       
      </div>

      <div className="bg-white rounded-lg border overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Loading Bookings...</span>
          </div>
        ) : isError ? (
          <div className="p-8 text-center text-red-500">Error loading bookings. Please try again.</div>
        ) : (
          <div className="overflow-x-auto">
            <DataTable
              columns={columns}
              data={viewings}
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
          setStatusChangeViewing(null)
        }}
        viewing={statusChangeViewing}
        onSave={handleSaveStatus}
        isLoading={updateMutation.isPending}
      />

      <ViewDetailsModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false)
          setViewDetailsViewing(null)
        }}
        viewing={viewDetailsViewing}
      />

      <DeleteConfirmation
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false)
          setDeletingViewing(null)
        }}
        viewing={deletingViewing}
        onConfirm={handleConfirmDelete}
        isLoading={deleteMutation.isPending}
      />
    </div>
  )
}
