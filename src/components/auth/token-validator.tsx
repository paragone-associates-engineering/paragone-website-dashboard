
import type React from "react"

import { useEffect } from "react"
import { useAuth } from "@/context/auth-context"

interface TokenValidatorProps {
  children: React.ReactNode
}

export function TokenValidator({ children }: TokenValidatorProps) {
  const { checkTokenValidity, isAuthenticated } = useAuth()

  useEffect(() => {
    // Check token validity on mount if user is authenticated
    if (isAuthenticated) {
      checkTokenValidity()
    }
  }, [isAuthenticated, checkTokenValidity])

  return <>{children}</>
}
