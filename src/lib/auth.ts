import type { User } from "@/types/auth"

// Check if user has permission for a specific action on a feature
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

// Get stored user from localStorage
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

// Clear auth data from localStorage
export const clearAuth = (): void => {
  localStorage.removeItem("paragone_token")
  localStorage.removeItem("paragone_user")
}

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem("paragone_token")
}
