import type React from "react"

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { FormContainer, FormField, FormTagsInput } from "@/components/shared/form-container"
import { jobService } from "@/services/job-service"
import type { CreateJobDTO } from "@/types/job"
import RichTextEditor from "@/components/tiptap/rich-text-editor"
import { Loader } from "@/components/ui/loader"

const EditJobPage = ({ isEdit = false }: { isEdit?: boolean }) => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const queryClient = useQueryClient()

  const [formData, setFormData] = useState<CreateJobDTO>({
    title: "",
    department: "",
    location: "",
    description: "",
    duties: "",
    skills: "",
    experience: "",
    education: "",
     url: "",
    applicationStartDate: "", 
    applicationEndDate: "", 
    jobTags: [],
    isActive: true,
  })

  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
 const [jobTags, setJobTags] = useState<string[]>([])

  const { data: jobQuery, isLoading } = useQuery({
    queryKey: ["job", id],
    queryFn: () => jobService.getJob(id!),
    enabled: !!id,
    
  })

 //console.log('jobQuery', jobQuery)
  useEffect(() => {
    if (jobQuery) {
      setFormData({
        title: jobQuery?.title || "",
        department: jobQuery?.department || "",
        location: jobQuery?.location || "",
        description: jobQuery?.description || "",
        duties: jobQuery?.duties || "",
        skills: jobQuery?.skills || "",
        url: jobQuery?.url || "",
        experience: jobQuery?.experience || "",
        education: jobQuery?.education || "",
         applicationStartDate: jobQuery?.applicationStartDate ? jobQuery.applicationStartDate : '',
        applicationEndDate: jobQuery?.applicationEndDate ? jobQuery.applicationEndDate : '',
        jobTags: jobQuery?.jobTags || [],
        isActive: jobQuery.isActive,
      })

    }
  },[jobQuery])

  const updateJobMutation = useMutation({
      mutationFn: (data: CreateJobDTO) => jobService.updateJob(id!, data),
      onSuccess: () => {
        toast.success("Job updated successfully")
        navigate("/career/list")
        queryClient.invalidateQueries({ queryKey: ["jobs"] })
        queryClient.invalidateQueries({ queryKey: ["job", id] })
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onError: (error:any) => {
        console.error("Error updating job:", error)
        toast.error("Failed to update job",{description:error?.response?.data?.message})
        setIsSubmitting(false)
      },
    })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when field is edited
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }
  const handleTagsChange = (tags: string[]) => {
    setJobTags(tags)
    setFormData((prev) => ({ ...prev, jobTags: tags }))
  }

//   const handleSelectChange = (name: string, value: string) => {
//     setFormData((prev) => ({ ...prev, [name]: value }))

//     // Clear error when field is edited
//     if (formErrors[name]) {
//       setFormErrors((prev) => {
//         const newErrors = { ...prev }
//         delete newErrors[name]
//         return newErrors
//       })
//     }
//   }

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, isActive: checked }))
  }

  const validateForm = () => {
    const errors: Record<string, string> = {}

    if (!formData.title.trim()) {
      errors.title = "Job title is required"
    }

    if (!formData.department.trim()) {
      errors.department = "Department is required"
    }

    if (!formData.location.trim()) {
      errors.location = "Location is required"
    }

    if (!formData.description.trim()) {
      errors.description = "Description is required"
    }

    if (!formData.duties.trim()) {
      errors.duties = "Duties are required"
    }

    return errors
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Validate form
    const errors = validateForm()
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      setIsSubmitting(false)
      return
    }

    if (id) {
      updateJobMutation.mutate(formData)
    } 
  }

  const handleCancel = () => {
    navigate("/career")
  }

  if ( isLoading) {
    return <div className="p-6 flex items-center justify-center"><Loader /> <span>Loading job details...</span></div>
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{isEdit ? "Edit Job" : "Add Job"}</h1>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <FormContainer
          title={ "Edit Job" }
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          submitLabel={ "Update Job"}
          isLoading={isSubmitting}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="Job Title" required error={formErrors.title}>
              <Input name="title" value={formData.title} onChange={handleInputChange} placeholder="Enter job title" />
            </FormField>

            <FormField label="Department" required error={formErrors.department}>
              <Input
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                placeholder="Enter department"
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <FormField label="Location" required error={formErrors.location}>
              <Input
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Enter job location"
              />
            </FormField>

            <FormField label="Status">
              <div className="flex items-center space-x-2">
                <Switch checked={formData.isActive} onCheckedChange={handleSwitchChange} />
                <span>{formData.isActive ? "Active" : "Inactive"}</span>
              </div>
            </FormField>
          </div>

          <FormField label="Description" required error={formErrors.description} className="mt-4">
             <RichTextEditor
                          content={formData.description}
                          editable={true}
                          onChange={(htmlContent: string) =>
                            setFormData((prev) => ({ ...prev, description: htmlContent }))
                          }
                          placeholder="Enter job description..."
                        />
            {/* <Textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter job description..."
              className="min-h-[100px]"
            /> */}
          </FormField>

          <FormField label="Duties" required error={formErrors.duties} className="mt-4">
            {/* <Textarea
              name="duties"
              value={formData.duties}
              onChange={handleInputChange}
              placeholder="Enter job duties..."
              className="min-h-[100px]"
            /> */}
             <RichTextEditor
              content={formData.duties}
              editable={true}
              onChange={(htmlContent: string) =>
                setFormData((prev) => ({ ...prev, duties: htmlContent }))
              }
              placeholder="Enter job duties.."
            />
          </FormField>

          <FormField label="Skills" className="mt-4">
           <RichTextEditor
                         content={formData.skills}
                         editable={true}
                         onChange={(htmlContent: string) =>
                           setFormData((prev) => ({ ...prev, skills: htmlContent }))
                         }
                         placeholder="Enter required skills.."
                       />
          </FormField>

          <FormField label="Experience" className="mt-4">
           <RichTextEditor
                         content={formData.experience}
                         editable={true}
                         onChange={(htmlContent: string) =>
                           setFormData((prev) => ({ ...prev, experience: htmlContent }))
                         }
                         placeholder="Enter job experience.."
                       />
          </FormField>

          <FormField label="Education" className="mt-4">
            <Textarea
              name="education"
              value={formData.education}
              onChange={handleInputChange}
              placeholder="Enter education requirements..."
              className="min-h-[100px]"
            />
          </FormField>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <FormField label="Application URL" className="mt-4">
              <Input
                name="url"
                value={formData.url}
                onChange={handleInputChange}
                placeholder="https://example.com/apply"
                type="url"
              />
            </FormField>

            <FormTagsInput
              label="Job Tags"
              value={jobTags}
              onChange={handleTagsChange}
              suggestions={["Marketing", "Intern", "Full-time", "Part-time", "Remote", "On-site"]}
              className="mt-4"
            />

            <FormField label="Application Start Date" error={formErrors.applicationStartDate}>
              <Input
                name="applicationStartDate"
                value={formData.applicationStartDate}
                onChange={handleInputChange}
                type="date"
                //min={today)}
              />
            </FormField>

            <FormField label="Application End Date" error={formErrors.applicationEndDate}>
              <Input
                name="applicationEndDate"
                value={formData.applicationEndDate}
                onChange={handleInputChange}
                type="date"
                min={formData.applicationStartDate || ""}
              />
            </FormField>
          </div>
        </FormContainer>
      </div>
    </div>
  )
}

export default EditJobPage
