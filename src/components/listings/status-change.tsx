
import type React from "react"

import { useState } from "react"
//import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { Modal } from "../ui/modal"
import { STATUS } from "@/services/listings-service"
import type { Listing } from "@/services/listings-service"

interface StatusChangeModalProps {
  isOpen: boolean
  onClose: () => void
  listing: Listing | null
  onSave?: (id: string, status: STATUS) => void
  isLoading: boolean
}

export function StatusChangeModal({ isOpen, onClose, listing, onSave, isLoading }: StatusChangeModalProps) {
  const [selectedStatus, setSelectedStatus] = useState<STATUS>(STATUS.PENDING)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (listing) {
      //console.log('saved')
      if (onSave) {
        onSave(listing?.id, selectedStatus)
      }
    }
  }

  if (!listing) return null
//console.log('list',listing)

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
              value={selectedStatus}
              onValueChange={(value) => setSelectedStatus(value as STATUS)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select new status" />
              </SelectTrigger>
              <SelectContent>
               <SelectItem value={STATUS.PENDING}>Pending</SelectItem>
                               <SelectItem value={STATUS.NEGOTIATION}>Negotiation</SelectItem>
                                 <SelectItem value={STATUS.INSPECTION}>Inspection</SelectItem>
                               <SelectItem value={STATUS.OFFMARKET}>Off Market</SelectItem>
                               <SelectItem value={STATUS.PAID}>Paid</SelectItem>
                               <SelectItem value={STATUS.CLOSED}>Closed</SelectItem>
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
