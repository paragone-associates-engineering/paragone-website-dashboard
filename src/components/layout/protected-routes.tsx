
import type React from "react"

import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "@/context/auth-context"

interface ProtectedRouteProps {
  requiredPermission?: {
    feature: string
    action: "view" | "edit" | "add" | "delete"
  }
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requiredPermission }) => {
  const { isAuthenticated, isLoading, hasPermission } = useAuth()

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // Check permissions if required
  if (requiredPermission) {
    const { feature, action } = requiredPermission
    if (!hasPermission(feature, action)) {
      return <Navigate to="/unauthorized" replace />
    }
  }

  
  return <Outlet />
}

export default ProtectedRoute
