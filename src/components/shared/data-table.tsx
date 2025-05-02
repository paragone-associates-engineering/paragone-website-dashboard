/* eslint-disable @typescript-eslint/no-explicit-any */

import type React from "react"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { MoreVertical, ChevronLeft, ChevronRight } from "lucide-react"
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
  }
  searchable?: boolean
  selectable?: boolean
  className?: string
}

export function DataTable({
  columns,
  data,
  onRowClick,
  onRowSelect,
  actionMenu,
  pagination = { pageSize: 10, initialPage: 1 },
  searchable = true,
  selectable = true,
  className,
}: DataTableProps) {
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(pagination.initialPage || 1)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<{ column: string; direction: "asc" | "desc" } | null>(null)
  const [itemsPerPage, setItemsPerPage] = useState(pagination.pageSize || 10)

  // Filter data based on search query
  const filteredData = searchQuery
    ? data.filter((item) =>
        Object.values(item).some(
          (value) => value && value.toString().toLowerCase().includes(searchQuery.toLowerCase()),
        ),
      )
    : data

  // Sort data if sortBy is set
  const sortedData = sortBy
    ? [...filteredData].sort((a, b) => {
        const aValue = a[sortBy.column]
        const bValue = b[sortBy.column]

        if (aValue === bValue) return 0

        if (sortBy.direction === "asc") {
          return aValue > bValue ? 1 : -1
        } else {
          return aValue < bValue ? 1 : -1
        }
      })
    : filteredData

  // Paginate data
  const totalPages = Math.ceil(sortedData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedData = sortedData.slice(startIndex, startIndex + itemsPerPage)

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
    if (selectedRows.length === paginatedData.length) {
      setSelectedRows([])
      if (onRowSelect) onRowSelect([])
    } else {
      const allIds = paginatedData.map((item) => item.id)
      setSelectedRows(allIds)
      if (onRowSelect) onRowSelect(paginatedData)
    }
  }

  // Handle sorting
  const handleSort = (column: string) => {
    if (sortBy?.column === column) {
      setSortBy(sortBy.direction === "asc" ? { column, direction: "desc" } : null)
    } else {
      setSortBy({ column, direction: "asc" })
    }
  }

  return (
    <div className={`bg-white rounded-lg border ${className}`}>
      {searchable && (
        <div className="p-4 flex justify-between items-center border-b">
          <div className="flex items-center gap-2">
            <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(Number(value))}>
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
                  checked={selectedRows.length > 0 && selectedRows.length === paginatedData.length}
                  onCheckedChange={toggleAllRows}
                />
              </TableHead>
            )}
            {columns.map((column) => (
              <TableHead
                key={column.id}
                className={column.enableSorting ? "cursor-pointer" : ""}
                onClick={column.enableSorting ? () => handleSort(column.accessorKey) : undefined}
              >
                <div className="flex items-center">
                  {column.header}
                  {sortBy?.column === column.accessorKey && (
                    <span className="ml-1">{sortBy.direction === "asc" ? "↑" : "↓"}</span>
                  )}
                </div>
              </TableHead>
            ))}
            {actionMenu && <TableHead className="w-12"></TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedData.map((row) => (
            <TableRow
              key={row.id}
              className={onRowClick ? "cursor-pointer" : ""}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
            >
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
          ))}
        </TableBody>
      </Table>

      {pagination && totalPages > 0 && (
        <div className="flex items-center justify-between p-4 border-t">
          <div className="text-sm text-gray-500">
            Showing {startIndex + 1} - {Math.min(startIndex + itemsPerPage, sortedData.length)} of {sortedData.length}{" "}
            results
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {Array.from({ length: Math.min(3, totalPages) }).map((_, index) => {
              const pageNumber = currentPage <= 2 ? index + 1 : currentPage - 1 + index
              if (pageNumber <= totalPages) {
                return (
                  <Button
                    key={pageNumber}
                    variant={currentPage === pageNumber ? "default" : "outline"}
                    size="sm"
                    className={currentPage === pageNumber ? "bg-primary hover:bg-primary/80" : ""}
                    onClick={() => setCurrentPage(pageNumber)}
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
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
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
