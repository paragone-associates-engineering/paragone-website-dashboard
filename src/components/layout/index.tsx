
import type React from "react"

import { useState } from "react"
import Navbar from "./navbar"
import Sidebar from "./sidebar-ui"
import Login from "@/pages/auth/login"

interface LayoutProps {
  children: React.ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  const [isLoggedin, setIsLoggedIn] = useState(true)
  const [collapsed, setCollapsed] = useState(false);
  if (!isLoggedin) {
    return <Login />
  }

  return (
    <div className='lg:flex max-w-full'>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <main className={`${collapsed ? 'lg:ml-[100px]' : 'lg:ml-[250px]'} w-full mx-auto`}>
        <Navbar handleLogOut={()=> setIsLoggedIn(false)} />
          <div className={`${collapsed ? 'max-w-[1150px]' : 'max-w-[1010px]' } 2xl:max-w-[1300px] xl:pl-5`}>
          {children}
          </div>
      </main>
    </div>
  )
}

export default Layout
