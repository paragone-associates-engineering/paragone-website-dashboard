
import type React from "react"

import { useState } from "react"
//import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import type { PropertyManagement } from "@/services/property-management-service"
import { STATUS } from "@/services/property-management-service"
import { Modal } from "../ui/modal"

interface StatusChangeModalProps {
  isOpen: boolean
  onClose: () => void
  property: PropertyManagement | null
  onSave: (id: string, status: STATUS) => void
  isLoading: boolean
}

export function StatusChangeModal({ isOpen, onClose, property, onSave, isLoading }: StatusChangeModalProps) {
  const [selectedStatus, setSelectedStatus] = useState<STATUS>(STATUS.PENDING)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (property) {
      onSave(property.id, selectedStatus)
    }
  }

  if (!property) return null

  return (
    <Modal isOpen={isOpen} title='Change Status' onClose={onClose}>
      <div className="sm:max-w-[400px] p-5">
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-4">
              Change status for{" "}
              <span className="font-semibold">
                {property.name.first} {property.name.lastName}
              </span>
            </p>
            <Label htmlFor="status">New Status</Label>
            <Select value={selectedStatus} onValueChange={(value) => setSelectedStatus(value as STATUS)}>
              <SelectTrigger>
                <SelectValue placeholder="Select new status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={STATUS.PENDING}>Pending</SelectItem>
                <SelectItem value={STATUS.IN_PROGRESS}>In Progress</SelectItem>
                <SelectItem value={STATUS.COMPLETED}>Completed</SelectItem>
                <SelectItem value={STATUS.APPROVED}>Approved</SelectItem>
                <SelectItem value={STATUS.REJECTED}>Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Status
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  )
}
