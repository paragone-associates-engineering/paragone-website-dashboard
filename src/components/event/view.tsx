import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Link, DollarSign } from "lucide-react"
import { format } from "date-fns"
import type { Event } from "@/types/event"

interface ViewEventModalProps {
  event: Event | null
  isOpen: boolean
  onClose: () => void
}

export const ViewEventModal = ({ event, isOpen, onClose }: ViewEventModalProps) => {
  if (!event) return null

  const getStatusBadge = (status: string) => {
    const statusColors = {
      active: "bg-green-100 text-green-800",
      inactive: "bg-gray-100 text-gray-800",
      deactivated: "bg-red-100 text-red-800",
    }

    return (
      <Badge className={statusColors[status as keyof typeof statusColors] || "bg-gray-100 text-gray-800"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const getEventTypeBadge = (type: string) => {
    const typeColors = {
      inPerson: "bg-blue-100 text-blue-800",
      virtual: "bg-purple-100 text-purple-800",
      hybrid: "bg-orange-100 text-orange-800",
    }

    return (
      <Badge className={typeColors[type as keyof typeof typeColors] || "bg-gray-100 text-gray-800"}>
        {type === "inPerson" ? "In Person" : type.charAt(0).toUpperCase() + type.slice(1)}
      </Badge>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">{event.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          
          <div className="flex items-center gap-2">
            {getStatusBadge(event.status)}
            {getEventTypeBadge(event.eventType)}
            {event.isPaid && <Badge className="bg-green-100 text-green-800">Paid Event</Badge>}
          </div>

          
          {event.image && (
            <div className="w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={event.image || "/placeholder.svg?height=200&width=400"}
                alt={event.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

         
          <div>
            <h3 className="font-semibold mb-2">Summary</h3>
            <p className="text-gray-700">{event.summary}</p>
          </div>

         
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span>
                  <strong>Expires:</strong> {format(new Date(event.expirationDate), "MMM d, yyyy 'at' h:mm a")}
                </span>
              </div>

              {event.location && (
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span>
                    <strong>Location:</strong> {event.location}
                  </span>
                </div>
              )}

              <div className="flex items-center gap-2 text-sm">
                <Link className="h-4 w-4 text-gray-500" />
                <span>
                  <strong>Link:</strong>{" "}
                  <a
                    href={event.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {event.link}
                  </a>
                </span>
              </div>
            </div>

           
            {event.isPaid && event.price && (
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Pricing
                </h4>
                <div className="space-y-2 text-sm">
                  {event.price.inPerson && (
                    <div>
                      <strong>In-Person:</strong> {event.price.inPerson.currency}{" "}
                      {event.price.inPerson.amount.toLocaleString()}
                    </div>
                  )}
                  {event.price.virtual && (
                    <div>
                      <strong>Virtual:</strong> {event.price.virtual.currency}{" "}
                      {event.price.virtual.amount.toLocaleString()}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

        
          <div className="pt-4 border-t text-xs text-gray-500">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <strong>Created:</strong> {format(new Date(event.createdAt), "MMM d, yyyy 'at' h:mm a")}
              </div>
              <div>
                <strong>Updated:</strong> {format(new Date(event.updatedAt), "MMM d, yyyy 'at' h:mm a")}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
