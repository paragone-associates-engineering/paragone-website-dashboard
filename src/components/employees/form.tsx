
import type React from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import type { EmployeeFormData } from "@/types/employee"

interface EmployeeFormProps {
  formData: EmployeeFormData
  isLoading: boolean
  isEdit?: boolean
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSelectChange: (name: string, value: string) => void
  onSubmit: (e: React.FormEvent) => void
  onCancel: () => void
}

const EmployeeForm = ({
  formData,
  isLoading,
  isEdit = false,
  onInputChange,
  onSelectChange,
  onSubmit,
  onCancel,
}: EmployeeFormProps) => {
  return (
    <form onSubmit={onSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">First name</label>
          <Input
            name="firstName"
            value={formData.firstName}
            onChange={onInputChange}
            placeholder="Enter first name"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Last name</label>
          <Input
            name="lastName"
            value={formData.lastName}
            onChange={onInputChange}
            placeholder="Enter last name"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Phone number</label>
          <Input
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={onInputChange}
            placeholder="Enter number"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Email address</label>
          <Input
            name="email"
            type="email"
            value={formData.email}
            onChange={onInputChange}
            placeholder="Enter email"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Designation</label>
          <Input
            name="designation"
            value={formData.designation}
            onChange={onInputChange}
            placeholder="Enter designation"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Role</label>
          <Input
            name="role"
            value={formData.role}
            onChange={onInputChange}
            placeholder="Enter role"
            required
          />
          
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Type</label>
          <Select value={formData.type} onValueChange={(value) => onSelectChange("type", value)} required>
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="intern">Intern</SelectItem>
              <SelectItem value="fullTime">Full Time</SelectItem>
              <SelectItem value="contract">Contract</SelectItem>
              <SelectItem value="associate">Associate</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-6">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isEdit ? "Updating..." : "Adding..."}
            </>
          ) : isEdit ? (
            "Update employee"
          ) : (
            "Add employee"
          )}
        </Button>
      </div>
    </form>
  )
}

export default EmployeeForm
