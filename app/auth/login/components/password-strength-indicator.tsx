'use client'

import { getPasswordStrength } from '../utils'
import { cn } from '@/common/utils/cn'

interface PasswordStrengthIndicatorProps {
  password: string
  showLabel?: boolean
  className?: string
}

/**
 * Password strength indicator component
 * Visual feedback for password strength during input
 */
export function PasswordStrengthIndicator({
  password,
  showLabel = true,
  className
}: PasswordStrengthIndicatorProps) {
  const strength = getPasswordStrength(password)

  return (
    <div className={cn('space-y-2', className)}>
      {showLabel && (
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">
            Password Strength
          </span>
          <span className="text-sm font-medium text-gray-500">
            {strength.label}
          </span>
        </div>
      )}

      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={cn('h-2 rounded-full transition-all duration-300', strength.color)}
          style={{ width: `${(strength.score / 6) * 100}%` }}
        />
      </div>

      {!showLabel && (
        <p className="text-sm text-gray-500">
          Password strength: {strength.label}
        </p>
      )}
    </div>
  )
}

export type PasswordStrengthIndicatorProps = PasswordStrengthIndicatorProps
