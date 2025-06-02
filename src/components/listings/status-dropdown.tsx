
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronDown, Circle, Loader2 } from "lucide-react"
import { toast } from "sonner"
import type { Listing } from "@/types/listings"

interface StatusDropdownProps {
  listing: Listing
  onStatusChange: (listingId: string, isActive: boolean) => Promise<void>
}

const StatusDropdown = ({ listing, onStatusChange }: StatusDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  const handleStatusChange = async (newStatus: boolean) => {
    if (newStatus === listing.isActive) return

    setIsUpdating(true)
    try {
      await onStatusChange(listing.id, newStatus)
      toast.success(`Listing status updated to ${newStatus ? "Active" : "Inactive"}`)
    } catch (error) {
      console.error("Error updating listing status:", error)
      toast.error("Failed to update listing status")
    } finally {
      setIsUpdating(false)
      setIsOpen(false)
    }
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={isUpdating}>
          {isUpdating ? (
            <Loader2 className="h-4 w-4 animate-spin mr-1" />
          ) : (
            <Badge className={listing.isActive ? "bg-green-500" : "bg-gray-500"}>
              {listing.isActive ? "Active" : "Inactive"}
            </Badge>
          )}
          <ChevronDown className="h-4 w-4 ml-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleStatusChange(true)}>
          <Circle className={`h-4 w-4 mr-2 ${listing.isActive ? "text-green-500 fill-green-500" : "text-gray-300"}`} />
          Active
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleStatusChange(false)}>
          <Circle className={`h-4 w-4 mr-2 ${!listing.isActive ? "text-gray-500 fill-gray-500" : "text-gray-300"}`} />
          Inactive
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default StatusDropdown
