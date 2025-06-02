
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { ShieldAlert } from "lucide-react"

const UnauthorizedPage = () => {
  const navigate = useNavigate()

  return (
    <div className="flex h-screen flex-col items-center justify-center p-4 text-center">
      <ShieldAlert className="h-24 w-24 text-primary mb-6" />
      <h1 className="text-4xl font-bold mb-2">Access Denied</h1>
      <p className="text-gray-600 mb-8 max-w-md">
        You don't have permission to access this page. Please contact your administrator if you believe this is an
        error.
      </p>
      <div className="flex gap-4">
        <Button onClick={() => navigate(-1)} variant="outline">
          Go Back
        </Button>
        <Button onClick={() => navigate("/")} >
          Go to Dashboard
        </Button>
      </div>
    </div>
  )
}

export default UnauthorizedPage
