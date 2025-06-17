

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { DataTable } from "@/components/shared/data-table"
import { Badge } from "@/components/ui/badge"
import { Pencil, Trash2, RefreshCw, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { propertyManagementService, type PropertyManagement, type STATUS } from "@/services/property-management-service"
import { EditModal } from "@/components/property-management/edit-modal"
import { StatusChangeModal } from "@/components/property-management/status-change"
import { DeleteConfirmation } from "@/components/property-management/delete-confirmation"

export default function PropertyManagementPage() {
  const queryClient = useQueryClient()
  const [editingProperty, setEditingProperty] = useState<PropertyManagement | null>(null)
  const [statusChangeProperty, setStatusChangeProperty] = useState<PropertyManagement | null>(null)
  const [deletingProperty, setDeletingProperty] = useState<PropertyManagement | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const {
    data: propertyData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["property-management"],
    queryFn: () => propertyManagementService.getPropertyManagement(),
    staleTime: 1000 * 60 * 5,
  })

  const properties = propertyData?.results || []
  const metadata = propertyData?.metadata?.[0] || { total: 0, totalPages: 0 }

  console.log(properties)
  const updateMutation = useMutation({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      propertyManagementService.updatePropertyManagement(id, data),
    onSuccess: () => {
      toast.success("Property updated successfully")
      queryClient.invalidateQueries({ queryKey: ["property-management"] })
      setIsEditModalOpen(false)
      setIsStatusModalOpen(false)
      setEditingProperty(null)
      setStatusChangeProperty(null)
    },
    onError: () => {
      toast.error("Failed to update property")
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => propertyManagementService.updatePropertyManagement(id, { isActive: false }),
    onSuccess: () => {
      toast.success("Property deleted successfully")
      queryClient.invalidateQueries({ queryKey: ["property-management"] })
      setIsDeleteDialogOpen(false)
      setDeletingProperty(null)
    },
    onError: () => {
      toast.error("Failed to delete property")
    },
  })

  const handleEdit = (property: PropertyManagement) => {
    setEditingProperty(property)
    setIsEditModalOpen(true)
  }

  const handleChangeStatus = (property: PropertyManagement) => {
    setStatusChangeProperty(property)
    setIsStatusModalOpen(true)
  }

  const handleDelete = (property: PropertyManagement) => {
    setDeletingProperty(property)
    setIsDeleteDialogOpen(true)
  }

 
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSaveEdit = (id: string, data: any) => {
    updateMutation.mutate({ id, data })
  }

  const handleSaveStatus = (id: string, status: STATUS) => {
    updateMutation.mutate({ id, data: { status } })
  }

  const handleConfirmDelete = () => {
    if (deletingProperty) {
      deleteMutation.mutate(deletingProperty.id)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusColors = {
      pending: "bg-yellow-100 text-yellow-800 capitalize",
      "In Progress": "bg-blue-100 text-blue-800 capitalize",
      completed: "bg-green-100 text-green-800 capitalize",
      approved: "bg-green-100 text-green-800 capitalize",
      rejected: "bg-red-100 text-red-800 capitalize",
    }

    return (
      <Badge className={statusColors[status as keyof typeof statusColors] || "bg-gray-100 text-gray-800"}>
        {status}
      </Badge>
    )
  }

  const columns = [
    {
      id: "customerName",
      header: "Customer Name",
      accessorKey: "name",
      cell: ( row: PropertyManagement ) => {
        return `${row.name.first} ${row.name.lastName}`
      },
      enableSorting: true,
    },
    {
      id: "phoneNumber",
      header: "Phone Number",
      accessorKey: "phoneNumber",
      enableSorting: false,
    },
    {
      id: "email",
      header: "Email Address",
      accessorKey: "email",
      enableSorting: true,
    },
    {
      id: "propertyType",
      header: "Property Type",
      accessorKey: "propertyType",
      enableSorting: true,
    },
    {
      id: "propertyLocation",
      header: "Location",
      accessorKey: "propertyLocation",
      enableSorting: true,
    },
    {
      id: "status",
      header: "Status",
      accessorKey: "status",
      cell: (row: PropertyManagement) => getStatusBadge(row.status),
      enableSorting: true,
    },
    {
      id: "createdAt",
      header: "Created",
      accessorKey: "createdAt",
      cell: (row: PropertyManagement) => {
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

  return (
    <div className="p-6 max-w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Property Management</h1>
        
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
              data={properties}
              actionMenu={actionMenu}
              pagination={{ pageSize: 10, totalItems: metadata.total }}
              searchable={true}
              selectable={true}
            />
          </div>
        )}
      </div>

      <EditModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setEditingProperty(null)
        }}
        property={editingProperty}
        onSave={handleSaveEdit}
        isLoading={updateMutation.isPending}
      />

      <StatusChangeModal
        isOpen={isStatusModalOpen}
        onClose={() => {
          setIsStatusModalOpen(false)
          setStatusChangeProperty(null)
        }}
        property={statusChangeProperty}
        onSave={handleSaveStatus}
        isLoading={updateMutation.isPending}
      />

      <DeleteConfirmation
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false)
          setDeletingProperty(null)
        }}
        property={deletingProperty}
        onConfirm={handleConfirmDelete}
        isLoading={deleteMutation.isPending}
      />
    </div>
  )
}
