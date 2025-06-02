"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { DataTable } from "@/components/shared/data-table"
import { Badge } from "@/components/ui/badge"
import { Pencil, Trash2, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { referAndEarnService, type ReferAndEarn } from "@/services/refer-and-earn-service"
import { EditModal } from "@/components/refer-and-earn/edit-modal"
import { DeleteConfirmation } from "@/components/refer-and-earn/delete-confirmation"

export default function ReferAndEarnPage() {
  const queryClient = useQueryClient()
  const [editingReferral, setEditingReferral] = useState<ReferAndEarn | null>(null)
  const [deletingReferral, setDeletingReferral] = useState<ReferAndEarn | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const {
    data: referralData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["refer-and-earn"],
    queryFn: () => referAndEarnService.getReferAndEarn(),
    staleTime: 1000 * 60 * 5,
  })

  const referrals = referralData?.results || []
  const metadata = referralData?.metadata?.[0] || { total: 0, totalPages: 0 }

  const updateMutation = useMutation({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutationFn: ({ id, data }: { id: string; data: any }) => referAndEarnService.updateReferAndEarn(id, data),
    onSuccess: () => {
      toast.success("Referral updated successfully")
      queryClient.invalidateQueries({ queryKey: ["refer-and-earn"] })
      setIsEditModalOpen(false)
      setEditingReferral(null)
    },
    onError: () => {
      toast.error("Failed to update referral")
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => referAndEarnService.updateReferAndEarn(id, { isActive: false }),
    onSuccess: () => {
      toast.success("Referral deleted successfully")
      queryClient.invalidateQueries({ queryKey: ["refer-and-earn"] })
      setIsDeleteDialogOpen(false)
      setDeletingReferral(null)
    },
    onError: () => {
      toast.error("Failed to delete referral")
    },
  })

  const handleEdit = (referral: ReferAndEarn) => {
    setEditingReferral(referral)
    setIsEditModalOpen(true)
  }

  const handleDelete = (referral: ReferAndEarn) => {
    setDeletingReferral(referral)
    setIsDeleteDialogOpen(true)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSaveEdit = (id: string, data: any) => {
    updateMutation.mutate({ id, data })
  }

  const handleConfirmDelete = () => {
    if (deletingReferral) {
      deleteMutation.mutate(deletingReferral.id)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusColors = {
      Pending: "bg-yellow-100 text-yellow-800",
      Approved: "bg-green-100 text-green-800",
      Rejected: "bg-red-100 text-red-800",
      "In Progress": "bg-blue-100 text-blue-800",
    }

    return (
      <Badge className={statusColors[status as keyof typeof statusColors] || "bg-gray-100 text-gray-800"}>
        {status}
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
      id: "fullName",
      header: "Full Name",
      accessorKey: "name",
      cell: (row: ReferAndEarn ) => {
        const { name } = row
        return `${name.first} ${name.lastName}`
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
      id: "interestedService",
      header: "Service",
      accessorKey: "interestedService",
      enableSorting: true,
    },
    {
      id: "status",
      header: "Status",
      accessorKey: "status",
      cell: (row: ReferAndEarn ) => getStatusBadge(row.status),
      enableSorting: true,
    },
    {
      id: "createdAt",
      header: "Created",
      accessorKey: "createdAt",
      cell: ( row: ReferAndEarn) => {
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
        label: "Edit",
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
    <div className="p-6 max-w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Refer and Earn</h1>
       
      </div>

      <div className="bg-white rounded-lg border overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Loading Referrals...</span>
          </div>
        ) : isError ? (
          <div className="p-8 text-center text-red-500">Error loading referrals. Please try again.</div>
        ) : (
          <div className="overflow-x-auto">
            <DataTable
              columns={columns}
              data={referrals}
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
          setEditingReferral(null)
        }}
        referral={editingReferral}
        onSave={handleSaveEdit}
        isLoading={updateMutation.isPending}
      />

      <DeleteConfirmation
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false)
          setDeletingReferral(null)
        }}
        referral={deletingReferral}
        onConfirm={handleConfirmDelete}
        isLoading={deleteMutation.isPending}
      />
    </div>
  )
}
