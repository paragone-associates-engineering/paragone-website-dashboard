
import type React from "react"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { format } from "date-fns"
import { Link } from "react-router-dom"
import { toast } from "sonner"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MoreVertical, ChevronDown, Loader2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import StatusDropdown from "@/components/listings/status-dropdown"
import { listingService } from "@/services/listings-service"
import type { Listing } from "@/types/listings"

const PropertyListing = () => {
  const [selectedListings, setSelectedListings] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const listingsPerPage = 10
  const queryClient = useQueryClient()

  // Fetch listings
  const listingsQuery = useQuery({
    queryKey: ["listings", searchQuery, currentPage],
    queryFn: () =>
      listingService.getListings({
        page: currentPage,
        limit: listingsPerPage,
        search: searchQuery || undefined,
      }),
  })

  // Update listing status mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({ listingId, isActive }: { listingId: string; isActive: boolean }) =>
      listingService.updateListingStatus(listingId, { isActive }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listings"] })
    },
  })

  // Delete listing mutation
  const deleteMutation = useMutation({
    mutationFn: (listingId: string) => listingService.deleteListing(listingId),
    onSuccess: () => {
      toast.success("Listing deleted successfully")
      queryClient.invalidateQueries({ queryKey: ["listings"] })
    },
    onError: (error) => {
      console.error("Error deleting listing:", error)
      toast.error("Failed to delete listing")
    },
  })

  const handleStatusChange = async (listingId: string, isActive: boolean) => {
    await updateStatusMutation.mutateAsync({ listingId, isActive })
  }

  const handleDelete = (listing: Listing) => {
    if (window.confirm(`Are you sure you want to delete ${listing.propertyName}?`)) {
      deleteMutation.mutate(listing.id)
    }
  }

  const toggleListing = (id: string) => {
    setSelectedListings((prev) => (prev.includes(id) ? prev.filter((listingId) => listingId !== id) : [...prev, id]))
  }

  const toggleAllListings = () => {
    const listings = listingsQuery.data?.results || []
    setSelectedListings(selectedListings.length === listings.length ? [] : listings.map((listing) => listing.id))
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    setCurrentPage(1)
  }

  // Format number with commas
  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }

  // Calculate total pages
  const totalPages = listingsQuery.data?.metadata[0]?.totalPages || 1

  return (
    <div className="p-6 lg:max-w-[960px] xl:max-w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Property Listing</h1>
        <div className="flex items-center gap-4">
          <Input
            type="search"
            placeholder="Search properties..."
            className="w-[300px]"
            value={searchQuery}
            onChange={handleSearch}
          />
          <Link to="/property/add">
            <Button className="bg-primary hover:bg-yellow-600">Add Property</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardContent className="p-6 flex items-center">
            <div className="flex-1">
              <h2 className="text-4xl font-bold">{listingsQuery.data?.metadata[0]?.total || 0}</h2>
              <p className="text-gray-500">Total Properties</p>
            </div>
            <div className="bg-gray-100 p-4 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6"
              >
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center">
            <div className="flex-1">
              <h2 className="text-4xl font-bold">
                {listingsQuery.data?.results.filter((listing) => listing.isActive).length || 0}
              </h2>
              <p className="text-gray-500">Active Properties</p>
            </div>
            <div className="bg-gray-100 p-4 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6 text-green-500"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-white rounded-lg border overflow-hidden">
        {listingsQuery.isLoading ? (
          <div className="flex justify-center items-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-yellow-500" />
            <span className="ml-2">Loading properties...</span>
          </div>
        ) : listingsQuery.isError ? (
          <div className="flex justify-center items-center p-12 text-red-500">
            Error loading properties. Please try again.
          </div>
        ) : (
          <div className='overflow-hidden'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={
                      selectedListings.length === listingsQuery?.data?.results.length &&
                      listingsQuery?.data?.results?.length > 0
                    }
                    onCheckedChange={toggleAllListings}
                  />
                </TableHead>
                <TableHead>ID</TableHead>
                <TableHead>
                  Date <ChevronDown className="inline-block h-4 w-4" />
                </TableHead>
                <TableHead>Property Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Listing Type</TableHead>
                <TableHead>Area (sqft)</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-12">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {listingsQuery?.data?.results.map((listing: Listing) => (
                <TableRow key={listing.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedListings.includes(listing.id)}
                      onCheckedChange={() => toggleListing(listing.id)}
                    />
                  </TableCell>
                  <TableCell>{listing.id}</TableCell>
                  <TableCell>{format(new Date(listing.createdAt), "dd/MM/yyyy")}</TableCell>
                  <TableCell>{listing.propertyName}</TableCell>
                  <TableCell>
                    <div>{listing.propertyType}</div>
                    <div className="text-sm text-gray-500">{listing.propertyCategory}</div>
                  </TableCell>
                  <TableCell>{listing?.location?.region}</TableCell>
                  <TableCell>₦{formatNumber(listing.amount)}</TableCell>
                  <TableCell>{listing.listingType}</TableCell>
                  <TableCell>{listing.area}</TableCell>
                  <TableCell>
                    <StatusDropdown listing={listing} onStatusChange={handleStatusChange} />
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <Link to={`/property/detail/${listing.id}`}>
                          <DropdownMenuItem>View details</DropdownMenuItem>
                        </Link>
                        <Link to={`/property/edit/${listing.id}`}>
                          <DropdownMenuItem>Edit property</DropdownMenuItem>
                        </Link>
                        <DropdownMenuItem onClick={() => handleDelete(listing)} className="text-red-600">
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </div>
        )}

        {listingsQuery.data && (
          <div className="flex items-center justify-between p-4 border-t">
            <div className="text-sm text-gray-500">
              Showing {(currentPage - 1) * listingsPerPage + 1} to{" "}
              {Math.min(currentPage * listingsPerPage, listingsQuery.data.metadata[0].total)} of{" "}
              {listingsQuery.data.metadata[0].total} results
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </Button>

              {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                const pageNumber = i + 1
                return (
                  <Button
                    key={pageNumber}
                    variant={currentPage === pageNumber ? "default" : "outline"}
                    size="sm"
                    className={currentPage === pageNumber ? "bg-yellow-500 hover:bg-yellow-600" : ""}
                    onClick={() => setCurrentPage(pageNumber)}
                  >
                    {pageNumber}
                  </Button>
                )
              })}

              {totalPages > 3 && currentPage > 2 && (
                <>
                  {currentPage > 3 && <span className="mx-1">...</span>}
                  <Button
                    variant={currentPage === totalPages ? "default" : "outline"}
                    size="sm"
                    className={currentPage === totalPages ? "bg-yellow-500 hover:bg-yellow-600" : ""}
                    onClick={() => setCurrentPage(totalPages)}
                  >
                    {totalPages}
                  </Button>
                </>
              )}

              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PropertyListing
