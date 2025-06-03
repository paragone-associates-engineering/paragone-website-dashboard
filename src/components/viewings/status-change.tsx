
import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { Modal } from "../ui/modal"
import type { Viewing } from "@/services/viewings-service"


interface StatusChangeModalProps {
  isOpen: boolean
  onClose: () => void
  viewing: Viewing | null
  onSave: (id: string, status: string) => void
  isLoading: boolean
}

export function StatusChangeModal({ isOpen, onClose, viewing, onSave, isLoading }: StatusChangeModalProps) {
  const [selectedStatus, setSelectedStatus] = useState("Pending")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (viewing) {
      onSave(viewing.id, selectedStatus)
    }
  }

  if (!viewing) return null

  return (
     <Modal isOpen={isOpen} title='Change Status' onClose={onClose}>
      <div className="sm:max-w-[400px] p-5">
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-4">
              Change status for{" "}
              <span className="font-semibold">
                {viewing.name.first} {viewing.name.lastName}
              </span>
            </p>
            <Label htmlFor="status">New Status</Label>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select new status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Confirmed">Confirmed</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
                <SelectItem value="Rescheduled">Rescheduled</SelectItem>
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
