export interface Review {
  id: string
  title?: string
  content: string
  rating: number
  testifierName: string
  testifierOccupation: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface ReviewsResponse {
  metadata: { total: number; totalPages: number }[]
  results: Review[]
}

export interface CreateReviewDTO {
  title?: string
  content: string
  rating: number
  testifierName: string
  testifierOccupation: string
}

export interface UpdateReviewDTO {
  title?: string
  content?: string
  rating?: number
  testifierName?: string
  testifierOccupation?: string
  isActive?: boolean
}
