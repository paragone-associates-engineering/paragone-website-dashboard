import type { User } from "@/types/auth"
import { checkAuth, signOut } from "@/services/auth-service"
import { encodeToken, decodeToken, encodeData, decodeData } from "./crypto"

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
  const encodedUserJson = localStorage.getItem("paragone_user")
  if (!encodedUserJson) return null

  try {
    const userJson = decodeData(encodedUserJson)
    return JSON.parse(userJson) as User
  } catch (error) {
    console.error("Failed to parse stored user:", error)
    localStorage.removeItem("paragone_user")
    return null
  }
}


export const storeUser = (user: User): void => {
  try {
    const userJson = JSON.stringify(user)
    const encodedUserJson = encodeData(userJson)
    localStorage.setItem("paragone_user", encodedUserJson)
  } catch (error) {
    console.error("Failed to store user:", error)
  }
}


export const storeToken = (token: string): void => {
  try {
    const encodedToken = encodeToken(token)
    localStorage.setItem("paragone_token", encodedToken)
  } catch (error) {
    console.error("Failed to store token:", error)
  }
}


export const getToken = (): string | null => {
  const encodedToken = localStorage.getItem("paragone_token")
  if (!encodedToken) return null

  try {
    return decodeToken(encodedToken)
  } catch (error) {
    console.error("Failed to decode token:", error)
    localStorage.removeItem("paragone_token")
    return null
  }
}

export const clearAuth = async () => {
  const token = getToken()
  if (token) {
    try {
      await signOut(token)
    } catch (error) {
      console.error("Sign out failed:", error)
    }
  }
  localStorage.removeItem("paragone_token")
  localStorage.removeItem("paragone_user")
}


export const isAuthenticated = (): boolean => {
  const token = getToken()
  return !!token
}
export const validateToken = async (): Promise<{ isValid: boolean; user?: User }> => {
  try {
    const userData = await checkAuth()
    return { isValid: true, user: userData as unknown as User }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Token validation failed:", error)

    if (error.response && (error.response.status === 400 || error.response.status === 401)) {
      if (error.response.data?.message === "sign in required") {
        return { isValid: false }
      }
    }

    if (error.code === "NETWORK_ERROR" || error.message?.includes("Network Error")) {
      throw error
    }

    return { isValid: false }
  }
}
