
import type React from "react"

import { useState } from "react"
//import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { Modal } from "../ui/modal"

import type { Listing } from "@/services/listings-service"

interface StatusChangeModalProps {
  isOpen: boolean
  onClose: () => void
  listing: Listing | null
  onSave: (id: string, isActive: boolean) => void
  isLoading: boolean
}

export function StatusChangeModal({ isOpen, onClose, listing, onSave, isLoading }: StatusChangeModalProps) {
  const [selectedStatus, setSelectedStatus] = useState<boolean>(true)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (listing) {
      onSave(listing.id, selectedStatus)
    }
  }

  if (!listing) return null


  return (
    <Modal isOpen={isOpen} title='Change Status' onClose={onClose}>
      <div className="sm:max-w-[400px] p-5">
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
             <p className="text-sm text-gray-600 mb-4">
              Change status for property <span className="font-semibold">"{listing.propertyName}"</span>
            </p>
            
            <Label htmlFor="status">New Status</Label>
            <Select
              value={selectedStatus ? "active" : "inactive"}
              onValueChange={(value) => setSelectedStatus(value === "active")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select new status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
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
