'use client'

import { cn } from '@/common/utils/cn'

interface AuthCardProps {
  children: React.ReactNode
  className?: string
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

/**
 * Auth card component - shared within auth feature
 * Consistent card styling for auth forms
 */
export function AuthCard({ children, className, padding = 'md' }: AuthCardProps) {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  }

  return (
    <div className={cn(
      'bg-white shadow rounded-lg',
      paddingClasses[padding],
      className
    )}>
      {children}
    </div>
  )
}
