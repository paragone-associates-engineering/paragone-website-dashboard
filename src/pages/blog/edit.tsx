
import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { FormContainer, FormField, FormImageUpload } from "@/components/shared/form-container"
import { LexicalEditor } from "@/components/shared/rich-text-editor"
import { blogService } from "@/services/blog-service"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

const BlogEditPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
 const [formData, setFormData] = useState({
    title: '',
    category: "Villa",
    content: "",
    header: "",
    datePosted: "",
    isActive: true,
  })
  const [blogImage, setBlogImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, boolean>>({})

  // Fetch blog post
  const { data: blogPost, isLoading } = useQuery({
    queryKey: ["blog", id],
    queryFn: () => blogService.getPost(id!),
    enabled: !!id,
   
  })

    useEffect(() => {
    if (blogPost) {
      setFormData({
        title: blogPost?.title || "",
        category: blogPost?.category || "Villa",
        content: blogPost?.content || "",
        header: blogPost?.header || "",
        datePosted: new Date(blogPost.datePosted).toISOString().split("T")[0],
        isActive: blogPost.isActive,
      })

      // Set image preview if available
      if (blogPost.images && blogPost.images.length > 0) {
        setImagePreview(blogPost.images[0])
      }
    }
  },[blogPost])

  
  
 
  const updateBlogMutation = useMutation({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutationFn: (data: any) => {
      const blogData = {
        title: data.title,
        content: data.content,
        header: data.header,
        datePosted: data.datePosted,
        isActive: data.isActive,
        images: blogImage ? [blogImage] : [],
      }
      return blogService.updatePost(id!, blogData)
    },
    onSuccess: () => {
      toast.success("Blog post updated successfully")
      queryClient.invalidateQueries({ queryKey: ["blogs"] })
      queryClient.invalidateQueries({ queryKey: ["blog", id] })
      navigate("/blog/list")
    },
    onError: (error) => {
      console.error("Error updating blog post:", error)
      toast.error("Failed to update blog post",{description:error.message})
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

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: false }))
  }

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, isActive: checked }))
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

    updateBlogMutation.mutate(formData)
  }

  const handleCancel = () => {
    navigate("/blog/list")
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading blog post...</span>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Edit Blog Post</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <FormContainer
            title="Edit Blog Post"
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            submitLabel="Update Blog"
            isLoading={updateBlogMutation.isPending}
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

              <FormField label="Blog category">
                <Select value={formData.category} onValueChange={(value) => handleSelectChange("category", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
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
               key={formData.content ? "editor-loaded" : "editor-initial"}
                value={formData.content}
                onChange={handleContentChange}
                placeholder="Write your blog content here..."
                error={errors.content}
                minHeight="200px"
              />
            </FormField>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <FormField label="Publication Date" required>
                <Input name="datePosted" value={formData.datePosted} onChange={handleInputChange} type="date" />
              </FormField>

              <FormField label="Status">
                <div className="flex items-center space-x-2">
                  <Switch checked={formData.isActive} onCheckedChange={handleSwitchChange} />
                  <span>{formData.isActive ? "Active" : "Inactive"}</span>
                </div>
              </FormField>

            </div>
          </FormContainer>
        </div>

        <div className="lg:col-span-1">
          <FormImageUpload
            label="Upload or Drag your image here"
            onChange={(file) => {
              setBlogImage(file)
              if (file) {
                setImagePreview(URL.createObjectURL(file))
              }
            }}
            value={imagePreview}
          />
          {imagePreview && !blogImage && (
            <p className="text-sm text-gray-500 mt-2 text-center">
              Current image shown. Upload a new one to replace it.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default BlogEditPage
