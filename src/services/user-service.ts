import api from "@/lib/api"
import { getStoredUser } from "@/lib/auth"
import type {  UserResponse, AddUserRequest, UpdateUserRequest } from "@/types/user"

export const getUsers = async (page = 1, limit = 30, searchString = ""): Promise<UserResponse> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  })

  if (searchString) {
    params.append("search", searchString)
  }

  const response = await api.get<UserResponse>(`/user/get-users?${params}`)
  return response.data
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const addUser = async (userData: AddUserRequest): Promise<any> => {
 const response = await api.post<AddUserRequest>("/user/add-user", userData)
   return response.data
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const updateUser = async (userId: string, userData: UpdateUserRequest): Promise<any> => {
    const response = await api.post<UpdateUserRequest>(`/user/update-user/${userId}`, userData)
  return response.data
}

// Delete a user
export const deleteUser = async (userId: string): Promise<void> => {
  try {
    const token = getStoredUser()
    if (!token) {
      throw new Error("No authentication token found")
    }

    await api.post(
      `/user/update-user/${userId}`,
      { isActive: false }
    )
  } catch (error) {
    console.error(`Error deleting user ${userId}:`, error)
    throw error
  }
}
