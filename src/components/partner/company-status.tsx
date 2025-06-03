
import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import type { SellAsCompany } from "@/services/partner-service"
import { Modal } from "../ui/modal"

interface CompanyStatusModalProps {
  isOpen: boolean
  onClose: () => void
  company: SellAsCompany | null
  onSave: (id: string, status: string) => void
  isLoading: boolean
}

export function CompanyStatusModal({ isOpen, onClose, company, onSave, isLoading }: CompanyStatusModalProps) {
  const [selectedStatus, setSelectedStatus] = useState("Pending")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (company) {
      onSave(company.id, selectedStatus)
    }
  }

  if (!company) return null

  return (
    <Modal isOpen={isOpen} title='Change Company Status' onClose={onClose}>
      <div className="sm:max-w-[400px] p-5">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-4">
              Change status for company at <span className="font-semibold">{company.officeAddress}</span>
            </p>
            <Label htmlFor="status">New Status</Label>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select new status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
                <SelectItem value="In Review">In Review</SelectItem>
                <SelectItem value="Verified">Verified</SelectItem>
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
