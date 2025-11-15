import { z } from "zod";
import { emailSchema, passwordSchema } from "@/common/lib/schemas";

/**
 * Login-specific form schema
 */
export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  remember_me: z.boolean().optional().default(false),
});

/**
 * Login form data type
 */
export type LoginFormData = z.infer<typeof loginSchema>;

/**
 * Login response type
 */
export interface LoginResponse {
  success: boolean;
  user?: {
    id: string;
    email: string;
    role?: string;
  };
  error?: string;
}

/**
 * Login state interface
 */
export interface LoginState {
  isLoading: boolean;
  error: string | null;
  user: LoginResponse["user"] | null;
}

/**
 * Login errors enum
 */
export enum LoginError {
  INVALID_CREDENTIALS = "Invalid email or password",
  NETWORK_ERROR = "Network error occurred",
  ACCOUNT_LOCKED = "Account is temporarily locked",
  EMAIL_NOT_VERIFIED = "Please verify your email address",
  UNKNOWN_ERROR = "An unexpected error occurred",
}

/**
 * Login redirect destinations
 */
export const LOGIN_REDIRECTS = {
  DASHBOARD: "/dashboard",
  PROFILE: "/profile",
  ONBOARDING: "/onboarding",
  VERIFY_EMAIL: "/auth/verify-email",
} as const;

export type LoginRedirect =
  (typeof LOGIN_REDIRECTS)[keyof typeof LOGIN_REDIRECTS];
