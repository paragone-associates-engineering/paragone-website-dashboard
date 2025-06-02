import axios from "axios"

const api = axios.create({
  baseURL: "https://paragone-website-backend.onrender.com",
})

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
    // Handle 401 Unauthorized errors (token expired or invalid)
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("paragone_token")
      localStorage.removeItem("paragone_user")
      window.location.href = "/login"
    }
    return Promise.reject(error)
  },
)

export default api
