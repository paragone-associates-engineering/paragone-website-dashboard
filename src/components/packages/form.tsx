import type React from "react"
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FormContainer, FormField } from "@/components/shared/form-container"
import { X, Plus } from "lucide-react"
import type { Package, PackageDetail, CreatePackageDTO } from "@/types/package"

interface PackageFormProps {
  initialData?: Package
  onSubmit: (data: CreatePackageDTO) => void
  onCancel: () => void
  isLoading: boolean
}

export const PackageForm = ({ initialData, onSubmit, onCancel, isLoading }: PackageFormProps) => {
  const [formData, setFormData] = useState<CreatePackageDTO>({
    id: "",
    name: "",
    level: "starter",
    price: 0,
    duration: "",
    details: [{ title: "" }],
    archived: false,
    isActive: true,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (initialData) {
      setFormData({
        id: initialData.id,
        name: initialData.name,
        level: initialData.level,
        price: initialData.price,
        duration: initialData.duration,
        details: initialData.details.map((detail) => ({
          title: detail.title,
          amount: detail.amount,
        })),
        archived: initialData.archived,
        isActive: initialData.isActive,
      })
    }
  }, [initialData])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: name === "price" ? Number(value) : value }))

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleDetailChange = (index: number, field: keyof PackageDetail, value: string | number) => {
    setFormData((prev) => {
      const newDetails = [...prev.details]
      newDetails[index] = {
        ...newDetails[index],
        [field]: field === "amount" ? Number(value) : value,
      }
      return { ...prev, details: newDetails }
    })
  }

  const addDetail = () => {
    setFormData((prev) => ({
      ...prev,
      details: [...prev.details, { title: "" }],
    }))
  }

  const removeDetail = (index: number) => {
    setFormData((prev) => {
      const newDetails = [...prev.details]
      newDetails.splice(index, 1)
      return { ...prev, details: newDetails.length ? newDetails : [{ title: "" }] }
    })
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Package name is required"
    }

    if (!formData.level.trim()) {
      newErrors.level = "Package level is required"
    }

    if (!formData.price || formData.price <= 0) {
      newErrors.price = "Valid price is required"
    }

    if (!formData.duration.trim()) {
      newErrors.duration = "Duration is required"
    }

    formData.details.forEach((detail, index) => {
      if (!detail.title.trim()) {
        newErrors[`detail_${index}`] = "Detail title is required"
      }
    })

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
    <FormContainer
      title={initialData ? "Edit Package" : "Create Package"}
      onSubmit={handleSubmit}
      onCancel={onCancel}
      submitLabel={initialData ? "Update Package" : "Create Package"}
      isLoading={isLoading}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField label="Package Name" required error={errors.name}>
          <Input name="name" value={formData.name} onChange={handleInputChange} placeholder="Enter package name" />
        </FormField>

        <FormField label="Package Level" required error={errors.level}>
          <Select 
            value={formData.level || ""} 
            onValueChange={(value) => handleSelectChange("level", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="starter">Starter</SelectItem>
              <SelectItem value="professional">Professional</SelectItem>
              <SelectItem value="commercial">Commercial</SelectItem>
              <SelectItem value="large">Large</SelectItem>
            </SelectContent>
          </Select>
        </FormField>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        <FormField label="Price (₦)" required error={errors.price}>
          <Input
            name="price"
            type="number"
            value={formData.price || ""}
            onChange={handleInputChange}
            placeholder="Enter price"
          />
        </FormField>

        <FormField label="Duration" required error={errors.duration}>
          <Input
            name="duration"
            value={formData.duration}
            onChange={handleInputChange}
            placeholder="e.g. 1 month, 3 months, 1 year"
          />
        </FormField>
      </div>

      <div className="mt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Package Details</h3>
          <Button type="button" variant="outline" size="sm" onClick={addDetail}>
            <Plus className="h-4 w-4 mr-1" /> Add Detail
          </Button>
        </div>

        {formData.details.map((detail, index) => (
          <div key={index} className="grid grid-cols-12 gap-4 mb-4">
            <div className="col-span-7">
              <FormField label="Title" required error={errors[`detail_${index}`]}>
                <Input
                  value={detail.title}
                  onChange={(e) => handleDetailChange(index, "title", e.target.value)}
                  placeholder="e.g. Property Listing"
                />
              </FormField>
            </div>

            <div className="col-span-4">
              <FormField label="Amount (optional)">
                <Input
                  type="number"
                  value={detail.amount || ""}
                  onChange={(e) => handleDetailChange(index, "amount", e.target.value)}
                  placeholder="e.g. 5"
                />
              </FormField>
            </div>

            <div className="col-span-1 flex items-end pb-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeDetail(index)}
                disabled={formData.details.length === 1}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </FormContainer>
  )
}