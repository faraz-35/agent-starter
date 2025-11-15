'use client'

import { useState, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

/**
 * Base auth form hook - shared within auth feature
 * Provides common form state management for auth forms
 * Contains ONLY form logic, no business logic
 */
export function useAuthForm<T extends z.ZodSchema>(
  schema: T,
  defaultValues: z.infer<T>
) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues,
    mode: 'onBlur',
  })

  const setLoading = useCallback((loading: boolean) => {
    setIsLoading(loading)
  }, [])

  const setErrorState = useCallback((errorMessage: string | null) => {
    setError(errorMessage)
  }, [])

  const clearError = useCallback(() => {
    setError(null)
    form.clearErrors()
  }, [form])

  const reset = useCallback(() => {
    setIsLoading(false)
    setError(null)
    form.reset()
  }, [form])

  return {
    // Form instance
    form,

    // State
    isLoading,
    error,

    // Actions
    setLoading,
    setErrorState,
    clearError,
    reset,

    // Computed values
    hasError: !!error,
    isValid: form.formState.isValid,
    isDirty: form.formState.isDirty,

    // Field helpers
    getFieldError: (field: string) => form.formState.errors[field]?.message,
    isFieldTouched: (field: string) => form.formState.touchedFields[field],
  }
}
