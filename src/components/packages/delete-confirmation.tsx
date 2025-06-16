"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"
import type { Package } from "@/types/package"
import { formatCurrency } from "@/lib/utils"

interface DeleteConfirmationModalProps {
  package: Package | null
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  isDeleting: boolean
}

export const DeleteConfirmationModal = ({
  package: pkg,
  isOpen,
  onClose,
  onConfirm,
  isDeleting,
}: DeleteConfirmationModalProps) => {
  if (!pkg) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Delete Package
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this package? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-900">{pkg.name}</h4>
          <p className="text-sm text-gray-600">{pkg.level}</p>
          <p className="text-lg font-bold text-gray-900 mt-1">
            ₦{formatCurrency(pkg.price)}/{pkg.duration}
          </p>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} disabled={isDeleting}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm} disabled={isDeleting}>
            {isDeleting ? "Deleting..." : "Delete Package"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
