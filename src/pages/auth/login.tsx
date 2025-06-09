
import type React from "react"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useMutation } from "@tanstack/react-query"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff } from "lucide-react"
import { loginUser } from "@/services/auth-service"
import { useAuth } from "@/context/auth-context"
import { toast } from "sonner"

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  })
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const { setUser } = useAuth()
  // const { toast } = useToast()

  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      setUser(data.user)
      toast("Login successful", {
        description: `Welcome back, ${data.user.firstName}!`,
      })
      navigate("/")
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast("Login failed", {
        description: error.response?.data?.message || "Invalid email or password. Please try again.",
      })
    },
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, rememberMe: checked }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    loginMutation.mutate({
      email: formData.email,
      password: formData.password,
    })
  }

  return (
    <div className="flex min-h-screen">
      <div className="hidden lg:block lg:w-1/2 bg-gray-900 relative">
        <img
          src="https://res.cloudinary.com/dv0mdoa6b/image/upload/v1745328905/Mask_group_1_vh7vxj.png"
          alt="Buildings"
          className="absolute inset-0 w-full h-full object-cover opacity-70"
        />
      </div>
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <img
              src="https://res.cloudinary.com/dv0mdoa6b/image/upload/v1741266763/Logo_1_t8y9ap.svg"
              alt="Paragóne Signature"
              className="h-12 mx-auto mb-4"
            />
            <h1 className="text-2xl font-bold mb-2">Sign In to your Account</h1>
            <p className="text-gray-600">Welcome back! please enter your detail</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <label htmlFor="password" className="block text-sm font-medium">
                    Password
                  </label>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-500" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex justify-between">
                <div className="flex items-center">
                  <Checkbox id="remember" checked={formData.rememberMe} onCheckedChange={handleCheckboxChange} />
                  <label htmlFor="remember" className="ml-2 text-sm">
                    Remember me
                  </label>
                </div>
                <Link to="/forgot-password" className="text-sm text-yellow-500 hover:text-yellow-600">
                  Forgot Password?
                </Link>
              </div>

              <Button
                type="submit"
                className="w-ful"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? "Signing in..." : "Sign In"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
