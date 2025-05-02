/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react"
import { DataTable, StatusBadge } from "@/components/shared/data-table"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, Pencil, Trash2 } from "lucide-react"
import UserSearchForm from "@/components/shared/add-user"

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

          
          <UserSearchForm
      existingUsers={initialUsers}
      onAddUser={() => console.log('Added user')}
      onCancel={() => console.log("Cancelled")}
    />
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
