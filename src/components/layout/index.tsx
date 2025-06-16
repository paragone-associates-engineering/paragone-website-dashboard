
import type React from "react"

import { useState } from "react"
import Navbar from "./navbar"
import Sidebar from "./sidebar-ui"
import { useAuth } from "@/context/auth-context"
import { useLocation } from "react-router-dom"
//import { TokenValidator } from "../auth/token-validator"
interface LayoutProps {
  children: React.ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  const [collapsed, setCollapsed] = useState(false);
   const { isAuthenticated } = useAuth()
  const location = useLocation()

 
  const isLoginPage = location.pathname === "/login" || location.pathname === "/forgot-password"

  if (isLoginPage || !isAuthenticated) {
    return <>{children}</>
  }
  return (
    <div className='lg:flex max-w-full'>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <main className={`${collapsed ? 'lg:ml-[80px]' : 'lg:ml-[250px] max-[1300px]:max-w-[1020px]'} w-full mx-auto`}>
        <Navbar />
          <div className={` max-w-full w-full xl:pl-5`}>
{children}
          </div>
      </main>
    </div>
  )
}

export default Layout
