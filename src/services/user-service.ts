import axios from "axios"
import api from "@/lib/api"
import { getStoredUser } from "@/lib/auth"
import type {  UserResponse, AddUserRequest, UpdateUserRequest } from "@/types/user"

const API_URL = "https://paragone-website-backend.onrender.com"

// Get all users with pagination and search
export const getUsers = async (page = 1, limit = 30, search = ""): Promise<UserResponse> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  })

  if (search) {
    params.append("search", search)
  }

  const response = await api.get<UserResponse>(`/user/get-users?${params}`)
  return response.data
}


// Get a single user by ID
// export const getEmployee = async (employeeId: string): Promise<Employee> => {
//   const response = await api.get<{ employee: Employee }>(`/employee/get-employee/${employeeId}`)
//   return response.data.employee
// }

// Add a new user
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const addUser = async (userData: AddUserRequest): Promise<any> => {
 const response = await api.post<AddUserRequest>("/user/add-user", userData)
   return response.data
}

// Update an existing user
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

    await axios.delete(`${API_URL}/user/delete-user/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  } catch (error) {
    console.error(`Error deleting user ${userId}:`, error)
    throw error
  }
}
