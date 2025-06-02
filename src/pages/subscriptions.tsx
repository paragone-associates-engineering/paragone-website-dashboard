
import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { packageService } from "@/services/package-service"
import { PackageCard } from "@/components/packages/card"
import { PackageForm } from "@/components/packages/form"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { toast } from "sonner"
import type { Package, CreatePackageDTO } from "@/types/package"

const Subscriptions = () => {
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingPackage, setEditingPackage] = useState<Package | null>(null)

  const queryClient = useQueryClient()

  const packagesQuery = useQuery({
    queryKey: ["packages"],
    queryFn: packageService.getPackages,
  })

  const createPackageMutation = useMutation({
    mutationFn: packageService.createPackage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["packages"] })
      toast.success("Package created successfully")
      setShowAddForm(false)
    },
    onError: (error) => {
      console.error("Error creating package:", error)
      toast.error("Failed to create package")
    },
  })

  const updatePackageMutation = useMutation({
    mutationFn: ({ packageId, data }: { packageId: string; data: CreatePackageDTO }) =>
      packageService.updatePackage(packageId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["packages"] })
      toast.success("Package updated successfully")
      setEditingPackage(null)
    },
    onError: (error) => {
      console.error("Error updating package:", error)
      toast.error("Failed to update package")
    },
  })

  const handleCreateSubmit = (data: CreatePackageDTO) => {
    createPackageMutation.mutate(data)
  }

  const handleUpdateSubmit = (data: CreatePackageDTO) => {
    if (editingPackage) {
      updatePackageMutation.mutate({ packageId: editingPackage.id, data })
    }
  }

  const handleEdit = (pkg: Package) => {
    setEditingPackage(pkg)
    setShowAddForm(false)
  }

  const handleCancel = () => {
    setShowAddForm(false)
    setEditingPackage(null)
  }

  if (packagesQuery.isLoading) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Subscriptions</h1>
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </div>
    )
  }

  if (packagesQuery.isError) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Subscriptions</h1>
        </div>
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
          Error loading subscription packages. Please try again later.
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Subscriptions</h1>
        {!showAddForm && !editingPackage && (
          <Button onClick={() => setShowAddForm(true)}>
            <Plus className="h-4 w-4 mr-2" /> Add Package
          </Button>
        )}
      </div>

      {showAddForm && (
        <div className="mb-6">
          <PackageForm
            onSubmit={handleCreateSubmit}
            onCancel={handleCancel}
            isLoading={createPackageMutation.isPending}
          />
        </div>
      )}

      {editingPackage && (
        <div className="mb-6">
          <PackageForm
            initialData={editingPackage}
            onSubmit={handleUpdateSubmit}
            onCancel={handleCancel}
            isLoading={updatePackageMutation.isPending}
          />
        </div>
      )}

      {!showAddForm && !editingPackage && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {packagesQuery.data?.map((pkg) => (
            <PackageCard key={pkg.id} package={pkg} onEdit={handleEdit} />
          ))}
        </div>
      )}
    </div>
  )
}

export default Subscriptions


