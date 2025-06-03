
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Phone, Mail, MessageSquare, Tag, Calendar } from "lucide-react"
import type { Contact } from "@/services/contact-service"
import { Modal } from "../ui/modal"

interface ViewDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  contact: Contact | null
}

export function ViewDetailsModal({ isOpen, onClose, contact }: ViewDetailsModalProps) {
  if (!contact) return null

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

  return (
     <Modal isOpen={isOpen} title='Contact Details' onClose={onClose}>
          <div className="sm:max-w-[400px] p-5">
        <div className="space-y-6">
        
          <div>
            <h3 className="text-lg font-semibold mb-3">Customer Information</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="font-medium">Name:</span>
                <span>
                  {contact.name.first} {contact.name.lastName}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-gray-500" />
                <span>{contact.phoneNumber}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <span>{contact.email}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Inquiry Information</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Tag className="h-4 w-4 text-gray-500" />
                <span className="font-medium">Reason:</span>
                <Badge variant="outline">{contact.reason}</Badge>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-medium">Status:</span>
                {getStatusBadge(contact.status)}
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span>Created: {new Date(contact.createdAt).toLocaleString()}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">Contact ID:</span>
                <span className="text-sm">{contact.id}</span>
              </div>
              {contact.listingId && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">Listing ID:</span>
                  <span className="text-sm">{contact.listingId}</span>
                </div>
              )}
            </div>
          </div>

        
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <MessageSquare className="h-5 w-5 mr-2" />
              Message
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700 whitespace-pre-wrap">{contact.message}</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button
            variant="outline"
            onClick={() => window.open(`tel:${contact.phoneNumber}`)}
            className="flex items-center"
          >
            <Phone className="h-4 w-4 mr-2" />
            Call
          </Button>
          <Button
            variant="outline"
            onClick={() => window.open(`mailto:${contact.email}`)}
            className="flex items-center"
          >
            <Mail className="h-4 w-4 mr-2" />
            Email
          </Button>
          <Button onClick={onClose}>Close</Button>
        </div>
     </div>
         </Modal>
  )
}
