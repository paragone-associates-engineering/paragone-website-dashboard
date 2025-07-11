import type React from "react"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { DataTable } from "@/components/shared/data-table"
import { FormContainer, FormField } from "@/components/shared/form-container"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Pencil, Trash2, X, Upload, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { adsService, type Ad, type AdFormData } from "@/services/ads-service"
import { EditModal } from "@/components/ads/edit-modal"
import { DeleteConfirmation } from "@/components/ads/delete-confirmation"

export default function AdvertisingPage() {
  const queryClient = useQueryClient()
  const [editingAd, setEditingAd] = useState<Ad | null>(null)
  const [deletingAd, setDeletingAd] = useState<Ad | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

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

  const {
    data: adsData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["ads"],
    queryFn: () => adsService.getAds(),
    staleTime: 1000 * 60 * 5,
  })

  const metadata = { total: Array.isArray(adsData) ? adsData.length : 0, totalPages: 0 }

  const createMutation = useMutation({
    mutationFn: (data: AdFormData) => adsService.createAd(data),
    onSuccess: () => {
      toast.success("Advertisement created successfully")
      queryClient.invalidateQueries({ queryKey: ["ads"] })
      resetForm()
    },
    onError: () => {
      toast.error("Failed to create advertisement")
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: AdFormData }) => adsService.updateAd(id, data),
    onSuccess: () => {
      toast.success("Advertisement updated successfully")
      queryClient.invalidateQueries({ queryKey: ["ads"] })
      setIsEditModalOpen(false)
      setEditingAd(null)
    },
    onError: () => {
      toast.error("Failed to update advertisement")
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adsService.deleteAd(id),
    onSuccess: () => {
      toast.success("Advertisement deleted successfully")
      queryClient.invalidateQueries({ queryKey: ["ads"] })
      setIsDeleteDialogOpen(false)
      setDeletingAd(null)
    },
    onError: () => {
      toast.error("Failed to delete advertisement")
    },
  })

  const resetForm = () => {
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

  const handleEdit = (ad: Ad) => {
    setEditingAd(ad)
    setIsEditModalOpen(true)
  }

  const handleDelete = (ad: Ad) => {
    setDeletingAd(ad)
    setIsDeleteDialogOpen(true)
  }

  const handleSaveEdit = (id: string, data: AdFormData) => {
    updateMutation.mutate({ id, data })
  }

  const handleConfirmDelete = () => {
    if (deletingAd) {
      deleteMutation.mutate(deletingAd.id)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title.trim()) {
      toast.error("Please enter a title")
      return
    }
    createMutation.mutate(formData)
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

  const columns = [
    {
      id: "image",
      header: "",
      accessorKey: "image",
      cell: ( row: Ad ) => (
        <div className="w-10 h-10 bg-gray-200 rounded-md flex items-center justify-center">
          {row.image ? (
            <img src={row.image || "/placeholder.svg"} alt="Ad" className="size-full object-cover rounded-md" />
          ) : (
            <div className="w-full h-full bg-gray-300 rounded-md" />
          )}
        </div>
      ),
    },
    {
      id: "title",
      header: "Title",
      accessorKey: "title",
      enableSorting: true,
    },
    {
      id: "type",
      header: "Type",
      accessorKey: "type",
      enableSorting: true,
    },
    {
      id: "createdAt",
      header: "Created",
      accessorKey: "createdAt",
      cell: (row: Ad ) => {
        return new Date(row.createdAt).toLocaleDateString()
      },
      enableSorting: true,
    },
    {
      id: "status",
      header: "Status",
      accessorKey: "isActive",
      cell: (row: Ad ) => (
        <Badge
          className={
            row.isActive ? "bg-green-100 text-green-800 hover:bg-green-200" : "bg-red-100 text-red-800 hover:bg-red-200"
          }
        >
          {row.isActive ? "Active" : "Inactive"}
        </Badge>
      ),
      enableSorting: true,
    },
    {
      id: "responses",
      header: "Responses",
      accessorKey: "responses",
      cell: (row: Ad ) => row.responses || 0,
    },
    {
      id: "action",
      header: "",
      accessorKey: "id",
      cell: () => null,
    },
  ]

  const actionMenu = {
    items: [
      {
        label: "Edit advertising",
        icon: <Pencil className="h-4 w-4" />,
        onClick: handleEdit,
      },
      {
        label: "Delete",
        icon: <Trash2 className="h-4 w-4" />,
        onClick: handleDelete,
        className: "text-red-600",
      },
    ],
  }

  return (
    <div className="p-6 max-w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Advertising</h1>
        <p className="text-sm text-gray-500">Total: {metadata.total} advertisements</p>
      </div>

      <div className="mb-6">
        <div className="bg-white rounded-lg border overflow-hidden">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">All Advertising</h2>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Loading Advertisements...</span>
            </div>
          ) : isError ? (
            <div className="p-8 text-center text-red-500">Error loading advertisements. Please try again.</div>
          ) : (
            <div className="overflow-x-auto">
              <DataTable
                columns={columns}
                data={!isLoading && adsData ? adsData : []}
                actionMenu={actionMenu}
                pagination={{ pageSize: 10, totalItems: metadata.total }}
                searchable={true}
                selectable={true}
              />
            </div>
          )}
        </div>
      </div>

      <FormContainer
        title="Create Advertisement"
        onSubmit={handleSubmit}
        onCancel={resetForm}
        submitLabel="Create Advertisement"
        isLoading={createMutation.isPending}
      >
        <FormField label="Title" required>
          <Input
            value={formData.title}
            onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
            placeholder="Enter advertisement title"
          />
        </FormField>

        <FormField label="Type" className="mt-4">
          <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, type: value }))}>
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
        </FormField>

        <FormField label="State" className="mt-4">
          <Input
            value={formData.state}
            onChange={(e) => setFormData((prev) => ({ ...prev, state: e.target.value }))}
            placeholder="Enter state"
          />
        </FormField>

        <FormField label="Description" className="mt-4">
          <Textarea
            value={formData.description}
            onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
            placeholder="Write description..."
            className="min-h-[100px]"
          />
        </FormField>

        <div className="mt-6">
          <h3 className="text-base font-medium mb-4">Upload Image/Video</h3>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              <input
                type="file"
                accept="image/*,video/*"
                onChange={(e) => handleImageChange(e.target.files?.[0] || null)}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="flex flex-col items-center justify-center cursor-pointer">
                <Upload className="h-12 w-12 text-gray-400 mb-4" />
                <span className="text-lg font-medium text-gray-600">Click to upload</span>
                <span className="text-sm text-gray-500">Support single image or video</span>
              </label>
            </div>

            {imagePreview && (
              <div className="relative w-full max-w-xs">
                <img
                  src={imagePreview || "/placeholder.svg"}
                  alt="Preview"
                  className="w-full h-32 object-cover rounded-md"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </FormContainer>

      <EditModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setEditingAd(null)
        }}
        ad={editingAd}
        onSave={handleSaveEdit}
        isLoading={updateMutation.isPending}
      />

      <DeleteConfirmation
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false)
          setDeletingAd(null)
        }}
        ad={deletingAd}
        onConfirm={handleConfirmDelete}
        isLoading={deleteMutation.isPending}
      />
    </div>
  )
}
