'use client'

import { cn } from '@/common/utils/cn'

interface AuthFormWrapperProps {
  title: string
  description: string
  children: React.ReactNode
  className?: string
  footer?: React.ReactNode
}

/**
 * Auth form wrapper component - shared within auth feature
 * Provides consistent layout and styling for all auth forms
 * Contains ONLY presentational logic, no business logic
 */
export function AuthFormWrapper({
  title,
  description,
  children,
  className,
  footer
}: AuthFormWrapperProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Auth Header */}
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            {title}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {description}
          </p>
        </div>

        {/* Form Content */}
        <div className={cn('bg-white shadow rounded-lg', className)}>
          {children}
        </div>

        {/* Footer Content */}
        {footer && (
          <div className="text-center space-y-2">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
