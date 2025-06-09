import api from "@/lib/api"
import type { BlogFormData, BlogPostResponse, CreateBlogPostDTO, UpdateBlogPostDTO } from "@/types/blog"

export const blogService = {
  getPosts: async (page = 1, limit = 10, search = ""): Promise<BlogPostResponse> => {
      const response = await api.get("/blog/get-posts", {
        params: { page, limit, search },
      })
      return response.data
   
    },

  getPost: async (postId: string) => {
    try {
      const response = await api.get(`/blog/get-post/${postId}`)
      return response.data
    } catch (error) {
      console.error(`Error fetching blog post ${postId}:`, error)
      throw error
    }
  },

  createPost: async (blogData: BlogFormData) => {
    try {
      const formData = new FormData()

      const blogDTO: CreateBlogPostDTO = {
        title: blogData.title,
        content: blogData.content,
        header: blogData.header,
        datePosted: blogData.datePosted,
        isActive: blogData.isActive,
      }

      formData.append("metadata", JSON.stringify(blogDTO))

      if (blogData.images && blogData.images.length > 0) {
        blogData.images.forEach((image) => {
          formData.append("images", image)
        })
      }

      const response = await api.post("/blog/create-post", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      return response.data
    } catch (error) {
      console.error("Error creating blog post:", error)
      throw error
    }
  },

  updatePost: async (postId: string, blogData: BlogFormData) => {
    try {
      const formData = new FormData()

      const blogDTO: UpdateBlogPostDTO = {
        title: blogData.title,
        content: blogData.content,
        header: blogData.header,
        //datePosted: blogData.datePosted,
        isActive: blogData.isActive,
      }

      formData.append("metadata", JSON.stringify(blogDTO))

    
      if (blogData.images && blogData.images.length > 0) {
        blogData.images.forEach((image) => {
          formData.append("images", image)
        })
      }

      const response = await api.post(`/blog/update-post/${postId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      return response.data
    } catch (error) {
      console.error(`Error updating blog post ${postId}:`, error)
      throw error
    }
  },

  deletePost: async (postId: string) => {
    try {
      const formData = new FormData()
       formData.append("metadata", JSON.stringify({isActive:false}))
      const response = await api.post(`/blog/update-post/${postId}`,formData)
      return response.data
    } catch (error) {
      console.error(`Error deleting blog post ${postId}:`, error)
      throw error
    }
  },
}
