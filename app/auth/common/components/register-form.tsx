'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { Button, Input } from '@/common/components/ui'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/common/components/ui'
import { useZodForm } from '@/common/hooks/use-zod-form'
import { registerUser } from '@/app/features/auth/actions/auth-actions'
import { registerSchema } from '@/common/lib/schemas'
import type { RegisterInput } from '@/common/lib/schemas'
import { cn } from '@/common/utils/cn'

interface RegisterFormProps {
  className?: string
}

/**
 * Registration form component with validation and error handling
 */
export function RegisterForm({ className }: RegisterFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const form = useZodForm(registerSchema, {
    email: '',
    password: '',
    confirmPassword: '',
  })

  const onSubmit = async (data: RegisterInput) => {
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const result = await registerUser({
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
      })

      if (result.data?.success) {
        setSuccess('Registration successful! Please check your email to verify your account.')
        setTimeout(() => {
          router.push('/login')
        }, 2000)
      } else {
        setError(result.serverError || 'Registration failed')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className={cn('w-full max-w-md mx-auto', className)}>
      <CardHeader>
        <CardTitle>Create Account</CardTitle>
        <CardDescription>
          Enter your information to create a new account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              {...form.register('email')}
              disabled={isLoading}
            />
            {form.formState.errors.email && (
              <p className="text-sm text-destructive">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="password"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Password
            </label>
            <Input
              id="password"
              type="password"
              placeholder="Create a password"
              {...form.register('password')}
              disabled={isLoading}
            />
            {form.formState.errors.password && (
              <p className="text-sm text-destructive">
                {form.formState.errors.password.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="confirmPassword"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Confirm Password
            </label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              {...form.register('confirmPassword')}
              disabled={isLoading}
            />
            {form.formState.errors.confirmPassword && (
              <p className="text-sm text-destructive">
                {form.formState.errors.confirmPassword.message}
              </p>
            )}
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          {success && (
            <p className="text-sm text-green-600">{success}</p>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Creating account...' : 'Create Account'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
