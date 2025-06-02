
import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Loader2 } from "lucide-react"
import { getEmployees } from "@/services/employee-service"
import EmployeeActions from "./actions"
import type { Employee } from "@/types/employee"

interface EmployeeListProps {
  onAddEmployee: () => void
  onEditEmployee: (employee: Employee) => void
  onViewEmployee: (employee: Employee) => void
  onDeleteEmployee: (employeeId: string) => void
}

const EmployeeList = ({ onAddEmployee, onEditEmployee, onViewEmployee, onDeleteEmployee }: EmployeeListProps) => {
  const [searchQuery, setSearchQuery] = useState("")
  const [limit, setLimit] = useState("30")

  // Fetch employees
  const {
    data: employeesData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["employees", limit, searchQuery],
    queryFn: () => getEmployees(1, Number.parseInt(limit), searchQuery),
  })

  return (
    <div className="bg-white rounded-lg border mb-6">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">All employees</h2>
      </div>

      <div className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-2">
          <Select value={limit} onValueChange={(value) => setLimit(value)}>
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Limit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="30">30</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative w-full md:w-auto">
            <Input
              placeholder="Search..."
              className="w-full md:w-[300px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button onClick={onAddEmployee}>Add employee</Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : isError ? (
        <div className="p-8 text-center text-red-500">Error loading employees. Please try again.</div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>First name</TableHead>
                <TableHead>Last name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Designation</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employeesData?.results && employeesData.results.length > 0 ? (
                employeesData.results.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell className='capitalize'>{employee.firstName}</TableCell>
                    <TableCell className='capitalize'>{employee.lastName}</TableCell>
                    <TableCell>{employee.email}</TableCell>
                    <TableCell className='capitalize'>{employee.role}</TableCell>
                    <TableCell className='capitalize'>{employee.type}</TableCell>
                    <TableCell className='capitalize'>{employee.designation}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          employee.isActive
                            ? "bg-green-100 text-green-800 hover:bg-green-200"
                            : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                        }
                      >
                        {employee.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <EmployeeActions
                        employee={employee}
                        onView={() => onViewEmployee(employee)}
                        onEdit={() => onEditEmployee(employee)}
                        onDelete={() => employee.id && onDeleteEmployee(employee.id)}
                      />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    No employees found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {employeesData && employeesData.metadata && employeesData.metadata.length > 0 && (
        <div className="p-4 flex justify-between items-center text-sm text-gray-500">
          <div>
            Showing {employeesData.results.length} of {employeesData.metadata[0].total} employees
          </div>
          {/* Pagination could be added here */}
        </div>
      )}
    </div>
  )
}

export default EmployeeList
