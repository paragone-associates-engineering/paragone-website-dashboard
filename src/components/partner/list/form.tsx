
import type React from "react"
import { useState, useEffect } from "react"
//import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Loader2, Upload, X } from "lucide-react"
import type { Partner, PartnerFormData } from "@/services/partner-list-service"
 import { Modal } from "../../ui/modal"
interface PartnerFormModalProps {
  isOpen: boolean
  onClose: () => void
  partner?: Partner
  onSave: (data: PartnerFormData) => void
  isLoading: boolean
}

export function PartnerFormModal({ isOpen, onClose, partner, onSave, isLoading }: PartnerFormModalProps) {
  const [formData, setFormData] = useState<PartnerFormData>({
    name: "",
    type: "",
    description: "",
    logo: undefined,
  })
  const [imagePreview, setImagePreview] = useState<string>("")
  const isEditing = !!partner

  useEffect(() => {
    if (partner) {
      setFormData({
        name: partner.name,
        type: partner.type,
        description: partner.description,
        logo: undefined,
      })
      setImagePreview(partner.logo || "")
    } else {
      setFormData({
        name: "",
        type: "",
        description: "",
        logo: undefined,
      })
      setImagePreview("")
    }
  }, [partner, isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  const handleClose = () => {
    onClose()
    setFormData({
      name: "",
      type: "",
      description: "",
      logo: undefined,
    })
    setImagePreview("")
  }

  const handleImageChange = (file: File | null) => {
    if (file) {
      setFormData((prev) => ({ ...prev, logo: file }))
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const removeImage = () => {
    setFormData((prev) => ({ ...prev, logo: undefined }))
    setImagePreview("")
  }

  return (
  <Modal isOpen={isOpen} title={isEditing ? "Edit Partner" : "Add Partner"} onClose={onClose}>
             <div className='p-5'>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="partner-name">Partner Name</Label>
            <Input
              id="partner-name"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Enter partner name"
              required
            />
          </div>

          <div>
            <Label htmlFor="partner-type">Partner Type</Label>
            <Select value={formData.type} onValueChange={(value) => setFormData((prev) => ({ ...prev, type: value }))}>
              <SelectTrigger id="partner-type">
                <SelectValue placeholder="Select partner type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Corporate Partner">Corporate Partner</SelectItem>
                <SelectItem value="Service Partner">Service Partner</SelectItem>
                <SelectItem value="Affiliate/ Referral Partner">Affiliate/ Referral Partner</SelectItem>
                <SelectItem value="Investment Partner">Investment Partner</SelectItem>
                <SelectItem value="Vendor Partner">Vendor Partner</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Write description..."
              rows={3}
              required
            />
          </div>

          <div>
            <Label>Partner Logo</Label>
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e.target.files?.[0] || null)}
                  className="hidden"
                  id="logo-upload"
                />
                <label htmlFor="logo-upload" className="flex flex-col items-center justify-center cursor-pointer">
                  <Upload className="h-8 w-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">Click to upload logo</span>
                </label>
              </div>

              {imagePreview && (
                <div className="relative w-full max-w-xs">
                  <img
                    src={imagePreview || "/placeholder.svg"}
                    alt="Logo Preview"
                    className="w-24 h-24 object-contain border rounded-md bg-white"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? "Update Partner" : "Create Partner"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  )
}
