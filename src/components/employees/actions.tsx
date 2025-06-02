
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreVertical, Eye, PenSquare, Trash2 } from "lucide-react"
import type { Employee } from "@/types/employee"

interface EmployeeActionsProps {
  employee: Employee
  onView: () => void
  onEdit: () => void
  onDelete: () => void
}

const EmployeeActions = ({  onView, onEdit, onDelete }: EmployeeActionsProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-4 w-4" />
          <span className="sr-only">More</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem className="flex items-center" onClick={onView}>
          <Eye className="mr-2 h-4 w-4" />
          <span>View profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="flex items-center" onClick={onEdit}>
          <PenSquare className="mr-2 h-4 w-4" />
          <span>Edit employee</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="flex items-center text-red-600" onClick={onDelete}>
          <Trash2 className="mr-2 h-4 w-4" />
          <span>Delete</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default EmployeeActions
