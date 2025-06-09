
import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import type { Contact } from "@/services/contact-service"
import { Modal } from "../ui/modal"

interface StatusChangeModalProps {
  isOpen: boolean
  onClose: () => void
  contact: Contact | null
  onSave: (id: string, status: string) => void
  isLoading: boolean
}

export function StatusChangeModal({ isOpen, onClose, contact, onSave, isLoading }: StatusChangeModalProps) {
  const [selectedStatus, setSelectedStatus] = useState("Pending")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (contact) {
      onSave(contact.id, selectedStatus)
    }
  }

  if (!contact) return null

  return (
     <Modal isOpen={isOpen} title='Change Status' onClose={onClose}>
          <div className="sm:max-w-[400px] p-5">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-4">
              Change status for inquiry from{" "}
              <span className="font-semibold">
                {contact.name.first} {contact.name.lastName}
              </span>
            </p>
            <Label htmlFor="status">New Status</Label>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select new status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Resolved">Resolved</SelectItem>
                <SelectItem value="Closed">Closed</SelectItem>
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
