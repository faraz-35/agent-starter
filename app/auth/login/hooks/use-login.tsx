'use client'

import { useCallback } from 'react'
import { loginAction } from '../actions'
import { LoginFormData } from '../types'

interface UseLoginOptions {
  onSuccess?: () => void
  onError?: (error: string) => void
}

/**
 * Login-specific business logic hook
 * Contains all login-specific authentication logic
 * Uses shared form state management from auth/common
 */
export function useLogin({ onSuccess, onError }: UseLoginOptions = {}) {
  const handleLogin = useCallback(async (data: LoginFormData) => {
    try {
      const result = await loginAction(data)

      if (result.data?.success) {
        onSuccess?.()
      } else {
        const errorMessage = result.serverError || 'Login failed'
        onError?.(errorMessage)
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred'
      onError?.(errorMessage)
    }
  }, [onSuccess, onError])

  return {
    handleLogin,
  }
}
