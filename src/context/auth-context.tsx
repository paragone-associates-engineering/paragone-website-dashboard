
import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import type { User } from "@/types/auth"
import { clearAuth, getStoredUser, hasPermission, isAuthenticated } from "@/lib/auth"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  logout: () => void
  setUser: (user: User) => void
  hasPermission: (feature: string, action: "view" | "edit" | "add" | "delete") => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    // Check if user is already authenticated
    const checkAuth = async () => {
      if (isAuthenticated()) {
        const storedUser = getStoredUser()
        if (storedUser) {
          setUser(storedUser)
        } else {
          // Token exists but no user data, clear auth
          clearAuth()
        }
      }
      setIsLoading(false)
    }

    checkAuth()
  }, [])

  const logout = () => {
    clearAuth()
    setUser(null)
    navigate("/login")
  }

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
