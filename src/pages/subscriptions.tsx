
import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { packageService } from "@/services/package-service"
import { PackageCard } from "@/components/packages/card"
import { PackageForm } from "@/components/packages/form"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import type { Package, CreatePackageDTO } from "@/types/package"

const Subscriptions = () => {
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingPackage, setEditingPackage] = useState<Package | null>(null)
  const [activeTab, setActiveTab] = useState<"all" | "published" | "archived">("all")

  const queryClient = useQueryClient()

  const packagesQuery = useQuery({
    queryKey: ["packages", activeTab],
    queryFn: async () => {
      const params: { archived?: string; isActive?: boolean } = {}

      if (activeTab === "published") {
        params.archived = "false"
        params.isActive = true
      } else if (activeTab === "archived") {
        params.archived = "true"
        params.isActive = true
      } else {
        // All tab - only active packages (both archived and published)
        params.isActive = true
      }

      return packageService.getPackages(params)
    },
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

  const filteredPackages =
    packagesQuery.data?.filter((pkg) => {
      if (activeTab === "published") {
        return pkg.isActive && !pkg.archived
      } else if (activeTab === "archived") {
        return pkg.isActive && pkg.archived
      }
      // All tab - show all active packages
      return pkg.isActive
    }) || []

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

      {/* Tabs */}
      <div className="border-b mb-6">
        <div className="flex">
          <button
            className={cn(
              "px-6 py-3 font-medium",
              activeTab === "all" && "border-b-2 border-yellow-500 text-yellow-500",
            )}
            onClick={() => setActiveTab("all")}
          >
            All ({packagesQuery.data?.filter((pkg) => pkg.isActive).length || 0})
          </button>
          <button
            className={cn(
              "px-6 py-3 font-medium",
              activeTab === "published" && "border-b-2 border-yellow-500 text-yellow-500",
            )}
            onClick={() => setActiveTab("published")}
          >
            Published ({packagesQuery.data?.filter((pkg) => pkg.isActive && !pkg.archived).length || 0})
          </button>
          <button
            className={cn(
              "px-6 py-3 font-medium",
              activeTab === "archived" && "border-b-2 border-yellow-500 text-yellow-500",
            )}
            onClick={() => setActiveTab("archived")}
          >
            Archived ({packagesQuery.data?.filter((pkg) => pkg.isActive && pkg.archived).length || 0})
          </button>
        </div>
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
        <>
          {filteredPackages.length === 0 ? (
            <div className="bg-white p-8 rounded-md shadow-sm border text-center">
              <p className="text-gray-500">No {activeTab === "all" ? "" : activeTab} packages found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredPackages.map((pkg) => (
                <PackageCard key={pkg.id} package={pkg} onEdit={handleEdit} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default Subscriptions
