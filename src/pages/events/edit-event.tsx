
import { useParams, useNavigate } from "react-router-dom"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { eventService } from "@/services/event-service"
import { EventForm } from "@/components/event/form"
import { toast } from "sonner"
import type { CreateEventDTO } from "@/types/event"

const EditEventPage = () => {
  const { eventId } = useParams<{ eventId: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  
  const eventQuery = useQuery({
    queryKey: ["event", eventId],
    queryFn: () => eventService.getEvent(eventId!),
    enabled: !!eventId,
  })

  const updateEventMutation = useMutation({
    mutationFn: (data: CreateEventDTO) => eventService.updateEvent(eventId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] })
      queryClient.invalidateQueries({ queryKey: ["event", eventId] })
      toast.success("Event updated successfully")
      navigate("/event/list")
    },
    onError: () => {
      toast.error("Failed to update event")
    },
  })

  const handleSubmit = (data: CreateEventDTO) => {
    updateEventMutation.mutate(data)
  }

  const handleCancel = () => {
    navigate("/event/list")
  }

  if (eventQuery.isLoading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </div>
    )
  }

  if (eventQuery.isError || !eventQuery.data) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
          Error loading event. Please try again later.
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <EventForm
        initialData={eventQuery.data}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={updateEventMutation.isPending}
      />
    </div>
  )
}

export default EditEventPage
