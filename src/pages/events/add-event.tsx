
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { eventService } from "@/services/event-service"
import { EventForm } from "@/components/event/form"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"
import type { CreateEventDTO } from "@/types/event"

const AddEventPage = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const createEventMutation = useMutation({
    mutationFn: eventService.createEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] })
      toast.success("Event created successfully")
      navigate("/event/list")
    },
    onError: (error:any) => {
      toast.error(`${error.message === 'Network Error' ? error?.message : error?.response?.data?.message}`)
    },
  })

  const handleSubmit = (data: CreateEventDTO) => {
    createEventMutation.mutate(data)
  }

  const handleCancel = () => {
    navigate("/event/list")
  }

  return (
    <div className="p-6">
      <EventForm onSubmit={handleSubmit} onCancel={handleCancel} isLoading={createEventMutation.isPending} />
    </div>
  )
}

export default AddEventPage
