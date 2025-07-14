import type React from "react"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Eye, Edit, Trash2, ExternalLink, Download } from "lucide-react"
import { resourceService } from "@/services/resource-service"
import { DeleteConfirmationModal } from "@/components/resources/delete-confirmation"
import { ViewResourceModal } from "@/components/resources/view-resource"
import { toast } from "sonner"
import { formatCurrency } from "@/lib/utils"
import { format } from "date-fns"
import type { Resource } from "@/types/resource"
import { Loader } from "@/components/ui/loader"

const ResourcesPage = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null)
  const [isExporting, setIsExporting] = useState(false)

  const resourcesPerPage = 12

  const resourcesQuery = useQuery({
    queryKey: ["resources", searchQuery, currentPage],
    queryFn: () =>
      resourceService.getResources({
        page: currentPage,
        limit: resourcesPerPage,
        searchString: searchQuery || undefined,
      }),
  })

  const deleteResourceMutation = useMutation({
    mutationFn: resourceService.deleteResource,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resources"] })
      toast.success("Resource deleted successfully")
      setDeleteModalOpen(false)
      setSelectedResource(null)
    },
    onError: (error) => {
      console.error("Error deleting resource:", error)
      toast.error("Failed to delete resource")
    },
  })

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
  }

  const handleView = (resource: Resource) => {
    setSelectedResource(resource)
    setViewModalOpen(true)
  }

  const handleEdit = (resource: Resource) => {
    navigate(`/resources/edit/${resource.id}`)
  }

  const handleDelete = (resource: Resource) => {
    setSelectedResource(resource)
    setDeleteModalOpen(true)
  }

  const confirmDelete = () => {
    if (selectedResource) {
      deleteResourceMutation.mutate(selectedResource.id)
    }
  }

  const stripHtml = (html: string) => {
    const tmp = document.createElement("DIV")
    tmp.innerHTML = html
    return tmp.textContent || tmp.innerText || ""
  }

  const handleExportCSV = async () => {
    setIsExporting(true)
    try {

      const allResources = await resourceService.getResources({
        page: 1,
        limit: 1000, 
        searchString: searchQuery || undefined,
      })

      const resources = allResources.results || []
      
     
      const csvHeaders = [
        "Title",
        "Summary",
        "Type",
        "Price",
        "Currency",
        "Link",
        "Status",
        "Created Date",
        "Resource ID"
      ]

      const csvRows = resources.map(resource => [
        resource.title,
        stripHtml(resource.summary || ""),
        resource.isPaid ? "Paid" : "Free",
        resource.isPaid ? (resource.price?.amount || 0).toString() : "0",
        resource.isPaid ? (resource.price?.currency || "NGN") : "NGN",
        resource.link || "",
        resource.isActive ? "Active" : "Inactive",
        format(new Date(resource.createdAt), "yyyy-MM-dd"),
        resource.id
      ])

      const csvContent = [
        csvHeaders.join(","),
        ...csvRows.map(row => row.map(field => `"${field}"`).join(","))
      ].join("\n")

      
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
      const link = document.createElement("a")
      const url = URL.createObjectURL(blob)
      
      link.setAttribute("href", url)
      link.setAttribute("download", `resources-${format(new Date(), "yyyy-MM-dd")}.csv`)
      link.style.visibility = "hidden"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      toast.success("Resources exported successfully")
    } catch (error) {
      console.error("Error exporting resources:", error)
      toast.error("Failed to export resources")
    } finally {
      setIsExporting(false)
    }
  }

  if (resourcesQuery.isLoading) {
    return (
      <div className="p-6">
         <Loader />
      </div>
    )
  }

  if (resourcesQuery.isError) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
          Error loading resources. Please try again later.
        </div>
      </div>
    )
  }

  const resources = resourcesQuery.data?.results || []
  const totalPages = resourcesQuery.data?.metadata[0]?.totalPages || 1
  const totalResources = resourcesQuery.data?.metadata[0]?.total || 0

  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Resources</h1>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={handleExportCSV}
            disabled={isExporting || totalResources === 0}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            {isExporting ? "Exporting..." : "Export CSV"}
          </Button>
          <Button onClick={() => navigate("/resources/add")}>
            <Plus className="h-4 w-4 mr-2" />
            Add Resource
          </Button>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search resources..."
            className="pl-10 pr-4 py-2 w-64"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>
        <div className="text-sm text-gray-500">
          {totalResources} resource{totalResources !== 1 ? "s" : ""} found
        </div>
      </div>

      {resources.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No resources found.</p>
          <Button onClick={() => navigate("/resources/add")}>
            <Plus className="h-4 w-4 mr-2" />
            Create your first resource
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-6 mb-6">
            {resources.map((resource) => (
              <Card key={resource.id} className="overflow-hidden pt-0 pb-2">
                <CardHeader className="p-0">
                  <div className="aspect-video bg-gray-200 relative">
                    {resource.image ? (
                      <img
                        src={resource.image || "/placeholder.svg"}
                        alt={resource.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                    )}
                    <div className="absolute top-2 right-2">
                      <Badge variant={resource.isActive ? "default" : "secondary"}>
                        {resource.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="py-0">
                  <CardTitle className="text-lg mb-2 line-clamp-2">{resource.title}</CardTitle>
                  <p
                    className="text-sm text-gray-600 mb-3 line-clamp-2"
                    dangerouslySetInnerHTML={{ __html: resource.summary }}
                  />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {resource.isPaid ? (
                        <Badge variant="outline" className="text-green-600">
                          ₦{formatCurrency(resource.price?.amount || 0)}
                        </Badge>
                      ) : (
                        <Badge variant="outline">Free</Badge>
                      )}
                    </div>
                    {resource.link && (
                      <Button variant="ghost" size="sm" onClick={() => window.open(resource.link, "_blank")}>
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0 flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleView(resource)}>
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleEdit(resource)}>
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(resource)}
                    className="text-red-600 hover:bg-red-600 hover:text-white"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center gap-2">
              <Button
                variant="outline"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="flex items-center px-4">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}

      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false)
          setSelectedResource(null)
        }}
        onConfirm={confirmDelete}
        title="Delete Resource"
        description={`Are you sure you want to delete "${selectedResource?.title}"? This action cannot be undone.`}
        isLoading={deleteResourceMutation.isPending}
      />

      <ViewResourceModal
        isOpen={viewModalOpen}
        onClose={() => {
          setViewModalOpen(false)
          setSelectedResource(null)
        }}
        resource={selectedResource}
      />
    </div>
  )
}

export default ResourcesPage