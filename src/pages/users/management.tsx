/* eslint-disable @typescript-eslint/no-explicit-any */
import type React from "react"
import { useState } from "react"
import { DataTable, StatusBadge } from "@/components/shared/data-table"
import { FormField } from "@/components/shared/form-container"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, Pencil, Trash2 } from "lucide-react"

interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  role: string
  phoneNumber: string
  designation: string
  status?: string
}

const initialUsers: User[] = [
  {
    id: "1",
    firstName: "Jane",
    lastName: "Cooper",
    email: "jane@microsoft.com",
    role: "Super Admin",
    phoneNumber: "(225) 555-0118",
    designation: "CEO",
    status: "Active",
  },
  {
    id: "2",
    firstName: "Floyd",
    lastName: "Miles",
    email: "floyd@yahoo.com",
    role: "Accounts",
    phoneNumber: "(205) 555-0100",
    designation: "Sr. Accountant",
    status: "Active",
  },
  {
    id: "3",
    firstName: "Ronald",
    lastName: "Richards",
    email: "ronald@adobe.com",
    role: "Manager",
    phoneNumber: "(302) 555-0107",
    designation: "Manager",
    status: "Active",
  },
  {
    id: "4",
    firstName: "Marvin",
    lastName: "McKinney",
    email: "marvin@tesla.com",
    role: "Operator",
    phoneNumber: "(252) 555-0126",
    designation: "Executive",
    status: "Active",
  },
]

interface Permission {
  id: string
  name: string
  view: boolean
  add: boolean
  edit: boolean
  delete: boolean
}

const initialPermissions: Permission[] = [
  {
    id: "1",
    name: "User management",
    view: true,
    add: true,
    edit: true,
    delete: true,
  },
  {
    id: "2",
    name: "Review management",
    view: false,
    add: true,
    edit: true,
    delete: true,
  },
  {
    id: "3",
    name: "Review management",
    view: false,
    add: true,
    edit: true,
    delete: true,
  },
  {
    id: "4",
    name: "Review management",
    view: false,
    add: true,
    edit: true,
    delete: true,
  },
]

const UserManagementPage = () => {
  const [users, setUsers] = useState<User[]>(initialUsers)
  const [permissions, setPermissions] = useState<Permission[]>(initialPermissions)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    designation: "",
    role: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newUser: User = {
      id: (users.length + 1).toString(),
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      role: formData.role,
      phoneNumber: formData.phoneNumber,
      designation: formData.designation,
      status: "Active",
    }
    setUsers([...users, newUser])
    setFormData({
      firstName: "",
      lastName: "",
      phoneNumber: "",
      email: "",
      designation: "",
      role: "",
    })
  }

  const handlePermissionChange = (id: string, field: keyof Permission, value: boolean) => {
    setPermissions(
      permissions.map((permission) => (permission.id === id ? { ...permission, [field]: value } : permission)),
    )
  }

  const handleDelete = (user: User) => {
    setUsers(users.filter((u) => u.id !== user.id))
  }

  const handleEdit = (user: User) => {
    console.log("Edit user:", user)
    // Implement edit functionality
  }

  const handleViewProfile = (user: User) => {
    console.log("View profile:", user)
    // Implement view profile functionality
  }

  const columns = [
    {
      id: "name",
      header: "Users Name",
      accessorKey: "name",
      cell: (info: any) => `${info?.firstName} ${info?.lastName}`,
    },
    {
      id: "role",
      header: "Role",
      accessorKey: "role",
    },
    {
      id: "phoneNumber",
      header: "Phone Number",
      accessorKey: "phoneNumber",
    },
    {
      id: "email",
      header: "Email",
      accessorKey: "email",
    },
    {
      id: "designation",
      header: "Designation",
      accessorKey: "designation",
    },
    {
      id: "status",
      header: "Status",
      accessorKey: "status",
     
      cell: (info: any) => info.status && <StatusBadge status={info.status} />,
    },
  ]

  const actionMenu = {
    items: [
      {
        label: "View profile",
        icon: <Eye className="h-4 w-4" />,
        onClick: handleViewProfile,
      },
      {
        label: "Edit user",
        icon: <Pencil className="h-4 w-4" />,
        onClick: handleEdit,
      },
      {
        label: "Delete",
        icon: <Trash2 className="h-4 w-4" />,
        onClick: handleDelete,
        className: "text-red-600",
      },
    ],
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Dashboard user</h1>
      </div>

      <div className="mb-6">
        <div className="bg-white rounded-lg border">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">All user</h2>
          </div>

          <DataTable
            columns={columns}
            data={users}
            actionMenu={actionMenu}
            pagination={{ pageSize: 10, totalItems: users.length }}
            searchable={true}
            selectable={false}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white rounded-lg border">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Add user</h2>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField label="First name">
                  <Input
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="Enter first name"
                  />
                </FormField>

                <FormField label="Last name">
                  <Input
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Enter last name"
                  />
                </FormField>

                <FormField label="Phone number">
                  <Input
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    placeholder="Enter number"
                  />
                </FormField>

                <FormField label="Email address">
                  <Input
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter email"
                    type="email"
                  />
                </FormField>

                <FormField label="Designation">
                  <Input
                    name="designation"
                    value={formData.designation}
                    onChange={handleInputChange}
                    placeholder="Enter designation"
                  />
                </FormField>

                <FormField label="Role">
                  <Select onValueChange={(value) => handleSelectChange("role", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Enter role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Super Admin">Super Admin</SelectItem>
                      <SelectItem value="Admin">Admin</SelectItem>
                      <SelectItem value="Manager">Manager</SelectItem>
                      <SelectItem value="Operator">Operator</SelectItem>
                      <SelectItem value="Accounts">Accounts</SelectItem>
                    </SelectContent>
                  </Select>
                </FormField>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <Button variant="outline">Cancel</Button>
                <Button>Add user</Button>
              </div>
            </div>
          </form>
        </div>

        <div className="bg-white rounded-lg border">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">User permission</h2>
          </div>

          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-500"></th>
                    <th className="text-center py-3 px-4 font-medium text-gray-500">View</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-500">Add</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-500">Edit</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-500">Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {permissions.map((permission) => (
                    <tr key={permission.id} className="border-b">
                      <td className="py-3 px-4">{permission.name}</td>
                      <td className="py-3 px-4 text-center">
                        <Checkbox
                          checked={permission.view}
                          onCheckedChange={(checked) =>
                            handlePermissionChange(permission.id, "view", checked as boolean)
                          }
                        />
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Checkbox
                          checked={permission.add}
                          onCheckedChange={(checked) =>
                            handlePermissionChange(permission.id, "add", checked as boolean)
                          }
                        />
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Checkbox
                          checked={permission.edit}
                          onCheckedChange={(checked) =>
                            handlePermissionChange(permission.id, "edit", checked as boolean)
                          }
                        />
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Checkbox
                          checked={permission.delete}
                          onCheckedChange={(checked) =>
                            handlePermissionChange(permission.id, "delete", checked as boolean)
                          }
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserManagementPage
