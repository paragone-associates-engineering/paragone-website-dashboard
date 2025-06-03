import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Loader2, Upload, X } from "lucide-react"
import type { SellAsCompany } from "@/services/partner-service"
import { Modal } from "../ui/modal"

interface RejectionModalProps {
  isOpen: boolean
  onClose: () => void
  company: SellAsCompany | null
  onReject: (id: string, data: { title: string; description: string; attachments?: File[] }) => void
  isLoading: boolean
}

export function RejectionModal({ isOpen, onClose, company, onReject, isLoading }: RejectionModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  })
  const [attachments, setAttachments] = useState<File[]>([])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (company && formData.title && formData.description) {
      onReject(company.id, {
        title: formData.title,
        description: formData.description,
        attachments: attachments.length > 0 ? attachments : undefined,
      })
    }
  }

  const handleClose = () => {
    onClose()
    setFormData({ title: "", description: "" })
    setAttachments([])
  }

  const handleFileChange = (files: FileList | null) => {
    if (files) {
      setAttachments(Array.from(files))
    }
  }

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index))
  }

  if (!company) return null

  return (
    <Modal isOpen={isOpen} title='Reject Company Application' onClose={onClose}>
      <div className="sm:max-w-[400px] p-5">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Rejection Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="Enter rejection title"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Rejection Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Explain the reason for rejection"
              rows={4}
              required
            />
          </div>

          <div>
            <Label>Attachments (Optional)</Label>
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <input
                  type="file"
                  multiple
                  onChange={(e) => handleFileChange(e.target.files)}
                  className="hidden"
                  id="attachment-upload"
                />
                <label htmlFor="attachment-upload" className="flex flex-col items-center justify-center cursor-pointer">
                  <Upload className="h-8 w-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">Click to upload attachments</span>
                </label>
              </div>

              {attachments.length > 0 && (
                <div className="space-y-2">
                  {attachments.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                      <span className="text-sm truncate">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => removeAttachment(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-red-600 hover:bg-red-700">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Reject Application
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  )
}
