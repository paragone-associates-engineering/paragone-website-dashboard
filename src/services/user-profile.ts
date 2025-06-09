import api from "@/lib/api"

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  employeeId: string
  role: string
  isActive: boolean
  permissions: string[]
  createdAt: string
  updatedAt: string
}

export interface UpdateUserRequest {
  firstName?: string
  lastName?: string
  email?: string
  isActive?: boolean
}

export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export const userService = {
  updateUser: async (userId: string, userData: UpdateUserRequest) => {
    const response = await api.post<User>(`/user/update-user/${userId}`, userData)
    return response.data
  },

resetPassword: async (email:string) => {
    const response = await api.post(`/authenticate/reset-password`, {email:email})
    return response.data
  },
}
