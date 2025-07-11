
import type React from "react"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Modal } from "@/components/ui/modal"
import { MoreVertical, Eye, PenSquare, Trash2, Search, Plus } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { jobService } from "@/services/job-service"
import type { Job } from "@/types/job"
import { format } from "date-fns"

const CareerPage = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [jobToDelete, setJobToDelete] = useState<Job | null>(null)
  const [showViewModal, setShowViewModal] = useState(false)
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)

  const jobsPerPage = 10

  const jobsQuery = useQuery({
    queryKey: ["jobs", searchQuery, currentPage],
    queryFn: () =>
      jobService.getJobs({
        page: currentPage,
        limit: jobsPerPage,
        search: searchQuery || undefined,
      }),
  })

  const deleteJobMutation = useMutation({
    mutationFn: (jobId: string) => jobService.deleteJob(jobId),
    onSuccess: () => {
      toast.success("Job deleted successfully")
      setShowDeleteModal(false)
      queryClient.invalidateQueries({ queryKey: ["jobs"] })
    },
    onError: (error) => {
      console.error("Error deleting job:", error)
      toast.error("Failed to delete job")
      setShowDeleteModal(false)
    },
  })

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    setCurrentPage(1)
  }

  const handleViewJob = (job: Job) => {
    setSelectedJob(job)
    setShowViewModal(true)
  }

  const handleEditJob = (job: Job) => {
    navigate(`/career/edit/${job.id}`)
  }

  const handleDeleteClick = (job: Job) => {
    setJobToDelete(job)
    setShowDeleteModal(true)
  }

  const confirmDelete = () => {
    if (jobToDelete) {
      deleteJobMutation.mutate(jobToDelete.id)
    }
  }

  const handleAddJob = () => {
    navigate("/career/add")
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Career Management</h1>
        <Button onClick={handleAddJob} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Job
        </Button>
      </div>

      <div className="bg-white rounded-lg border mb-6">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">All Jobs</h2>
        </div>

        <div className="p-4">
          <div className="relative w-full md:w-80 mb-4">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input placeholder="Search jobs..." value={searchQuery} onChange={handleSearch} className="pl-8" />
          </div>

          {jobsQuery.isLoading ? (
            <div className="text-center py-4">Loading jobs...</div>
          ) : jobsQuery.isError ? (
            <div className="text-center py-4 text-red-500">Error loading jobs</div>
          ) : jobsQuery.data?.results.length === 0 ? (
            <div className="text-center py-4">No jobs found</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {jobsQuery.data?.results.map((job) => (
                    <TableRow key={job.id} className="cursor-pointer" onClick={() => navigate(`/career/edit/${job.id}`)}>
                      <TableCell className="font-medium">{job.title}</TableCell>
                      <TableCell>{job.department}</TableCell>
                      <TableCell>{job.location}</TableCell>
                      <TableCell>
                        <Badge className={job.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                          {job.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>{format(new Date(job.createdAt), "MMM dd, yyyy")}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem className="flex items-center" onClick={() => handleViewJob(job)}>
                              <Eye className="mr-2 h-4 w-4" />
                              <span>View details</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex items-center" onClick={() => handleEditJob(job)}>
                              <PenSquare className="mr-2 h-4 w-4" />
                              <span>Edit job</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="flex items-center text-red-600"
                              onClick={() => handleDeleteClick(job)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              <span>Delete</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {jobsQuery.data && jobsQuery.data.metadata[0]?.totalPages > 1 && (
            <div className="flex justify-between items-center mt-4">
              <div className="text-sm text-gray-500">
                Showing {(currentPage - 1) * jobsPerPage + 1} to{" "}
                {Math.min(currentPage * jobsPerPage, jobsQuery.data.metadata[0].total)} of{" "}
                {jobsQuery.data.metadata[0].total} results
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  disabled={currentPage >= jobsQuery.data.metadata[0].totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Confirm Delete">
        <div className="p-4">
          This will deactivate the join us entry for{" "}
            <span className="font-semibold">
              {jobToDelete?.title} 
            </span>
            . This action cannot be undone.
        </div>
        <div className="flex justify-end gap-2 m-4 mb-6">
          <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={confirmDelete}>
            Delete
          </Button>
        </div>
      </Modal>

      {/* View Job Modal */}
      <Modal isOpen={showViewModal} onClose={() => setShowViewModal(false)} title="Job Details">
        {selectedJob && (
          <div className="p-5">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold">{selectedJob.title}</h2>
              <Badge className={selectedJob.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                {selectedJob.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-500">Department</p>
                <p>{selectedJob.department}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p>{selectedJob.location}</p>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-1">Description</p>
              <p className="whitespace-pre-wrap">{selectedJob.description}</p>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-1">Duties</p>
              <p className="whitespace-pre-wrap">{selectedJob.duties}</p>
            </div>

            {selectedJob.skills && (
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-1">Skills</p>
                <p className="whitespace-pre-wrap">{selectedJob.skills}</p>
              </div>
            )}

            {selectedJob.experience && (
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-1">Experience</p>
                <p className="whitespace-pre-wrap">{selectedJob.experience}</p>
              </div>
            )}

            {selectedJob.education && (
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-1">Education</p>
                <p className="whitespace-pre-wrap">{selectedJob.education}</p>
              </div>
            )}

            <div className="text-sm text-gray-500 mt-6">
              Created on {format(new Date(selectedJob.createdAt), "MMMM dd, yyyy")}
            </div>
          </div>
        )}
        <div className="flex justify-end gap-2 mt-3 mb-5">
          <Button variant="outline" onClick={() => setShowViewModal(false)}>
            Close
          </Button>
          {selectedJob && (
            <Button
              onClick={() => {
                setShowViewModal(false)
                handleEditJob(selectedJob)
              }}
            >
              Edit Job
            </Button>
          )}
        </div>
      </Modal>
    </div>
  )
}

export default CareerPage
