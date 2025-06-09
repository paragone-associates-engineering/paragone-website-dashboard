
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Phone, Mail, MessageSquare, Tag, Calendar } from "lucide-react"
import type { Contact } from "@/services/contact-service"
import { Modal } from "../ui/modal"
import { listingsService } from "@/services/listings-service"
import { useQuery } from "@tanstack/react-query"

interface ViewDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  contact: Contact | null
}

export function ViewDetailsModal({ isOpen, onClose, contact }: ViewDetailsModalProps) {
   const {
    data: listing,
  } = useQuery({
    queryKey: ["listing", contact?.listingId],
    queryFn: () => contact ? listingsService.getListing(contact.listingId!) : Promise.resolve(undefined),
    enabled: !!contact?.listingId,
    staleTime: 1000 * 60 * 5,
  })
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
          <div className=" p-5">
        <div className="grid grid-cols-2 gap-6">
        
          <div>
            <h3 className="text-lg font-semibold mb-3">Customer Information</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="font-medium">Name:</span>
                <span className="capitalize">
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
                <div className="flex space-x-2">
                  <span className="text-sm text-gray-500">Property:</span>
                  <div className="flex flex-col gap-1 font-bold">
                  <span className="text-sm ">{contact.listingId}</span>
                   <span className="text-sm capitalize">{listing && listing?.propertyName}</span>
                    <span className="text-sm capitalize">{listing && listing?.listingType}</span>
                    <span className="text-sm capitalize ">{listing && listing?.propertyType}</span>
                   </div>
                </div>
              )}
            </div>
          </div>

        
          <div className="col-span-2 mb-2">
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
