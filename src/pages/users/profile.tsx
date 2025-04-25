
import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Camera } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState("edit-profile")

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">User profile</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg border p-6">
            <div className="flex flex-col items-center">
              <div className="relative mb-4">
                <Avatar className="h-32 w-32">
                  <AvatarImage src="/placeholder.svg" alt="Will Jonto" />
                  <AvatarFallback>WJ</AvatarFallback>
                </Avatar>
              </div>
              <h2 className="text-2xl font-bold">Will Jonto</h2>
              <p className="text-gray-500">Manager</p>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Personal Info</h3>
              <div className="space-y-3">
                <div className="flex">
                  <span className="text-gray-500 w-24 text-sm">Full Name</span>
                  <span className='text-sm'>: Will Jonto</span>
                </div>
                <div className="flex">
                  <span className="text-gray-500 w-24 text-sm">Email</span>
                  <span className='text-sm'>: willjontoax@gmail.com</span>
                </div>
                <div className="flex">
                  <span className="text-gray-500 w-24 text-sm">Phone Number</span>
                  <span  className='text-sm'>: (1) 2536 2561 2365</span>
                </div>
                <div className="flex">
                  <span className="text-gray-500 w-24 text-sm">Department</span>
                  <span  className='text-sm'>: Design</span>
                </div>
                <div className="flex">
                  <span className="text-gray-500 w-24 text-sm">Designation</span>
                  <span  className='text-sm'>: Manager</span>
                </div>
                <div className="flex">
                  <span className="text-gray-500 w-24 text-sm">Languages</span>
                  <span  className='text-sm'>: English</span>
                </div>
                <div className="flex">
                  <span className="text-gray-500 w-24 text-sm align-top">Bio</span>
                  <span  className='text-sm'>: Lorem Ipsum is simply dummy text of the printing and typesetting industry.</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="bg-white rounded-lg border">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="edit-profile">Edit Profile</TabsTrigger>
                <TabsTrigger value="change-password">Change Password</TabsTrigger>
                <TabsTrigger value="notification-settings">Notification Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="edit-profile" className="p-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Profile Image</h3>
                    <div className="flex items-center gap-4">
                      <Avatar className="h-24 w-24">
                        <AvatarImage src="/placeholder.svg" alt="Profile" />
                        <AvatarFallback>WJ</AvatarFallback>
                      </Avatar>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Camera className="h-4 w-4" />
                        <span>Change</span>
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">
                        Full Name<span className="text-red-500">*</span>
                      </Label>
                      <Input id="fullName" placeholder="Enter Full Name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">
                        Email<span className="text-red-500">*</span>
                      </Label>
                      <Input id="email" type="email" placeholder="Enter email address" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input id="phone" placeholder="Enter phone number" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="department">
                        Department<span className="text-red-500">*</span>
                      </Label>
                      <Select defaultValue="design">
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="design">Design</SelectItem>
                          <SelectItem value="development">Development</SelectItem>
                          <SelectItem value="marketing">Marketing</SelectItem>
                          <SelectItem value="sales">Sales</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="designation">
                        Designation<span className="text-red-500">*</span>
                      </Label>
                      <Select defaultValue="manager">
                        <SelectTrigger>
                          <SelectValue placeholder="Select designation" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="manager">Manager</SelectItem>
                          <SelectItem value="director">Director</SelectItem>
                          <SelectItem value="developer">Developer</SelectItem>
                          <SelectItem value="designer">Designer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="language">
                        Language<span className="text-red-500">*</span>
                      </Label>
                      <Select defaultValue="english">
                        <SelectTrigger>
                          <SelectValue placeholder="Select one" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="english">English</SelectItem>
                          <SelectItem value="spanish">Spanish</SelectItem>
                          <SelectItem value="french">French</SelectItem>
                          <SelectItem value="german">German</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea id="bio" placeholder="Write description..." />
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button variant="outline">Cancel</Button>
                    <Button>Save</Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="change-password" className="p-6">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">
                      New Password<span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Input id="newPassword" type="password" placeholder="Enter Full Name" />
                      <Button variant="ghost" size="icon" className="absolute right-0 top-0 h-full">
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
                        />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">
                      Confirmed Password<span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Input id="confirmPassword" type="password" placeholder="Enter email address" />
                      <Button variant="ghost" size="icon" className="absolute right-0 top-0 h-full">
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
                        />
                      </Button>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline">Cancel</Button>
                    <Button className="bg-yellow-500 hover:bg-yellow-600">Save changes</Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="notification-settings" className="p-6">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Company News</h3>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Push Notification</h3>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Weekly News Letters</h3>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Meetups Near you</h3>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Orders Notifications</h3>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline">Cancel</Button>
                    <Button className="bg-yellow-500 hover:bg-yellow-600">Save changes</Button>
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

export default UserProfile
