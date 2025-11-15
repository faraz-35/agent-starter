'use client'

import { ReactNode } from 'react'
import { cn } from '@/common/utils/cn'

interface AuthFormFieldProps {
  label: string
  error?: string
  required?: boolean
  children: ReactNode
  className?: string
}

/**
 * Auth form field component - shared within auth feature
 * Consistent form field styling and layout
 * Contains ONLY presentational logic
 */
export function AuthFormField({
  label,
  error,
  required,
  children,
  className
}: AuthFormFieldProps) {
  return (
    <div className={cn('space-y-2', className)}>
      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
      {error && (
        <p className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}
