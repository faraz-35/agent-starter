'use client'

import { X, AlertTriangle, Shield, RefreshCw } from 'lucide-react'
import { formatLoginError, loginStorage } from '../utils'
import { LoginError } from '../types'
import { Button } from '@/common/components/ui'

interface LoginErrorDisplayProps {
  error: string | null
  onClear?: () => void
  className?: string
}

/**
 * Login error display component
 * Shows contextual error messages with appropriate actions
 */
export function LoginErrorDisplay({ error, onClear, className }: LoginErrorDisplayProps) {
  if (!error) return null

  const isRateLimited = loginStorage.isRateLimited()
  const lockoutTime = loginStorage.getLockoutRemainingTime()

  const getErrorIcon = (errorMessage: string) => {
    if (isRateLimited) {
      return <Shield className="h-5 w-5 text-amber-600" />
    }

    if (errorMessage.includes('network') || errorMessage.includes('connection')) {
      return <RefreshCw className="h-5 w-5 text-blue-600" />
    }

    return <AlertTriangle className="h-5 w-5 text-red-600" />
  }

  const getErrorTitle = (errorMessage: string) => {
    if (isRateLimited) return 'Account Temporarily Locked'
    if (errorMessage.includes('network')) return 'Network Error'
    if (errorMessage.includes('email')) return 'Email Error'
    return 'Login Failed'
  }

  const handleRetry = () => {
    // Clear the rate limiting if user wants to retry
    if (isRateLimited) {
      loginStorage.recordSuccessfulLogin()
    }
    onClear?.()
  }

  return (
    <div className={`rounded-md border border-red-200 bg-red-50 p-4 ${className}`}>
      <div className="flex">
        <div className="flex-shrink-0">
          {getErrorIcon(error)}
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-red-800">
            {getErrorTitle(error)}
          </h3>
          <div className="mt-2 text-sm text-red-700">
            <p>{formatLoginError(error)}</p>

            {isRateLimited && lockoutTime > 0 && (
              <p className="mt-1">
                Please try again in {Math.ceil(lockoutTime / 60)} minutes.
              </p>
            )}

            {error.includes('network') && (
              <p className="mt-2">
                Please check your internet connection and try again.
              </p>
            )}
          </div>

          <div className="mt-4 flex space-x-3">
            {isRateLocked ? (
              <Button
                variant="outline"
                size="sm"
                onClick={handleRetry}
                className="text-red-700 border-red-300 hover:bg-red-100"
              >
                Contact Support
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={handleRetry}
                className="text-red-700 border-red-300 hover:bg-red-100"
              >
                Try Again
              </Button>
            )}

            {onClear && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClear}
                className="text-red-700 hover:bg-red-100"
              >
                <X className="h-4 w-4 mr-1" />
                Dismiss
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper component
const isRateLocked = (error: string | null) => {
  return error?.includes('locked') || loginStorage.isRateLimited()
}

export type LoginErrorDisplayProps = LoginErrorDisplayProps
