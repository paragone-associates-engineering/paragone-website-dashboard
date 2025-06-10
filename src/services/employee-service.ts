import api from "@/lib/api"
import type { Employee, EmployeeResponse } from "@/types/employee"

export const getEmployees = async (page = 1, limit = 30, search = ""): Promise<EmployeeResponse> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  })

  if (search) {
    params.append("search", search)
  }

  const response = await api.get<EmployeeResponse>(`/employee/get-employees?${params}`)
  return response.data
}

export const getEmployee = async (employeeId: string): Promise<Employee> => {
  const response = await api.get<{ employee: Employee }>(`/employee/get-employee/${employeeId}`)
  return response.data.employee
}

export const addEmployee = async (employeeData: Omit<Employee, "id">): Promise<Employee> => {
  const response = await api.post<{ employee: Employee }>("/employee/add-employee", employeeData)
  return response.data.employee
}

export const updateEmployee = async (employeeId: string, employeeData: Partial<Employee>): Promise<Employee> => {
  const response = await api.post<{ employee: Employee }>(`/employee/update-employee/${employeeId}`, employeeData)
  return response.data.employee
}

export const deleteEmployee = async (employeeId: string): Promise<void> => {
  await api.post(`/employee/update-employee/${employeeId}`,{isActive: false })
}
