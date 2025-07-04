import api from "@/lib/api"
import type { Review, ReviewsResponse, CreateReviewDTO, UpdateReviewDTO } from "@/types/review"

export const reviewService = {
  getReviews: async (params?: {
    page?: number
    limit?: number
    searchString?: string
    archived?: string
    isActive?: boolean
  }) => {
    try {
      const response = await api.get<ReviewsResponse>("/gsuite/get-reviews", { params })
      return response.data
    } catch (error) {
      console.error("Error fetching reviews:", error)
      throw error
    }
  },

  createReview: async (reviewData: CreateReviewDTO) => {
    try {
      const response = await api.post<Review>("/gsuite/create-review", reviewData)
      return response.data
    } catch (error) {
      console.error("Error creating review:", error)
      throw error
    }
  },

  updateReview: async (reviewId: string, reviewData: UpdateReviewDTO) => {
    try {
      const response = await api.post<Review>(`/gsuite/update-review/${reviewId}`, reviewData)
      return response.data
    } catch (error) {
      console.error("Error updating review:", error)
      throw error
    }
  },

  archiveReview: async (reviewId: string, archived: boolean) => {
    return reviewService.updateReview(reviewId, { archived })
  },

  deleteReview: async (reviewId: string) => {
    return reviewService.updateReview(reviewId, { isActive: false })
  },

  toggleReviewStatus: async (reviewId: string, isActive: boolean) => {
    return reviewService.updateReview(reviewId, { isActive })
  },
}
