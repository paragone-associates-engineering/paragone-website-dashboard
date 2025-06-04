import { useEffect, type ReactNode } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/context/auth-context"

interface AdminGuardProps {
  children: ReactNode
  redirectTo?: string
  fallback?: ReactNode
}

export const AdminGuard = ({ 
  children, 
  redirectTo = '/unauthorized',
  fallback = <div>Loading...</div>
}: AdminGuardProps) => {
  const navigate = useNavigate()
  const { isAdmin, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      navigate(redirectTo)
    }
  }, [isAdmin, isLoading, navigate, redirectTo])

  if (isLoading) {
    return <>{fallback}</>
  }

  if (!isAdmin) {
    return null 
  }

  return <>{children}</>
}