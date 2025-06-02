
import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit } from "lucide-react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { packageService } from "@/services/package-service"
import { toast } from "sonner"
import type { Package } from "@/types/package"
import { formatCurrency } from "@/lib/utils"

interface PackageCardProps {
  package: Package
  onEdit: (pkg: Package) => void
}

export const PackageCard = ({ package: pkg, onEdit }: PackageCardProps) => {
  const [isUpdating, setIsUpdating] = useState(false)
  const queryClient = useQueryClient()

  const toggleStatusMutation = useMutation({
    mutationFn: ({ packageId, isActive }: { packageId: string; isActive: boolean }) =>
      packageService.togglePackageStatus(packageId, isActive),
    onMutate: () => {
      setIsUpdating(true)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["packages"] })
      toast.success(`Package ${pkg.isActive ? "archived" : "activated"} successfully`)
    },
    onError: (error) => {
      console.error("Error toggling package status:", error)
      toast.error("Failed to update package status")
    },
    onSettled: () => {
      setIsUpdating(false)
    },
  })

  const handleToggleStatus = () => {
    toggleStatusMutation.mutate({ packageId: pkg.id, isActive: !pkg.isActive })
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

  return (
    <Card className={`${getColorClass(pkg.level)} border px-2`}>
      <CardHeader className="px-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl font-bold">{pkg.name}</CardTitle>
            <CardDescription className="text-gray-600">{pkg.level}</CardDescription>
          </div>
          <Button variant="outline" size="sm" className="h-8 px-3" onClick={() => onEdit(pkg)}>
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

      <CardFooter className="flex justify-center">
        <Button variant={pkg.isActive ? "destructive" : "outline"} onClick={handleToggleStatus} disabled={isUpdating}>
          {isUpdating ? "Processing..." : pkg.isActive ? "Archive" : "Activate"}
        </Button>

      </CardFooter>
    </Card>
  )
}
