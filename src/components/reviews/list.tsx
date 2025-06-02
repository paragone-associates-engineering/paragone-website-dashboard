
import type React from "react"

import { useState } from "react"
import { Search, Star } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import type { Review } from "@/types/review"

interface ReviewListProps {
  reviews: Review[]
  isLoading: boolean
  onArchive: (review: Review) => void
  archivingId: string | null
  onSearch: (query: string) => void
  onSort: (sortBy: string) => void
  sortBy: string
}

const ReviewList: React.FC<ReviewListProps> = ({
  reviews,
  isLoading,
  onArchive,
  archivingId,
  onSearch,
  onSort,
  sortBy,
}) => {
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(searchQuery)
  }

  // Render star rating
  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn("w-5 h-5", star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300")}
          />
        ))}
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white p-4 rounded-md shadow-sm border animate-pulse">
            <div className="flex items-start">
              <div className="w-12 h-12 rounded-full bg-gray-200 mr-4"></div>
              <div className="flex-1">
                <div className="h-5 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
                <div className="flex justify-end">
                  <div className="h-8 bg-gray-200 rounded w-24"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <form onSubmit={handleSearchSubmit} className="relative">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search reviews..."
            className="pl-10 pr-4 py-2 border rounded-md w-full max-w-md bg-gray-50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="sr-only">
            Search
          </button>
        </form>
      </div>

      <div className="flex justify-end mb-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Sort by:</span>
          <select
            className="border rounded-md px-2 py-1 text-sm"
            value={sortBy}
            onChange={(e) => onSort(e.target.value)}
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="highest">Highest Rating</option>
            <option value="lowest">Lowest Rating</option>
          </select>
        </div>
      </div>

      {reviews.length === 0 ? (
        <div className="bg-white p-8 rounded-md shadow-sm border text-center">
          <p className="text-gray-500">No reviews found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white p-4 rounded-md shadow-sm border">
              <div className="flex items-start">
                <div className="w-12 h-12 rounded-full bg-gray-200 mr-4 flex items-center justify-center text-gray-500 font-bold">
                  {review.testifierName.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{review.testifierName}</h3>
                      <div className="text-sm text-gray-500">{review.testifierOccupation}</div>
                      <div className="text-xs text-gray-400">{format(new Date(review.createdAt), "MMM d, yyyy")}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-xl font-bold">{review.rating.toFixed(1)}</div>
                      {renderStars(review.rating)}
                    </div>
                  </div>

                  {review.title && <h4 className="font-medium mt-2">{review.title}</h4>}

                  <p className="my-3 text-gray-700">{review.content}</p>

                  <div className="flex justify-end gap-2">
                    <button
                      className={cn(
                        "px-4 py-1 border rounded-md",
                        review.isActive ? "text-red-600 hover:bg-red-50" : "text-green-600 hover:bg-green-50",
                      )}
                      onClick={() => onArchive(review)}
                      disabled={archivingId === review.id}
                    >
                      {archivingId === review.id ? "Processing..." : review.isActive ? "Archive" : "Publish"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ReviewList
