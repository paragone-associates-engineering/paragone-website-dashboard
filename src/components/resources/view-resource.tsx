
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Calendar, DollarSign } from "lucide-react"
import { format } from "date-fns"
import { formatCurrency } from "@/lib/utils"
import type { Resource } from "@/types/resource"

interface ViewResourceModalProps {
  isOpen: boolean
  onClose: () => void
  resource: Resource | null
}

export const ViewResourceModal = ({ isOpen, onClose, resource }: ViewResourceModalProps) => {
  if (!resource) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{resource.title}</span>
            <Badge variant={resource.isActive ? "default" : "secondary"}>
              {resource.isActive ? "Active" : "Inactive"}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {resource.image && (
            <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
              <img
                src={resource.image || "/placeholder.svg"}
                alt={resource.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div>
            <h3 className="font-medium mb-2">Summary</h3>
            <p className="text-gray-700" dangerouslySetInnerHTML={{ __html: resource.summary }} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-gray-500" />
              <span className="text-sm">
                {resource.isPaid ? (
                  <Badge variant="outline" className="text-green-600">
                    ₦{formatCurrency(resource.price?.amount || 0)}
                  </Badge>
                ) : (
                  <Badge variant="outline">Free</Badge>
                )}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                Created {format(new Date(resource.createdAt), "MMM d, yyyy")}
              </span>
            </div>
          </div>

          {resource.link && (
            <div>
              <h3 className="font-medium mb-2">Resource Link</h3>
              <Button
                variant="outline"
                onClick={() => window.open(resource.link, "_blank")}
                className="w-full justify-start"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Open Resource
              </Button>
            </div>
          )}

            <div className="flex justify-end">
                <Button onClick={onClose}>
                Close
                </Button>
                </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
