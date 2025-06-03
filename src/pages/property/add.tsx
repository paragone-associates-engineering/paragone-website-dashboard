import type React from "react"
import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Upload, X } from "lucide-react"
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
} from "@/services/listings-service"

const propertyTypes = ["Bungalow", "Apartment", "Duplex", "Villa", "Penthouse", "Mansion", "Studio", "Townhouse"]

export default function AddPropertyPage() {
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

  const createListingMutation = useMutation({
    mutationFn: (data: ListingFormData) => listingsService.createListing(data),
    onSuccess: () => {
      toast.success("Property listing created successfully")
      queryClient.invalidateQueries({ queryKey: ["listings"] })
      resetForm()
    },
    onError: () => {
      toast.error("Failed to create property listing")
    },
  })

  const resetForm = () => {
    setFormData({
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
    setImageFiles([])
    setImagePreviews([])
  }

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
    setImageFiles((prev) => prev.filter((_, i) => i !== index))
    setImagePreviews((prev) => {
      const newPreviews = prev.filter((_, i) => i !== index)
      // Revoke the URL to prevent memory leaks
      URL.revokeObjectURL(prev[index])
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

    createListingMutation.mutate(submissionData)
  }

  return (
    <div className="p-6 max-w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Add Property</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <FormContainer
            title="Add Property"
            onSubmit={handleSubmit}
            onCancel={resetForm}
            submitLabel="Create Listing"
            isLoading={createListingMutation.isPending}
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

                <FormField label="Property Type" required>
                  <Select
                    value={formData.propertyType}
                    onValueChange={(value) => handleSelectChange("propertyType", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select property type" />
                    </SelectTrigger>
                    <SelectContent>
                      {propertyTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>
              </FormRow>

              <FormRow className="mt-4">
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
                      <SelectItem value={PropertyCategory.INDUSTRIAL}>Industrial</SelectItem>
                      <SelectItem value={PropertyCategory.LAND}>Land</SelectItem>
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
        </div>
      </div>
    </div>
  )
}
