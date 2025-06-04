import api from "@/lib/api"

export interface NotificationMetadata {
  total: number
  totalPages: number
}

export interface Notification {
  _id: string
  id: string
  message: string
  type: string
  seenBy: string[]
  link: string
  recordId: string
  targetRoles: string[]
  isActive: boolean
  createdBy: string
  lastUpdatedBy: string
  expiresAt: string
  createdAt: string
  updatedAt: string
  __v: number
}

export interface NotificationsResponse {
  metadata: NotificationMetadata[]
  results: Notification[]
}

export interface UpdateNotificationSeenRequestDTO {
  notificationIds: string[]
}

export const notificationService = {
  getNotifications: async (params?: { page?: number; limit?: number }) => {
    const response = await api.get<NotificationsResponse>("/notification/get-notifications", { params })
    return response.data
  },

  markAsRead: async (notificationIds: string[]) => {
    const response = await api.post("/notification/update-seen", {
      notificationIds,
    })
    return response.data
  },
}
