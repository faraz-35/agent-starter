'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button, Input } from '@/common/components/ui'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/common/components/ui'
import { useMagicLinkLogin } from '../hooks'
import { LOGIN_FIELD_LABELS, LOGIN_FIELD_PLACEHOLDERS } from '../constants'
import { cn } from '@/common/utils/cn'

const magicLinkSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
})

type MagicLinkFormData = z.infer<typeof magicLinkSchema>

interface MagicLinkFormProps {
  className?: string
  onSuccess?: (email: string) => void
}

/**
 * Magic link login form component
 * Handles passwordless login via email magic links
 */
export function MagicLinkForm({ className, onSuccess }: MagicLinkFormProps) {
  const { handleSendMagicLink, state, reset } = useMagicLinkLogin()

  const form = useForm<MagicLinkFormData>({
    resolver: zodResolver(magicLinkSchema),
    defaultValues: {
      email: state.email,
    },
  })

  const onSubmit = async (data: MagicLinkFormData) => {
    await handleSendMagicLink(data.email)

    if (state.isSent && onSuccess) {
      onSuccess(data.email)
    }
  }

  const handleBack = () => {
    reset()
    form.reset()
  }

  if (state.isSent) {
    return (
      <Card className={cn('w-full max-w-md mx-auto', className)}>
        <CardHeader>
          <CardTitle>Check Your Email</CardTitle>
          <CardDescription>
            We've sent a magic link to {state.email}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-3">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <p className="text-sm text-gray-600">
              Click the link in your email to sign in. The link will expire in 24 hours.
            </p>

            <div className="space-y-2">
              <p className="text-xs text-gray-500">
                Didn't receive the email? Check your spam folder or try again.
              </p>

              <Button
                variant="outline"
                size="sm"
                onClick={handleBack}
                className="w-full"
              >
                Send Another Link
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn('w-full max-w-md mx-auto', className)}>
      <CardHeader>
        <CardTitle>Magic Link Login</CardTitle>
        <CardDescription>
          Enter your email address and we'll send you a secure login link
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="magic-link-email"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {LOGIN_FIELD_LABELS.email}
            </label>
            <Input
              id="magic-link-email"
              type="email"
              placeholder={LOGIN_FIELD_PLACEHOLDERS.email}
              {...form.register('email')}
              disabled={state.isLoading}
            />
            {form.formState.errors.email && (
              <p className="text-sm text-destructive">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={state.isLoading}
          >
            {state.isLoading ? 'Sending Magic Link...' : 'Send Magic Link'}
          </Button>

          <div className="text-center">
            <Button
              type="button"
              variant="link"
              size="sm"
              onClick={handleBack}
            >
              Back to Password Login
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export type MagicLinkFormProps = MagicLinkFormProps
