'use client'

import { cn } from '@/common/utils/cn'
import { getPasswordStrengthScore } from '../utils/auth-utils'

interface PasswordStrengthIndicatorProps {
  password: string
  showLabel?: boolean
  className?: string
}

/**
 * Password strength indicator component - shared within auth feature
 * Visual feedback for password strength during input
 * Used by both login and registration forms
 */
export function PasswordStrengthIndicator({
  password,
  showLabel = true,
  className
}: PasswordStrengthIndicatorProps) {
  const score = getPasswordStrengthScore(password)

  const strengthLevels = [
    { score: 0, label: 'Very Weak', color: 'bg-red-500' },
    { score: 1, label: 'Weak', color: 'bg-orange-500' },
    { score: 2, label: 'Fair', color: 'bg-yellow-500' },
    { score: 3, label: 'Good', color: 'bg-blue-500' },
    { score: 4, label: 'Strong', color: 'bg-green-500' },
  ]

  const currentLevel = strengthLevels[score] || strengthLevels[0]

  return (
    <div className={cn('space-y-2', className)}>
      {showLabel && (
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">
            Password Strength
          </span>
          <span className="text-sm font-medium text-gray-500">
            {currentLevel.label}
          </span>
        </div>
      )}

      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={cn('h-2 rounded-full transition-all duration-300', currentLevel.color)}
          style={{ width: `${(score / 4) * 100}%` }}
        />
      </div>

      {!showLabel && (
        <p className="text-sm text-gray-500">
          Password strength: {currentLevel.label}
        </p>
      )}
    </div>
  )
}

export type PasswordStrengthIndicatorProps = PasswordStrengthIndicatorProps
