import api from "@/lib/api"
import type {
  Resource,
  CreateResourceRequestDTO,
  ResourcesResponse,
  ResourceApplicationsResponse,
} from "@/types/resource"

export const resourceService = {
  getResources: async (params?: { page?: number; limit?: number; searchString?: string }) => {
    try {
      const response = await api.get<ResourcesResponse>("/resource/get-resources", { params })
      return response.data
    } catch (error) {
      console.error("Error fetching resources:", error)
      throw error
    }
  },

  getResource: async (resourceId: string) => {
    try {
      const response = await api.get<Resource>(`/resource/get-resource/${resourceId}`)
      return response.data
    } catch (error) {
      console.error("Error fetching resource:", error)
      throw error
    }
  },

  createResource: async (resourceData: CreateResourceRequestDTO) => {
    try {
      const formData = new FormData()

      
      const metadata = {
        title: resourceData.title,
        summary: resourceData.summary,
        link: resourceData.link,
        isPaid: resourceData.isPaid,
        ...(resourceData.price && { price: resourceData.price }),
      }

      formData.append("metadata", JSON.stringify(metadata))

      
      if (resourceData.image && resourceData.image.length > 0) {
        resourceData.image.forEach((file) => {
          formData.append("image", file)
        })
      }

      const response = await api.post<Resource>("/resource/create-resource", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      return response.data
    } catch (error) {
      console.error("Error creating resource:", error)
      throw error
    }
  },

  updateResource: async (resourceId: string, resourceData: CreateResourceRequestDTO) => {
    try {
      const formData = new FormData()

      
      const metadata = {
        title: resourceData.title,
        summary: resourceData.summary,
        link: resourceData.link,
        isPaid: resourceData.isPaid,
        ...(resourceData.price && { price: resourceData.price }),
      }

      
      formData.append("metadata", JSON.stringify(metadata))

     
      if (resourceData.image && resourceData.image.length > 0) {
        resourceData.image.forEach((file) => {
          formData.append("image", file)
        })
      }

      const response = await api.post<Resource>(`/resource/update-resource/${resourceId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      return response.data
    } catch (error) {
      console.error("Error updating resource:", error)
      throw error
    }
  },

  deleteResource: async (resourceId: string) => {
    try {
      const formData = new FormData()
      const metadata = {
        isActive: false,
      }
      
      formData.append("metadata", JSON.stringify(metadata))

      const response = await api.post(`/resource/update-resource/${resourceId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      return response.data
    } catch (error) {
      console.error("Error deleting resource:", error)
      throw error
    }
  },


  getResourceApplications: async (params?: { page?: number; limit?: number; searchString?: string }) => {
    try {
      const response = await api.get<ResourceApplicationsResponse>("/resource/get-resource-applications", { params })
      return response.data
    } catch (error) {
      console.error("Error fetching resource applications:", error)
      throw error
    }
  },

  deleteApplication: async (applicationId: string) => {
    try {
      const response = await api.post(`/resource/update-application/${applicationId}`, { isActive: false })
      return response.data
    } catch (error) {
      console.error("Error deleting application:", error)
      throw error
    }
  },
}
