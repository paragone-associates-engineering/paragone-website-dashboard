
import type React from "react"

import { useState } from "react"
import Navbar from "./navbar"
import Sidebar from "./sidebar-ui"
import { useAuth } from "@/context/auth-context"
import { useLocation } from "react-router-dom"
import { TokenValidator } from "../auth/token-validator"
interface LayoutProps {
  children: React.ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  const [collapsed, setCollapsed] = useState(false);
   const { isAuthenticated } = useAuth()
  const location = useLocation()

 
  const isLoginPage = location.pathname === "/login"

  if (isLoginPage || !isAuthenticated) {
    return <>{children}</>
  }
  return (
    <div className='lg:flex max-w-full'>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <main className={`${collapsed ? 'lg:ml-[100px]' : 'lg:ml-[250px]'} w-full mx-auto`}>
        <Navbar />
          <div className={`max-w-full w-full xl:pl-5`}>
<TokenValidator>{children}</TokenValidator>
          </div>
      </main>
    </div>
  )
}

export default Layout
