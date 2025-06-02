
import { useState, useEffect } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import type { Permission } from "@/types/user"

interface UserPermissionsProps {
  permissions: Permission[]
  onChange: (permissions: Permission[]) => void
}

// Define available features
const availableFeatures = [
  "user",
  "employee",
  "property",
  "customer",
  "partner",
  "review",
  "region",
  "subscription",
  "advertising",
  "blog",
  "career",
  "inspection",
  "contact",
]

// Create a readable name from feature ID
const getFeatureName = (feature: string): string => {
  return feature.charAt(0).toUpperCase() + feature.slice(1) + " management"
}

const UserPermissions = ({ permissions, onChange }: UserPermissionsProps) => {
  const [localPermissions, setLocalPermissions] = useState<Permission[]>([])

  useEffect(() => {
    // Initialize permissions with existing ones or create defaults
    const initialPermissions = [...permissions]

    // Add any missing features
    availableFeatures.forEach((feature) => {
      if (!initialPermissions.some((p) => p.feature === feature)) {
        initialPermissions.push({
          feature,
          view: false,
          add: false,
          edit: false,
          delete: false,
        })
      }
    })

    setLocalPermissions(initialPermissions)
  }, [permissions])

  const handlePermissionChange = (feature: string, action: "view" | "add" | "edit" | "delete", checked: boolean) => {
    const updatedPermissions = localPermissions.map((permission) =>
      permission.feature === feature ? { ...permission, [action]: checked } : permission,
    )

    setLocalPermissions(updatedPermissions)
    onChange(updatedPermissions)
  }

  return (
    <div className="p-6">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-4 font-medium text-gray-500">Feature</th>
              <th className="text-center py-3 px-4 font-medium text-gray-500">View</th>
              <th className="text-center py-3 px-4 font-medium text-gray-500">Add</th>
              <th className="text-center py-3 px-4 font-medium text-gray-500">Edit</th>
              <th className="text-center py-3 px-4 font-medium text-gray-500">Delete</th>
            </tr>
          </thead>
          <tbody>
            {localPermissions.map((permission, index) => (
              <tr key={index} className="border-b">
                <td className="py-3 px-4">{getFeatureName(permission.feature)}</td>
                <td className="py-3 px-4 text-center">
                  <Checkbox
                    checked={permission.view}
                    onCheckedChange={(checked) =>
                      handlePermissionChange(permission.feature, "view", checked as boolean)
                    }
                  />
                </td>
                <td className="py-3 px-4 text-center">
                  <Checkbox
                    checked={permission.add}
                    onCheckedChange={(checked) => handlePermissionChange(permission.feature, "add", checked as boolean)}
                  />
                </td>
                <td className="py-3 px-4 text-center">
                  <Checkbox
                    checked={permission.edit}
                    onCheckedChange={(checked) =>
                      handlePermissionChange(permission.feature, "edit", checked as boolean)
                    }
                  />
                </td>
                <td className="py-3 px-4 text-center">
                  <Checkbox
                    checked={permission.delete}
                    onCheckedChange={(checked) =>
                      handlePermissionChange(permission.feature, "delete", checked as boolean)
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default UserPermissions
