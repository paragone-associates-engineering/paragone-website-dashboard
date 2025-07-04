import axios from "axios"

const api = axios.create({
  baseURL: "https://paragone-website-backend.onrender.com",
})

// Auth error handler (set by AuthProvider)
let authErrorHandler: (() => void) | null = null

export const setAuthErrorHandler = (handler: () => void) => {
  authErrorHandler = handler
}

// Request interceptor to add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("paragone_token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized or 400 with "sign in required" message
    if (
      (error.response && error.response.status === 401) ||
      (error.response && error.response.status === 400 && error.response.data?.message === "sign in required")
    ) {
      // Only call auth error handler if we're not already on login page
      if (window.location.pathname !== "/login" && authErrorHandler) {
        authErrorHandler()
      }
    }
    return Promise.reject(error)
  },
)

export default api
