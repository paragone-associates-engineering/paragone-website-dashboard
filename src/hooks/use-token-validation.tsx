
import { useCallback } from "react"
import { useAuth } from "@/context/auth-context"

export function useTokenValidation() {
  const { checkTokenValidity, isAuthenticated } = useAuth()

  const validateAndExecute = useCallback(
    async (callback: () => void | Promise<void>) => {
      if (!isAuthenticated) {
        return false
      }

      const isValid = await checkTokenValidity()
      if (isValid) {
        await callback()
        return true
      }
      return false
    },
    [checkTokenValidity, isAuthenticated],
  )

  return {
    validateAndExecute,
    checkTokenValidity,
  }
}
