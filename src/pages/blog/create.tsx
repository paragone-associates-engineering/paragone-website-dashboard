
import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FormContainer, FormField, FormImageUpload, FormTagsInput } from "@/components/shared/form-container"

const CreateBlog = () => {
  const [formData, setFormData] = useState({
    name: "",
    category: "Villa",
    description: "",
    url: "",
    startDate: "",
    endDate: "",
    scheduleDate: "",
    startTime: "08:00",
    endTime: "10:00",
  })
  const [blogImage, setBlogImage] = useState<string | null>(null)
  const [blogTags, setBlogTags] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      console.log("Form submitted:", {
        ...formData,
        blogImage,
        blogTags,
      })
      setIsSubmitting(false)
      // Reset form or redirect
    }, 1500)
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Create blog</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <FormContainer
            title="Create blog"
            onSubmit={handleSubmit}
            onCancel={() => console.log("Cancelled")}
            submitLabel="Create blog"
            isLoading={isSubmitting}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField label="Blog name" required>
                <Input name="name" value={formData.name} onChange={handleInputChange} placeholder="Enter blog name" />
              </FormField>

              <FormField label="Blog category" required>
                <Select value={formData.category} onValueChange={(value) => handleSelectChange("category", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Villa" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Villa">Villa</SelectItem>
                    <SelectItem value="Apartment">Apartment</SelectItem>
                    <SelectItem value="House">House</SelectItem>
                    <SelectItem value="Land">Land</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>
            </div>

            <FormField label="Description" className="mt-4">
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter descriptions..."
                className="min-h-[100px]"
              />
            </FormField>

            <FormField label="Add URL" className="mt-4">
              <Input
                name="url"
                value={formData.url}
                onChange={handleInputChange}
                placeholder="https://paragonesignature.netlify.app/"
              />
            </FormField>

            <FormTagsInput
              label="Blog tags"
              value={blogTags}
              onChange={setBlogTags}
              suggestions={["Property", "Land", "Sale"]}
              className="mt-4"
            />

            <div className="mt-6">
              <h3 className="text-lg font-medium mb-4">Select time and schedule</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField label="Start date">
                  <div className="relative">
                    <Input
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      placeholder="dd/mm/yyyy"
                      type="date"
                    />
                  </div>
                </FormField>

                <FormField label="End date">
                  <div className="relative">
                    <Input
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleInputChange}
                      placeholder="dd/mm/yyyy"
                      type="date"
                    />
                  </div>
                </FormField>
              </div>

              <FormField label="Blog schedule" className="mt-4">
                <div className="relative">
                  <Input
                    name="scheduleDate"
                    value={formData.scheduleDate}
                    onChange={handleInputChange}
                    placeholder="dd/mm/yyyy"
                    type="date"
                  />
                </div>
              </FormField>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <FormField label="Start time">
                  <div className="relative">
                    <Input name="startTime" value={formData.startTime} onChange={handleInputChange} type="time" />
                  </div>
                </FormField>

                <FormField label="End time">
                  <div className="relative">
                    <Input name="endTime" value={formData.endTime} onChange={handleInputChange} type="time" />
                  </div>
                </FormField>
              </div>
            </div>
          </FormContainer>
        </div>

        <div className="lg:col-span-1">
          <FormImageUpload
            label="Upload or Drag your image here"
            onChange={(file) => setBlogImage(file ? URL.createObjectURL(file) : null)}
            value={blogImage}
          />
        </div>
      </div>
    </div>
  )
}

export default CreateBlog
