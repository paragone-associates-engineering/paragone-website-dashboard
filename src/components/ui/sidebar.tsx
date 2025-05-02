
import React, { createContext, useContext, useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { ChevronDown, ChevronRight } from "lucide-react"
import { useLocation, useNavigate } from "react-router-dom"

type SidebarContextType = {
  collapsed: boolean
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>
  mobileOpen: boolean
  setMobileOpen: React.Dispatch<React.SetStateAction<boolean>>
  isMobile: boolean
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

// eslint-disable-next-line react-refresh/only-export-components
export function useSidebar() {
  const context = useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}

interface SidebarProviderProps {
  children: React.ReactNode
  defaultCollapsed?: boolean
}

export function SidebarProvider({ children, defaultCollapsed = false }: SidebarProviderProps) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Check if we're on mobile and set initial state
  useEffect(() => {
    const checkMobile = () => {
      const isMobileView = window.innerWidth < 1024
      setIsMobile(isMobileView)
    }

    // Initial check
    checkMobile()

    // Add resize listener
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Close mobile sidebar when window is resized to desktop size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileOpen(false)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <SidebarContext.Provider value={{ collapsed, setCollapsed, mobileOpen, setMobileOpen, isMobile }}>
      {children}
    </SidebarContext.Provider>
  )
}

interface SidebarProps {
  children: React.ReactNode
  className?: string
}

export function Sidebar({ children, className }: SidebarProps) {
  const { collapsed, mobileOpen, setMobileOpen, isMobile } = useSidebar()

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setMobileOpen(false)} />}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex h-full flex-col bg-white transition-all duration-300 ease-in-out",
          // On desktop: collapsed state controls width
          !isMobile && (collapsed ? "w-[60px]" : "w-[250px]"),
          // On mobile: always full width but translate out of view unless open
          isMobile && "w-[250px]",
          isMobile ? (mobileOpen ? "translate-x-0" : "-translate-x-full") : "translate-x-0",
          className,
        )}
      >
        {children}
      </aside>
    </>
  )
}

interface SidebarLogoProps {
  collapsed?: boolean
  className?: string
}

export function SidebarLogo({ collapsed, className }: SidebarLogoProps) {
  const { collapsed: contextCollapsed } = useSidebar()
  const isCollapsed = collapsed !== undefined ? collapsed : contextCollapsed

  return (
    <div
      className={cn(
        "flex h-16 items-center border-b border-gray-100 px-4",
        isCollapsed ? "justify-center" : "justify-start",
        className,
      )}
    >
      <div className="flex items-center gap-2">
        <div className="flex-shrink-0">
        <span className="text-lg font-bold text-gray-800">PS LOGO</span>
        </div>
      
      </div>
    </div>
  )
}

interface SidebarNavProps {
  children: React.ReactNode
  className?: string
}

export function SidebarNav({ children, className }: SidebarNavProps) {
  return (
    <nav className={cn("flex-1 overflow-y-auto py-4", className)}>
      <ul className="space-y-1 px-2">{children}</ul>
    </nav>
  )
}

interface SidebarItemProps {
  icon: React.ReactNode
  label: string
  active?: boolean
  badge?: string | number
  href?: string
  onClick?: () => void
  children?: React.ReactNode
  className?: string
}

export function SidebarItem({
  icon,
  label,
  active = false,
  badge,
  href,
  onClick,
  children,
  className,
}: SidebarItemProps) {
  const { collapsed, setMobileOpen } = useSidebar()
  const [open, setOpen] = useState(false)
  const hasChildren = React.Children.count(children) > 0
  const navigate = useNavigate()
  const location = useLocation()

  // Check if any child route is active
  const isChildActive = React.Children.toArray(children).some((child) => {
    if (React.isValidElement(child) && "props" in child && typeof child.props === "object" && child.props && "href" in child.props && child.props.href) {
      return location.pathname === child.props.href
    }
    return false
  })

  const handleClick = (e: React.MouseEvent) => {
    // Prevent default navigation
    e.preventDefault()

    if (hasChildren) {
      // Toggle submenu
      setOpen(!open)
    } else if (href) {
      // Navigate and close mobile sidebar
      navigate(href)
      setMobileOpen(false)
    }

    if (onClick) {
      onClick()
    }
  }

  const content = (
    <div
      className={cn(
        "group flex w-full cursor-pointer items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
        active || isChildActive ? "bg-primary text-white" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
        className,
      )}
      onClick={handleClick}
    >
      <div className={cn("flex h-5 w-5 items-center justify-center", collapsed ? "mr-0" : "mr-2")}>{icon}</div>
      {!collapsed && (
        <>
          <span className="flex-1 truncate">{label}</span>
          {badge && (
            <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-medium text-white">
              {badge}
            </span>
          )}
          {hasChildren && (
            <div className="ml-auto">
              {open ? (
                <ChevronDown className="h-4 w-4 text-gray-500" />
              ) : (
                <ChevronRight className="h-4 w-4 text-gray-500" />
              )}
            </div>
          )}
        </>
      )}
    </div>
  )

  return (
    <li className="relative">
      {content}

      {/* Badge for collapsed mode */}
      {collapsed && badge && (
        <span className="absolute right-0 top-0 flex h-5 w-5 -translate-y-1/2 translate-x-1/2 items-center justify-center rounded-full bg-primary text-xs font-medium text-white">
          {badge}
        </span>
      )}

      {/* Submenu */}
      {!collapsed && hasChildren && open && <ul className="mt-1 space-y-1 pl-6">{children}</ul>}
    </li>
  )
}

interface SidebarSubItemProps {
  label: string
  href?: string
  active?: boolean
  onClick?: () => void
  className?: string
}

export function SidebarSubItem({ label, href, active, onClick, className }: SidebarSubItemProps) {
  const { setMobileOpen } = useSidebar()
  const navigate = useNavigate()
  const location = useLocation()

  // Check if this route is active
  const isActive = active || (href && location.pathname === href)

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()

    if (href) {
      navigate(href)
      setMobileOpen(false)
    }

    if (onClick) {
      onClick()
    }
  }

  const content = (
    <div
      className={cn(
        "flex cursor-pointer items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
        isActive ? "text-primary" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
        className,
      )}
      onClick={handleClick}
    >
      <span className="truncate">{label}</span>
    </div>
  )

  return <li>{content}</li>
}

interface SidebarFooterProps {
  children: React.ReactNode
  className?: string
}

export function SidebarFooter({ children, className }: SidebarFooterProps) {
  const { collapsed } = useSidebar()

  return (
    <div className={cn("mt-auto border-t border-gray-100 p-4", collapsed ? "text-center" : "", className)}>
      {children}
    </div>
  )
}

interface SidebarToggleProps {
  className?: string
}

export function SidebarToggle({ className }: SidebarToggleProps) {
  const { collapsed, setCollapsed, isMobile } = useSidebar()

  // Only show on desktop
  if (isMobile) return null

  return (
    <button
      className={cn(
        "fixed left-[250px] top-4 z-50 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md transition-all",
        collapsed && "left-[60px]",
        className,
      )}
      onClick={() => setCollapsed(!collapsed)}
    >
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
        className={cn("h-4 w-4 transition-transform", collapsed ? "rotate-180" : "")}
      >
        <path d="m15 18-6-6 6-6" />
      </svg>
    </button>
  )
}
