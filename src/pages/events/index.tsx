
import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Eye, Edit, Trash2, Calendar, MapPin } from "lucide-react"
import { eventService } from "@/services/event-service"
import { toast } from "sonner"
import { format } from "date-fns"
import { useNavigate } from "react-router-dom"
import type { Event } from "@/types/event"
import { DeleteConfirmationModal } from "@/components/event/delete-confirmation"
import { ViewEventModal } from "@/components/event/view"

const EventsPage = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [deletingEvent, setDeletingEvent] = useState<Event | null>(null)
  const [viewingEvent, setViewingEvent] = useState<Event | null>(null)

  const navigate = useNavigate()
  const queryClient = useQueryClient()

 
  const eventsQuery = useQuery({
    queryKey: ["events", searchQuery, currentPage],
    queryFn: () =>
      eventService.getEvents({
        page: currentPage,
        limit: 10,
        searchString: searchQuery || undefined,
      }),
  })

  
  const deleteEventMutation = useMutation({
    mutationFn: eventService.deleteEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] })
      toast.success("Event deleted successfully")
      setDeletingEvent(null)
    },
    onError: () => {
      toast.error("Failed to delete event")
    },
  })

  const handleDeleteEvent = (event: Event) => {
    setDeletingEvent(event)
  }

  const confirmDelete = () => {
    if (deletingEvent) {
      deleteEventMutation.mutate(deletingEvent.id)
    }
  }

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
    <div className="p-6">
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Events Management</h1>
        <Button onClick={() => navigate("/event/create")}>
          <Plus className="h-4 w-4 mr-2" />
          Create Event
        </Button>
      </div>

     
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

     
      <div className="space-y-4">
        {eventsQuery.isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : eventsQuery.data?.results.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No events found</p>
            </CardContent>
          </Card>
        ) : (
          eventsQuery.data?.results.map((event) => (
            <Card key={event.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{event.title}</h3>
                      {getStatusBadge(event.status)}
                      {getEventTypeBadge(event.eventType)}
                      {event.isPaid && <Badge className="bg-green-100 text-green-800">Paid</Badge>}
                    </div>

                    <p className="text-gray-600 mb-3 line-clamp-2">{event.summary}</p>

                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>Expires: {format(new Date(event.expirationDate), "MMM d, yyyy")}</span>
                      </div>
                      {event.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>{event.location}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => setViewingEvent(event)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => navigate(`/event/edit/${event.id}`)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDeleteEvent(event)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

    
      {eventsQuery.data?.metadata &&
        eventsQuery.data.metadata[0] &&
        eventsQuery.data.metadata[0].totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>

            {Array.from({ length: eventsQuery.data?.metadata?.[0]?.totalPages || 0 }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Button>
            ))}

            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => prev + 1)}
              disabled={currentPage === eventsQuery.data?.metadata?.[0]?.totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      
      <DeleteConfirmationModal
        isOpen={!!deletingEvent}
        onClose={() => setDeletingEvent(null)}
        onConfirm={confirmDelete}
        title="Delete Event"
        description={`Are you sure you want to delete "${deletingEvent?.title}"? This action cannot be undone.`}
        isLoading={deleteEventMutation.isPending}
      />

      <ViewEventModal event={viewingEvent} isOpen={!!viewingEvent} onClose={() => setViewingEvent(null)} />
    </div>
  )
}

export default EventsPage
