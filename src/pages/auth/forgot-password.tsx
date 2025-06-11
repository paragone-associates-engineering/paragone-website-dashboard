import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { userService } from '@/services/user-profile'
import { useMutation } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {toast} from 'sonner'
const ForgotPassword = () => {
  const navigate =  useNavigate();
    const [resetPasswordEmail, setResetPasswordEmail] = useState("")
    const resetPasswordMutation = useMutation({
    mutationFn: (email: string) => userService.resetPassword(email),
    onSuccess: () => {
      toast.success("Password reset email sent successfully. Please check your email.")
      setResetPasswordEmail("")
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error:any) => {
      toast.error(error.response.data.message || "Failed to send password reset email")
    },
  })

  const handleResetPassword = (e: React.FormEvent) => {
      e.preventDefault()
  
      if (!resetPasswordEmail) {
        toast.error("Please enter your email address")
        return
      }
  
      resetPasswordMutation.mutate(resetPasswordEmail)
    }

 const handleCancel = () => {
      if (!resetPasswordEmail) {
        navigate('/login')
      }
      else{
        setResetPasswordEmail('')
      }
 }

    return (
        <div className='flex min-h-screen'>
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
           
          </div>
            <form onSubmit={handleResetPassword} className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Forgot Password</h3>
                    <p className="text-sm text-gray-600 mb-6">
                      Enter your email address and we'll send you instructions to reset your password.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="resetEmail">
                      Email Address<span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="resetEmail"
                      type="email"
                      value={resetPasswordEmail}
                      onChange={(e) => setResetPasswordEmail(e.target.value)}
                      placeholder="Enter your email address"
                      required
                    />
                 
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-blue-800">Password Reset Information</h3>
                        <div className="mt-2 text-sm text-blue-700">
                          <ul className="list-disc pl-5 space-y-1">
                            <li>A new password will be automatically generated</li>
                            <li>You will receive the new password via email</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={handleCancel}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={resetPasswordMutation.isPending}>
                      {resetPasswordMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Send Reset Email
                    </Button>
                  </div>
                </form>
                </div>
                </div>

        </div>
    )
}

export default ForgotPassword
