
import { useState, useEffect } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { partnerListService, type Partner, type PartnerFormData } from "@/services/partner-list-service"
import { PartnerFormModal } from "@/components/partner/list/form"
import { DeleteConfirmation } from "@/components/partner/list/delete-confirmation"
import { PartnerMenu } from "@/components/partner/list/menu"
import { ViewDetailsModal } from "@/components/partner/list/view-details"

export default function PartnerList() {
  const queryClient = useQueryClient()
  const [searchTerm, setSearchTerm] = useState("")
  const [itemsPerPage, setItemsPerPage] = useState("9")
  const [currentPage, setCurrentPage] = useState(1)
  const [filteredPartners, setFilteredPartners] = useState<Partner[]>([])

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null)
  const [viewingPartner, setViewingPartner] = useState<Partner | null>(null)
  const [deletingPartner, setDeletingPartner] = useState<Partner | null>(null)

  const {
    data: partners,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["partners"],
    queryFn: () => partnerListService.getPartners(),
    staleTime: 1000 * 60 * 5,
  })

  // Filter partners based on search term
  useEffect(() => {
    if (partners) {
      const filtered = partners.filter(
        (partner) =>
          partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          partner.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
          partner.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredPartners(filtered)
      setCurrentPage(1) // Reset to first page when filtering
    }
  }, [partners, searchTerm])

  // Pagination
  const partnersPerPage = Number.parseInt(itemsPerPage)
  const indexOfLastPartner = currentPage * partnersPerPage
  const indexOfFirstPartner = indexOfLastPartner - partnersPerPage
  const currentPartners = filteredPartners.slice(indexOfFirstPartner, indexOfLastPartner)
  const totalPages = Math.ceil(filteredPartners.length / partnersPerPage)

  const createPartnerMutation = useMutation({
    mutationFn: (data: PartnerFormData) => partnerListService.createPartner(data),
    onSuccess: () => {
      toast.success("Partner created successfully")
      queryClient.invalidateQueries({ queryKey: ["partners"] })
      setIsFormModalOpen(false)
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error:any) => {
      toast.error(error?.response?.data?.message || "Failed to create partner")
    },
  })

  const updatePartnerMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: PartnerFormData }) => partnerListService.updatePartner(id, data),
    onSuccess: () => {
      toast.success("Partner updated successfully")
      queryClient.invalidateQueries({ queryKey: ["partners"] })
      setIsFormModalOpen(false)
      setEditingPartner(null)
    },
    onError: () => {
      toast.error("Failed to update partner")
    },
  })

  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      partnerListService.togglePartnerStatus(id, isActive),
    onSuccess: (_, variables) => {
      toast.success(`Partner ${variables.isActive ? "activated" : "deactivated"} successfully`)
      queryClient.invalidateQueries({ queryKey: ["partners"] })
      setIsDeleteDialogOpen(false)
      setDeletingPartner(null)
    },
    onError: () => {
      toast.error("Failed to update partner status")
    },
  })

  // Handlers
  const handleAddPartner = () => {
    setEditingPartner(null)
    setIsFormModalOpen(true)
  }

  const handleEditPartner = (partner: Partner) => {
    setEditingPartner(partner)
    setIsFormModalOpen(true)
  }

  const handleViewPartner = (partner: Partner) => {
    setViewingPartner(partner)
    setIsViewModalOpen(true)
  }

  const handleToggleStatus = (partner: Partner) => {
    if (partner.isActive) {
      // If active, show confirmation before deactivating
      setDeletingPartner(partner)
      setIsDeleteDialogOpen(true)
    } else {
      // If inactive, activate directly
      toggleStatusMutation.mutate({ id: partner.id, isActive: true })
    }
  }

  const handleSavePartner = (data: PartnerFormData) => {
    if (editingPartner) {
      updatePartnerMutation.mutate({ id: editingPartner.id, data })
    } else {
      createPartnerMutation.mutate(data)
    }
  }

  const handleConfirmDelete = () => {
    if (deletingPartner) {
      toggleStatusMutation.mutate({ id: deletingPartner.id, isActive: false })
    }
  }

  // Pagination controls
  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = []
    const maxVisiblePages = 3
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }
    return pages
  }

  return (
    <div className="p-6 max-w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Partner List</h1>
      </div>

      <div className="bg-white rounded-lg border">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">All Partners</h2>
        </div>

        <div className="p-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Select value={itemsPerPage} onValueChange={setItemsPerPage}>
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Show" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="9">9</SelectItem>
                <SelectItem value="18">18</SelectItem>
                <SelectItem value="27">27</SelectItem>
                <SelectItem value="36">36</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm text-gray-500">partners per page</span>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <Input
              placeholder="Search partners..."
              className="w-full md:w-[300px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button onClick={handleAddPartner}>Add Partner</Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Loading Partners...</span>
          </div>
        ) : isError ? (
          <div className="p-12 text-center text-red-500">Error loading partners. Please try again.</div>
        ) : filteredPartners.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            {searchTerm ? "No partners match your search criteria." : "No partners found. Add your first partner!"}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
              {currentPartners.map((partner) => (
                <div
                  key={partner.id}
                  className={`flex border rounded-lg p-4 ${partner.isActive ? "bg-white" : "bg-gray-50"}`}
                >
                  <div className="flex-shrink-0 w-16 h-16 mr-4 bg-white rounded-md flex items-center justify-center border">
                    {partner.logo ? (
                      <img
                        src={partner.logo || "/placeholder.svg"}
                        alt={partner.name}
                        className="w-full h-full object-contain p-1"
                      />
                    ) : (
                      <div className="text-gray-400 text-xs text-center">No Logo</div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{partner.name}</h3>
                        <Badge variant={partner.isActive ? "outline" : "secondary"} className="mt-1 text-xs">
                          {partner.type}
                        </Badge>
                      </div>
                      <PartnerMenu
                        partner={partner}
                        onEdit={handleEditPartner}
                        onView={handleViewPartner}
                        onToggleStatus={handleToggleStatus}
                      />
                    </div>
                    <div className="mt-2">
                      <p className="text-sm text-gray-600 line-clamp-2">{partner.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between p-4 border-t">
              <div className="text-sm text-gray-500">
                Showing {indexOfFirstPartner + 1}-{Math.min(indexOfLastPartner, filteredPartners.length)} of{" "}
                {filteredPartners.length} results
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <path d="m15 18-6-6 6-6" />
                  </svg>
                </Button>
                {getPageNumbers().map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    className={currentPage === page ? "bg-primary hover:bg-primary/90" : ""}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="icon"
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </Button>
              </div>
            </div>
          </>
        )}
      </div>

      <PartnerFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false)
          setEditingPartner(null)
        }}
        partner={editingPartner || undefined}
        onSave={handleSavePartner}
        isLoading={createPartnerMutation.isPending || updatePartnerMutation.isPending}
      />

      <ViewDetailsModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false)
          setViewingPartner(null)
        }}
        partner={viewingPartner}
      />

      <DeleteConfirmation
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false)
          setDeletingPartner(null)
        }}
        partner={deletingPartner}
        onConfirm={handleConfirmDelete}
        isLoading={toggleStatusMutation.isPending}
      />
    </div>
  )
}
