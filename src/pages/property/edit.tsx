import type React from "react"

import { useState, useEffect, useMemo } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Upload, X, ArrowLeft, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { FormContainer, FormSection, FormRow, FormField } from "@/components/shared/form-container"
import { LocationSelect } from "@/components/listings/location-select"
import { LandmarksInput } from "@/components/listings/landmarks-input"
import { PropertyDetailsInput } from "@/components/listings/property-detail-input"
import {
  listingsService,
  type ListingFormData,
  type LocationDTO,
  type Landmarks,
  type PropertyDetail,
  ListingType,
  PropertyCategory,
  propertyTypesByCategory
} from "@/services/listings-service"
import { Button } from "@/components/ui/button"

export default function EditPropertyPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [formData, setFormData] = useState<ListingFormData>({
    propertyName: "",
    propertyType: "",
    propertyCategory: PropertyCategory.RESIDENTIAL,
    description: "",
    amount: 0,
    area: 0,
    listingType: ListingType.FOR_SALE,
    videoUrl: "",
    location: {
      id: "",
      country: "",
      region: "",
      city: "",
      postalCode: "",
    },
    landmarks: [],
    propertyDetails: [],
    images: [],
  })

  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [existingImages, setExistingImages] = useState<string[]>([])

  // Get available property types based on selected category
  const availablePropertyTypes = useMemo(
    () =>
      propertyTypesByCategory[formData.propertyCategory as keyof typeof propertyTypesByCategory] ||
      [],
    [formData.propertyCategory]
  )

  // Reset property type when category changes (but only after initial load)
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  
  useEffect(() => {
    if (!isInitialLoad && formData.propertyType && !availablePropertyTypes.includes(formData.propertyType)) {
      setFormData((prev) => ({ ...prev, propertyType: "" }))
    }
  }, [formData.propertyCategory, formData.propertyType, availablePropertyTypes, isInitialLoad])

  const {
    data: listing,
    isLoading,
    isError,
    
  } = useQuery({
    queryKey: ["listing", id],
    queryFn: () => listingsService.getListing(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  })

  // Update listing
  const updateMutation = useMutation({
    mutationFn: (data: ListingFormData) => {
      if (!id) throw new Error("No listing ID provided")

      // Create update DTO from form data
      const updateData = {
        propertyName: data.propertyName,
        propertyType: data.propertyType,
        propertyCategory: data.propertyCategory,
        description: data.description,
        amount: data.amount,
        area: data.area,
        listingType: data.listingType,
        videoUrl: data.videoUrl,
        location: data.location,
        landmarks: data.landmarks,
        propertyDetails: data.propertyDetails,
      }

      return listingsService.updateListing(id, updateData)
    },
    onSuccess: () => {
      toast.success("Property listing updated successfully")
      queryClient.invalidateQueries({ queryKey: ["listings"] })
      queryClient.invalidateQueries({ queryKey: ["listing", id] })
      navigate(`/property-detail/${id}`)
    },
    onError: () => {
      toast.error("Failed to update property listing")
    },
  })

  // Populate form with existing data when listing is loaded
  useEffect(() => {
    if (listing) {
      setFormData({
        propertyName: listing.propertyName,
        propertyType: listing.propertyType,
        propertyCategory: listing.propertyCategory,
        description: listing.description,
        amount: listing.amount,
        area: listing.area,
        listingType: listing.listingType,
        videoUrl: listing.videoUrl || "",
        location: listing.location,
        landmarks: listing.landmarks || [],
        propertyDetails: listing.propertyDetails || [],
        images: [],
      })

      // Set existing images
      if (listing.images && listing.images.length > 0) {
        setExistingImages(listing.images)
        setImagePreviews(listing.images)
      }

      // Mark initial load as complete
      setIsInitialLoad(false)
    }
  }, [listing])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleLocationChange = (location: LocationDTO) => {
    setFormData((prev) => ({ ...prev, location }))
  }

  const handleLandmarksChange = (landmarks: Landmarks[]) => {
    setFormData((prev) => ({ ...prev, landmarks }))
  }

  const handlePropertyDetailsChange = (propertyDetails: PropertyDetail[]) => {
    setFormData((prev) => ({ ...prev, propertyDetails }))
  }

  const handleImageChange = (files: FileList | null) => {
    if (files) {
      const newFiles = Array.from(files)
      const newPreviews = newFiles.map((file) => URL.createObjectURL(file))

      setImageFiles((prev) => [...prev, ...newFiles])
      setImagePreviews((prev) => [...prev, ...newPreviews])
    }
  }

  const removeImage = (index: number) => {
    // Check if it's an existing image or a new one
    if (index < existingImages.length) {
      // It's an existing image
      setExistingImages((prev) => prev.filter((_, i) => i !== index))
    } else {
      // It's a new image
      const adjustedIndex = index - existingImages.length
      setImageFiles((prev) => prev.filter((_, i) => i !== adjustedIndex))
    }

    // Remove from previews
    setImagePreviews((prev) => {
      const newPreviews = prev.filter((_, i) => i !== index)
      // Revoke the URL to prevent memory leaks
      if (index >= existingImages.length) {
        URL.revokeObjectURL(prev[index])
      }
      return newPreviews
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.propertyName || !formData.propertyType || !formData.location.id) {
      toast.error("Please fill in all required fields")
      return
    }

    const submissionData: ListingFormData = {
      ...formData,
      images: imageFiles,
    }

    updateMutation.mutate(submissionData)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading property data...</span>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="p-6">
        <div className="mb-6 flex items-center">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="mr-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Error</h1>
        </div>

        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          Failed to load property data. Please try again.
        </div>

        <Button onClick={() => navigate("/property-listing")}>Back to Listings</Button>
      </div>
    )
  }

  if (!listing) {
    return (
      <div className="p-6">
        <div className="mb-6 flex items-center">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="mr-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Property Not Found</h1>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded mb-4">
          The property you're trying to edit doesn't exist or has been removed.
        </div>

        <Button onClick={() => navigate("/property-listing")}>Back to Listings</Button>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-full">
      <div className="mb-6 flex items-center">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="mr-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Edit Property: {listing.propertyName}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <FormContainer
            title="Edit Property"
            onSubmit={handleSubmit}
            onCancel={() => navigate(`/property-detail/${id}`)}
            submitLabel="Update Listing"
            isLoading={updateMutation.isPending}
          >
            <FormSection title="Property Information">
              <FormRow>
                <FormField label="Property Name" required>
                  <Input
                    name="propertyName"
                    value={formData.propertyName}
                    onChange={handleInputChange}
                    placeholder="Enter property name"
                  />
                </FormField>

                <FormField label="Property Category" required>
                  <Select
                    value={formData.propertyCategory}
                    onValueChange={(value) => handleSelectChange("propertyCategory", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={PropertyCategory.RESIDENTIAL}>Residential</SelectItem>
                      <SelectItem value={PropertyCategory.COMMERCIAL}>Commercial</SelectItem>
                      <SelectItem value={PropertyCategory.LAND}>Land</SelectItem>
                    </SelectContent>
                  </Select>
                </FormField>
              </FormRow>

              <FormRow className="mt-4">
                <FormField label="Property Type" required>
                  <Select
                    value={formData.propertyType}
                    onValueChange={(value) => handleSelectChange("propertyType", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select property type" />
                    </SelectTrigger>
                    <SelectContent>
                      {availablePropertyTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>

                <FormField label="Listing Type" required>
                  <Select
                    value={formData.listingType}
                    onValueChange={(value) => handleSelectChange("listingType", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select listing type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={ListingType.FOR_SALE}>For Sale</SelectItem>
                      <SelectItem value={ListingType.FOR_RENT}>For Rent</SelectItem>
                      <SelectItem value={ListingType.SHORT_STAY}>Short Stay</SelectItem>
                      <SelectItem value={ListingType.LAND}>Land</SelectItem>
                    </SelectContent>
                  </Select>
                </FormField>
              </FormRow>

              <FormField label="Description" className="mt-4">
                <Textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Property description..."
                  className="min-h-[100px]"
                />
              </FormField>
            </FormSection>

            <FormSection title="Property Location" collapsible>
              <LocationSelect
                value={formData.location.id ? formData.location : null}
                onChange={handleLocationChange}
                label="Select Location"
                required
              />
            </FormSection>

            <FormSection title="Property Specifications" collapsible>
              <FormRow>
                <FormField label="Price Amount" required>
                  <Input
                    name="amount"
                    type="number"
                    value={formData.amount || ""}
                    onChange={(e) => setFormData((prev) => ({ ...prev, amount: Number.parseInt(e.target.value) || 0 }))}
                    placeholder="Enter price"
                  />
                </FormField>

                <FormField label="Area (sq ft)" required>
                  <Input
                    name="area"
                    type="number"
                    value={formData.area || ""}
                    onChange={(e) => setFormData((prev) => ({ ...prev, area: Number.parseInt(e.target.value) || 0 }))}
                    placeholder="Enter area"
                  />
                </FormField>
              </FormRow>
            </FormSection>

            <FormSection title="Property Details" collapsible>
              <PropertyDetailsInput value={formData.propertyDetails} onChange={handlePropertyDetailsChange} />
            </FormSection>

            <FormSection title="Landmarks" collapsible>
              <LandmarksInput value={formData.landmarks || []} onChange={handleLandmarksChange} />
            </FormSection>

            <FormSection title="Property Video" collapsible>
              <FormField label="Video URL">
                <Input
                  name="videoUrl"
                  value={formData.videoUrl}
                  onChange={handleInputChange}
                  placeholder="https://www.youtube.com/watch?v=..."
                />
              </FormField>
            </FormSection>
          </FormContainer>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border p-6">
            <Label className="text-lg font-semibold mb-4 block">Property Images</Label>

            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleImageChange(e.target.files)}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="flex flex-col items-center justify-center cursor-pointer">
                  <Upload className="h-12 w-12 text-gray-400 mb-4" />
                  <span className="text-lg font-medium text-gray-600">Click to upload images</span>
                  <span className="text-sm text-gray-500">Support multiple images</span>
                </label>
              </div>

              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-2 gap-2">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative">
                      <img
                        src={preview || "/placeholder.svg"}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg border p-6 mt-6">
            <h3 className="text-lg font-semibold mb-4">Property Status</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Active Status:</span>
                <Select
                  value={listing.isActive ? "active" : "inactive"}
                  onValueChange={(value) => {
                    if (!id) return

                    listingsService
                      .updateListingStatus(id, { isActive: value === "active" })
                      .then(() => {
                        toast.success(`Property ${value === "active" ? "activated" : "deactivated"} successfully`)
                        queryClient.invalidateQueries({ queryKey: ["listings"] })
                        queryClient.invalidateQueries({ queryKey: ["listing", id] })
                      })
                      .catch(() => {
                        toast.error("Failed to update property status")
                      })
                  }}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <span>Created:</span>
                <span>{new Date(listing.createdAt).toLocaleDateString()}</span>
              </div>

              <div className="flex items-center justify-between">
                <span>Last Updated:</span>
                <span>{new Date(listing.updatedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}