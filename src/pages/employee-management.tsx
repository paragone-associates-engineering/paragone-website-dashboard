
import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreVertical, Eye, PenSquare, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface Employee {
  firstName: string
  lastName: string
  email: string
  role: string
  type: string
  designation: string
  status?: string
}

const employeesData: Employee[] = [
  {
    firstName: "Jane",
    lastName: "Cooper",
    email: "jane@microsoft.com",
    role: "Super Admin",
    type: "Full Time",
    designation: "CEO",
  },
  {
    firstName: "Floyd",
    lastName: "Miles",
    email: "floyd@yahoo.com",
    role: "Accounts",
    type: "Associate",
    designation: "Sr. Accountant",
  },
  {
    firstName: "Ronald",
    lastName: "Richards",
    email: "ronald@adobe.com",
    role: "Manager",
    type: "Intern",
    designation: "Manager",
    status: "Active",
  },
  {
    firstName: "Marvin",
    lastName: "McKinney",
    email: "marvin@tesla.com",
    role: "Operator",
    type: "Contract",
    designation: "Executive",
    status: "Active",
  },
]

const EmployeeManagement = () => {
  const [showAddForm, setShowAddForm] = useState(true)

  return (
    <div className="p-3 md:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Employee Management</h1>
      </div>

      <div className="bg-white rounded-lg border mb-6">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">All employee</h2>
        </div>

        <div className="p-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Select defaultValue="30">
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="30">30</SelectItem>
                <SelectItem value="40">40</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Input placeholder="Search..." className="w-[300px]" />
            </div>
            <Button onClick={() => setShowAddForm(true)}>Add employee</Button>
          </div>
        </div>

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
            {employeesData.map((employee, index) => (
              <TableRow key={index}>
                <TableCell>{employee.firstName}</TableCell>
                <TableCell>{employee.lastName}</TableCell>
                <TableCell>{employee.email}</TableCell>
                <TableCell>{employee.role}</TableCell>
                <TableCell>{employee.type}</TableCell>
                <TableCell>{employee.designation}</TableCell>
                <TableCell>
                  {employee.status && (
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-200">{employee.status}</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">More</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className="flex items-center">
                        <Eye className="mr-2 h-4 w-4" />
                        <span>View profile</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex items-center">
                        <PenSquare className="mr-2 h-4 w-4" />
                        <span>Edit employee</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex items-center text-red-600">
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {showAddForm && (
        <div className="bg-white rounded-lg border">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Add employee</h2>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">First name</label>
                <Input placeholder="Enter first name" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Last name</label>
                <Input placeholder="Enter last name" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Phone number</label>
                <Input placeholder="Enter number" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email address</label>
                <Input placeholder="Enter email" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Designation</label>
                <Input placeholder="Enter designation" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Role</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Enter role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="employee">Employee</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Type</label>
                <Select defaultValue="intern">
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="intern">Intern</SelectItem>
                    <SelectItem value="fulltime">Full Time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="associate">Associate</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
              <Button className="bg-yellow-500 hover:bg-yellow-600">Add employee</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default EmployeeManagement
