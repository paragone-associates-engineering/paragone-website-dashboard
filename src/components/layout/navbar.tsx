import type React from "react"
import { Bell, Search, User} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Link } from "react-router-dom"

interface NavbarProps {
  children?: React.ReactNode
  handleLogOut: () => void
}

const Navbar = ({ children, handleLogOut }: NavbarProps) => {
  return (
    <header className="sticky top-0 z-30 flex h-20 py-4 items-center justify-between border-b bg-white px-4 md:px-6 w-full">
      <div className="flex items-center">
        {children}
        <h1 className="ml-14 lg:ml-2 text-xl font-semibold">Dashboard</h1>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative hidden md:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input type="search" placeholder="Search here..." className="w-[300px] pl-8" />
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="relative">
            <User className="h-5 w-5" />
            <Badge
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
              variant="destructive"
            >
              38
            </Badge>
          </Button>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-yellow-500 hover:bg-yellow-600">
              12
            </Badge>
          </Button>
          {/* <Button variant="ghost" size="icon" className="relative">
            <ShoppingCart className="h-5 w-5" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-red-500 hover:bg-red-600">
              1
            </Badge>
          </Button> */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg" alt="Erwin Smith" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1 leading-none">
                  <p className="font-medium">Jane Doe</p>
                  <p className="text-sm text-muted-foreground">Super Admin</p>
                </div>
              </div>
             <Link to='/user/profile'><DropdownMenuItem>Profile Settings</DropdownMenuItem></Link>
              <Link to='/property/list'><DropdownMenuItem>Properties</DropdownMenuItem></Link>
             <DropdownMenuItem onClick={handleLogOut}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

export default Navbar
