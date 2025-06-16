import api from "@/lib/api"

export interface ViewingName {
  first: string
  lastName: string
  _id: string
}

export enum ViewingType {
  IN_PERSON = "In-person",
  VIRTUAL = "Virtual",
}

export interface PropertyDetails {
  propertyName: string
  location: {city:string; region:string; country:string}
  amount: number
  propertyId: string
}

export interface Viewing {
  _id: string
  id: string
  date: string
  viewingType: ViewingType
  status: string
  name: ViewingName
  phoneNumber: string
  email: string
  propertyDetails: PropertyDetails
  isActive: boolean
  createdAt: string
  updatedAt: string
  __v: number
}

export interface ViewingsMetadata {
  total: number
  totalPages: number
}

export interface ViewingsResponse {
  metadata: ViewingsMetadata[]
  results: Viewing[]
}

export interface UpdateViewingDTO {
  status?: string
  viewingType?: ViewingType
  isActive?: boolean
  date?: string
}

export const viewingsService = {
  getViewings: async (params?: { page?: number; limit?: number; search?: string }) => {
    const response = await api.get<ViewingsResponse>("/form/get-viewings", { params })
    return response.data
  },

  updateViewing: async (viewingId: string, data: UpdateViewingDTO) => {
    const response = await api.post<Viewing>(`/form/update-viewing/${viewingId}`, data)
    return response.data
  },
}
