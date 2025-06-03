import api from "@/lib/api"

export interface Partner {
  _id: string
  id: string
  name: string
  type: string
  description: string
  logo: string
  isActive: boolean
  createdBy: string
  lastUpdatedBy: string
  createdAt: string
  updatedAt: string
  __v: number
}

export interface CreatePartnerDTO {
  name: string
  type: string
  description: string
}

export interface UpdatePartnerDTO {
  name?: string
  type?: string
  description?: string
  isActive?: boolean
}

export interface PartnerFormData {
  name: string
  type: string
  description: string
  logo?: File
}

export const partnerListService = {
  getPartners: async () => {
    const response = await api.get<Partner[]>("/partner/get-partners")
    return response.data
  },

  createPartner: async (partnerData: PartnerFormData) => {
    try {
      const formData = new FormData()

      const partnerDTO: CreatePartnerDTO = {
        name: partnerData.name,
        type: partnerData.type,
        description: partnerData.description,
      }

      formData.append("metadata", JSON.stringify(partnerDTO))

      if (partnerData.logo) {
        formData.append("logo", partnerData.logo)
      }

      const response = await api.post("/partner/create-partner", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      return response.data
    } catch (error) {
      console.error("Error creating partner:", error)
      throw error
    }
  },

  updatePartner: async (partnerId: string, partnerData: PartnerFormData) => {
    try {
      const formData = new FormData()

      const partnerDTO: UpdatePartnerDTO = {
        name: partnerData.name,
        type: partnerData.type,
        description: partnerData.description,
      }

      formData.append("metadata", JSON.stringify(partnerDTO))

      if (partnerData.logo) {
        formData.append("logo", partnerData.logo)
      }

      const response = await api.post(`/partner/update-partner/${partnerId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      return response.data
    } catch (error) {
      console.error(`Error updating partner ${partnerId}:`, error)
      throw error
    }
  },

  togglePartnerStatus: async (partnerId: string, isActive: boolean) => {
    try {
      const formData = new FormData()
      formData.append("metadata", JSON.stringify({ isActive }))

      const response = await api.post(`/partner/update-partner/${partnerId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      return response.data
    } catch (error) {
      console.error(`Error toggling partner status ${partnerId}:`, error)
      throw error
    }
  },
}
