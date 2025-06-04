

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { useNavigate } from "react-router-dom"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { notificationService, type Notification } from "@/services/notification-service"
import { useAuth } from "@/context/auth-context"
import { formatDistanceToNow } from "date-fns"
import { ExternalLink, } from "lucide-react"

interface SelectableNotificationItemProps {
  notification: Notification
  isSelected: boolean
  onSelectionChange: (id: string, selected: boolean) => void
}

export function SelectableNotificationItem({
  notification,
  isSelected,
  onSelectionChange,
}: SelectableNotificationItemProps) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { user } = useAuth()
  
  const isRead = user ? notification.seenBy.includes(user.id) : false

  const markAsReadMutation = useMutation({
    mutationFn: (notificationIds: string[]) => notificationService.markAsRead(notificationIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] })
      toast.success("Notification marked as read")
    },
    onError: () => {
      toast.error("Failed to mark notification as read")
    },
    
  })

  // const handleMarkAsRead = async (e: React.MouseEvent) => {
  //   e.stopPropagation()
  //   if (isRead || isMarking) return

  //   setIsMarking(true)
  //   markAsReadMutation.mutate([notification.id])
  // }

  const handleGoToDetails = () => {
    // Mark as read when navigating
    if (!isRead) {
      markAsReadMutation.mutate([notification.id])
    }

    // Navigate to the link
    if (notification.link) {
      navigate(notification.link)
    }
  }

  const handleSelectionChange = (checked: boolean) => {
    onSelectionChange(notification.id, checked)
  }

  const getTimeAgo = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true })
    } catch {
      return "Unknown time"
    }
  }

  const getFormattedDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    } catch {
      return "Unknown date"
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "new leads":
        return "👤"
      case "expired listings":
        return "⏰"
      case "missed deadlines":
        return "⚠️"
      default:
        return "📢"
    }
  }

  const getAvatarColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "new leads":
        return "bg-green-100"
      case "expired listings":
        return "bg-yellow-100"
      case "missed deadlines":
        return "bg-red-100"
      default:
        return "bg-blue-100"
    }
  }

  return (
    <div
      className={`flex items-start gap-4 p-4 rounded-lg border transition-colors ${
        isSelected
          ? "bg-blue-50 border-blue-300"
          : isRead
            ? "bg-gray-50 border-gray-200"
            : "bg-white border-blue-200 shadow-sm"
      }`}
    >
      {/* Selection Checkbox */}
      <div className="flex items-center pt-1">
        <Checkbox
          checked={isSelected}
          onCheckedChange={handleSelectionChange}
          className="data-[state=checked]:bg-primary"
        />
      </div>

      

      <Avatar className={`h-10 w-10 ${getAvatarColor(notification.type)}`}>
        <AvatarFallback className="text-lg">{getNotificationIcon(notification.type)}</AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant={isRead ? "secondary" : "default"} className="text-xs">
              {notification.type}
            </Badge>
            {!isRead && (
              <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                New
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
           <div className="text-xs text-gray-500  whitespace-nowrap">{getTimeAgo(notification.createdAt)}</div>
          </div>
        </div>

        <div className="text-sm text-gray-900 py-5 mb-2 line-clamp-3">{notification.message}</div>

        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-500">{getFormattedDate(notification.createdAt)}</div>

          {notification.link && (
            <Button
              onClick={handleGoToDetails}
              size="sm"
              className="bg-green-100 text-green-800 hover:bg-green-200 hover:text-green-900 h-8"
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              Go to details
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
