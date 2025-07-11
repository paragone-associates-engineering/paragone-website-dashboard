import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { blogService } from "@/services/blog-service"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, PenSquare, Trash2, Plus } from "lucide-react"
import { toast } from "sonner"
import { format } from "date-fns"
import type { BlogPost } from "@/types/blog"
import { DataTable, type Column } from "@/components/shared/data-table"


const BlogListPage = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

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

  const handleSearch = (query: string) => {
    setSearchTerm(query)
    setCurrentPage(1)
  }

  const handlePageChange = (page: number, pageSize: number) => {
    setCurrentPage(page)
    setItemsPerPage(pageSize)
  }

  const handleRowClick = (post: BlogPost) => {
    navigate(`/blog/edit/${post.id}`)
  }

  const columns: Column[] = [
    {
      id: "title",
      header: "Title",
      accessorKey: "title",
      enableSorting: false,
      cell: (post: BlogPost) => (
        <div className="font-medium">{post.title.slice(0,50) + "..."}</div>
      ),
    },
    {
      id: "header",
      header: "Header",
      accessorKey: "header",
      enableSorting: false,
      cell: (post: BlogPost) => (
        <div>{post.header.slice(0,50) + "..."}</div>
      ),
    },
    {
      id: "datePosted",
      header: "Date Posted",
      accessorKey: "datePosted",
      enableSorting: false,
      cell: (post: BlogPost) => (
        <div>{format(new Date(post.datePosted), "MMM dd, yyyy")}</div>
      ),
    },
    {
      id: "status",
      header: "Status",
      accessorKey: "isActive",
      enableSorting: false,
      cell: (post: BlogPost) => (
        <Badge className={post.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
          {post.isActive ? "Active" : "Inactive"}
        </Badge>
      ),
    },
  ]

  const actionMenu = {
    items: [
      {
        label: "View",
        icon: <Eye className="h-4 w-4" />,
        onClick: handleViewPost,
      },
      {
        label: "Edit",
        icon: <PenSquare className="h-4 w-4" />,
        onClick: handleEditPost,
      },
      {
        label: "Delete",
        icon: <Trash2 className="h-4 w-4" />,
        onClick: handleDeletePost,
        className: "text-red-600",
      },
    ],
  }

  const paginationConfig = {
    pageSize: itemsPerPage,
    totalItems: data?.metadata[0]?.total || 0,
    initialPage: currentPage,
    onPageChange: handlePageChange,
    serverSide: true,
  }

  if (isError) {
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Blog Posts</h1>
          <Button onClick={handleCreatePost} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create New Post
          </Button>
        </div>
        <div className="bg-white rounded-lg border p-8">
          <div className="text-center text-red-500">
            Error loading blog posts. Please try again.
          </div>
        </div>
      </div>
    )
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
          <DataTable
            columns={columns}
            data={data?.results || []}
            onRowClick={handleRowClick}
            actionMenu={actionMenu}
            pagination={paginationConfig}
            searchable={true}
            selectable={false}
            exportable={false}
            onSearch={handleSearch}
            searchValue={searchTerm}
            loading={isLoading}
            exportFileName="blog-posts"
          />
        </div>
      </div>
    </div>
  )
}

export default BlogListPage