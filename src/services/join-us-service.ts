import api from "@/lib/api"

export interface JoinUsName {
  first: string
  lastName: string
  _id: string
}

export interface JoinUs {
  _id: string
  id: string
  name: JoinUsName
  email: string
  phoneNumber: string
  location: string
  participation: string
  status?: string
  isActive: boolean
  createdBy: string
  lastUpdatedBy: string
  createdAt: string
  updatedAt: string
  __v: number
}

export interface UpdateJoinUsDTO {
  status?: string
  isActive?: boolean
  location?: string
  participation?: string
}

export const joinUsService = {
  getJoinUs: async (params?: { page?: number; limit?: number; search?: string }) => {
    const response = await api.get<JoinUs[]>("/form/get-join-us", { params })
    return response.data
  },

  updateJoinUs: async (id: string, data: UpdateJoinUsDTO) => {
    const response = await api.post<JoinUs>(`/form/update-join-us/${id}`, data)
    return response.data
  },
}
