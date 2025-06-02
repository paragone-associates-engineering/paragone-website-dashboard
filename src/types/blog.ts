export interface BlogPost {
  id: string
  title: string
  content: string
  images: string[]
  header: string
  datePosted: Date
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface BlogPostResponse {
  metadata: {
    total: number
    totalPages: number
  }[]
  results: BlogPost[]
}

export interface CreateBlogPostDTO {
  title: string
  content: string
  header: string
  datePosted: string
  isActive: boolean
}

export interface UpdateBlogPostDTO {
  title?: string
  content?: string
  header?: string
  datePosted?: string
  isActive?: boolean
}

export interface BlogFormData {
  title: string
  content: string
  header: string
  datePosted: string
  isActive: boolean
  images: File[]
}
