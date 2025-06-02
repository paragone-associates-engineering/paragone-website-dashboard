import type React from "react"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { getUsers } from "@/services/user-service"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Loader } from "@/components/ui/loader"
import { MoreVertical, Eye, PenSquare, Trash2 } from "lucide-react"
import type { User } from "@/types/user"

interface UserListProps {
  onViewUser: (user: User) => void
  onEditUser: (user: User) => void
  onDeleteUser: (user: User) => void
  onAddUser: () => void
}

const UserList = ({ onViewUser, onEditUser, onDeleteUser, onAddUser }: UserListProps) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [limit, setLimit] = useState("10")
  const [page, setPage] = useState(1)

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["users", page, limit, searchTerm],
    queryFn: () => getUsers(page, Number.parseInt(limit), searchTerm),
  })

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    setPage(1) 
  }

  const handleLimitChange = (value: string) => {
    setLimit(value)
    setPage(1) 
  }

  if (isError) {
    return (
      <div className="p-4 text-center">
        <p className="text-red-500">Error loading users: {(error as Error).message}</p>
        <Button onClick={() => window.location.reload()} className="mt-2">
          Retry
        </Button>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border mb-6">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">All users</h2>
      </div>

      <div className="p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Select defaultValue={limit} onValueChange={handleLimitChange}>
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Show" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="30">30</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-sm text-gray-500">entries</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Input placeholder="Search users..." className="w-[300px]" value={searchTerm} onChange={handleSearch} />
          </div>
          <Button onClick={onAddUser}>Add user</Button>
        </div>
      </div>

      {isLoading ? (
       <Loader />
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Phone Number</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.results && data.results.length > 0 ? (
                data.results.map((user) => (
                  <TableRow key={user?.id}>
                    <TableCell>{`${user?.firstName} ${user?.lastName}`}</TableCell>
                    <TableCell>{user?.email}</TableCell>
                    <TableCell>{user?.role || "N/A"}</TableCell>
                    <TableCell>{user?.phoneNumber || "N/A"}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          user.isActive
                            ? "bg-green-100 text-green-800 hover:bg-green-200"
                            : "bg-red-100 text-red-800 hover:bg-red-200"
                        }
                      >
                        {user.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">More</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="flex items-center" onClick={() => onViewUser(user)}>
                            <Eye className="mr-2 h-4 w-4" />
                            <span>View profile</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="flex items-center" onClick={() => onEditUser(user)}>
                            <PenSquare className="mr-2 h-4 w-4" />
                            <span>Edit user</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="flex items-center text-red-600"
                            onClick={() => onDeleteUser(user)}
                          >
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
                  <TableCell colSpan={6} className="text-center py-8">
                    No users found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {data?.metadata && data.metadata[0] && (
            <div className="p-4 flex justify-between items-center">
              <div className="text-sm text-gray-500">
                Showing {(page - 1) * Number.parseInt(limit) + 1} to{" "}
                {Math.min(page * Number.parseInt(limit), data.metadata[0].total)} of {data.metadata[0].total} entries
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page >= data.metadata[0].totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default UserList
