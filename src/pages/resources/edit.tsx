
import { useMutation, useQuery } from "@tanstack/react-query"
import { useNavigate, useParams } from "react-router-dom"
import { ResourceForm } from "@/components/resources/resource-form"
import { resourceService } from "@/services/resource-service"
import { toast } from "sonner"
import type { CreateResourceRequestDTO } from "@/types/resource"
import { Loader } from "@/components/ui/loader"

const EditResourcePage = () => {
  const navigate = useNavigate()
  const { resourceId } = useParams<{ resourceId: string }>()

  const resourceQuery = useQuery({
    queryKey: ["resource", resourceId],
    queryFn: () => resourceService.getResource(resourceId!),
    enabled: !!resourceId,
  })

  const updateResourceMutation = useMutation({
    mutationFn: (data: CreateResourceRequestDTO) => resourceService.updateResource(resourceId!, data),
    onSuccess: () => {
      toast.success("Resource updated successfully")
      navigate("/resources/list")
    },
    onError: (error) => {
      console.error("Error updating resource:", error)
      toast.error("Failed to update resource")
    },
  })

  const handleSubmit = (data: CreateResourceRequestDTO) => {
    updateResourceMutation.mutate(data)
  }

  const handleCancel = () => {
    navigate("/resources/list")
  }

  if (resourceQuery.isLoading) {
    return (
      <div className="p-6">
        <Loader/>
      </div>
    )
  }

  if (resourceQuery.isError || !resourceQuery.data) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
          Error loading resource. Please try again later.
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Edit Resource</h1>
        <p className="text-gray-600">Update resource information</p>
      </div>

      <ResourceForm
        initialData={resourceQuery.data}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={updateResourceMutation.isPending}
      />
    </div>
  )
}

export default EditResourcePage
