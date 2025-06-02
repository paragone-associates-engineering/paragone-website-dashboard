import { useState } from "react"
import { Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { reviewService } from "@/services/review-service"
import ReviewForm from "@/components/reviews/form"
import ReviewList from "@/components/reviews/list"
import type {  CreateReviewDTO } from "@/types/review"

const ReviewsPage = () => {
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState<"all" | "published" | "archived" | "custom">("all")
  const [sortBy, setSortBy] = useState<string>("newest")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [archivingId, setArchivingId] = useState<string | null>(null)

  const reviewsPerPage = 10

  const reviewsQuery = useQuery({
    queryKey: ["reviews", activeTab, searchQuery, currentPage, sortBy],
    queryFn: async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const params: Record<string, any> = {
        page: currentPage,
        limit: reviewsPerPage,
      }

      if (searchQuery) {
        params.search = searchQuery
      }

      if (activeTab === "published") {
        params.isActive = true
      } else if (activeTab === "archived") {
        params.isActive = false
      }

      if (sortBy) {
        params.sort = sortBy
      }

      return reviewService.getReviews(params)
    },
  })

  const createReviewMutation = useMutation({
    mutationFn: (data: CreateReviewDTO) => reviewService.createReview(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] })
      setActiveTab("all")
      toast.success("Review created successfully")
    },
    onError: (error) => {
      console.error("Error creating review:", error)
      toast.error("Failed to create review")
    },
  })

  const updateReviewStatusMutation = useMutation({
    mutationFn: ({ reviewId, isActive }: { reviewId: string; isActive: boolean }) =>
      reviewService.toggleReviewStatus(reviewId, isActive),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] })
      toast.success(`Review ${data.isActive ? "published" : "archived"} successfully`)
    },
    onError: (error) => {
      console.error("Error updating review status:", error)
      toast.error("Failed to update review status")
    },
  })

  const handleArchiveToggle = async (review: { id: string; isActive: boolean }) => {
    try {
      setArchivingId(review.id)
      await updateReviewStatusMutation.mutateAsync({
        reviewId: review.id,
        isActive: !review.isActive,
      })
    } finally {
      setArchivingId(null)
    }
  }

  const handleCreateReview = async (data: CreateReviewDTO) => {
    await createReviewMutation.mutateAsync(data)
  }


  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setCurrentPage(1)
  }

  
  const handleSort = (sortValue: string) => {
    setSortBy(sortValue)
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Reviews</h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search here..."
              className="pl-10 pr-4 py-2 border rounded-md w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <button className="bg-yellow-500 text-white px-4 py-2 rounded-md" onClick={() => setActiveTab("custom")}>
            Add Review
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b mb-6">
        <div className="flex">
          <button
            className={cn(
              "px-6 py-3 font-medium",
              activeTab === "all" && "border-b-2 border-yellow-500 text-yellow-500",
            )}
            onClick={() => setActiveTab("all")}
          >
            All
          </button>
          <button
            className={cn(
              "px-6 py-3 font-medium",
              activeTab === "published" && "border-b-2 border-yellow-500 text-yellow-500",
            )}
            onClick={() => setActiveTab("published")}
          >
            Published
          </button>
          <button
            className={cn(
              "px-6 py-3 font-medium",
              activeTab === "archived" && "border-b-2 border-yellow-500 text-yellow-500",
            )}
            onClick={() => setActiveTab("archived")}
          >
            Archived
          </button>
          <button
            className={cn(
              "px-6 py-3 font-medium",
              activeTab === "custom" && "border-b-2 border-yellow-500 text-yellow-500",
            )}
            onClick={() => setActiveTab("custom")}
          >
            Custom
          </button>
        </div>
      </div>

      {/* Content based on active tab */}
      {activeTab === "custom" ? (
        <ReviewForm
          onSubmit={handleCreateReview}
          onCancel={() => setActiveTab("all")}
          isLoading={createReviewMutation.isPending}
        />
      ) : (
        <>
          <ReviewList
            reviews={reviewsQuery.data?.results || []}
            isLoading={reviewsQuery.isLoading}
            onArchive={handleArchiveToggle}
            archivingId={archivingId}
            onSearch={handleSearch}
            onSort={handleSort}
            sortBy={sortBy}
          />

          {/* Pagination */}
          {reviewsQuery.data && reviewsQuery.data.metadata[0]?.totalPages > 1 && (
            <div className="flex justify-between items-center mt-6">
              <div className="text-sm text-gray-500">
                Showing {(currentPage - 1) * reviewsPerPage + 1} to{" "}
                {Math.min(currentPage * reviewsPerPage, reviewsQuery.data.metadata[0].total)} of{" "}
                {reviewsQuery.data.metadata[0].total} results
              </div>
              <div className="flex gap-1">
                <button
                  className="w-8 h-8 flex items-center justify-center border rounded-md"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  &lt;
                </button>
                {Array.from({ length: reviewsQuery.data.metadata[0].totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    className={cn(
                      "w-8 h-8 flex items-center justify-center rounded-md",
                      currentPage === page ? "bg-yellow-500 text-white" : "border hover:bg-gray-50",
                    )}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                ))}
                <button
                  className="w-8 h-8 flex items-center justify-center border rounded-md"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, reviewsQuery.data.metadata[0].totalPages))}
                  disabled={currentPage === reviewsQuery.data.metadata[0].totalPages}
                >
                  &gt;
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default ReviewsPage
