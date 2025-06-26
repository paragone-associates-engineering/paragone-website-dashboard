
import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { ResourceForm } from "@/components/resources/resource-form"
import { resourceService } from "@/services/resource-service"
import { toast } from "sonner"
import type { CreateResourceRequestDTO } from "@/types/resource"

const AddResourcePage = () => {
  const navigate = useNavigate()

  const createResourceMutation = useMutation({
    mutationFn: resourceService.createResource,
    onSuccess: () => {
      toast.success("Resource created successfully")
      navigate("/resources/list")
    },
    onError: (error) => {
      console.error("Error creating resource:", error)
      toast.error("Failed to create resource")
    },
  })

  const handleSubmit = (data: CreateResourceRequestDTO) => {
    createResourceMutation.mutate(data)
  }

  const handleCancel = () => {
    navigate("/resources/list")
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Add New Resource</h1>
        <p className="text-gray-600">Create a new resource for your platform</p>
      </div>

      <ResourceForm onSubmit={handleSubmit} onCancel={handleCancel} isLoading={createResourceMutation.isPending} />
    </div>
  )
}

export default AddResourcePage
