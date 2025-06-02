
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { Key } from "react"
//import type { User } from "@/types/user"

interface UserProfileProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user: any
  isLoading: boolean
  onClose: () => void
  onEdit: () => void
}

const UserProfile = ({ user, isLoading, onClose, onEdit }: UserProfileProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="p-6 text-center">
        <p>User not found</p>
        <Button onClick={onClose} className="mt-4">
          Close
        </Button>
      </div>
    )
  }

  // Helper function to format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="p-6">
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold">
              {user.firstName} {user.lastName}
            </h2>
            <p className="text-gray-500">{user.email}</p>
          </div>
          <Badge className={user.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
            {user.isActive ? "Active" : "Inactive"}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Employee ID</h3>
            <p>{user.employeeId}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Phone Number</h3>
            <p>{user.phoneNumber || "N/A"}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Role</h3>
            <p>{user.role || "N/A"}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Designation</h3>
            <p>{user.designation || "N/A"}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Created At</h3>
            <p>{formatDate(user.createdAt)}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Last Updated</h3>
            <p>{formatDate(user.updatedAt)}</p>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Permissions</h3>
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Feature
                  </th>
                  <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    View
                  </th>
                  <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Add
                  </th>
                  <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Edit
                  </th>
                  <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Delete
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {user.permissions.map((permission: { feature: string; view: boolean; add: boolean; edit: boolean; delete: boolean }, index: Key | null | undefined) => (
                  <tr key={index}>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {permission.feature.charAt(0).toUpperCase() + permission.feature.slice(1)}
                    </td>
                    <td className="px-4 py-2 text-center">{permission.view ? "✓" : "✗"}</td>
                    <td className="px-4 py-2 text-center">{permission.add ? "✓" : "✗"}</td>
                    <td className="px-4 py-2 text-center">{permission.edit ? "✓" : "✗"}</td>
                    <td className="px-4 py-2 text-center">{permission.delete ? "✓" : "✗"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={onEdit}>Edit User</Button>
        </div>
      </div>
    </div>
  )
}

export default UserProfile
