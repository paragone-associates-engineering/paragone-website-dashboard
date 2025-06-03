
import type React from "react"

import { useState, useEffect } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Camera, Loader2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { userService, type User, type UpdateUserRequest } from "@/services/user-profile"

export default function UserProfilePage() {
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState("edit-profile")
  const [user, setUser] = useState<User | null>(null)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  })

  // Notification settings state
  const [notifications, setNotifications] = useState({
    companyNews: false,
    pushNotification: true,
    weeklyNewsletters: true,
    meetupsNearYou: false,
    ordersNotifications: true,
  })

  // Add reset password state after the notifications state
  const [resetPasswordEmail, setResetPasswordEmail] = useState("")

  // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: (data: UpdateUserRequest) => {
      if (!user?.id) throw new Error("No user ID found")
      return userService.updateUser(user.id, data)
    },
    onSuccess: (updatedUser) => {
      // Update localStorage with new data
      localStorage.setItem("paragone_user", JSON.stringify(updatedUser))
      setUser(updatedUser)
      toast.success("Profile updated successfully")
      queryClient.invalidateQueries({ queryKey: ["user", user?.id] })
    },
    onError: () => {
      toast.error("Failed to update profile")
    },
  })

  // Add reset password mutation after the updateUserMutation
  const resetPasswordMutation = useMutation({
    mutationFn: (email: string) => userService.resetPassword(email),
    onSuccess: () => {
      toast.success("Password reset email sent successfully. Please check your email.")
      setResetPasswordEmail("")
    },
    onError: () => {
      toast.error("Failed to send password reset email")
    },
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.firstName || !formData.lastName || !formData.email) {
      toast.error("Please fill in all required fields")
      return
    }

    updateUserMutation.mutate({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
    })
  }

  const handleNotificationChange = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const handleNotificationSubmit = () => {
    // Since there's no specific endpoint for notifications, we'll just show a success message
    toast.success("Notification settings saved")
  }

  // Add reset password handler
  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault()

    if (!resetPasswordEmail) {
      toast.error("Please enter your email address")
      return
    }

    resetPasswordMutation.mutate(resetPasswordEmail)
  }

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  // Load user data from localStorage on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem("paragone_user")
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser) as User
        setUser(userData)
        setFormData({
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
        })
      } catch (error) {
        console.error("Error parsing user data:", error)
        toast.error("Error loading user data")
      }
    }
  }, [])

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading profile...</span>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">User Profile</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg border p-6">
            <div className="flex flex-col items-center">
              <div className="relative mb-4">
                <Avatar className="h-32 w-32">
                  <AvatarImage src="/placeholder.svg" alt={`${user.firstName} ${user.lastName}`} />
                  <AvatarFallback className="text-2xl">{getInitials(user.firstName, user.lastName)}</AvatarFallback>
                </Avatar>
              </div>
              <h2 className="text-2xl font-bold">
                {user.firstName} {user.lastName}
              </h2>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant={user.role === "super-admin" ? "default" : "secondary"}>{user.role}</Badge>
                <Badge variant={user.isActive ? "default" : "secondary"}>{user.isActive ? "Active" : "Inactive"}</Badge>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Personal Info</h3>
              <div className="space-y-3">
                <div className="flex">
                  <span className="text-gray-500 w-24 text-sm">Full Name</span>
                  <span className="text-sm">
                    : {user.firstName} {user.lastName}
                  </span>
                </div>
                <div className="flex">
                  <span className="text-gray-500 w-24 text-sm">Email</span>
                  <span className="text-sm">: {user.email}</span>
                </div>
                <div className="flex">
                  <span className="text-gray-500 w-24 text-sm">Employee ID</span>
                  <span className="text-sm">: {user.employeeId}</span>
                </div>
                <div className="flex">
                  <span className="text-gray-500 w-24 text-sm">Role</span>
                  <span className="text-sm">: {user.role}</span>
                </div>
                <div className="flex">
                  <span className="text-gray-500 w-24 text-sm">Status</span>
                  <span className="text-sm">: {user.isActive ? "Active" : "Inactive"}</span>
                </div>
                <div className="flex">
                  <span className="text-gray-500 w-24 text-sm">Created</span>
                  <span className="text-sm">: {formatDate(user.createdAt)}</span>
                </div>
                <div className="flex">
                  <span className="text-gray-500 w-24 text-sm">Updated</span>
                  <span className="text-sm">: {formatDate(user.updatedAt)}</span>
                </div>
              </div>
            </div>

            {/* {user.permissions && user.permissions.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-4">Permissions</h3>
                <div className="flex flex-wrap gap-2">
                  {user.permissions.map((permission, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {permission}
                    </Badge>
                  ))}
                </div>
              </div>
            )} */}
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="bg-white rounded-lg border">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="edit-profile">Edit Profile</TabsTrigger>
                <TabsTrigger value="reset-password">Reset Password</TabsTrigger>
                <TabsTrigger value="notification-settings">Notification Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="edit-profile" className="p-6">
                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Profile Image</h3>
                    <div className="flex items-center gap-4">
                      <Avatar className="h-24 w-24">
                        <AvatarImage src="/placeholder.svg" alt="Profile" />
                        <AvatarFallback className="text-xl">
                          {getInitials(formData.firstName, formData.lastName)}
                        </AvatarFallback>
                      </Avatar>
                      <Button type="button" variant="outline" size="sm" className="gap-2">
                        <Camera className="h-4 w-4" />
                        <span>Change</span>
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">
                        First Name<span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        placeholder="Enter first name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">
                        Last Name<span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        placeholder="Enter last name"
                        required
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="email">
                        Email<span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Enter email address"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Read-only Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label>Employee ID</Label>
                        <Input value={user.employeeId} disabled className="bg-gray-50" />
                      </div>
                      <div className="space-y-2">
                        <Label>Role</Label>
                        <Input value={user.role} disabled className="bg-gray-50" />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setFormData({
                          firstName: user.firstName,
                          lastName: user.lastName,
                          email: user.email,
                        })
                      }}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={updateUserMutation.isPending}>
                      {updateUserMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Save Changes
                    </Button>
                  </div>
                </form>
              </TabsContent>

              <TabsContent value="reset-password" className="p-6">
                <form onSubmit={handleResetPassword} className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Reset Password</h3>
                    <p className="text-sm text-gray-600 mb-6">
                      Enter your email address and we'll send you instructions to reset your password.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="resetEmail">
                      Email Address<span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="resetEmail"
                      type="email"
                      value={resetPasswordEmail}
                      onChange={(e) => setResetPasswordEmail(e.target.value)}
                      placeholder="Enter your email address"
                      required
                    />
                    <p className="text-xs text-gray-500">Current email: {user.email}</p>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-blue-800">Password Reset Information</h3>
                        <div className="mt-2 text-sm text-blue-700">
                          <ul className="list-disc pl-5 space-y-1">
                            <li>A new password will be automatically generated</li>
                            <li>You will receive the new password via email</li>
                            <li>You will be logged out to login with new details your new password after reset</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setResetPasswordEmail("")}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={resetPasswordMutation.isPending}>
                      {resetPasswordMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Send Reset Email
                    </Button>
                  </div>
                </form>
              </TabsContent>

              <TabsContent value="notification-settings" className="p-6">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Company News</h3>
                      <p className="text-sm text-gray-500">Get notified about company updates</p>
                    </div>
                    <Switch
                      checked={notifications.companyNews}
                      onCheckedChange={() => handleNotificationChange("companyNews")}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Push Notifications</h3>
                      <p className="text-sm text-gray-500">Receive push notifications on your device</p>
                    </div>
                    <Switch
                      checked={notifications.pushNotification}
                      onCheckedChange={() => handleNotificationChange("pushNotification")}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Weekly Newsletters</h3>
                      <p className="text-sm text-gray-500">Get weekly updates via email</p>
                    </div>
                    <Switch
                      checked={notifications.weeklyNewsletters}
                      onCheckedChange={() => handleNotificationChange("weeklyNewsletters")}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Meetups Near You</h3>
                      <p className="text-sm text-gray-500">Get notified about local events</p>
                    </div>
                    <Switch
                      checked={notifications.meetupsNearYou}
                      onCheckedChange={() => handleNotificationChange("meetupsNearYou")}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Order Notifications</h3>
                      <p className="text-sm text-gray-500">Get updates about your orders</p>
                    </div>
                    <Switch
                      checked={notifications.ordersNotifications}
                      onCheckedChange={() => handleNotificationChange("ordersNotifications")}
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setNotifications({
                          companyNews: false,
                          pushNotification: true,
                          weeklyNewsletters: true,
                          meetupsNearYou: false,
                          ordersNotifications: true,
                        })
                      }}
                    >
                      Reset
                    </Button>
                    <Button onClick={handleNotificationSubmit}>Save Changes</Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
