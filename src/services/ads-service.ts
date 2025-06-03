import api from "@/lib/api"

export interface Ad {
  _id: string
  id: string
  title: string
  description?: string
  type?: string
  objectives?: string[]
  state?: string
  cities?: string[]
  image: string
  isActive: boolean
  responses?: number
  createdAt: string
  updatedAt: string
  __v: number
}

export interface AdsMetadata {
  total: number
  totalPages: number
}

export interface AdsResponse {
  metadata: AdsMetadata[]
  results: Ad[]
}

export interface CreateAdDTO {
  title: string
  description?: string
  type?: string
  objectives?: string[]
  state?: string
  cities?: string[]
  isActive: boolean
}

export interface UpdateAdDTO {
  title?: string
  description?: string
  type?: string
  objectives?: string[]
  state?: string
  cities?: string[]
  isActive?: boolean
}

export interface AdFormData {
  title: string
  description?: string
  type?: string
  objectives?: string[]
  state?: string
  cities?: string[]
  isActive: boolean
  image?: File
}

export const adsService = {
  getAds: async (params?: { page?: number; limit?: number; search?: string }) => {
    const response = await api.get<AdsResponse>("/ads/get-ads", { params })
    return response.data
  },

  createAd: async (adData: AdFormData) => {
    try {
      const formData = new FormData()

      const adDTO: CreateAdDTO = {
        title: adData.title,
        description: adData.description,
        type: adData.type,
        objectives: adData.objectives,
        state: adData.state,
        cities: adData.cities,
        isActive: adData.isActive,
      }

      formData.append("metadata", JSON.stringify(adDTO))

      if (adData.image) {
        formData.append("image", adData.image)
      }

      const response = await api.post("/ads/create-ad", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      return response.data
    } catch (error) {
      console.error("Error creating ad:", error)
      throw error
    }
  },

  updateAd: async (adId: string, adData: AdFormData) => {
    try {
      const formData = new FormData()

      const adDTO: UpdateAdDTO = {
        title: adData.title,
        description: adData.description,
        type: adData.type,
        objectives: adData.objectives,
        state: adData.state,
        cities: adData.cities,
        isActive: adData.isActive,
      }

      formData.append("metadata", JSON.stringify(adDTO))

      if (adData.image) {
        formData.append("image", adData.image)
      }

      const response = await api.post(`/ads/update-ad/${adId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      return response.data
    } catch (error) {
      console.error(`Error updating ad ${adId}:`, error)
      throw error
    }
  },

  deleteAd: async (adId: string) => {
    try {
      const response = await api.post(`/ads/delete-ad/${adId}`)
      return response.data
    } catch (error) {
      console.error(`Error deleting ad ${adId}:`, error)
      throw error
    }
  },
}
