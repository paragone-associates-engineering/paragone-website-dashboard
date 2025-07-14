import api from "@/lib/api"
import type {
  Event,
  CreateEventDTO,
  UpdateEventDTO,
  EventsResponse,
  EventApplicationsResponse,
  ApplicationStatus,
} from "@/types/event"

export const eventService = {
  
  createEvent: async (eventData: CreateEventDTO) => {
    try {
      const formData = new FormData()

      if (eventData.image && eventData.image instanceof Array) {
        eventData.image.forEach((file) => formData.append("image", file))
      }

      const metadata: Record<string, any> = {}
      
      Object.entries(eventData).forEach(([key, value]) => {
        if (key !== "image" && value !== undefined && value !== null) {
          if (key === "price" && value) {
            metadata[key] = value // Keep price as object in metadata
          } else if (key === "expirationDate" && value) {
            // Ensure expirationDate is a UTC ISO 8601 string
            const date = new Date(value)
            metadata[key] = date.toISOString()
          } else {
            metadata[key] = value
          }
        }
      })

      formData.append("metadata", JSON.stringify(metadata))

      const response = await api.post<Event>("/event/create-event", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      return response.data
    } catch (error) {
      console.error("Error creating event:", error)
      throw error
    }
  },

  updateEvent: async (eventId: string, eventData: UpdateEventDTO) => {
    try {
      const formData = new FormData()

      if (eventData.image && eventData.image instanceof Array) {
        eventData.image.forEach((file) => formData.append("image", file))
      }

      const metadata: Record<string, any> = {}
      
      Object.entries(eventData).forEach(([key, value]) => {
        if (key !== "image" && value !== undefined && value !== null) {
          if (key === "price" && value) {
            metadata[key] = value 
          } else if (key === "expirationDate" && value) {
            
            const date = new Date(value)
            metadata[key] = date.toISOString()
          } else {
            metadata[key] = value
          }
        }
      })

      formData.append("metadata", JSON.stringify(metadata))

      const response = await api.post<Event>(`/event/update-event/${eventId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      return response.data
    } catch (error) {
      console.error("Error updating event:", error)
      throw error
    }
  },

  getEvents: async (params?: { page?: number; limit?: number; searchString?: string }) => {
    try {
      const response = await api.get<EventsResponse>("/event/get-events", { params })
      return response.data
    } catch (error) {
      console.error("Error fetching events:", error)
      throw error
    }
  },

  getEvent: async (eventId: string) => {
    try {
      const response = await api.get<Event>(`/event/get-event/${eventId}`)
      return response.data
    } catch (error) {
      console.error("Error fetching event:", error)
      throw error
    }
  },

  deleteEvent: async (eventId: string) => {
    try {
    
      const formData = new FormData()
      const metadata = { isActive: false }
      formData.append("metadata", JSON.stringify(metadata))
      
      const response = await api.post(`/event/update-event/${eventId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      return response.data
    } catch (error) {
      console.error("Error deleting event:", error)
      throw error
    }
  },

 
  getEventApplications: async (params?: { page?: number; limit?: number; searchString?: string }) => {
    try {
      const response = await api.get<EventApplicationsResponse>("/event/get-event-applications", { params })
      return response.data
    } catch (error) {
      console.error("Error fetching event applications:", error)
      throw error
    }
  },

  updateApplicationStatus: async (applicationId: string, status: ApplicationStatus) => {
    try {
      const response = await api.post(`/event/update-application/${applicationId}`, { status })
      return response.data
    } catch (error) {
      console.error("Error updating application status:", error)
      throw error
    }
  },

  deleteApplication: async (applicationId: string) => {
    try {
      const response = await api.post(`/event/update-application/${applicationId}`, { isActive: false })
      return response.data
    } catch (error) {
      console.error("Error deleting application:", error)
      throw error
    }
  },
}