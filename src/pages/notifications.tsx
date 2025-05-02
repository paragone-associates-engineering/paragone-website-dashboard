
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Notification {
  id: string
  type: "mention"
  user: {
    name: string
    avatar: string
  }
  project: string
  time: string
  date: string
}

const notifications: Notification[] = [
  {
    id: "1",
    type: "mention",
    user: {
      name: "Andy Johnson",
      avatar: "/placeholder.svg",
    },
    project: "Unicoz Project",
    time: "3mins ago",
    date: "Monday, June 31 2020",
  },
  {
    id: "2",
    type: "mention",
    user: {
      name: "Levi Ackerman",
      avatar: "/placeholder.svg",
    },
    project: "Unicoz Project",
    time: "3mins ago",
    date: "Monday, June 31 2020",
  },
  {
    id: "3",
    type: "mention",
    user: {
      name: "Abdul Majid",
      avatar: "/placeholder.svg",
    },
    project: "Unicoz Project",
    time: "3mins ago",
    date: "Monday, June 31 2020",
  },
]

const NotificationPage = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Notification</h1>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium text-primary">New leads</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {notifications.map((notification) => (
              <div key={notification.id} className="flex items-start gap-4">
                <div className="text-sm text-gray-500 w-20">{notification.time}</div>
                <Avatar className="h-10 w-10 bg-green-100">
                  <AvatarImage src={notification.user.avatar || "/placeholder.svg"} alt={notification.user.name} />
                  <AvatarFallback>{notification.user.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center">
                    <span className="font-medium">{notification.user.name}</span>
                    <span className="ml-1 text-gray-500">mention you in</span>
                    <span className="ml-1 text-primary">{notification.project}</span>
                  </div>
                  <div className="text-sm text-gray-500">{notification.date}</div>
                </div>
                <Button className="bg-green-100 text-green-800 hover:bg-green-200 hover:text-green-900">
                  Go to details
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium text-red-500">Expired listings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {notifications.map((notification) => (
              <div key={notification.id} className="flex items-start gap-4">
                <div className="text-sm text-gray-500 w-20">{notification.time}</div>
                <Avatar className="h-10 w-10 bg-yellow-100">
                  <AvatarImage src={notification.user.avatar || "/placeholder.svg"} alt={notification.user.name} />
                  <AvatarFallback>{notification.user.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center">
                    <span className="font-medium">{notification.user.name}</span>
                    <span className="ml-1 text-gray-500">mention you in</span>
                    <span className="ml-1 text-primary">{notification.project}</span>
                  </div>
                  <div className="text-sm text-gray-500">{notification.date}</div>
                </div>
                <Button className="bg-green-100 text-green-800 hover:bg-green-200 hover:text-green-900">
                  Go to details
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium text-purple-500">Missed deadlines</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {notifications.map((notification) => (
              <div key={notification.id} className="flex items-start gap-4">
                <div className="text-sm text-gray-500 w-20">{notification.time}</div>
                <Avatar className="h-10 w-10 bg-purple-100">
                  <AvatarImage src={notification.user.avatar || "/placeholder.svg"} alt={notification.user.name} />
                  <AvatarFallback>{notification.user.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center">
                    <span className="font-medium">{notification.user.name}</span>
                    <span className="ml-1 text-gray-500">mention you in</span>
                    <span className="ml-1 text-primary">{notification.project}</span>
                  </div>
                  <div className="text-sm text-gray-500">{notification.date}</div>
                </div>
                <Button className="bg-green-100 text-green-800 hover:bg-green-200 hover:text-green-900">
                  Go to details
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default NotificationPage
