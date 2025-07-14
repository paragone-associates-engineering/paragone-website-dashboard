import type React from "react"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Trash2, Mail, Phone, Download } from "lucide-react"
import { resourceService } from "@/services/resource-service"
import { DeleteConfirmationModal } from "@/components/resources/delete-confirmation"
import { toast } from "sonner"
import { format } from "date-fns"
import type { ResourceApplication } from "@/types/resource"
import { Loader } from "@/components/ui/loader"

const ResourceApplicationsPage = () => {
  const queryClient = useQueryClient()
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedApplication, setSelectedApplication] = useState<ResourceApplication | null>(null)
  const [isExporting, setIsExporting] = useState(false)

  const applicationsPerPage = 10

  const applicationsQuery = useQuery({
    queryKey: ["resource-applications", searchQuery, currentPage],
    queryFn: () =>
      resourceService.getResourceApplications({
        page: currentPage,
        limit: applicationsPerPage,
        searchString: searchQuery || undefined,
      }),
  })

  const deleteApplicationMutation = useMutation({
    mutationFn: resourceService.deleteApplication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resource-applications"] })
      toast.success("Application deleted successfully")
      setDeleteModalOpen(false)
      setSelectedApplication(null)
    },
    onError: (error) => {
      console.error("Error deleting application:", error)
      toast.error("Failed to delete application")
    },
  })

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
  }

  const handleDelete = (application: ResourceApplication) => {
    setSelectedApplication(application)
    setDeleteModalOpen(true)
  }

  const confirmDelete = () => {
    if (selectedApplication) {
      deleteApplicationMutation.mutate(selectedApplication.id)
    }
  }

  const handleExportCSV = async () => {
    setIsExporting(true)
    try {
     
      const allApplications = await resourceService.getResourceApplications({
        page: 1,
        limit: 1000, 
        searchString: searchQuery || undefined,
      })

      const applications = allApplications.results || []
      
      
      const csvHeaders = [
        "Applicant Name",
        "Email",
        "Phone Number",
        "Resource Title",
        "Message",
        "Applied Date",
        "Status",
        "Application ID"
      ]

      const csvRows = applications.map(app => [
        `${app.applicantName.first} ${app.applicantName.lastName}`,
        app.email,
        app.phoneNumber,
        app.resourceTitle,
        app.message || "",
        format(new Date(app.createdAt), "yyyy-MM-dd"),
        app.isActive ? "Active" : "Deleted",
        app.id
      ])

      const csvContent = [
        csvHeaders.join(","),
        ...csvRows.map(row => row.map(field => `"${field}"`).join(","))
      ].join("\n")

      // Create and download the file
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
      const link = document.createElement("a")
      const url = URL.createObjectURL(blob)
      
      link.setAttribute("href", url)
      link.setAttribute("download", `resource-applications-${format(new Date(), "yyyy-MM-dd")}.csv`)
      link.style.visibility = "hidden"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      toast.success("Applications exported successfully")
    } catch (error) {
      console.error("Error exporting applications:", error)
      toast.error("Failed to export applications")
    } finally {
      setIsExporting(false)
    }
  }

  if (applicationsQuery.isLoading) {
    return (
      <div className="p-6">
       <Loader />
      </div>
    )
  }

  if (applicationsQuery.isError) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
          Error loading applications. Please try again later.
        </div>
      </div>
    )
  }

  const applications = applicationsQuery.data?.results || []
  const totalPages = applicationsQuery.data?.metadata[0]?.totalPages || 1
  const totalApplications = applicationsQuery.data?.metadata[0]?.total || 0

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Resource Applications</h1>
        <p className="text-gray-600">Manage resource applications from users</p>
      </div>

      <div className="flex justify-between items-center mb-6">
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search applications..."
            className="pl-10 pr-4 py-2 w-64"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={handleExportCSV}
            disabled={isExporting || totalApplications === 0}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            {isExporting ? "Exporting..." : "Export CSV"}
          </Button>
          <div className="text-sm text-gray-500">
            {totalApplications} application{totalApplications !== 1 ? "s" : ""} found
          </div>
        </div>
      </div>

      {applications.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No applications found.</p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Applicant
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Resource
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Applied Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {applications.map((application) => (
                    <tr key={application.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{application.applicantName.first} {application.applicantName.lastName}</div>
                          {application.message && (
                            <div className="text-sm text-gray-500 max-w-xs truncate">{application.message}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{application.resourceTitle.slice(0,40) + '...'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center text-sm text-gray-600">
                            <Mail className="h-4 w-4 mr-1" />
                            {application.email}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Phone className="h-4 w-4 mr-1" />
                            {application.phoneNumber}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {format(new Date(application.createdAt), "MMM d, yyyy")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant={application.isActive ? "default" : "secondary"}>
                          {application.isActive ? "Active" : "Deleted"}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(application)}
                          className="text-red-600 hover:bg-red-500 hover:text-white"
                          disabled={!application.isActive}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
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
          setSelectedApplication(null)
        }}
        onConfirm={confirmDelete}
        title="Delete Application"
        description={`Are you sure you want to delete the application from "${selectedApplication?.applicantName.first} ${selectedApplication?.applicantName.lastName}"? This action cannot be undone.`}
        isLoading={deleteApplicationMutation.isPending}
      />
    </div>
  )
}

export default ResourceApplicationsPage