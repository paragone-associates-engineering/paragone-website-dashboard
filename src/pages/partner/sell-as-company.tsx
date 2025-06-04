
import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { DataTable } from "@/components/shared/data-table"
import { Badge } from "@/components/ui/badge"
import { Eye, Pencil, Trash2, XCircle, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { partnerService, type SellAsCompany } from "@/services/partner-service"
import { CompanyStatusModal } from "@/components/partner/company-status"
import { RejectionModal } from "@/components/partner/rejection-modal"
import { DeleteConfirmation } from "@/components/partner/delete-confirmation"

export default function SellAsACompanyPage() {
  const queryClient = useQueryClient()


  const [statusChangeCompany, setStatusChangeCompany] = useState<SellAsCompany | null>(null)
  const [rejectingCompany, setRejectingCompany] = useState<SellAsCompany | null>(null)
  const [deletingCompany, setDeletingCompany] = useState<SellAsCompany | null>(null)
  const [isCompanyStatusModalOpen, setIsCompanyStatusModalOpen] = useState(false)
  const [isRejectionModalOpen, setIsRejectionModalOpen] = useState(false)
  const [isCompanyDeleteDialogOpen, setIsCompanyDeleteDialogOpen] = useState(false)

  const {
    data: companiesData,
    isLoading: companiesLoading,
    isError: companiesError,
  } = useQuery({
    queryKey: ["sell-as-company"],
    queryFn: () => partnerService.getSellAsCompany(),
    staleTime: 1000 * 60 * 5,
  })

  
  const companies = Array.isArray(companiesData) ? companiesData : []

 

 

  // Company mutations
  const updateCompanyMutation = useMutation({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutationFn: ({ id, data }: { id: string; data: any }) => partnerService.updateSellAsCompany(id, data),
    onSuccess: () => {
      toast.success("Company request updated successfully")
      queryClient.invalidateQueries({ queryKey: ["sell-as-company"] })
      setIsCompanyStatusModalOpen(false)
      setStatusChangeCompany(null)
    },
    onError: () => {
      toast.error("Failed to update company request")
    },
  })

  const rejectCompanyMutation = useMutation({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutationFn: ({ id, data }: { id: string; data: any }) => partnerService.rejectSellAsCompany(id, data),
    onSuccess: () => {
      toast.success("Company application rejected successfully")
      queryClient.invalidateQueries({ queryKey: ["sell-as-company"] })
      setIsRejectionModalOpen(false)
      setRejectingCompany(null)
    },
    onError: () => {
      toast.error("Failed to reject company application")
    },
  })

  const deleteCompanyMutation = useMutation({
    mutationFn: (id: string) => partnerService.updateSellAsCompany(id, { isActive: false }),
    onSuccess: () => {
      toast.success("Company request deleted successfully")
      queryClient.invalidateQueries({ queryKey: ["sell-as-company"] })
      setIsCompanyDeleteDialogOpen(false)
      setDeletingCompany(null)
    },
    onError: () => {
      toast.error("Failed to delete company request")
    },
  })

 

 

  // Company handlers
  const handleCompanyStatusChange = (company: SellAsCompany) => {
    setStatusChangeCompany(company)
    setIsCompanyStatusModalOpen(true)
  }

  const handleCompanyReject = (company: SellAsCompany) => {
    setRejectingCompany(company)
    setIsRejectionModalOpen(true)
  }

  const handleCompanyDelete = (company: SellAsCompany) => {
    setDeletingCompany(company)
    setIsCompanyDeleteDialogOpen(true)
  }

  const handleCompanyView = (company: SellAsCompany) => {
    toast.info(`Viewing company details for ${company.email}`)
  }

 

  const handleSaveCompanyStatus = (id: string, status: string) => {
    updateCompanyMutation.mutate({ id, data: { status } })
  }
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSaveRejection = (id: string, data: any) => {
    rejectCompanyMutation.mutate({ id, data })
  }

 
  const handleConfirmCompanyDelete = () => {
    if (deletingCompany) {
      deleteCompanyMutation.mutate(deletingCompany.id)
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

 

  // Company columns
  const companyColumns = [
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
      id: "officeAddress",
      header: "Office Address",
      accessorKey: "officeAddress",
      enableSorting: true,
    },
    {
      id: "state",
      header: "State",
      accessorKey: "state",
      enableSorting: true,
    },
    {
      id: "country",
      header: "Country",
      accessorKey: "country",
      enableSorting: true,
    },
    {
      id: "contactMethod",
      header: "Contact Method",
      accessorKey: "contactMethod",
      enableSorting: true,
    },
    {
      id: "properties",
      header: "Properties",
      accessorKey: "properties",
      cell: (row: SellAsCompany ) => row.properties.length,
    },
    {
      id: "status",
      header: "Status",
      accessorKey: "status",
      cell: (row: SellAsCompany ) => getStatusBadge(row.status),
      enableSorting: true,
    },
    {
      id: "action",
      header: "",
      accessorKey: "id",
      cell: () => null,
    },
  ]

  

  const companyActionMenu = {
    items: [
      {
        label: "View details",
        icon: <Eye className="h-4 w-4" />,
        onClick: handleCompanyView,
      },
      {
        label: "Change status",
        icon: <Pencil className="h-4 w-4" />,
        onClick: handleCompanyStatusChange,
      },
      {
        label: "Reject",
        icon: <XCircle className="h-4 w-4" />,
        onClick: handleCompanyReject,
        className: "text-orange-600",
      },
      {
        label: "Delete",
        icon: <Trash2 className="h-4 w-4" />,
        onClick: handleCompanyDelete,
        className: "text-red-600",
      },
    ],
  }

  return (
    <div className="p-6 lg:max-w-[980px] 2xl:max-w-full overflow-x-hidden">
      <div className="mb-6">
        <h1 className="text-2xl font-bold"> Sell as a Company ({companies.length})</h1>
      </div>
       
          <div className="bg-white rounded-lg border overflow-hidden">
            {companiesLoading ? (
              <div className="flex justify-center items-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2">Loading Company Requests...</span>
              </div>
            ) : companiesError ? (
              <div className="p-8 text-center text-red-500">Error loading company requests. Please try again.</div>
            ) : (
              <div className="overflow-x-auto">
                <DataTable
                  columns={companyColumns}
                  data={companies}
                  actionMenu={companyActionMenu}
                  pagination={{ pageSize: 10, totalItems: companies.length }}
                  searchable={true}
                  selectable={true}
                />
              </div>
            )}
          </div>
        
      

      {/* Company Modals */}
      <CompanyStatusModal
        isOpen={isCompanyStatusModalOpen}
        onClose={() => {
          setIsCompanyStatusModalOpen(false)
          setStatusChangeCompany(null)
        }}
        company={statusChangeCompany}
        onSave={handleSaveCompanyStatus}
        isLoading={updateCompanyMutation.isPending}
      />

      <RejectionModal
        isOpen={isRejectionModalOpen}
        onClose={() => {
          setIsRejectionModalOpen(false)
          setRejectingCompany(null)
        }}
        company={rejectingCompany}
        onReject={handleSaveRejection}
        isLoading={rejectCompanyMutation.isPending}
      />

      {/* Delete Confirmations */}

      <DeleteConfirmation
        isOpen={isCompanyDeleteDialogOpen}
        onClose={() => {
          setIsCompanyDeleteDialogOpen(false)
          setDeletingCompany(null)
        }}
        itemName={deletingCompany ? deletingCompany.email : ""}
        onConfirm={handleConfirmCompanyDelete}
        isLoading={deleteCompanyMutation.isPending}
      />
    </div>
  )
}
