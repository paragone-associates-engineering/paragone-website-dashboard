export interface Employee {
  _id?: string
  id?: string
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  role: string
  type: string
  designation: string
  isActive?: boolean
  createdAt?: string
  updatedAt?: string
  __v?: number
}

export interface EmployeeResponseMetadata {
  total: number
  totalPages: number
}

export interface EmployeeResponse {
  metadata: EmployeeResponseMetadata[]
  results: Employee[]
}

export interface EmployeeFormData {
  firstName: string
  lastName: string
  phoneNumber: string
  email: string
  designation: string
  role: string
  type: string
}
