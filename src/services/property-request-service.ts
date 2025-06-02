import api from "@/lib/api"

export interface PropertyRequestName {
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

export interface PropertyRequest {
  _id: string
  id: string
  status: string
  name: PropertyRequestName
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

export interface PropertyRequestMetadata {
  total: number
  totalPages: number
}

export interface PropertyRequestResponse {
  metadata: PropertyRequestMetadata[]
  results: PropertyRequest[]
}

export interface UpdatePropertyRequestDTO {
  status?: STATUS
  isActive?: boolean
  additionalComment?: string
  propertyType?: string
  propertyLocation?: string
}

export const propertyRequestService = {
  getPropertyRequest: async (params?: { page?: number; limit?: number; search?: string }) => {
    const response = await api.get< PropertyRequest>("/form/get-property-request", { params })
    return response.data
  },

  updatePropertyRequest: async (id: string, data: UpdatePropertyRequestDTO) => {
    const response = await api.post<PropertyRequest>(`/form/update-property-request/${id}`, data)
    return response.data
  },
}
