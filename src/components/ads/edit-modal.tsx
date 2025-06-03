
import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Loader2, X, Upload } from "lucide-react"
import type { Ad, AdFormData } from "@/services/ads-service"
import { Modal } from "../ui/modal"

interface EditModalProps {
  isOpen: boolean
  onClose: () => void
  ad: Ad | null
  onSave: (id: string, data: AdFormData) => void
  isLoading: boolean
}

export function EditModal({ isOpen, onClose, ad, onSave, isLoading }: EditModalProps) {
  const [formData, setFormData] = useState<AdFormData>({
    title: "",
    description: "",
    type: "",
    objectives: [],
    state: "",
    cities: [],
    isActive: true,
    image: undefined,
  })
  const [imagePreview, setImagePreview] = useState<string>("")

  useEffect(() => {
    if (ad) {
      setFormData({
        title: ad.title,
        description: ad.description || "",
        type: ad.type || "",
        objectives: ad.objectives || [],
        state: ad.state || "",
        cities: ad.cities || [],
        isActive: ad.isActive,
        image: undefined,
      })
      setImagePreview(ad.image || "")
    }
  }, [ad])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (ad) {
      onSave(ad.id, formData)
    }
  }

  const handleClose = () => {
    onClose()
    setFormData({
      title: "",
      description: "",
      type: "",
      objectives: [],
      state: "",
      cities: [],
      isActive: true,
      image: undefined,
    })
    setImagePreview("")
  }

  const handleImageChange = (file: File | null) => {
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }))
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const removeImage = () => {
    setFormData((prev) => ({ ...prev, image: undefined }))
    setImagePreview("")
  }

  if (!ad) return null
return (
  <Modal isOpen={isOpen} title='Edit Advertisement' onClose={onClose}>
         <div className="sm:max-w-[400px] p-5">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="Enter ad title"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Enter description"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="type">Type</Label>
            <Select value={formData.type} onValueChange={(value) => setFormData((prev) => ({ ...prev, type: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="affiliate">Affiliate or discount codes</SelectItem>
                <SelectItem value="social">Social media advertising</SelectItem>
                <SelectItem value="display">Display advertising</SelectItem>
                <SelectItem value="video">Video advertising</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="state">State</Label>
            <Input
              id="state"
              value={formData.state}
              onChange={(e) => setFormData((prev) => ({ ...prev, state: e.target.value }))}
              placeholder="Enter state"
            />
          </div>

          <div>
            <Label htmlFor="isActive">Status</Label>
            <Select
              value={formData.isActive ? "active" : "inactive"}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, isActive: value === "active" }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

           <div>
            <Label>Image</Label>
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={(e) => handleImageChange(e.target.files?.[0] || null)}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="flex flex-col items-center justify-center cursor-pointer">
                  <Upload className="h-8 w-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">Click to upload image/video</span>
                </label>
              </div>

                 {imagePreview && (
                <div className="relative w-full max-w-xs">
                  <img
                    src={imagePreview || "/placeholder.svg"}
                    alt="Preview"
                    className="w-full h-32 object-cover rounded-lg"
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
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  )
}
