
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Tag, FileText } from "lucide-react"
import type { Partner } from "@/services/partner-list-service"
import { Modal } from "../../ui/modal"

interface ViewDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  partner: Partner | null
}

export function ViewDetailsModal({ isOpen, onClose, partner }: ViewDetailsModalProps) {
  if (!partner) return null

  return (
     <Modal isOpen={isOpen} title='Partner details' onClose={onClose}>
          <div className="sm:max-w-[400px] p-5">
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <div className="w-24 h-24 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden">
              {partner.logo ? (
                <img
                  src={partner.logo || "/placeholder.svg"}
                  alt={partner.name}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="text-gray-400 text-xs text-center">No Logo</div>
              )}
            </div>
            <div>
              <h3 className="text-xl font-semibold">{partner.name}</h3>
              <Badge variant={partner.isActive ? "default" : "secondary"} className="mt-1">
                {partner.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex items-center text-sm text-gray-500 mb-1">
                <Tag className="h-4 w-4 mr-1" />
                <span>Type</span>
              </div>
              <p className="font-medium">{partner.type}</p>
            </div>

            <div>
              <div className="flex items-center text-sm text-gray-500 mb-1">
                <FileText className="h-4 w-4 mr-1" />
                <span>Description</span>
              </div>
              <p className="text-gray-700">{partner.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex items-center text-sm text-gray-500 mb-1">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>Created</span>
                </div>
                <p className="text-sm">{new Date(partner.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <div className="flex items-center text-sm text-gray-500 mb-1">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>Last Updated</span>
                </div>
                <p className="text-sm">{new Date(partner.updatedAt).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-500 mb-1">Created By</div>
                <p className="text-sm font-medium">{partner.createdBy}</p>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Last Updated By</div>
                <p className="text-sm font-medium">{partner.lastUpdatedBy}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    </Modal>
  )
}
