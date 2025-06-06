import axios from "axios"

const api = axios.create({
  baseURL: "https://paragone-website-backend.onrender.com",
})

let authErrorHandler: (() => void) | null = null

// Function to set the auth error handler from AuthProvider
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
      // Use the auth error handler if available (from AuthProvider)
      if (authErrorHandler) {
        authErrorHandler()
      } else {
        // Fallback to direct logout if AuthProvider isn't available
        localStorage.removeItem("paragone_token")
        localStorage.removeItem("paragone_user")

        // Show a user-friendly message
        if (window.location.pathname !== "/login") {
          // Only show toast if not already on login page
          import("sonner").then(({ toast }) => {
            toast.error("Your session has expired. Please log in again.")
          })
        }
        window.location.href = "/login"
      }
    }
    return Promise.reject(error)
  },
)

export default api