
import type React from "react"
import { createContext, useContext, useEffect, useState, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import type { User } from "@/types/auth"
import { clearAuth, getStoredUser, hasPermission, isAuthenticated, validateToken, storeUser } from "@/lib/auth"
import { toast } from "sonner"

interface AuthContextType {
  user: User | null
  isLoading: boolean
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
      logout()
      return false
    }
  }, [logout])

  useEffect(() => {
    const checkAuth = async () => {
      if (isAuthenticated()) {
        const { isValid, user: freshUserData } = await validateToken()

        if (isValid) {
          if (freshUserData) {
            setUser(freshUserData)
            storeUser(freshUserData)
          } else {
            const storedUser = getStoredUser()
            if (storedUser) {
              setUser(storedUser)
            } else {
              clearAuth()
            }
          }
        } else {
          clearAuth()
        }
      }

      setIsLoading(false)
    }

    checkAuth()
  }, [])

  // Set up periodic token validation (every 5 minutes)
  useEffect(() => {
    if (!user) return

    const interval = setInterval(
      async () => {
        await checkTokenValidity()
      },
      5 * 60 * 1000,
    ) // 5 minutes

    return () => clearInterval(interval)
  }, [user, checkTokenValidity])

  // Check token validity when the page becomes visible (user switches back to tab)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && user) {
        checkTokenValidity()
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange)
  }, [user, checkTokenValidity])

  // Check token validity when the page gains focus
  useEffect(() => {
    const handleFocus = () => {
      if (user) {
        checkTokenValidity()
      }
    }

    window.addEventListener("focus", handleFocus)
    return () => window.removeEventListener("focus", handleFocus)
  }, [user, checkTokenValidity])

  const checkPermission = (feature: string, action: "view" | "edit" | "add" | "delete") => {
    return hasPermission(user, feature, action)
  }

  const value = {
    user,
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
