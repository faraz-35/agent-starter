'use client'

import { Button } from '@/common/components/ui'
import { useSocialLogin } from '../hooks'
import { SOCIAL_LOGIN_CONFIG } from '../constants'

interface SocialLoginButtonsProps {
  className?: string
  redirectUrl?: string
}

/**
 * Social login buttons component
 * Handles authentication through third-party providers
 */
export function SocialLoginButtons({ className, redirectUrl }: SocialLoginButtonsProps) {
  const { handleSocialLogin } = useSocialLogin()

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Or continue with</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {Object.entries(SOCIAL_LOGIN_CONFIG)
          .filter(([_, config]) => config.enabled)
          .map(([provider, config]) => (
            <Button
              key={provider}
              type="button"
              variant="outline"
              onClick={() => handleSocialLogin(provider as 'google' | 'github')}
              className={`w-full inline-flex justify-center items-center py-2 px-4 border ${config.borderColor} rounded-md shadow-sm text-sm font-medium ${config.textColor} ${config.bgColor} hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                {provider === 'google' && (
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                )}
                {provider === 'github' && (
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.627-5.373-12-12-12z" />
                )}
              </svg>
              {config.name}
            </Button>
          ))}
      </div>
    </div>
  )
}

export type SocialLoginButtonsProps = SocialLoginButtonsProps
