import { Badge } from "@/components/ui/badge"
import { Loader2 } from "lucide-react"
import type { Employee } from "@/types/employee"

interface EmployeeProfileProps {
  employee: Employee | null | undefined
  isLoading: boolean
}

const EmployeeProfile = ({ employee, isLoading }: EmployeeProfileProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!employee) {
    return <div className="text-center py-4">Employee not found</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-center">
        <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-bold text-gray-600">
          {employee.firstName.charAt(0)}
          {employee.lastName.charAt(0)}
        </div>
      </div>

      <div className="text-center">
        <h3 className="text-xl font-bold">
          {employee.firstName} {employee.lastName}
        </h3>
        <p className="text-gray-500">{employee.designation}</p>
      </div>

      <div className="border-t pt-4 space-y-3">
        <div className="flex justify-between">
          <span className="font-medium">Email:</span>
          <span>{employee.email}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Phone:</span>
          <span>{employee.phoneNumber}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Role:</span>
          <span>{employee.role}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Type:</span>
          <span>{employee.type}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Status:</span>
          <Badge className={employee.isActive ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
            {employee.isActive ? "Active" : "Inactive"}
          </Badge>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Joined:</span>
          <span>{new Date(employee.createdAt || "").toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  )
}

export default EmployeeProfile
