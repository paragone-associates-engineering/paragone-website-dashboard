import type React from "react"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Input } from "@/components/ui/input"
//import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FormContainer, FormField, FormImageUpload, FormTagsInput } from "@/components/shared/form-container"
import { LexicalEditor } from "@/components/shared/rich-text-editor"
import { blogService } from "@/services/blog-service"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

const CreateBlog = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [formData, setFormData] = useState({
    title: "",
    category: "Villa",
    content: "",
    header: "",
    url: "",
    startDate: "",
    endDate: "",
    scheduleDate: "",
    startTime: "08:00",
    endTime: "10:00",
    isActive: true,
  })

  const [blogImage, setBlogImage] = useState<File | null>(null)
  const [blogTags, setBlogTags] = useState<string[]>([])
  const [errors, setErrors] = useState<Record<string, boolean>>({})

  const createBlogMutation = useMutation({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutationFn: (data: any) => {
      const blogData = {
        title: data.title,
        content: data.content,
        header: data.header,
        datePosted: data.scheduleDate || new Date().toISOString().split("T")[0],
        isActive: data.isActive,
        images: blogImage ? [blogImage] : [],
      }
      return blogService.createPost(blogData)
    },
    onSuccess: () => {
      toast.success("Blog post created successfully")
      queryClient.invalidateQueries({ queryKey: ["blogs"] })
      navigate("/blog/list")
    },
    onError: (error) => {
      console.error("Error creating blog post:", error)
      toast.error("Failed to create blog post")
    },
  })

  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: false }))
  }

  const handleContentChange = (content: string) => {
    setFormData((prev) => ({ ...prev, content }))
    setErrors((prev) => ({ ...prev, content: false }))
  }


  const validateForm = () => {
    const newErrors: Record<string, boolean> = {}
    let isValid = true

    if (!formData.title.trim()) {
      newErrors.title = true
      isValid = false
    }

    if (!formData.header.trim()) {
      newErrors.header = true
      isValid = false
    }

    // For Lexical editor, we need to check if the content is empty
    if (!formData.content || formData.content === "{}") {
      newErrors.content = true
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (!validateForm()) {
      toast.error("Please fill in all required fields")
      return
    }

    createBlogMutation.mutate(formData)
  }

  const handleCancel = () => {
    navigate("/blog/list")
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
            onCancel={handleCancel}
            submitLabel="Create blog"
            isLoading={createBlogMutation.isPending}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField label="Blog title" required>
                <Input
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter blog title"
                  className={errors.title ? "border-red-500" : ""}
                />
                {errors.title && <p className="text-sm text-red-500 mt-1">Title is required</p>}
              </FormField>

              <FormField label="Blog category" required>
                <Input
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  placeholder="Enter blog category"
                  className={errors.title ? "border-red-500" : ""}
                />
              </FormField>
            </div>

            <FormField label="Header" required className="mt-4">
              <Input
                name="header"
                value={formData.header}
                onChange={handleInputChange}
                placeholder="Enter blog header"
                className={errors.header ? "border-red-500" : ""}
              />
              {errors.header && <p className="text-sm text-red-500 mt-1">Header is required</p>}
            </FormField>

            <FormField label="Content" required className="mt-4">
              <LexicalEditor
                value={formData.content}
                onChange={handleContentChange}
                placeholder="Write your blog content here..."
                error={errors.content}
                minHeight="200px"
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
            onChange={(file) => setBlogImage(file)}
            value={blogImage ? URL.createObjectURL(blogImage) : null}
          />
        </div>
      </div>
    </div>
  )
}

export default CreateBlog
