import api from "@/lib/api"
import type { AuthResponse, LoginCredentials } from "@/types/auth"
import { storeToken, storeUser } from "@/lib/auth"

export interface CheckAuthResponse {
  valid: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user?: any
}

export const loginUser = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/authenticate/sign-in", credentials)
  const { user, token } = response.data
  storeUser(user)
  storeToken(token)

  return response.data
}

export const checkAuth = async () => {
    const response = await api.get<CheckAuthResponse>("/authenticate/check-auth")
    return response.data
 }

 export const signOut = async (token:string) => {
    const response = await api.post<{token:string}>("/authenticate/sign-out", token)
    return response.data
 }