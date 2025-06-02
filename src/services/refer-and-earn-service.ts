import api from "@/lib/api"

export interface ReferAndEarnName {
  first: string
  lastName: string
  _id: string
}

export interface ReferAndEarn {
  _id: string
  id: string
  additionalComments: string
  interestedService: string
  name: ReferAndEarnName
  status: string
  phoneNumber: string
  email: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  __v: number
}

export interface ReferAndEarnMetadata {
  total: number
  totalPages: number
}

export interface ReferAndEarnResponse {
  metadata: ReferAndEarnMetadata[]
  results: ReferAndEarn[]
}

export interface UpdateReferAndEarnDTO {
  status?: string
  isActive?: boolean
  additionalComments?: string
  interestedService?: string
}

export const referAndEarnService = {
  getReferAndEarn: async (params?: { page?: number; limit?: number; search?: string }) => {
    const response = await api.get<ReferAndEarnResponse>("/form/get-refer-and-earn", { params })
    return response.data
  },

  updateReferAndEarn: async (id: string, data: UpdateReferAndEarnDTO) => {
    const response = await api.post<ReferAndEarn>(`/form/update-refer-and-earn/${id}`, data)
    return response.data
  },
}
