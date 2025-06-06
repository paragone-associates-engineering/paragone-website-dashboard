"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import type { ConnectWithUs } from "@/services/partner-service"
 import { Modal } from "../ui/modal"
 
interface IndividualStatusModalProps {
  isOpen: boolean
  onClose: () => void
  individual: ConnectWithUs | null
  onSave: (id: string, status: string) => void
  isLoading: boolean
}

export function IndividualStatusModal({ isOpen, onClose, individual, onSave, isLoading }: IndividualStatusModalProps) {
  const [selectedStatus, setSelectedStatus] = useState("Pending")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (individual) {
      onSave(individual.id, selectedStatus)
    }
  }

  if (!individual) return null

  return (
  
 <Modal isOpen={isOpen} title='Change Company Status' onClose={onClose}>
      <div className="sm:max-w-[400px] p-5">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-4">
              Change status for{" "}
              <span className="font-semibold">
                {individual.name.first} {individual.name.lastName}
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
