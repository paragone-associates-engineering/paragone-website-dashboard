import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Trash2, Users, Download } from "lucide-react"
import { eventService } from "@/services/event-service"
import { toast } from "sonner"
import { format } from "date-fns"
import type { EventApplication } from "@/types/event"
import { DeleteConfirmationModal } from "@/components/event/delete-confirmation"

const EventApplicationsPage = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [deletingApplication, setDeletingApplication] = useState<EventApplication | null>(null)
  const [isExporting, setIsExporting] = useState(false)

  const queryClient = useQueryClient()

  const applicationsQuery = useQuery({
    queryKey: ["event-applications", searchQuery, currentPage],
    queryFn: () =>
      eventService.getEventApplications({
        page: currentPage,
        limit: 10,
        searchString: searchQuery || undefined,
      }),
  })

  
  const allApplicationsQuery = useQuery({
    queryKey: ["all-event-applications", searchQuery],
    queryFn: () =>
      eventService.getEventApplications({
        page: 1,
        limit: 1000, 
        searchString: searchQuery || undefined,
      }),
    enabled: false, 
  })

  
  const deleteApplicationMutation = useMutation({
    mutationFn: eventService.deleteApplication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["event-applications"] })
      toast.success("Application deleted successfully")
      setDeletingApplication(null)
    },
    onError: () => {
      toast.error("Failed to delete application")
    },
  })

  const handleDeleteApplication = (application: EventApplication) => {
    setDeletingApplication(application)
  }

  const confirmDelete = () => {
    if (deletingApplication) {
      deleteApplicationMutation.mutate(deletingApplication.id)
    }
  }

  const getEventTypeBadge = (type: string) => {
    const typeColors = {
      inPerson: "bg-blue-100 text-blue-800 capitalize",
      virtual: "bg-purple-100 text-purple-800 capitalize",
      hybrid: "bg-orange-100 text-orange-800 capitalize",
    }

    return (
      <Badge className={typeColors[type as keyof typeof typeColors] || "bg-gray-100  text-gray-800"}>
        {type === "inPerson" ? "In Person" : type}
      </Badge>
    )
  }

  
  const convertToCSV = (applications: EventApplication[]) => {
    const headers = [
      "First Name",
      "Last Name",
      "Email",
      "Phone Number",
      "Event Title",
      "Event Type",
      "Application Date",
      "Status"
    ]

    const csvData = applications.map(app => [
      app.applicantName?.first || "",
      app.applicantName?.lastName || "",
      app.email || "",
      app.phoneNumber || "",
      app.eventTitle || "",
      app.eventType === "inPerson" ? "In Person" : app.eventType || "",
      format(new Date(app.createdAt), "yyyy-MM-dd HH:mm:ss"),
      app.status || "pending"
    ])

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(","))
      .join("\n")

    return csvContent
  }

  const downloadCSV = (csvContent: string, filename: string) => {
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute("href", url)
      link.setAttribute("download", filename)
      link.style.visibility = "hidden"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const handleExportCSV = async () => {
    setIsExporting(true)
    try {
      const result = await allApplicationsQuery.refetch()
      
      if (result.data?.results) {
        const csvContent = convertToCSV(result.data.results)
        const timestamp = format(new Date(), "yyyy-MM-dd_HH-mm-ss")
        const filename = `event-applications_${timestamp}.csv`
        
        downloadCSV(csvContent, filename)
        toast.success("Applications exported successfully")
      } else {
        toast.error("No data to export")
      }
    } catch (error) {
      toast.error("Failed to export applications")
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Event Applications</h1>
        <Button 
          onClick={handleExportCSV}
          disabled={isExporting || applicationsQuery.isLoading}
          variant="outline"
        >
          <Download className="h-4 w-4 mr-2" />
          {isExporting ? "Exporting..." : "Export CSV"}
        </Button>
      </div>

      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Search applications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="space-y-4">
        {applicationsQuery.isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : applicationsQuery.data?.results.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No applications found</p>
            </CardContent>
          </Card>
        ) : (
          applicationsQuery.data?.results.map((application) => (
            <Card key={application.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{application.applicantName?.first} {application.applicantName?.lastName}</h3>
                      {getEventTypeBadge(application?.eventType)}
                    </div>

                    <div className="space-y-1 text-sm text-gray-600">
                      <p>
                        <strong>Event:</strong> {application.eventTitle}
                      </p>
                      <p>
                        <strong>Email:</strong> {application.email}
                      </p>
                      <p>
                        <strong>Phone:</strong> {application?.phoneNumber}
                      </p>
                      <p>
                        <strong>Applied:</strong> {format(new Date(application?.createdAt), "MMM d, yyyy 'at' h:mm a")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleDeleteApplication(application)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Pagination */}
      {(applicationsQuery.data?.metadata?.[0]?.totalPages ?? 0) > 1 && (
        <div className="flex justify-center mt-6">
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>

            {Array.from({ length: applicationsQuery.data?.metadata[0]?.totalPages || 0 }, (_, i) => i + 1).map(
              (page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Button>
              ),
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => prev + 1)}
              disabled={currentPage === applicationsQuery.data?.metadata[0]?.totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      <DeleteConfirmationModal
        isOpen={!!deletingApplication}
        onClose={() => setDeletingApplication(null)}
        onConfirm={confirmDelete}
        title="Delete Application"
        description={`Are you sure you want to delete the application from "${deletingApplication?.applicantName}"? This action cannot be undone.`}
        isLoading={deleteApplicationMutation.isPending}
      />
    </div>
  )
}

export default EventApplicationsPage