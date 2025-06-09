
import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
//import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import type { JoinUs } from "@/services/join-us-service"
import { Modal } from "../ui/modal"

interface EditModalProps {
  isOpen: boolean
  onClose: () => void
  joinUsEntry: JoinUs | null
  onSave: (id: string, data: { email:string, firstName:string, lastName:string, phoneNumber:string, location: string; participation: string }) => void
  isLoading: boolean
}

export function EditModal({ isOpen, onClose, joinUsEntry, onSave, isLoading }: EditModalProps) {
  const [formData, setFormData] = useState({
    email:"",
    firstName:"",
    lastName:"",
    location: "",
    participation: "",
    phoneNumber: ""
  })

  useEffect(() => {
    if (joinUsEntry) {
      setFormData({
         email:joinUsEntry.email,
    firstName:joinUsEntry.name.first,
    lastName: joinUsEntry.name.lastName,
    phoneNumber: joinUsEntry.phoneNumber,
       // status: joinUsEntry.status || "Pending",
        location: joinUsEntry.location,
        participation: joinUsEntry.participation,
      })
    }
  }, [joinUsEntry])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (joinUsEntry) {
      onSave(joinUsEntry.id, formData)
    }
  }

  const handleClose = () => {
    onClose()
    setFormData({
      email:"",
    firstName:"",
    lastName:"",
      location: "",
      participation: "",
      phoneNumber: ""
    })
  }

  if (!joinUsEntry) return null

  return (
    <Modal isOpen={isOpen} title='Edit Join Us Entry' onClose={onClose}>
         <div className=" p-5 w-full">
          
        <form onSubmit={handleSubmit} className="space-y-4 w-full">
          <div className="grid grid-cols-2 gap-4 w-full">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" value={formData.firstName} className="bg-gray-50" />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" value={formData.lastName} className="bg-gray-50" />
            </div>
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={formData.email}  className="bg-gray-50" />
          </div>

          <div>
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input id="phoneNumber" value={formData.phoneNumber} className="bg-gray-50" />
          </div>

          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
              placeholder="Enter location"
            />
          </div>

          <div>
            <Label htmlFor="participation">Participation</Label>
            <Textarea
              id="participation"
              value={formData.participation}
              onChange={(e) => setFormData((prev) => ({ ...prev, participation: e.target.value }))}
              placeholder="Enter participation details"
              rows={3}
            />
          </div>

          {/* <div>
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
                <SelectItem value="In Review">In Review</SelectItem>
                <SelectItem value="Contacted">Contacted</SelectItem>
              </SelectContent>
            </Select>
          </div> */}

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
