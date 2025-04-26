
import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FormContainer, FormField, FormImageUpload, FormTagsInput } from "@/components/shared/form-container"

const AddJobPage = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    responsibilities: "",
    qualifications: "",
    applicationStartDate: "",
    applicationEndDate: "",
    url: "",
  })
  const [jobImage, setJobImage] = useState<string | null>(null)
  const [jobTags, setJobTags] = useState<string[]>([])
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
        jobImage,
        jobTags,
      })
      setIsSubmitting(false)
      // Reset form or redirect
    }, 1500)
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Add job</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <FormContainer
            title="Add job"
            onSubmit={handleSubmit}
            onCancel={() => console.log("Cancelled")}
            submitLabel="Create job"
            isLoading={isSubmitting}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField label="Job title" required>
                <Input name="title" value={formData.title} onChange={handleInputChange} placeholder="Enter job title" />
              </FormField>

              <FormField label="Employee type" required>
                <Select onValueChange={(value) => handleSelectChange("employeeType", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Full time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-time">Full time</SelectItem>
                    <SelectItem value="part-time">Part time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="internship">Internship</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>
            </div>

            <FormField label="Job description" className="mt-4">
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Job descriptions..."
                className="min-h-[100px]"
              />
            </FormField>

            <FormField label="Job responsibilities" className="mt-4">
              <Textarea
                name="responsibilities"
                value={formData.responsibilities}
                onChange={handleInputChange}
                placeholder="Job responsibilities..."
                className="min-h-[100px]"
              />
            </FormField>

            <FormField label="Job qualifications" className="mt-4">
              <Textarea
                name="qualifications"
                value={formData.qualifications}
                onChange={handleInputChange}
                placeholder="Job qualifications..."
                className="min-h-[100px]"
              />
            </FormField>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <FormField label="Application start date">
                <div className="relative">
                  <Input
                    name="applicationStartDate"
                    value={formData.applicationStartDate}
                    onChange={handleInputChange}
                    placeholder="dd/mm/yyyy"
                    type="date"
                  />
                </div>
              </FormField>

              <FormField label="Application end date">
                <div className="relative">
                  <Input
                    name="applicationEndDate"
                    value={formData.applicationEndDate}
                    onChange={handleInputChange}
                    placeholder="dd/mm/yyyy"
                    type="date"
                  />
                </div>
              </FormField>
            </div>

            <FormField label="Add URL" className="mt-4">
              <Input
                name="url"
                value={formData.url}
                onChange={handleInputChange}
                placeholder="https://paragonesignature.netlify.app/"
              />
            </FormField>

            <FormTagsInput
              label="Job tags"
              value={jobTags}
              onChange={setJobTags}
              suggestions={["Marketing", "Sales", "IT"]}
              className="mt-4"
            />
          </FormContainer>
        </div>

        <div className="lg:col-span-1">
          <FormImageUpload
            label="Upload or Drag your image here"
            onChange={(file) => setJobImage(file ? URL.createObjectURL(file) : null)}
            value={jobImage}
          />
        </div>
      </div>
    </div>
  )
}

export default AddJobPage;
