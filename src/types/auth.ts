export interface Permission {
  feature: string
  view: boolean
  edit: boolean
  add: boolean
  delete: boolean
  _id: string
}

export interface User {
  id: string
  email: string
  isActive: boolean
  firstName: string
  lastName: string
  employeeId: string
  permissions: Permission[]
  createdAt: string
  updatedAt: string
}

export interface AuthResponse {
  user: User
  token: string
}

export interface LoginCredentials {
  email: string
  password: string
}
