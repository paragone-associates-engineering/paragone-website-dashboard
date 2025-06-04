
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { notificationService, type Notification } from "@/services/notification-service"
import { useAuth } from "@/context/auth-context"
import { Check, CheckIcon as CheckAll, X } from "lucide-react"

interface BulkActionsProps {
  notifications: Notification[]
  selectedIds: string[]
  onSelectionChange: (ids: string[]) => void
}

export function BulkActions({ notifications, selectedIds, onSelectionChange }: BulkActionsProps) {
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const [isMarking, setIsMarking] = useState(false)

  const unreadNotifications = notifications.filter((n) => user && !n.seenBy.includes(user.id))
  const selectedNotifications = notifications.filter((n) => selectedIds.includes(n.id))
  const selectedUnreadIds = selectedNotifications.filter((n) => user && !n.seenBy.includes(user.id)).map((n) => n.id)

  const markAsReadMutation = useMutation({
    mutationFn: (notificationIds: string[]) => notificationService.markAsRead(notificationIds),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] })
      toast.success(`${variables.length} notification${variables.length > 1 ? "s" : ""} marked as read`)
      onSelectionChange([])
    },
    onError: () => {
      toast.error("Failed to mark notifications as read")
    },
    onSettled: () => {
      setIsMarking(false)
    },
  })

  const handleSelectAll = () => {
    if (selectedIds.length === notifications.length) {
      onSelectionChange([])
    } else {
      onSelectionChange(notifications.map((n) => n.id))
    }
  }

  const handleSelectAllUnread = () => {
    const unreadIds = unreadNotifications.map((n) => n.id)
    if (selectedIds.length === unreadIds.length && unreadIds.every((id) => selectedIds.includes(id))) {
      onSelectionChange([])
    } else {
      onSelectionChange(unreadIds)
    }
  }

  const handleMarkSelectedAsRead = () => {
    if (selectedUnreadIds.length === 0) {
      toast.info("No unread notifications selected")
      return
    }

    setIsMarking(true)
    markAsReadMutation.mutate(selectedUnreadIds)
  }

  const handleMarkAllUnreadAsRead = () => {
    const unreadIds = unreadNotifications.map((n) => n.id)
    if (unreadIds.length === 0) {
      toast.info("No unread notifications to mark")
      return
    }

    setIsMarking(true)
    markAsReadMutation.mutate(unreadIds)
  }

  const handleClearSelection = () => {
    onSelectionChange([])
  }

  if (notifications.length === 0) return null

  return (
    <div className="bg-gray-50 border rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4 flex-wrap">
          {/* Select All Checkbox */}
          <div className="flex items-center gap-2">
            <Checkbox
              checked={selectedIds.length === notifications.length}
              onCheckedChange={handleSelectAll}
              className="data-[state=checked]:bg-primary"
            />
            <span className="text-sm font-medium">
              Select All ({selectedIds.length}/{notifications.length})
            </span>
          </div>

          {/* Quick Select Buttons */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSelectAllUnread}
              disabled={unreadNotifications.length === 0}
            >
              <CheckAll className="h-4 w-4 mr-1" />
              Select Unread ({unreadNotifications.length})
            </Button>

            {selectedIds.length > 0 && (
              <Button variant="outline" size="sm" onClick={handleClearSelection}>
                <X className="h-4 w-4 mr-1" />
                Clear Selection
              </Button>
            )}
          </div>

          {/* Selection Info */}
          {selectedIds.length > 0 && (
            <Badge variant="secondary" className="text-xs">
              {selectedIds.length} selected • {selectedUnreadIds.length} unread
            </Badge>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {selectedIds.length > 0 && selectedUnreadIds.length > 0 && (
            <Button
              onClick={handleMarkSelectedAsRead}
              disabled={isMarking}
              size="sm"
              className="bg-green-600 hover:bg-green-700"
            >
              <Check className="h-4 w-4 mr-1" />
              Mark Selected as Read ({selectedUnreadIds.length})
            </Button>
          )}

          {unreadNotifications.length > 0 && (
            <Button
              onClick={handleMarkAllUnreadAsRead}
              disabled={isMarking}
              variant="outline"
              size="sm"
              className="border-green-600 text-green-600 hover:bg-green-50"
            >
              <CheckAll className="h-4 w-4 mr-1" />
              Mark All Unread as Read ({unreadNotifications.length})
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
