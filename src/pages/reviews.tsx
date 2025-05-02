
import type React from "react"
import { useState } from "react"
import { Search, Star, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface Review {
  id: string
  name: string
  profileImage: string
  joinDate: string
  rating: number
  content: string
  tags: string[]
  archived: boolean
}

const ReviewsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"all" | "published" | "archived" | "custom">("all")
  const [sortBy, setSortBy] = useState<string>("newest")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [currentPage, setCurrentPage] = useState<number>(1)

  // New review form state
  const [newReview, setNewReview] = useState({
    clientName: "",
    reviewText: "",
    rating: 3,
    tags: ["Excellent Service"],
  })

  // Sample reviews data
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: "#C01234",
      name: "Marilyn Dias",
      profileImage: "https://plus.unsplash.com/premium_photo-1658527049634-15142565537a?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGF2YXRhcnxlbnwwfHwwfHx8MA%3D%3D",
      joinDate: "26/04/2020, 12:42 AM",
      rating: 5.0,
      content:
        "Friendly service. Josh, Lunar and everyone at Just Property in Hastings deserved a big Thank You from us for moving us from Jakarta to Medan during the lockdown.",
      tags: ["EXCELLENT", "GREAT", "BEST SERVICE"],
      archived: false,
    },
    {
      id: "#C01234",
      name: "Ryan Philips",
      profileImage: "https://images.unsplash.com/photo-1639149888905-fb39731f2e6c?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGF2YXRhcnxlbnwwfHwwfHx8MA%3D%3D",
      joinDate: "26/04/2020, 12:42 AM",
      rating: 3.0,
      content:
        "Dealing with Syamsudin and Bakri was a joy. I got in touch with Just Property after seeing a couple of properties that caught my eye. Both Syamsudin and Bakri strive to deliver a professional service and surpassed my expectations - they were not only help...",
      tags: ["BAD SERVICE", "UNEXPECTED"],
      archived: false,
    },
    {
      id: "#C01234",
      name: "Tatiana Rhiel Madsen",
      profileImage: "https://images.unsplash.com/photo-1640960543409-dbe56ccc30e2?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGF2YXRhcnxlbnwwfHwwfHx8MA%3D%3D",
      joinDate: "26/04/2020, 12:42 AM",
      rating: 4.0,
      content:
        "I viewed a number of properties with Just Property and found them to be professional, efficient, patient, courteous and helpful every time.",
      tags: ["BEST SERVICE", "EXCELLENT"],
      archived: false,
    },
    {
      id: "#C01234",
      name: "Tiana Saris",
      profileImage: "https://plus.unsplash.com/premium_photo-1658527049634-15142565537a?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGF2YXRhcnxlbnwwfHwwfHx8MA%3D%3D",
      joinDate: "26/04/2020, 12:42 AM",
      rating: 2.0,
      content:
        "I used Just Property for the sale of my late mother's property. From the off they were very confident and enthusiastic about finding a buyer, and I wasn't disappointed - within a very short time of marketing the house they told me they had a buye...",
      tags: ["EXCELLENT", "GREAT", "BEST SERVICE"],
      archived: false,
    },
    {
      id: "#C01234",
      name: "Jaxson Stanton",
      profileImage: "https://plus.unsplash.com/premium_photo-1670884442192-7b58d513cd55?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fGF2YXRhcnxlbnwwfHwwfHx8MA%3D%3D",
      joinDate: "26/04/2020, 12:42 AM",
      rating: 4.0,
      content:
        "I viewed a number of properties with Just Property and found them to be professional, efficient, patient, courteous and helpful every time.",
      tags: ["BEST SERVICE", "EXCELLENT"],
      archived: false,
    },
  ])

  // Filter reviews based on active tab and search query
  const filteredReviews = reviews.filter((review) => {
    // Filter by tab
    if (activeTab === "published" && review.archived) return false
    if (activeTab === "archived" && !review.archived) return false

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        review.name.toLowerCase().includes(query) ||
        review.content.toLowerCase().includes(query) ||
        review.id.toLowerCase().includes(query)
      )
    }

    return true
  })

  // Pagination
  const reviewsPerPage = 4
  const totalPages = Math.ceil(filteredReviews.length / reviewsPerPage)
  const paginatedReviews = filteredReviews.slice((currentPage - 1) * reviewsPerPage, currentPage * reviewsPerPage)

  // Handle archive/approve
  const handleArchiveToggle = (id: string) => {
    setReviews(reviews.map((review) => (review.id === id ? { ...review, archived: !review.archived } : review)))
  }

  // Handle adding a new tag
  const handleAddTag = (tag: string) => {
    if (tag && !newReview.tags.includes(tag)) {
      setNewReview({
        ...newReview,
        tags: [...newReview.tags, tag],
      })
    }
  }

  // Handle removing a tag
  const handleRemoveTag = (tag: string) => {
    setNewReview({
      ...newReview,
      tags: newReview.tags.filter((t) => t !== tag),
    })
  }

  // Handle submitting a new review
  const handleSubmitReview = () => {
    const newReviewObj: Review = {
      id: `#C${Math.floor(10000 + Math.random() * 90000)}`,
      name: newReview.clientName,
      profileImage: "https://plus.unsplash.com/premium_photo-1658527049634-15142565537a?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGF2YXRhcnxlbnwwfHwwfHx8MA%3D%3D",
      joinDate: new Date().toLocaleString(),
      rating: newReview.rating,
      content: newReview.reviewText,
      tags: newReview.tags,
      archived: false,
    }

    setReviews([newReviewObj, ...reviews])
    setActiveTab("all") // Switch back to all tab after submission
    setNewReview({
      clientName: "",
      reviewText: "",
      rating: 3,
      tags: ["Excellent Service"],
    })
  }

  // Render star rating
  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn("w-5 h-5", star <= rating ? "text-primary fill-primary" : "text-gray-300")}
          />
        ))}
      </div>
    )
  }

  // Render interactive star rating for form
  const renderInteractiveStars = () => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              "w-6 h-6 cursor-pointer",
              star <= newReview.rating ? "text-primary fill-primary" : "text-gray-300",
            )}
            onClick={() => setNewReview({ ...newReview, rating: star })}
          />
        ))}
      </div>
    )
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
          <button className="bg-primary text-white px-4 py-2 rounded-md" onClick={() => setActiveTab("custom")}>
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
              activeTab === "all" && "border-b-2 border-primary text-primary",
            )}
            onClick={() => setActiveTab("all")}
          >
            All
          </button>
          <button
            className={cn(
              "px-6 py-3 font-medium",
              activeTab === "published" && "border-b-2 border-primary text-primary",
            )}
            onClick={() => setActiveTab("published")}
          >
            Published
          </button>
          <button
            className={cn(
              "px-6 py-3 font-medium",
              activeTab === "archived" && "border-b-2 border-primary text-primary",
            )}
            onClick={() => setActiveTab("archived")}
          >
            Archived
          </button>
          <button
            className={cn(
              "px-6 py-3 font-medium",
              activeTab === "custom" && "border-b-2 border-primary text-primary",
            )}
            onClick={() => setActiveTab("custom")}
          >
            Custom
          </button>
        </div>
      </div>

      {/* Search bar for reviews list */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            className="pl-10 pr-4 py-2 border rounded-md w-full max-w-md bg-gray-50"
          />
        </div>
      </div>

      {/* Sort dropdown */}
      <div className="flex justify-end mb-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Sort by:</span>
          <select
            className="border rounded-md px-2 py-1 text-sm"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="highest">Highest Rating</option>
            <option value="lowest">Lowest Rating</option>
          </select>
        </div>
      </div>

      {/* Content based on active tab */}
      {activeTab === "custom" ? (
        <div className="bg-white p-6 rounded-md shadow-sm border">
          <h2 className="text-xl font-bold mb-4">Add review</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div>
              <label className="block mb-2 font-medium">Client name</label>
              <input
                type="text"
                placeholder="Enter name"
                className="w-full p-2 border rounded-md"
                value={newReview.clientName}
                onChange={(e) => setNewReview({ ...newReview, clientName: e.target.value })}
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">Enter tags</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Add tag and press Enter"
                  className="w-full p-2 border rounded-md"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      handleAddTag(e.currentTarget.value)
                      e.currentTarget.value = ""
                    }
                  }}
                />
                <div className="flex flex-wrap gap-1 mt-2">
                  {newReview.tags.map((tag, index) => (
                    <div
                      key={index}
                      className="bg-gray-100 text-gray-500 px-2 py-1 rounded-md flex items-center text-sm"
                    >
                      {tag}
                      <button onClick={() => handleRemoveTag(tag)} className="ml-1 text-gray-500 hover:text-gray-900">
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label className="block mb-2 font-medium">Reviews</label>
            <textarea
              placeholder="Enter reviews..."
              className="w-full p-2 border rounded-md h-32"
              value={newReview.reviewText}
              onChange={(e) => setNewReview({ ...newReview, reviewText: e.target.value })}
            />
          </div>

          <div className="mb-6">
            <label className="block mb-2 font-medium">Enter star review</label>
            <div className="flex justify-between items-center">
              {renderInteractiveStars()}
              <span className="text-primary font-medium">{newReview.rating} Star</span>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              className="px-4 py-2 border rounded-md"
              onClick={() => {
                setNewReview({
                  clientName: "",
                  reviewText: "",
                  rating: 3,
                  tags: ["Excellent Service"],
                })
              }}
            >
              Cancel
            </button>
            <button className="px-4 py-2 bg-primary text-white rounded-md" onClick={handleSubmitReview}>
              Add review
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {paginatedReviews.map((review, index) => (
            <div key={index} className="bg-white p-4 rounded-md shadow-sm border">
              <div className="flex items-start">
                <img
                  src={review.profileImage || "/placeholder.svg"}
                  alt={review.name}
                  className="w-12 h-12 rounded-full mr-4 object-cover"
                />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-primary font-medium">{review.id}</div>
                      <h3 className="font-medium">{review.name}</h3>
                      <div className="text-sm text-gray-500">join on {review.joinDate}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-xl font-bold">{review.rating.toFixed(1)}</div>
                      {renderStars(review.rating)}
                    </div>
                  </div>
                  <p className="my-3 line-clamp-3 text-gray-700">{review.content}</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {review.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className={cn(
                          "px-3 py-1 rounded-full text-xs font-medium",
                          tag === "EXCELLENT" && "bg-yellow-100 text-primary",
                          tag === "GREAT" && "bg-green-100 text-green-600",
                          tag === "BEST SERVICE" && "bg-blue-100 text-blue-600",
                          tag === "BAD SERVICE" && "bg-red-100 text-red-600",
                          tag === "UNEXPECTED" && "bg-purple-100 text-purple-600",
                        )}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex justify-end gap-2">
                    <button className="px-4 py-1 border hover:bg-primary hover:text-white cursor-pointer rounded-md" onClick={() => handleArchiveToggle(review.id)}>
                      {review.archived ? "Unarchive" : "Archive"}
                    </button>
                    <button className="px-4 py-1 bg-primary hover:bg-primary/80 text-white cursor-pointer rounded-md">Approve</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <div className="text-sm text-gray-500">
          Showing {(currentPage - 1) * reviewsPerPage + 1} to{" "}
          {Math.min(currentPage * reviewsPerPage, filteredReviews.length)} of {filteredReviews.length} results
        </div>
        <div className="flex gap-1">
          <button
            className="w-8 h-8 flex items-center justify-center border rounded-md"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            &lt;
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={cn(
                "w-8 h-8 flex items-center justify-center rounded-md",
                currentPage === page ? "bg-primary text-white" : "border hover:bg-gray-50",
              )}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          ))}
          <button
            className="w-8 h-8 flex items-center justify-center border rounded-md"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  )
}

export default ReviewsPage
