import api from "@/lib/api"

export interface PartnerName {
  first: string
  lastName: string
  _id: string
}

export enum SellAsType {
  INDIVIDUAL = "Individual",
  COMPANY = "Company",
}

export interface ConnectWithUs {
  _id: string
  id: string
  sellDate: string
  contactTime: string
  additionalComment: string
  status: string
  sellAsType: SellAsType
  name: PartnerName
  propertyType: string
  address: string
  contactMethod: string
  phoneNumber: string
  email: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  __v: number
}

export interface Property {
  propertyName: string
  propertyType: string
  propertyDocuments: string[]
  location: string
  landmarks?: string[]
  description: string
  propertyImages: string[]
}

export interface Package {
  name: string
  price: number
  features: string[]
}

export interface SellAsCompany {
  _id: string
  id: string
  officeAddress: string
  cacDocument: string[]
  phoneNumber: string
  email: string
  contactMethod: string
  status: string
  state: string
  country: string
  package: Package
  properties: Property[]
  isActive: boolean
  createdAt: string
  updatedAt: string
  __v: number
}

export interface ConnectWithUsMetadata {
  total: number
  totalPages: number
}

export interface ConnectWithUsResponse {
  metadata: ConnectWithUsMetadata[]
  results: ConnectWithUs[]
}

export interface UpdateConnectWithUsDTO {
  status?: string
  isActive?: boolean
  additionalComment?: string
}

export interface UpdateSellAsCompanyDTO {
  status?: string
  isActive?: boolean
}

export interface CreateRejectionDTO {
  title: string
  description: string
  attachments?: File[]
}

export const partnerService = {
  // Individual selling requests
  getConnectWithUs: async (params?: { page?: number; limit?: number; search?: string }) => {
    const response = await api.get<ConnectWithUsResponse>("/form/get-connect-with-us", { params })
    return response.data
  },

  updateConnectWithUs: async (id: string, data: UpdateConnectWithUsDTO) => {
    const response = await api.post<ConnectWithUs>(`/form/update-connect-with-us/${id}`, data)
    return response.data
  },

  // Company selling requests
  getSellAsCompany: async (params?: { page?: number; limit?: number; search?: string }) => {
    const response = await api.get<SellAsCompany[]>("/form/get-sell-as-company", { params })
    return response.data
  },

  updateSellAsCompany: async (id: string, data: UpdateSellAsCompanyDTO) => {
    const response = await api.post<SellAsCompany>(`/form/update-sell-as-company/${id}`, data)
    return response.data
  },

  rejectSellAsCompany: async (sellAsCompanyId: string, rejectionData: CreateRejectionDTO) => {
    try {
      const formData = new FormData()

      const rejectionDTO = {
        sellAsCompanyId,
        title: rejectionData.title,
        description: rejectionData.description,
      }

      formData.append("metadata", JSON.stringify(rejectionDTO))

      if (rejectionData.attachments && rejectionData.attachments.length > 0) {
        rejectionData.attachments.forEach((file) => {
          formData.append("attachments", file)
        })
      }

      const response = await api.post(`/form/reject-sell-as-company/${sellAsCompanyId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      return response.data
    } catch (error) {
      console.error("Error rejecting company:", error)
      throw error
    }
  },
}
