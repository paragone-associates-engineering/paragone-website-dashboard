import type { User } from "@/types/auth"
import { checkAuth, signOut } from "@/services/auth-service"


export const hasPermission = (
  user: User | null,
  feature: string,
  action: "view" | "edit" | "add" | "delete",
): boolean => {
  if (!user || !user.permissions) return false

  const permission = user.permissions.find((p) => p.feature === feature || p.feature === "string")
  if (!permission) return false

  return permission[action] === true
}


export const getStoredUser = (): User | null => {
  const userJson = localStorage.getItem("paragone_user")
  if (!userJson) return null

  try {
    return JSON.parse(userJson) as User
  } catch (error) {
    console.error("Failed to parse stored user:", error)
    return null
  }
}

// Store user in localStorage
export const storeUser = (user: User): void => {
  localStorage.setItem("paragone_user", JSON.stringify(user))
}

// Store token in localStorage
export const storeToken = (token: string): void => {
  localStorage.setItem("paragone_token", token)
}


export const clearAuth = async () => {
  const token =  getToken()
  if(token){
await signOut(token)
  }
 localStorage.removeItem("paragone_token")
  localStorage.removeItem("paragone_user")
}

// Check if user is authenticated (token exists)
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem("paragone_token")
}

// Check if token is valid with the server
export const validateToken = async (): Promise<{ isValid: boolean; user?: User }> => {
  try {
    const userData = await checkAuth()
   
    return { isValid: true, user: userData as unknown as User }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Token validation failed:", error)

    // Check if it's the specific "sign in required" error
    if (error.response && (error.response.status === 400 || error.response.status === 401)) {
      if (error.response.data?.message === "sign in required") {
        return { isValid: false }
      }
    }
    return { isValid: false }
  }
}

export const getToken = (): string | null => {
  return localStorage.getItem("paragone_token")
}