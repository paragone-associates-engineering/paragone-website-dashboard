/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-refresh/only-export-components */

import type React from "react"
import { createContext, useContext, useEffect, useState, useCallback, useRef } from "react"
import { useNavigate } from "react-router-dom"
import type { User } from "@/types/auth"
import { clearAuth, getStoredUser, hasPermission, isAuthenticated, validateToken, storeUser } from "@/lib/auth"
import { toast } from "sonner"
import { setAuthErrorHandler } from "@/lib/api"

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


  const isValidatingRef = useRef(false)
  const lastValidationRef = useRef<number>(0)
  const validationIntervalRef = useRef<NodeJS.Timeout | null>(null)

  
  const VALIDATION_CACHE_TIME = 30 * 1000 // 30 seconds
  const VALIDATION_INTERVAL = 5 * 60 * 1000 // 5 minutes

  const userRole = user?.role?.toLowerCase?.() || ""
  const isAdmin = ["admin", "super-admin", "super admin"].includes(userRole)

  const logout = useCallback(() => {
    // Clear any ongoing validation
    if (validationIntervalRef.current) {
      clearInterval(validationIntervalRef.current)
      validationIntervalRef.current = null
    }

    clearAuth()
    setUser(null)
    navigate("/login")
  }, [navigate])

  const refreshUserData = useCallback(async (): Promise<boolean> => {
    
    if (isValidatingRef.current) {
      return false
    }

    try {
      isValidatingRef.current = true
      const { isValid, user: freshUserData } = await validateToken()

      if (isValid && freshUserData) {
        setUser(freshUserData)
        storeUser(freshUserData)
        lastValidationRef.current = Date.now()
        return true
      }

      return false
    } catch (error) {
      console.error("Failed to refresh user data:", error)
      return false
    } finally {
      isValidatingRef.current = false
    }
  }, [])

  const checkTokenValidity = useCallback(async (): Promise<boolean> => {
    if (!isAuthenticated()) {
      return false
    }

   
    const now = Date.now()
    if (now - lastValidationRef.current < VALIDATION_CACHE_TIME) {
      return true 
    }

    
    if (isValidatingRef.current) {
      return true 
    }

    try {
      isValidatingRef.current = true
      const { isValid, user: freshUserData } = await validateToken()

      if (!isValid) {
        toast.error("Your session has expired. Please log in again.")
        logout()
        return false
      }

     
      if (freshUserData) {
        setUser(freshUserData)
        storeUser(freshUserData)
      }

      lastValidationRef.current = now
      return true
    } catch (error) {
      console.error("Token validation error:", error)
      
      if (error instanceof Error && error.message.includes("Network Error")) {
        return true 
      }
      return false
    } finally {
      isValidatingRef.current = false
    }
  }, [logout])

  
  const handleAuthError = useCallback(() => {
    
    if (validationIntervalRef.current) {
      clearInterval(validationIntervalRef.current)
      validationIntervalRef.current = null
    }

    clearAuth()
    setUser(null)
    toast.error("Your session has expired. Please log in again.")
    navigate("/login")
  }, [])

  useEffect(() => {
  
    setAuthErrorHandler(handleAuthError)

    const checkAuth = async () => {
      if (isAuthenticated()) {
        const storedUser = getStoredUser()
        if (storedUser) {
          
          setUser(storedUser)
          lastValidationRef.current = Date.now() // Mark as recently validated
        } else {
          
          try {
            const { isValid, user: freshUserData } = await validateToken()
            if (isValid && freshUserData) {
              setUser(freshUserData)
              storeUser(freshUserData)
              lastValidationRef.current = Date.now()
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

  
  useEffect(() => {
    if (!user) return

    
    if (validationIntervalRef.current) {
      clearInterval(validationIntervalRef.current)
    }

    // Set up new interval
    validationIntervalRef.current = setInterval(async () => {
      await checkTokenValidity()
    }, VALIDATION_INTERVAL)

    return () => {
      if (validationIntervalRef.current) {
        clearInterval(validationIntervalRef.current)
        validationIntervalRef.current = null
      }
    }
  }, [user, checkTokenValidity])

  
  useEffect(() => {
    let visibilityTimeout: NodeJS.Timeout

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && user) {
       
        clearTimeout(visibilityTimeout)
        visibilityTimeout = setTimeout(() => {
          checkTokenValidity()
        }, 1000) 
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      clearTimeout(visibilityTimeout)
    }
  }, [user, checkTokenValidity])

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
