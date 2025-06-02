
import type React from "react"
import { useState, useEffect } from "react"
//import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import type { PropertyManagement } from "@/services/property-management-service"
import { STATUS } from "@/services/property-management-service"
import { Modal } from "../ui/modal"

interface EditModalProps {
  isOpen: boolean
  onClose: () => void
  property: PropertyManagement | null
  onSave: (
    id: string,
    data: { status: STATUS; additionalComment: string; propertyType: string; propertyLocation: string },
  ) => void
  isLoading: boolean
}

export function EditModal({ isOpen, onClose, property, onSave, isLoading }: EditModalProps) {
  const [formData, setFormData] = useState({
    status: STATUS.PENDING,
    additionalComment: "",
    propertyType: "",
    propertyLocation: "",
  })

  useEffect(() => {
    if (property) {
      setFormData({
        status: property.status as STATUS,
        additionalComment: property.additionalComment || "",
        propertyType: property.propertyType,
        propertyLocation: property.propertyLocation,
      })
    }
  }, [property])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (property) {
      onSave(property.id, formData)
    }
  }

  const handleClose = () => {
    onClose()
    setFormData({
      status: STATUS.PENDING,
      additionalComment: "",
      propertyType: "",
      propertyLocation: "",
    })
  }

  if (!property) return null

  return (
    <Modal isOpen={isOpen} title='Edit Property Management' onClose={onClose}>
      <div className="sm:max-w-[400px] p-5">
       
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" value={property.name.first} disabled className="bg-gray-50" />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" value={property.name.lastName} disabled className="bg-gray-50" />
            </div>
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={property.email} disabled className="bg-gray-50" />
          </div>

          <div>
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input id="phoneNumber" value={property.phoneNumber} disabled className="bg-gray-50" />
          </div>

          <div>
            <Label htmlFor="propertyType">Property Type</Label>
            <Input
              id="propertyType"
              value={formData.propertyType}
              onChange={(e) => setFormData((prev) => ({ ...prev, propertyType: e.target.value }))}
              placeholder="Enter property type"
            />
          </div>

          <div>
            <Label htmlFor="propertyLocation">Property Location</Label>
            <Input
              id="propertyLocation"
              value={formData.propertyLocation}
              onChange={(e) => setFormData((prev) => ({ ...prev, propertyLocation: e.target.value }))}
              placeholder="Enter property location"
            />
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, status: value as STATUS }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
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

          <div>
            <Label htmlFor="additionalComment">Additional Comments</Label>
            <Textarea
              id="additionalComment"
              value={formData.additionalComment}
              onChange={(e) => setFormData((prev) => ({ ...prev, additionalComment: e.target.value }))}
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
