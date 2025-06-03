import api from "@/lib/api"

export interface ContactName {
  first: string
  lastName: string
  _id: string
}

export interface Contact {
  _id: string
  id: string
  message: string
  listingId?: string
  name: ContactName
  reason: string
  phoneNumber: string
  email: string
  status?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  __v: number
}

export interface ContactMetadata {
  total: number
  totalPages: number
}

export interface ContactResponse {
  metadata: ContactMetadata[]
  results: Contact[]
}

export interface UpdateContactDTO {
  status?: string
  isActive?: boolean
}

export const contactService = {
  getContacts: async (params?: { page?: number; limit?: number; search?: string }) => {
    const response = await api.get<ContactResponse>("/form/get-get-in-touch", { params })
    return response.data
  },

  updateContact: async (id: string, data: UpdateContactDTO) => {
    const response = await api.post<Contact>(`/form/update-get-in-touch/${id}`, data)
    return response.data
  },
}
