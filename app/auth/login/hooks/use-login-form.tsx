'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { useToast } from '@/common/components/ui/toast' // Assuming toast is available
import { loginAction } from '../actions'
import { loginSchema, LoginFormData, LoginState, LoginError } from '../types'
import { LOGIN_REDIRECTS } from '../types'

/**
 * Custom hook for handling login form state and logic
 * Encapsulates all login-specific business logic and state management
 */
export function useLoginForm() {
  const router = useRouter()
  const { toast } = useToast()

  const [state, setState] = useState<LoginState>({
    isLoading: false,
    error: null,
    user: null,
  })

  const form = useForm<LoginFormData>({
    resolver: (resolver: any) => resolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      remember_me: false,
    },
    mode: 'onBlur',
  })

  const handleLogin = useCallback(async (data: LoginFormData) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      const result = await loginAction(data)

      if (result.data?.success) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          user: result.data.user || null,
          error: null,
        }))

        // Show success toast
        toast({
          title: 'Login successful',
          description: `Welcome back, ${result.data.user?.email}!`,
        })

        // Navigate to appropriate redirect
        const redirectUrl = (result.data as any).redirectUrl || LOGIN_REDIRECTS.DASHBOARD
        router.push(redirectUrl)
        router.refresh()

      } else {
        const errorMessage = result.serverError || LoginError.UNKNOWN_ERROR
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: errorMessage,
        }))

        // Show error toast
        toast({
          title: 'Login failed',
          description: errorMessage,
          variant: 'destructive',
        })
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : LoginError.UNKNOWN_ERROR

      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }))

      // Show error toast
      toast({
        title: 'Login failed',
        description: errorMessage,
        variant: 'destructive',
      })
    }
  }, [router, toast])

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }))
    form.clearErrors()
  }, [form])

  const resetForm = useCallback(() => {
    setState({
      isLoading: false,
      error: null,
      user: null,
    })
    form.reset()
  }, [form])

  // Auto-clear error after 5 seconds
  useState(() => {
    if (state.error) {
      const timer = setTimeout(clearError, 5000)
      return () => clearTimeout(timer)
    }
  })

  return {
    // Form state
    form,
    state,

    // Actions
    onSubmit: form.handleSubmit(handleLogin),
    clearError,
    resetForm,

    // Computed values
    hasError: !!state.error,
    canSubmit: form.formState.isValid && !state.isLoading,

    // Form field helpers
    getFieldError: (field: keyof LoginFormData) => form.formState.errors[field]?.message,
    isFieldTouched: (field: keyof LoginFormData) => form.formState.touchedFields[field],
  }
}

/**
 * Hook for social login functionality
 */
export function useSocialLogin() {
  const router = useRouter()

  const handleSocialLogin = useCallback((provider: 'google' | 'github') => {
    // Import and use the getSocialLoginUrl function
    import('../actions').then(({ getSocialLoginUrl }) => {
      const url = getSocialLoginUrl(provider)
      window.location.href = url
    })
  }, [router])

  return {
    handleSocialLogin,
  }
}

/**
 * Hook for magic link login
 */
export function useMagicLinkLogin() {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [isSent, setIsSent] = useState(false)

  const handleSendMagicLink = useCallback(async (emailAddress: string) => {
    setIsLoading(true)
    setEmail(emailAddress)

    try {
      const { loginWithMagicLinkAction } = await import('../actions')

      const result = await loginWithMagicLinkAction({ email: emailAddress })

      if (result.data?.success) {
        setIsSent(true)
      }
    } catch (error) {
      console.error('Magic link error:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const reset = useCallback(() => {
    setIsLoading(false)
    setEmail('')
    setIsSent(false)
  }, [])

  return {
    handleSendMagicLink,
    reset,
    state: {
      isLoading,
      email,
      isSent,
    }
  }
}
