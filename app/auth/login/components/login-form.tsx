"use client";

import { useRouter } from "next/navigation";
import { Button, Input } from "@/common/components/ui";
import { AuthFormField, AuthCard } from "../../common/components";
import { useAuthForm } from "../../common/hooks";
import { loginAction } from "../actions";
import { loginSchema } from "../types";
import { SOCIAL_LOGIN_CONFIG } from "../constants";
import { SocialLoginButtons } from "../../common/components";
import { useLogin } from "../hooks/use-login";

interface LoginFormProps {
  className?: string;
}

/**
 * Login form component with validation and error handling
 * Contains all login-specific business logic
 * Uses shared components from auth/common to avoid duplication
 */
export function LoginForm({ className }: LoginFormProps) {
  const router = useRouter();

  // Base form management from shared auth hook
  const form = useAuthForm(loginSchema, {
    email: "",
    password: "",
    remember_me: false,
  });

  // Login-specific business logic hook
  const { handleLogin } = useLogin({
    onSuccess: () => {
      router.push("/dashboard");
      router.refresh();
    },
    onError: form.setErrorState,
  });

  const onSubmit = async (data: any) => {
    form.setLoading(true);
    form.clearError();

    try {
      await handleLogin(data);
    } finally {
      form.setLoading(false);
    }
  };

  return (
    <AuthCard className={className}>
      <form onSubmit={form.form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Email Field - using shared component */}
        <AuthFormField
          label="Email Address"
          error={form.getFieldError("email")}
          required
        >
          <Input
            id="email"
            type="email"
            placeholder="Enter your email address"
            {...form.form.register("email")}
            disabled={form.isLoading}
          />
        </AuthFormField>

        {/* Password Field - using shared component */}
        <AuthFormField
          label="Password"
          error={form.getFieldError("password")}
          required
        >
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            {...form.form.register("password")}
            disabled={form.isLoading}
          />
        </AuthFormField>

        {/* Remember Me - login specific */}
        <div className="flex items-center">
          <input
            id="remember-me"
            type="checkbox"
            {...form.form.register("remember_me")}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label
            htmlFor="remember-me"
            className="ml-2 block text-sm text-gray-900"
          >
            Remember me
          </label>
        </div>

        {/* Error Display - login specific */}
        {form.error && (
          <div className="rounded-md border border-red-200 bg-red-50 p-3">
            <p className="text-sm text-red-800">{form.error}</p>
          </div>
        )}

        {/* Submit Button */}
        <Button type="submit" className="w-full" disabled={form.isLoading}>
          {form.isLoading ? "Signing in..." : "Sign In"}
        </Button>

        {/* Social Login - using shared component */}
        <SocialLoginButtons
          providers={Object.entries(SOCIAL_LOGIN_CONFIG)
            .filter(([_, config]) => config.enabled)
            .map(([id, config]) => ({ id, ...config }))}
          onProviderClick={(providerId) => {
            // Login-specific social login handling
            window.location.href = `/auth/oauth/${providerId}`;
          }}
        />

        {/* Forgot Password Link - login specific */}
        <div className="text-center">
          <a
            href="/auth/forgot-password"
            className="text-sm text-indigo-600 hover:text-indigo-500"
          >
            Forgot your password?
          </a>
        </div>
      </form>
    </AuthCard>
  );
}
