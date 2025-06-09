
import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { DataTable } from "@/components/shared/data-table"
//import { Badge } from "@/components/ui/badge"
import { Pencil, Trash2,  Loader2 } from "lucide-react"
import { toast } from "sonner"
import { joinUsService, type JoinUs } from "@/services/join-us-service"
import { EditModal } from "@/components/join-us/edit-modal"
import { StatusChangeModal } from "@/components/join-us/status-change"
import { DeleteConfirmation } from "@/components/join-us/delete-confirmation"

export default function JoinUsPage() {
  const queryClient = useQueryClient()
  const [editingEntry, setEditingEntry] = useState<JoinUs | null>(null)
  const [statusChangeEntry, setStatusChangeEntry] = useState<JoinUs | null>(null)
  const [deletingEntry, setDeletingEntry] = useState<JoinUs | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const {
    data: joinUsEntries,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["join-us"],
    queryFn: () => joinUsService.getJoinUs(),
    staleTime: 1000 * 60 * 5,
  })

  const entries = joinUsEntries || []

  const updateMutation = useMutation({
     // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutationFn: ({ id, data }: { id: string; data: any }) => joinUsService.updateJoinUs(id, data),
    onSuccess: () => {
      toast.success("Entry updated successfully")
      queryClient.invalidateQueries({ queryKey: ["join-us"] })
      setIsEditModalOpen(false)
      setIsStatusModalOpen(false)
      setEditingEntry(null)
      setStatusChangeEntry(null)
    },
    onError: () => {
      toast.error("Failed to update entry")
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => joinUsService.updateJoinUs(id, { isActive: false }),
    onSuccess: () => {
      toast.success("Entry deleted successfully")
      queryClient.invalidateQueries({ queryKey: ["join-us"] })
      setIsDeleteDialogOpen(false)
      setDeletingEntry(null)
    },
    onError: () => {
      toast.error("Failed to delete entry")
    },
  })

  const handleEdit = (entry: JoinUs) => {
    setEditingEntry(entry)
    setIsEditModalOpen(true)
  }

  // const handleChangeStatus = (entry: JoinUs) => {
  //   setStatusChangeEntry(entry)
  //   setIsStatusModalOpen(true)
  // }

  const handleDelete = (entry: JoinUs) => {
    setDeletingEntry(entry)
    setIsDeleteDialogOpen(true)
  }

  // const handleViewDetails = (entry: JoinUs) => {
  //   toast.info(`Viewing details for ${entry.name.first} ${entry.name.lastName}`)
  // }
 // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSaveEdit = (id: string, data: any) => {
    updateMutation.mutate({ id, data })
  }

  const handleSaveStatus = (id: string, status: string) => {
    updateMutation.mutate({ id, data: { status } })
  }

  const handleConfirmDelete = () => {
    if (deletingEntry) {
      deleteMutation.mutate(deletingEntry.id)
    }
  }

  // const getStatusBadge = (status?: string) => {
  //   const statusColors = {
  //     Pending: "bg-yellow-100 text-yellow-800",
  //     Approved: "bg-green-100 text-green-800",
  //     Rejected: "bg-red-100 text-red-800",
  //     "In Review": "bg-blue-100 text-blue-800",
  //     Contacted: "bg-purple-100 text-purple-800",
  //   }

  //   const displayStatus = status || "Pending"

  //   return (
  //     <Badge className={statusColors[displayStatus as keyof typeof statusColors] || "bg-gray-100 text-gray-800"}>
  //       {displayStatus}
  //     </Badge>
  //   )
  // }

  const columns = [
    {
      id: "id",
      header: "ID",
      accessorKey: "id",
      enableSorting: true,
    },
    {
      id: "fullName",
      header: "Full Name",
      accessorKey: "name",
      cell: ( row: JoinUs ) => {
        return `${row.name.first} ${row.name.lastName}`
      },
      enableSorting: true,
    },
    {
      id: "email",
      header: "Email",
      accessorKey: "email",
      enableSorting: true,
    },
    {
      id: "phoneNumber",
      header: "Phone Number",
      accessorKey: "phoneNumber",
      enableSorting: false,
    },
    {
      id: "location",
      header: "Location",
      accessorKey: "location",
      enableSorting: true,
    },
    {
      id: "participation",
      header: "Participation",
      accessorKey: "participation",
      cell: ( row: JoinUs ) => {
        const participation = row.participation
        return participation.length > 30 ? `${participation.substring(0, 30)}...` : participation
      },
      enableSorting: false,
    },
    {
      id: "createdAt",
      header: "Joined",
      accessorKey: "createdAt",
      cell: ( row: JoinUs ) => {
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
      // {
      //   label: "View Details",
      //   icon: <Eye className="h-4 w-4" />,
      //   onClick: handleViewDetails,
      // },
      {
        label: "Edit",
        icon: <Pencil className="h-4 w-4" />,
        onClick: handleEdit,
      },
      // {
      //   label: "Change Status",
      //   icon: <RefreshCw className="h-4 w-4" />,
      //   onClick: handleChangeStatus,
      // },
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
        <h1 className="text-2xl font-bold">Join Us</h1>
       
      </div>

      <div className="bg-white rounded-lg border overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Loading Entries...</span>
          </div>
        ) : isError ? (
          <div className="p-8 text-center text-red-500">Error loading entries. Please try again.</div>
        ) : (
          <div className="overflow-x-auto">
            <DataTable
              columns={columns}
              data={entries}
              actionMenu={actionMenu}
              pagination={{ pageSize: 10, totalItems: entries.length }}
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
          setEditingEntry(null)
        }}
        joinUsEntry={editingEntry}
        onSave={handleSaveEdit}
        isLoading={updateMutation.isPending}
      />

      <StatusChangeModal
        isOpen={isStatusModalOpen}
        onClose={() => {
          setIsStatusModalOpen(false)
          setStatusChangeEntry(null)
        }}
        joinUsEntry={statusChangeEntry}
        onSave={handleSaveStatus}
        isLoading={updateMutation.isPending}
      />

      <DeleteConfirmation
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false)
          setDeletingEntry(null)
        }}
        joinUsEntry={deletingEntry}
        onConfirm={handleConfirmDelete}
        isLoading={deleteMutation.isPending}
      />
    </div>
  )
}
