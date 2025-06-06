
import type React from "react"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { blogService } from "@/services/blog-service"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreVertical, Eye, PenSquare, Trash2, Search, Plus, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { format } from "date-fns"
import type { BlogPost } from "@/types/blog"

const BlogListPage = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)

  const { data, isLoading, isError } = useQuery({
    queryKey: ["blogs", currentPage, itemsPerPage, searchTerm],
    queryFn: () => blogService.getPosts(currentPage, itemsPerPage, searchTerm),
    staleTime: 1000 * 60 * 5, 
  })

  
  
  const deleteBlogMutation = useMutation({
    mutationFn: (postId: string) => blogService.deletePost(postId),
    onSuccess: () => {
      toast.success("Blog post deleted successfully")
      queryClient.invalidateQueries({ queryKey: ["blogs"] })
    },
    onError: (error) => {
      console.error("Error deleting blog post:", error)
      toast.error("Failed to delete blog post")
    },
  })

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1) 
  }

  const handleViewPost = (post: BlogPost) => {
    navigate(`/blog/edit/${post.id}`)
  }

  const handleEditPost = (post: BlogPost) => {
    navigate(`/blog/edit/${post.id}`)
  }

  const handleDeletePost = (post: BlogPost) => {
    if (window.confirm("Are you sure you want to delete this blog post?")) {
      deleteBlogMutation.mutate(post.id)
    }
  }

  const handleCreatePost = () => {
    navigate("/blog/create")
  }

  
  const totalItems = data?.metadata[0]?.total || 0
  const totalPages = data?.metadata[0]?.totalPages || 1

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Blog Posts</h1>
        <Button onClick={handleCreatePost} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create New Post
        </Button>
      </div>

      <div className="bg-white rounded-lg border mb-6">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">All Blog Posts</h2>
        </div>

        <div className="p-4">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search blog posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit">Search</Button>
          </form>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Loading blog posts...</span>
          </div>
        ) : isError ? (
          <div className="p-8 text-center text-red-500">Error loading blog posts. Please try again.</div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Header</TableHead>
                  <TableHead>Date Posted</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.results && data.results.length > 0 ? (
                  data.results.map((post) => (
                    <TableRow key={post.id}>
                      <TableCell className="font-medium">{post.title}</TableCell>
                      <TableCell>{post.header}</TableCell>
                      <TableCell>{format(new Date(post.datePosted), "MMM dd, yyyy")}</TableCell>
                      <TableCell>
                        <Badge className={post.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                          {post.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewPost(post)}>
                              <Eye className="mr-2 h-4 w-4" />
                              <span>View</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditPost(post)}>
                              <PenSquare className="mr-2 h-4 w-4" />
                              <span>Edit</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeletePost(post)} className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              <span>Delete</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      No blog posts found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

           
            {totalPages > 1 && (
              <div className="flex items-center justify-between p-4 border-t">
                <div>
                  Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, totalItems)}{" "}
                  of {totalItems} entries
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default BlogListPage
