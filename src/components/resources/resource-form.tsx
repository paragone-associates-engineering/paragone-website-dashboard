
import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Upload, X } from "lucide-react"
import type { Resource, CreateResourceRequestDTO } from "@/types/resource"
import RichTextEditor from "../tiptap/rich-text-editor"
import { FormField } from "../shared/form-container"

interface ResourceFormProps {
  initialData?: Resource
  onSubmit: (data: CreateResourceRequestDTO) => void
  onCancel: () => void
  isLoading: boolean
}

export const ResourceForm = ({ initialData, onSubmit, onCancel, isLoading }: ResourceFormProps) => {
  const [formData, setFormData] = useState<CreateResourceRequestDTO>({
    id: "",
    title: "",
    summary: "",
    link: "",
    isPaid: false,
    isActive: true,
    price: undefined,
    image: [],
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  useEffect(() => {
    if (initialData) {
      setFormData({
        id: initialData.id || "",
        title: initialData.title,
        summary: initialData.summary,
        link: initialData.link,
        isPaid: initialData.isPaid,
        isActive: initialData.isActive ?? true,
        price: initialData.price,
        image: [],
      })

      if (initialData.image) {
        setImagePreview(initialData.image)
      }
    }
  }, [initialData])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      isPaid: checked,
      price: checked ? { amount: 0, currency: "NGN" } : undefined,
    }))
  }

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const amount = Number(e.target.value)
    setFormData((prev) => ({
      ...prev,
      price: prev.price ? { ...prev.price, amount } : { amount, currency: "NGN" },
    }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      const file = files[0]
      setFormData((prev) => ({ ...prev, image: [file] }))

      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setFormData((prev) => ({ ...prev, image: [] }))
    setImagePreview(null)
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = "Title is required"
    }

    if (!formData.summary.trim()) {
      newErrors.summary = "Summary is required"
    }

    if (!formData.link.trim()) {
      newErrors.link = "Link is required"
    } else {
      try {
        new URL(formData.link)
      } catch {
        newErrors.link = "Please enter a valid URL"
      }
    }

    if (formData.isPaid && (!formData.price || formData.price.amount <= 0)) {
      newErrors.price = "Price is required for paid resources"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(formData)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>{initialData ? "Edit Resource" : "Create New Resource"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <FormField label="Title" required>
                            <Input
                              name="title"
                              value={formData.title}
                              onChange={handleInputChange}
                              placeholder="Enter resource title"
                              className={errors.title ? "border-red-500" : ""}
                            />
                            {errors.title && <p className="text-sm text-red-500 mt-1">Title is required</p>}
                          </FormField>
          </div>

          <div className="space-y-2">
            <FormField  label="Summary" required className="mt-4">
                          <RichTextEditor
                        content={formData.summary}
                        onChange={(htmlContent: string) =>
                          setFormData((prev) => ({ ...prev, summary: htmlContent }))
                        }
                        editable={true}
                        placeholder="Enter resource summary"
                      />
                        </FormField>
            {/* <Label htmlFor="summary">Summary *</Label>
            <Textarea
              id="summary"
              name="summary"
              value={formData.summary}
              onChange={handleInputChange}
              placeholder="Enter resource summary"
              rows={4}
            /> */}
            {errors.summary && <p className="text-sm text-red-600">{errors.summary}</p>}
          </div>

          <div className="space-y-2">
             <FormField label="Resource Link" required>
                            <Input
                             name="link"
                              value={formData.link}
                              onChange={handleInputChange}
                              placeholder="https://example.com/resource"
                            />
                             {errors.link && <p className="text-sm text-red-600">{errors.link}</p>}
                          </FormField>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch id="isPaid" checked={formData.isPaid} onCheckedChange={handleSwitchChange} />
              <Label htmlFor="isPaid">This is a paid resource</Label>
            </div>

            {formData.isPaid && (
              <div className="space-y-2">
                  <FormField label="Price (₦)" required>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price?.amount || ""}
                  onChange={handlePriceChange}
                  placeholder="0.00"
                />
                {errors.price && <p className="text-sm text-red-600">{errors.price}</p>}
                </FormField>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label>Resource Image <span className="text-red-500">*</span></Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview || "/placeholder.svg"}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={removeImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4">
                    <label htmlFor="image" className="cursor-pointer">
                      <span className="mt-2 block text-sm font-medium text-gray-900">Upload an image</span>
                      <input id="image" type="file" className="sr-only" accept="image/*" onChange={handleImageChange} />
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? "Saving..." : initialData ? "Update Resource" : "Create Resource"}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}
