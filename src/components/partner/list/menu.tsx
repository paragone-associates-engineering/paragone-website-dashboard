

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreVertical, Pencil, Eye, Power, PowerOff } from "lucide-react"
import type { Partner } from "@/services/partner-list-service"

interface PartnerMenuProps {
  partner: Partner
  onEdit: (partner: Partner) => void
  onView: (partner: Partner) => void
  onToggleStatus: (partner: Partner) => void
}

export function PartnerMenu({ partner, onEdit, onView, onToggleStatus }: PartnerMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreVertical className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onView(partner)}>
          <Eye className="mr-2 h-4 w-4" />
          <span>View details</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onEdit(partner)}>
          <Pencil className="mr-2 h-4 w-4" />
          <span>Edit partner</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onToggleStatus(partner)}>
          {partner.isActive ? (
            <>
              <PowerOff className="mr-2 h-4 w-4 text-red-500" />
              <span className="text-red-500">Deactivate</span>
            </>
          ) : (
            <>
              <Power className="mr-2 h-4 w-4 text-green-500" />
              <span className="text-green-500">Activate</span>
            </>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
