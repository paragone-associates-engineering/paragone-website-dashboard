
import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { DataTable } from "@/components/shared/data-table"
import { Badge } from "@/components/ui/badge"
import {  Pencil, Trash2,  Loader2 } from "lucide-react"
import { toast } from "sonner"
import { partnerService, type ConnectWithUs } from "@/services/partner-service"
import { IndividualStatusModal } from "@/components/partner/individual-status"

import { DeleteConfirmation } from "@/components/partner/delete-confirmation"

export default function PartnerWithUsPage() {
  const queryClient = useQueryClient()

  const [statusChangeIndividual, setStatusChangeIndividual] = useState<ConnectWithUs | null>(null)
  const [deletingIndividual, setDeletingIndividual] = useState<ConnectWithUs | null>(null)
  const [isIndividualStatusModalOpen, setIsIndividualStatusModalOpen] = useState(false)
  const [isIndividualDeleteDialogOpen, setIsIndividualDeleteDialogOpen] = useState(false)
 

  const {
    data: individualsData,
    isLoading: individualsLoading,
    isError: individualsError,
  } = useQuery({
    queryKey: ["connect-with-us"],
    queryFn: () => partnerService.getConnectWithUs(),
    staleTime: 1000 * 60 * 5,
  })

 

  const individuals = individualsData?.results || []
  const individualsMetadata = individualsData?.metadata?.[0] || { total: 0, totalPages: 0 }
 

 const updateIndividualMutation = useMutation({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutationFn: ({ id, data }: { id: string; data: any }) => partnerService.updateConnectWithUs(id, data),
    onSuccess: () => {
      toast.success("Individual request updated successfully")
      queryClient.invalidateQueries({ queryKey: ["connect-with-us"] })
      setIsIndividualStatusModalOpen(false)
      setStatusChangeIndividual(null)
    },
    onError: () => {
      toast.error("Failed to update individual request")
    },
  })

  const deleteIndividualMutation = useMutation({
    mutationFn: (id: string) => partnerService.updateConnectWithUs(id, { isActive: false }),
    onSuccess: () => {
      toast.success("Individual request deleted successfully")
      queryClient.invalidateQueries({ queryKey: ["connect-with-us"] })
      setIsIndividualDeleteDialogOpen(false)
      setDeletingIndividual(null)
    },
    onError: () => {
      toast.error("Failed to delete individual request")
    },
  })

  

  const handleIndividualStatusChange = (individual: ConnectWithUs) => {
    setStatusChangeIndividual(individual)
    setIsIndividualStatusModalOpen(true)
  }

  const handleIndividualDelete = (individual: ConnectWithUs) => {
    setDeletingIndividual(individual)
    setIsIndividualDeleteDialogOpen(true)
  }

  // const handleIndividualView = (individual: ConnectWithUs) => {
  //   toast.info(`Viewing details for ${individual.name.first} ${individual.name.lastName}`)
  // }

 
  const handleSaveIndividualStatus = (id: string, status: string) => {
    updateIndividualMutation.mutate({ id, data: { status } })
  }


  const handleConfirmIndividualDelete = () => {
    if (deletingIndividual) {
      deleteIndividualMutation.mutate(deletingIndividual.id)
    }
  }

  

  const getStatusBadge = (status: string) => {
    const statusColors = {
      Pending: "bg-yellow-100 text-yellow-800",
      Approved: "bg-green-100 text-green-800",
      Rejected: "bg-red-100 text-red-800",
      "In Review": "bg-blue-100 text-blue-800",
      Contacted: "bg-purple-100 text-purple-800",
      Verified: "bg-green-100 text-green-800",
    }

    return (
      <Badge className={statusColors[status as keyof typeof statusColors] || "bg-gray-100 text-gray-800"}>
        {status}
      </Badge>
    )
  }

  // Individual columns
  const individualColumns = [
    {
      id: "customerName",
      header: "Customer Name",
      accessorKey: "name",
      cell: ( row: ConnectWithUs ) => {
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
      id: "address",
      header: "Address",
      accessorKey: "address",
      enableSorting: true,
    },
    {
      id: "contactMethod",
      header: "Contact Method",
      accessorKey: "contactMethod",
      enableSorting: true,
    },
    {
      id: "contactTime",
      header: "Contact Time",
      accessorKey: "contactTime",
      enableSorting: true,
    },
    {
      id: "sellDate",
      header: "Sell Date",
      accessorKey: "sellDate",
      enableSorting: true,
    },
    {
      id: "status",
      header: "Status",
      accessorKey: "status",
      cell: ( row: ConnectWithUs ) => getStatusBadge(row.status),
      enableSorting: true,
    },
    {
      id: "action",
      header: "",
      accessorKey: "id",
      cell: () => null,
    },
  ]

 

  const individualActionMenu = {
    items: [
      // {
      //   label: "View details",
      //   icon: <Eye className="h-4 w-4" />,
      //   onClick: handleIndividualView,
      // },
      {
        label: "Change status",
        icon: <Pencil className="h-4 w-4" />,
        onClick: handleIndividualStatusChange,
      },
      {
        label: "Delete",
        icon: <Trash2 className="h-4 w-4" />,
        onClick: handleIndividualDelete,
        className: "text-red-600",
      },
    ],
  }

  

  return (
    <div className="p-6 lg:max-w-[980px] 2xl:max-w-full overflow-x-hidden">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">   Sell as an Individual ({individualsMetadata.total})</h1>
      </div>

          <div className="bg-white rounded-lg border overflow-hidden">
            {individualsLoading ? (
              <div className="flex justify-center items-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2">Loading Individual Requests...</span>
              </div>
            ) : individualsError ? (
              <div className="p-8 text-center text-red-500">Error loading individual requests. Please try again.</div>
            ) : (
              <div className="overflow-x-auto ">
                <DataTable
                  columns={individualColumns}
                  data={individuals}
                  onRowClick={handleIndividualStatusChange}
                  actionMenu={individualActionMenu}
                  pagination={{ pageSize: 10, totalItems: individualsMetadata.total }}
                  searchable={true}
                  selectable={true}
                />
              </div>
            )}
          </div>
      

   

      {/* Individual Modals */}
      <IndividualStatusModal
        isOpen={isIndividualStatusModalOpen}
        onClose={() => {
          setIsIndividualStatusModalOpen(false)
          setStatusChangeIndividual(null)
        }}
        individual={statusChangeIndividual}
        onSave={handleSaveIndividualStatus}
        isLoading={updateIndividualMutation.isPending}
      />

     
      {/* Delete Confirmations */}
      <DeleteConfirmation
        isOpen={isIndividualDeleteDialogOpen}
        onClose={() => {
          setIsIndividualDeleteDialogOpen(false)
          setDeletingIndividual(null)
        }}
        itemName={deletingIndividual ? `${deletingIndividual.name.first} ${deletingIndividual.name.lastName}` : ""}
        onConfirm={handleConfirmIndividualDelete}
        isLoading={deleteIndividualMutation.isPending}
      />

    
    </div>
  )
}
