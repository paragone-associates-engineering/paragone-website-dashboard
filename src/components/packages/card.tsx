

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit, Archive, ArchiveRestore, Trash2 } from "lucide-react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { packageService } from "@/services/package-service"
import { DeleteConfirmationModal } from "./delete-confirmation"
import { toast } from "sonner"
import type { Package } from "@/types/package"
import { formatCurrency } from "@/lib/utils"

interface PackageCardProps {
  package: Package
  onEdit: (pkg: Package) => void
}

export const PackageCard = ({ package: pkg, onEdit }: PackageCardProps) => {
  const [isUpdating, setIsUpdating] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const queryClient = useQueryClient()

  const archiveMutation = useMutation({
    mutationFn: ({ packageId, archived }: { packageId: string; archived: boolean }) =>
      packageService.archivePackage(packageId, archived),
    onMutate: () => {
      setIsUpdating(true)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["packages"] })
      toast.success(`Package ${pkg.archived ? "unarchived" : "archived"} successfully`)
    },
    onError: (error) => {
      console.error("Error archiving package:", error)
      toast.error("Failed to update package")
    },
    onSettled: () => {
      setIsUpdating(false)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (packageId: string) => packageService.deletePackage(packageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["packages"] })
      toast.success("Package deleted successfully")
      setShowDeleteModal(false)
    },
    onError: (error) => {
      console.error("Error deleting package:", error)
      toast.error("Failed to delete package")
    },
  })

  const handleArchiveToggle = () => {
    archiveMutation.mutate({ packageId: pkg.id, archived: !pkg.archived })
  }

  const handleDelete = () => {
    deleteMutation.mutate(pkg.id)
  }

  const getColorClass = (level: string) => {
    switch (level.toLowerCase()) {
      case "starter":
        return "bg-[#D5F7F6]"
      case "professional":
        return "bg-[#FFF1C5]"
      case "commercial":
        return "bg-[#DEE3FF]"
      case "large":
        return "bg-[#FEDEFF]"
      default:
        return "bg-gray-50"
    }
  }

  const isDeleted = !pkg.isActive

  return (
    <>
      <Card
        className={`${getColorClass(pkg.level)} border px-2 ${pkg.archived ? "opacity-75" : ""} ${isDeleted ? "opacity-50" : ""}`}
      >
        <CardHeader className="px-2">
          <div className="flex justify-between items-start">
            <div>
               {pkg.archived && (
                  <span className="px-2 py-1 text-xs bg-gray-500 text-white rounded-full">Archived</span>
                )}
                {isDeleted && <span className="px-2 py-1 text-xs bg-red-500 text-white rounded-full">Deleted</span>}
              <div className="flex items-center gap-2">
                <CardTitle className="text-xl font-bold">{pkg.name}</CardTitle>
               
              </div>
              <CardDescription className="text-gray-600">{pkg.level}</CardDescription>
            </div>
            <Button variant="outline" size="sm" className="h-8 px-3" onClick={() => onEdit(pkg)} disabled={isDeleted}>
              <Edit className="h-4 w-4" />
              <span className="ml-1">Edit</span>
            </Button>
          </div>
        </CardHeader>

        <CardContent className="px-2">
          <div className="mb-6">
            <h3 className="text-3xl font-bold">₦{formatCurrency(pkg.price)}/</h3>
            <p className="text-gray-600">{pkg.duration}</p>
          </div>

          <div className="mb-6">
            <h4 className="font-medium mb-2">What's included:</h4>
            <ul className="space-y-2">
              {pkg.details.map((detail, idx) => (
                <li key={idx} className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>
                    {detail.title}
                    {detail.amount && ` ${detail.amount}`}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>

        <CardFooter className="flex justify-center gap-2">
          <Button
            variant={pkg.archived ? "outline" : "secondary"}
            onClick={handleArchiveToggle}
            disabled={isUpdating || isDeleted}
            size="sm"
          >
            {isUpdating ? (
              "Processing..."
            ) : (
              <>
                {pkg.archived ? <ArchiveRestore className="h-4 w-4 mr-1" /> : <Archive className="h-4 w-4 mr-1" />}
                {pkg.archived ? "Unarchive" : "Archive"}
              </>
            )}
          </Button>

          <Button variant="destructive" onClick={() => setShowDeleteModal(true)} disabled={isDeleted} size="sm">
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </Button>
        </CardFooter>
      </Card>

      <DeleteConfirmationModal
        package={pkg}
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        isDeleting={deleteMutation.isPending}
      />
    </>
  )
}
