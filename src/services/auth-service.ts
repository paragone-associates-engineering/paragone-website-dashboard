import api from "@/lib/api"
import type { AuthResponse, LoginCredentials } from "@/types/auth"
import { storeToken, storeUser } from "@/lib/auth"

export const loginUser = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/authenticate/sign-in", credentials)

  
  const { user, token } = response.data
  storeUser(user)
  storeToken(token)

  return response.data
}
