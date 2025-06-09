import type React from "react"
import { createContext, useContext, useEffect, useState, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import type { User } from "@/types/auth"
import { clearAuth, getStoredUser, hasPermission, isAuthenticated, validateToken, storeUser } from "@/lib/auth"
import { toast } from "sonner"
import { setAuthErrorHandler } from "@/lib/api" // Updated import path

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAdmin: boolean
  isAuthenticated: boolean
  logout: () => void
  setUser: (user: User) => void
  hasPermission: (feature: string, action: "view" | "edit" | "add" | "delete") => boolean
  checkTokenValidity: () => Promise<boolean>
  refreshUserData: () => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const navigate = useNavigate()
  const isAdmin = typeof user?.role === "string" &&
    (
      user.role === "admin" ||
      user.role === "super-admin"
    );

  const logout = useCallback(() => {
    clearAuth()
    setUser(null)
    navigate("/login")
  }, [navigate])

  const refreshUserData = useCallback(async (): Promise<boolean> => {
    try {
      const { isValid, user: freshUserData } = await validateToken()

      if (isValid && freshUserData) {
        setUser(freshUserData)
        storeUser(freshUserData)
        return true
      }

      return false
    } catch (error) {
      console.error("Failed to refresh user data:", error)
      return false
    }
  }, [])

  const checkTokenValidity = useCallback(async (): Promise<boolean> => {
    if (!isAuthenticated()) {
      return false
    }

    try {
      const { isValid, user: freshUserData } = await validateToken()

      if (!isValid) {
        toast.error("Your session has expired. Please log in again.")
        logout()
        return false
      }

      // Update user data if we received fresh data
      if (freshUserData) {
        setUser(freshUserData)
        storeUser(freshUserData)
      }

      return true
    } catch (error) {
      console.error("Token validation error:", error)
      // Don't logout on network errors - only on actual auth failures
      return false
    }
  }, [logout])

  // Handle auth errors (called by API interceptor)
  const handleAuthError = useCallback(() => {
    clearAuth()
    setUser(null)
    toast.error("Your session has expired. Please log in again.")
    navigate("/login")
  }, [navigate])

  useEffect(() => {
    // Set up the auth error handler for API interceptor
    setAuthErrorHandler(handleAuthError)

    const checkAuth = async () => {
      if (isAuthenticated()) {
        const storedUser = getStoredUser()
        if (storedUser) {
          setUser(storedUser)
        } else {
          // Only validate token if we don't have stored user data
          try {
            const { isValid, user: freshUserData } = await validateToken()
            if (isValid && freshUserData) {
              setUser(freshUserData)
              storeUser(freshUserData)
            } else {
              clearAuth()
            }
          } catch (error) {
            console.error("Initial auth check failed:", error)
            clearAuth()
          }
        }
      }

      setIsLoading(false)
    }

    checkAuth()
  }, [handleAuthError])

  // Remove all the aggressive token checking intervals and event listeners
  // Token validation should only happen:
  // 1. On initial load (above)
  // 2. When we get a 401 error from an API call (handleAuthError)
  // 3. When explicitly called by the app (checkTokenValidity)

  const checkPermission = (feature: string, action: "view" | "edit" | "add" | "delete") => {
    return hasPermission(user, feature, action)
  }

  const value = {
    user,
    isAdmin,
    isLoading,
    isAuthenticated: !!user,
    logout,
    setUser,
    hasPermission: checkPermission,
    checkTokenValidity,
    refreshUserData,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}