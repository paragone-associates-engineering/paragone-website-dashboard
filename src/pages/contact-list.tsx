
import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { DataTable } from "@/components/shared/data-table"
import { Badge } from "@/components/ui/badge"
import { Eye, Phone, Trash2, Mail, RefreshCw, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { contactService, type Contact } from "@/services/contact-service"
import { StatusChangeModal } from "@/components/contact/status-change"
import { ViewDetailsModal } from "@/components/contact/view-details"
import { DeleteConfirmation } from "@/components/contact/delete-confirmation"

export default function ContactUsListPage() {
  const queryClient = useQueryClient()
  const [statusChangeContact, setStatusChangeContact] = useState<Contact | null>(null)
  const [viewDetailsContact, setViewDetailsContact] = useState<Contact | null>(null)
  const [deletingContact, setDeletingContact] = useState<Contact | null>(null)
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const {
    data: contactData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["contacts"],
    queryFn: () => contactService.getContacts(),
    staleTime: 1000 * 60 * 5,
  })

  const contacts = contactData?.results || []
  const metadata = contactData?.metadata?.[0] || { total: 0, totalPages: 0 }

  const updateMutation = useMutation({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutationFn: ({ id, data }: { id: string; data: any }) => contactService.updateContact(id, data),
    onSuccess: () => {
      toast.success("Contact updated successfully")
      queryClient.invalidateQueries({ queryKey: ["contacts"] })
      setIsStatusModalOpen(false)
      setStatusChangeContact(null)
    },
    onError: () => {
      toast.error("Failed to update contact")
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => contactService.updateContact(id, { isActive: false }),
    onSuccess: () => {
      toast.success("Contact deleted successfully")
      queryClient.invalidateQueries({ queryKey: ["contacts"] })
      setIsDeleteDialogOpen(false)
      setDeletingContact(null)
    },
    onError: () => {
      toast.error("Failed to delete contact")
    },
  })

  const handleViewDetails = (contact: Contact) => {
    setViewDetailsContact(contact)
    setIsViewModalOpen(true)
  }

  const handleChangeStatus = (contact: Contact) => {
    setStatusChangeContact(contact)
    setIsStatusModalOpen(true)
  }

  const handleContact = (contact: Contact) => {
    // Open phone dialer
    window.open(`tel:${contact.phoneNumber}`)
  }

  const handleEmail = (contact: Contact) => {
   
    window.open(`mailto:${contact.email}`)
  }

  const handleDelete = (contact: Contact) => {
    setDeletingContact(contact)
    setIsDeleteDialogOpen(true)
  }

  const handleSaveStatus = (id: string, status: string) => {
    updateMutation.mutate({ id, data: { status } })
  }

  const handleConfirmDelete = () => {
    if (deletingContact) {
      deleteMutation.mutate(deletingContact.id)
    }
  }

  const getStatusBadge = (status?: string) => {
    const statusColors = {
      Pending: "bg-yellow-100 text-yellow-800",
      "In Progress": "bg-blue-100 text-blue-800",
      Completed: "bg-green-100 text-green-800",
      Resolved: "bg-green-100 text-green-800",
      Closed: "bg-gray-100 text-gray-800",
    }

    const displayStatus = status || "Pending"

    return (
      <Badge className={statusColors[displayStatus as keyof typeof statusColors] || "bg-gray-100 text-gray-800"}>
        {displayStatus}
      </Badge>
    )
  }

  const columns = [
    {
      id: "id",
      header: "Contact ID",
      accessorKey: "id",
      enableSorting: true,
    },
    {
      id: "createdAt",
      header: "Date",
      accessorKey: "createdAt",
      cell: ( row: Contact ) => {
        return new Date(row.createdAt).toLocaleDateString()
      },
      enableSorting: true,
    },
    {
      id: "customerName",
      header: "Customer Name",
      accessorKey: "name",
      cell: ( row: Contact ) => {
        return `${row.name.first} ${row.name.lastName}`
      },
      enableSorting: true,
    },
    {
      id: "email",
      header: "Email Address",
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
      id: "reason",
      header: "Reason",
      accessorKey: "reason",
      cell: ( row: Contact) => (
        <Badge variant="outline" className="text-xs">
          {row.reason}
        </Badge>
      ),
      enableSorting: true,
    },
    {
      id: "message",
      header: "Message",
      accessorKey: "message",
      cell: ( row: Contact ) => {
        const message = row.message
        return message.length > 50 ? `${message.substring(0, 50)}...` : message
      },
    },
    {
      id: "status",
      header: "Status",
      accessorKey: "status",
      cell: ( row: Contact ) => getStatusBadge(row.status),
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
        icon: <RefreshCw className="h-4 w-4" />,
        onClick: handleChangeStatus,
      },
      {
        label: "Call",
        icon: <Phone className="h-4 w-4" />,
        onClick: handleContact,
      },
      {
        label: "Email",
        icon: <Mail className="h-4 w-4" />,
        onClick: handleEmail,
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
        <h1 className="text-2xl font-bold">Contact Us List</h1>
        <p className="text-sm text-gray-500">Total: {metadata.total} inquiries</p>
      </div>

      <div className="bg-white rounded-lg border overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Loading Contacts...</span>
          </div>
        ) : isError ? (
          <div className="p-8 text-center text-red-500">Error loading contacts. Please try again.</div>
        ) : (
          <div className="overflow-x-auto">
            <DataTable
              columns={columns}
              data={contacts}
              onRowClick={handleViewDetails}
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
          setStatusChangeContact(null)
        }}
        contact={statusChangeContact}
        onSave={handleSaveStatus}
        isLoading={updateMutation.isPending}
      />

      <ViewDetailsModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false)
          setViewDetailsContact(null)
        }}
        contact={viewDetailsContact}
      />

      <DeleteConfirmation
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false)
          setDeletingContact(null)
        }}
        contact={deletingContact}
        onConfirm={handleConfirmDelete}
        isLoading={deleteMutation.isPending}
      />
    </div>
  )
}
