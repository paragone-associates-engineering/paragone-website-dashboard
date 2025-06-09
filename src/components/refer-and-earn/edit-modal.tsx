
import type React from "react"

import { useState, useEffect } from "react"
//import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import type { ReferAndEarn } from "@/services/refer-and-earn-service"
import { Modal } from "../ui/modal"

interface EditModalProps {
  isOpen: boolean
  onClose: () => void
  referral: ReferAndEarn | null
  onSave: (id: string, data: { status: string; additionalComments: string; interestedService: string }) => void
  isLoading: boolean
}

export function EditModal({ isOpen, onClose, referral, onSave, isLoading }: EditModalProps) {
  const [formData, setFormData] = useState({
    status: "",
    additionalComments: "",
    interestedService: "",
  })

  useEffect(() => {
    if (referral) {
      setFormData({
        status: referral.status,
        additionalComments: referral.additionalComments,
        interestedService: referral.interestedService,
      })
    }
  }, [referral])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (referral) {
      onSave(referral.id, formData)
    }
  }

  const handleClose = () => {
    onClose()
    setFormData({
      status: "",
      additionalComments: "",
      interestedService: "",
    })
  }

  if (!referral) return null

  return (
    <Modal isOpen={isOpen} title='Edit Referral' onClose={handleClose}>
      <div className="p-5">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" value={referral.name.first} disabled className="bg-gray-50" />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" value={referral.name.lastName} disabled className="bg-gray-50" />
            </div>
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={referral.email} disabled className="bg-gray-50" />
          </div>

          <div>
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input id="phoneNumber" value={referral.phoneNumber} className="bg-gray-50" />
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, status: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="interestedService">Interested Service</Label>
            <Input
              id="interestedService"
              value={formData.interestedService}
              onChange={(e) => setFormData((prev) => ({ ...prev, interestedService: e.target.value }))}
              placeholder="Enter interested service"
            />
          </div>

          <div>
            <Label htmlFor="additionalComments">Additional Comments</Label>
            <Textarea
              id="additionalComments"
              value={formData.additionalComments}
              onChange={(e) => setFormData((prev) => ({ ...prev, additionalComments: e.target.value }))}
              placeholder="Enter additional comments"
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  )
}
