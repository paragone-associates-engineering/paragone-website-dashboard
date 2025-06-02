import type React from "react"

import { useState, useEffect } from "react"
import { FormField } from "@/components/shared/form-container"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import UserPermissions from "./permission"
import { EmployeeSearch } from "./employee-search"
import type { Permission} from "@/types/user"

interface UserFormProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user?: any
  isLoading: boolean
  onSubmit: (data: { employeeId: string; permissions: Permission[] }) => void
  onCancel: () => void
}

const UserForm = ({ user, isLoading, onSubmit, onCancel }: UserFormProps) => {
  const [employeeId, setEmployeeId] = useState(user?.employeeId || "")
  const [permissions, setPermissions] = useState<Permission[]>(user?.permissions || [])

  useEffect(() => {
    if (user) {
      setEmployeeId(user.employeeId)
      setPermissions(user.permissions)
    }
  }, [user])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      employeeId,
      permissions,
    })
  }

  const handlePermissionsChange = (updatedPermissions: Permission[]) => {
    setPermissions(updatedPermissions)
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="p-6">
        <div className="space-y-6">
          <FormField label="Select Employee">
            <EmployeeSearch
              value={employeeId}
              onChange={setEmployeeId}
              disabled={isLoading || !!user}
              placeholder="Search for an employee..."
            />
          </FormField>

          <div className="bg-white rounded-lg border">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold">User permissions</h2>
            </div>
            <UserPermissions permissions={permissions} onChange={handlePermissionsChange} />
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading || !employeeId}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {user ? "Updating..." : "Creating..."}
              </>
            ) : (
              <>{user ? "Update user" : "Create user"}</>
            )}
          </Button>
        </div>
      </div>
    </form>
  )
}

export default UserForm
