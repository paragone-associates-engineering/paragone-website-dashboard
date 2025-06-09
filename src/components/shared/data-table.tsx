/* eslint-disable @typescript-eslint/no-explicit-any */

import type React from "react"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { MoreVertical, ChevronLeft, ChevronRight, Star } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"


export interface Column {
  id: string
  header: string
  accessorKey: string
  cell?: (info: any) => React.ReactNode
  enableSorting?: boolean
}

interface DataTableProps {
  columns: Column[]
  data: any[]
  onRowClick?: (row: any) => void
  onRowSelect?: (selectedRows: any[]) => void
  actionMenu?: {
    items: {
      label: string
      icon?: React.ReactNode
      onClick: (row: any) => void
      className?: string
    }[]
  }
  pagination?: {
    pageSize?: number
    totalItems?: number
    initialPage?: number
    onPageChange?: (page: number, pageSize: number) => void
    serverSide?: boolean
  }
  isFeatured?:boolean
   removeFeatured?: (id:string) => void
  searchable?: boolean
  selectable?: boolean
  className?: string
  onSearch?: (query: string) => void
  loading?: boolean
}

export function DataTable({
  columns,
  data,
  onRowClick,
  onRowSelect,
  actionMenu,
  removeFeatured,
  pagination = { pageSize: 10, initialPage: 1, serverSide: false },
  searchable = true,
  selectable = true,
  className,
  onSearch,
  loading = false,
}: DataTableProps) {
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(pagination.initialPage || 1)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<{ column: string; direction: "asc" | "desc" } | null>(null)
  const [itemsPerPage, setItemsPerPage] = useState(pagination.pageSize || 10)

 
  useEffect(() => {
    if (pagination.serverSide && searchQuery !== "") {
      setCurrentPage(1)
    }
  }, [searchQuery, pagination.serverSide])

  // Handle search with debouncing for server-side
  useEffect(() => {
    if (pagination.serverSide && onSearch) {
      const timeoutId = setTimeout(() => {
        onSearch(searchQuery)
      }, 800)
      return () => clearTimeout(timeoutId)
    }
  }, [searchQuery, onSearch, pagination.serverSide])

  // Handle page changes for server-side pagination
  useEffect(() => {
    if (pagination.serverSide && pagination.onPageChange) {
      pagination.onPageChange(currentPage, itemsPerPage)
    }
  }, [currentPage, itemsPerPage, pagination])

  // Client-side filtering and processing
  const processedData = (() => {
    if (pagination.serverSide) {
      // For server-side, use data as-is since filtering/pagination is handled by API
      return data
    }

    // Client-side processing
    let filteredData = searchQuery
      ? data.filter((item) =>
          Object.values(item).some(
            (value) => value && value.toString().toLowerCase().includes(searchQuery.toLowerCase()),
          ),
        )
      : data

    // Sort data if sortBy is set (client-side only)
    if (sortBy) {
      filteredData = [...filteredData].sort((a, b) => {
        const aValue = a[sortBy.column]
        const bValue = b[sortBy.column]

        if (aValue === bValue) return 0

        if (sortBy.direction === "asc") {
          return aValue > bValue ? 1 : -1
        } else {
          return aValue < bValue ? 1 : -1
        }
      })
    }

    // Paginate data (client-side only)
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredData.slice(startIndex, startIndex + itemsPerPage)
  })()

  // Calculate pagination info
  const totalItems = pagination.serverSide 
    ? (pagination.totalItems || 0) 
    : (searchQuery 
        ? data.filter((item) =>
            Object.values(item).some(
              (value) => value && value.toString().toLowerCase().includes(searchQuery.toLowerCase()),
            ),
          ).length
        : data.length)
  
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = pagination.serverSide ? (currentPage - 1) * itemsPerPage : (currentPage - 1) * itemsPerPage
  const endIndex = pagination.serverSide 
    ? Math.min(startIndex + itemsPerPage, totalItems)
    : Math.min(startIndex + processedData.length, totalItems)

  // Handle row selection
  const toggleRowSelection = (id: string) => {
    setSelectedRows((prev) => {
      const newSelection = prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
      if (onRowSelect) {
        const selectedItems = data.filter((item) => newSelection.includes(item.id))
        onRowSelect(selectedItems)
      }
      return newSelection
    })
  }

  const toggleAllRows = () => {
    const currentPageData = pagination.serverSide ? data : processedData
    if (selectedRows.length === currentPageData.length) {
      setSelectedRows([])
      if (onRowSelect) onRowSelect([])
    } else {
      const allIds = currentPageData.map((item) => item.id)
      setSelectedRows(allIds)
      if (onRowSelect) onRowSelect(currentPageData)
    }
  }

  // Handle sorting (only for client-side)
  const handleSort = (column: string) => {
    if (pagination.serverSide) return // Don't sort on client-side for server-side pagination
    
    if (sortBy?.column === column) {
      setSortBy(sortBy.direction === "asc" ? { column, direction: "desc" } : null)
    } else {
      setSortBy({ column, direction: "asc" })
    }
  }

  
  // Handle page size change
  const handlePageSizeChange = (newPageSize: number) => {
    setItemsPerPage(newPageSize)
    setCurrentPage(1) 
  }

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
  }

  return (
    <div className={`bg-white rounded-lg border ${className}`}>
      {searchable && (
        <div className="p-4 flex justify-between items-center border-b">
          <div className="flex items-center gap-2">
            <Select value={itemsPerPage.toString()} onValueChange={(value) => handlePageSizeChange(Number(value))}>
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Show" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="30">30</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Input
              type="search"
              placeholder="Search..."
              className="sm:w-[300px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              disabled={loading}
            />
          </div>
        </div>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            {selectable && (
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedRows.length > 0 && selectedRows.length === (pagination.serverSide ? data.length : processedData.length)}
                  onCheckedChange={toggleAllRows}
                />
              </TableHead>
            )}
            {columns.map((column) => (
              <TableHead
                key={column.id}
                className={column.enableSorting && !pagination.serverSide ? "cursor-pointer" : ""}
                onClick={column.enableSorting && !pagination.serverSide ? () => handleSort(column.accessorKey) : undefined}
              >
                <div className="flex items-center">
                  {column.header}
                  {sortBy?.column === column.accessorKey && !pagination.serverSide && (
                    <span className="ml-1">{sortBy.direction === "asc" ? "↑" : "↓"}</span>
                  )}
                </div>
              </TableHead>
            ))}
            {actionMenu && <TableHead className="w-12"></TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={columns.length + (selectable ? 1 : 0) + (actionMenu ? 1 : 0)} className="text-center py-8">
                Loading...
              </TableCell>
            </TableRow>
          ) : processedData.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length + (selectable ? 1 : 0) + (actionMenu ? 1 : 0)} className="text-center py-8">
                No data found
              </TableCell>
            </TableRow>
          ) : (
            processedData.map((row) => (
              <TableRow
                key={row.id}
                className={onRowClick ? "cursor-pointer" : ""}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
              >
                <TableCell onClick={(e) => {
                  e.stopPropagation();
                  removeFeatured?.(row?.id)
                  }}>
  {row?.featured && (
    <Star className="fill-primary stroke-primary text-sm" />
  )}
</TableCell>
                {selectable && (
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={selectedRows.includes(row.id)}
                      onCheckedChange={() => toggleRowSelection(row.id)}
                    />
                  </TableCell>
                )}
                
                {columns.map((column) => (
                  <TableCell key={`${row.id}-${column.id}`}>
                    {column.cell ? column.cell(row) : row[column.accessorKey]}
                  </TableCell>
                ))}
                {actionMenu && (
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {actionMenu.items.map((item, index) => (
                          <DropdownMenuItem
                            key={index}
                            className={`flex items-center ${item.className || ""}`}
                            onClick={() => item.onClick(row)}
                          >
                            {item.icon && <span className="mr-2">{item.icon}</span>}
                            <span>{item.label}</span>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {pagination && totalPages > 0 && (
        <div className="flex items-center justify-between p-4 border-t">
          <div className="text-sm text-gray-500">
            Showing {startIndex + 1} - {endIndex} of {totalItems} results
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1 || loading}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {Array.from({ length: Math.min(5, totalPages) }).map((_, index) => {
              let pageNumber: number
              if (totalPages <= 5) {
                pageNumber = index + 1
              } else if (currentPage <= 3) {
                pageNumber = index + 1
              } else if (currentPage >= totalPages - 2) {
                pageNumber = totalPages - 4 + index
              } else {
                pageNumber = currentPage - 2 + index
              }

              if (pageNumber <= totalPages && pageNumber >= 1) {
                return (
                  <Button
                    key={pageNumber}
                    variant={currentPage === pageNumber ? "default" : "outline"}
                    size="sm"
                    className={currentPage === pageNumber ? "bg-primary hover:bg-primary/80" : ""}
                    onClick={() => handlePageChange(pageNumber)}
                    disabled={loading}
                  >
                    {pageNumber}
                  </Button>
                )
              }
              return null
            })}
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages || loading}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export function StatusBadge({ status }: { status: string }) {
  const getStatusStyles = () => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800 hover:bg-green-200 py-2"
      case "inactive":
        return "bg-red-100 text-red-800 hover:bg-red-200 py-2"
      case "pending":
        return "bg-[#5A6164] hover:bg-gray-600 py-2"
      case "in progress":
        return "bg-primary hover:bg-primary/80 py-2"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200 py-2"
    }
  }

  return <Badge className={getStatusStyles()}>{status}</Badge>
}