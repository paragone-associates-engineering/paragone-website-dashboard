
import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, Bell, BellOff, RefreshCw } from "lucide-react"
//import { useNavigate } from "react-router-dom"
import { useAuth } from "@/context/auth-context"
import { notificationService } from "@/services/notification-service"
import { SelectableNotificationItem } from "@/components/notifications/selectable-item"
import { BulkActions } from "@/components/notifications/bulk-action"
//import { toast } from "sonner"

export default function NotificationPage() {
  const { user } = useAuth()
  //const navigate = useNavigate()
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all")
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const {
    data: notificationsData,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => notificationService.getNotifications(),
    staleTime: 1000 * 60 * 2, 
  })

  const notifications = notificationsData?.results || []
  const metadata = notificationsData?.metadata?.[0] || { total: 0, totalPages: 0 }
  const groupedNotifications = notifications.reduce(
    (acc, notification) => {
      const type = notification.type.toLowerCase()
      if (!acc[type]) {
        acc[type] = []
      }
      acc[type].push(notification)
      return acc
    },
    {} as Record<string, typeof notifications>,
  )

  // Filter notifications based on read status
  const filterNotifications = (notifs: typeof notifications) => {
    if (!user) return notifs

    switch (filter) {
      case "unread":
        return notifs.filter((n) => !n.seenBy.includes(user.id))
      case "read":
        return notifs.filter((n) => n.seenBy.includes(user.id))
      default:
        return notifs
    }
  }

  const getUnreadCount = () => {
    if (!user) return 0
    return notifications.filter((n) => !n.seenBy.includes(user.id)).length
  }

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "new leads":
        return "text-green-600"
      case "expired listings":
        return "text-red-500"
      case "missed deadlines":
        return "text-purple-500"
      default:
        return "text-blue-600"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "new leads":
        return "👥"
      case "expired listings":
        return "⏰"
      case "missed deadlines":
        return "⚠️"
      default:
        return "📢"
    }
  }

  const handleSelectionChange = (ids: string[]) => {
    setSelectedIds(ids)
  }

  const handleItemSelectionChange = (id: string, selected: boolean) => {
    if (selected) {
      setSelectedIds((prev) => [...prev, id])
    } else {
      setSelectedIds((prev) => prev.filter((selectedId) => selectedId !== id))
    }
  }

  // Clear selection when filter changes
  const handleFilterChange = (newFilter: typeof filter) => {
    setFilter(newFilter)
    setSelectedIds([])
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Notifications</h1>
        </div>
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading notifications...</span>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Notifications</h1>
        </div>
        <div className="text-center text-red-500 py-12">
          <p>Error loading notifications. Please try again.</p>
          <Button onClick={() => refetch()} className="mt-4">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Notifications</h1>
            <p className="text-gray-600">
              {metadata.total} total notifications • {getUnreadCount()} unread
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching}>
              {isFetching ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-2 mt-4">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => handleFilterChange("all")}
          >
            All ({metadata.total})
          </Button>
          <Button
            variant={filter === "unread" ? "default" : "outline"}
            size="sm"
            onClick={() => handleFilterChange("unread")}
          >
            <Bell className="h-4 w-4 mr-1" />
            Unread ({getUnreadCount()})
          </Button>
          <Button
            variant={filter === "read" ? "default" : "outline"}
            size="sm"
            onClick={() => handleFilterChange("read")}
          >
            <BellOff className="h-4 w-4 mr-1" />
            Read ({metadata.total - getUnreadCount()})
          </Button>
        </div>
      </div>

      {notifications.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
            <p className="text-gray-500">You're all caught up! Check back later for new notifications.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Bulk Actions */}
          <BulkActions
            notifications={notifications}
            selectedIds={selectedIds}
            onSelectionChange={handleSelectionChange}
          />

          {Object.entries(groupedNotifications).map(([type, typeNotifications]) => {
            const filteredNotifications = filterNotifications(typeNotifications)

            if (filteredNotifications.length === 0) return null

            return (
              <Card key={type}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className={`text-lg font-medium ${getTypeColor(type)} flex items-center gap-2`}>
                      <span className="text-xl">{getTypeIcon(type)}</span>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </CardTitle>
                    <Badge variant="secondary" className="text-xs">
                      {filteredNotifications.length}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  {filteredNotifications.map((notification) => (
                    <SelectableNotificationItem
                      key={notification._id}
                      notification={notification}
                      isSelected={selectedIds.includes(notification.id)}
                      onSelectionChange={handleItemSelectionChange}
                    />
                  ))}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
