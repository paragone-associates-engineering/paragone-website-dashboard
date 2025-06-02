export interface Permission {
  feature: string
  view: boolean
  edit: boolean
  add: boolean
  delete: boolean
  _id?: string
}

export interface User {
  id: string
  _id?: string
  email: string
  isActive: boolean
  firstName: string
  lastName: string
  employeeId: string
  permissions: Permission[]
  createdAt?: string
  updatedAt?: string
  phoneNumber?: string
  role?: string
  type?: string
  designation?: string
}

export interface UserResponse {
  metadata: [
    {
      total: number
      totalPages: number
    },
  ]
  results: User[]
}

export interface AddUserRequest {
  employeeId: string
  permissions: Permission[]
}

export interface UpdateUserRequest {
  employeeId?: string
  permissions?: Permission[]
  isActive?: boolean
}
