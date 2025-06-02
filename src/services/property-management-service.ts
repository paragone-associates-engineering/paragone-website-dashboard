import api from "@/lib/api"

export interface PropertyManagementName {
  first: string
  lastName: string
  _id: string
}

export enum STATUS {
  PENDING = "Pending",
  IN_PROGRESS = "In Progress",
  COMPLETED = "Completed",
  REJECTED = "Rejected",
  APPROVED = "Approved",
}

export interface PropertyManagement {
  _id: string
  id: string
  status: string
  name: PropertyManagementName
  propertyType: string
  propertyLocation: string
  phoneNumber: string
  email: string
  additionalComment?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  __v: number
}

export interface PropertyManagementMetadata {
  total: number
  totalPages: number
}

export interface PropertyManagementResponse {
  metadata: PropertyManagementMetadata[]
  results: PropertyManagement[]
}

export interface UpdatePropertyManagementDTO {
  status?: STATUS
  isActive?: boolean
  additionalComment?: string
  propertyType?: string
  propertyLocation?: string
}

export const propertyManagementService = {
  getPropertyManagement: async (params?: { page?: number; limit?: number; search?: string }) => {
    const response = await api.get<PropertyManagementResponse>("/form/get-property-management", { params })
    return response.data
  },

  updatePropertyManagement: async (id: string, data: UpdatePropertyManagementDTO) => {
    const response = await api.post<PropertyManagement>(`/form/update-property-management/${id}`, data)
    return response.data
  },
}
