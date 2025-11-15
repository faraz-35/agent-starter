import { publicAction } from "@/common/lib/safe-action";
import { createSupabaseServerClient } from "@/common/lib/supabase-server";
import {
  loginSchema,
  LoginFormData,
  LoginResponse,
  LoginError,
} from "../types";
import { LOGIN_REDIRECTS } from "../types";

/**
 * Login server action with comprehensive error handling
 * Handles user authentication and session management
 */
export const loginAction = publicAction(
  loginSchema,
  async ({
    email,
    password,
    remember_me,
  }: LoginFormData): Promise<LoginResponse> => {
    try {
      const supabase = createSupabaseServerClient();

      // Attempt to sign in the user
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
        options: {
          // Set session persistence based on remember_me preference
          ...(remember_me &&
            {
              // For remember_me, we don't set explicit expiration
              // Let Supabase handle default session duration
            }),
        },
      });

      if (error) {
        // Handle specific Supabase errors
        switch (error.message) {
          case "Invalid login credentials":
            throw new Error(LoginError.INVALID_CREDENTIALS);
          case "Email not confirmed":
            throw new Error(LoginError.EMAIL_NOT_VERIFIED);
          case "User is banned":
            throw new Error(LoginError.ACCOUNT_LOCKED);
          default:
            console.error("Login error:", error);
            throw new Error(LoginError.UNKNOWN_ERROR);
        }
      }

      if (!data.user) {
        throw new Error(LoginError.INVALID_CREDENTIALS);
      }

      // Get user profile data including role
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role, status, first_name, last_name")
        .eq("id", data.user.id)
        .single();

      if (profileError) {
        console.error("Profile fetch error:", profileError);
        // Continue with login even if profile fetch fails
      }

      // Check if user is active
      if (profile?.status === "inactive" || profile?.status === "suspended") {
        await supabase.auth.signOut();
        throw new Error(LoginError.ACCOUNT_LOCKED);
      }

      // Log successful login for audit purposes
      await supabase.from("activities").insert({
        user_id: data.user.id,
        action: "login",
        entity_type: "auth",
        metadata: {
          remember_me,
          ip_address: null, // Will be set by RLS policy
          user_agent: null, // Will be set by RLS policy
        },
      });

      // Determine appropriate redirect based on user profile
      let redirectUrl = LOGIN_REDIRECTS.DASHBOARD;

      // If user has no profile, redirect to onboarding
      if (!profile) {
        redirectUrl = LOGIN_REDIRECTS.ONBOARDING;
      } else if (!data.user.email_confirmed_at) {
        redirectUrl = LOGIN_REDIRECTS.VERIFY_EMAIL;
      }

      return {
        success: true,
        user: {
          id: data.user.id,
          email: data.user.email!,
          role: profile?.role || "member",
        },
        // Include redirect URL for client-side navigation
        redirectUrl,
      };
    } catch (error) {
      // Re-throw known errors, wrap unknown errors
      if (
        error instanceof Error &&
        Object.values(LoginError).includes(error.message as LoginError)
      ) {
        throw error;
      }

      console.error("Unexpected login error:", error);
      throw new Error(LoginError.UNKNOWN_ERROR);
    }
  },
);

/**
 * Login with magic link (passwordless login)
 */
export const loginWithMagicLinkAction = publicAction(
  z.object({
    email: z.string().email(),
    redirectTo: z.string().optional().default("/dashboard"),
  }),
  async ({ email, redirectTo }) => {
    const supabase = createSupabaseServerClient();

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}${redirectTo}`,
      },
    });

    if (error) {
      throw new Error("Failed to send magic link. Please try again.");
    }

    return {
      success: true,
      message: "Magic link sent to your email address",
    };
  },
);

/**
 * Check if email exists in the system
 */
export const checkEmailExistsAction = publicAction(
  z.object({
    email: z.string().email(),
  }),
  async ({ email }) => {
    const supabase = createSupabaseServerClient();

    const { data, error } = await supabase
      .from("profiles")
      .select("email")
      .eq("email", email)
      .single();

    if (error && error.code !== "PGRST116") {
      // PGRST116 is "not found"
      throw new Error("Failed to check email existence");
    }

    return {
      exists: !!data,
    };
  },
);

/**
 * Social login provider configuration
 */
export const socialLoginProviders = [
  {
    id: "google",
    name: "Google",
    icon: "google",
    color: "bg-blue-500",
  },
  {
    id: "github",
    name: "GitHub",
    icon: "github",
    color: "bg-gray-900",
  },
] as const;

export type SocialLoginProvider = (typeof socialLoginProviders)[number]["id"];

/**
 * Get social login URL
 */
export const getSocialLoginUrl = (
  provider: SocialLoginProvider,
  redirectTo?: string,
) => {
  const baseUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`;
  const redirectUrl = redirectTo || LOGIN_REDIRECTS.DASHBOARD;

  return `${baseUrl}?provider=${provider}&redirectTo=${encodeURIComponent(redirectUrl)}`;
};
