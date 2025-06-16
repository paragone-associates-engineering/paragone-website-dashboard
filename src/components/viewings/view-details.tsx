

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Phone, Mail, Home, DollarSign } from "lucide-react"
import { Modal } from "../ui/modal"
import type { Viewing } from "@/services/viewings-service"

interface ViewDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  viewing: Viewing | null
}

export function ViewDetailsModal({ isOpen, onClose, viewing }: ViewDetailsModalProps) {
  if (!viewing) return null

  const getStatusBadge = (status: string) => {
    const statusColors = {
      Pending: "bg-yellow-100 text-yellow-800",
      Confirmed: "bg-blue-100 text-blue-800",
      Completed: "bg-green-100 text-green-800",
      Cancelled: "bg-red-100 text-red-800",
      Rescheduled: "bg-purple-100 text-purple-800",
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

  return (
    <Modal isOpen={isOpen} title='Viewing Details' onClose={onClose}>
      <div className="sm:max-w-[400px] p-5">
        <div className="space-y-6">
         
          <div>
            <h3 className="text-lg font-semibold mb-3">Customer Information</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="font-medium">Name:</span>
                <span>
                  {viewing.name.first} {viewing.name.lastName}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-gray-500" />
                <span>{viewing.phoneNumber}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <span>{viewing.email}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Property Information</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Home className="h-4 w-4 text-gray-500" />
                <span className="font-medium">{viewing.propertyDetails.propertyName}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span>{viewing.propertyDetails.location.city} - {viewing.propertyDetails.location.region}, {viewing.propertyDetails.location.country}</span>
              </div>
              <div className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4 text-gray-500" />
                <span>${viewing.propertyDetails.amount.toLocaleString()}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">Property ID:</span>
                <span className="text-sm">{viewing.propertyDetails.propertyId}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Viewing Information</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span>{new Date(viewing.date).toLocaleString()}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-medium">Type:</span>
                {getViewingTypeBadge(viewing.viewingType)}
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-medium">Status:</span>
                {getStatusBadge(viewing.status)}
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">Viewing ID:</span>
                <span className="text-sm">{viewing.id}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 px-10">
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    </Modal>
  )
}
