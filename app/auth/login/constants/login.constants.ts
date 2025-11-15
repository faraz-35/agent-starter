import { LoginError } from "../types";

/**
 * Login form validation messages
 */
export const LOGIN_MESSAGES = {
  REQUIRED_EMAIL: "Email address is required",
  INVALID_EMAIL: "Please enter a valid email address",
  REQUIRED_PASSWORD: "Password is required",
  MIN_PASSWORD_LENGTH: "Password must be at least 8 characters",
  PASSWORD_REQUIREMENTS:
    "Password must contain at least one uppercase letter, one lowercase letter, and one number",

  // Error messages
  [LoginError.INVALID_CREDENTIALS]: "Invalid email or password",
  [LoginError.NETWORK_ERROR]:
    "Network error occurred. Please check your connection and try again",
  [LoginError.ACCOUNT_LOCKED]:
    "Your account has been locked. Please contact support",
  [LoginError.EMAIL_NOT_VERIFIED]:
    "Please verify your email address before logging in",
  [LoginError.UNKNOWN_ERROR]: "An unexpected error occurred. Please try again",
} as const;

/**
 * Login form field labels
 */
export const LOGIN_FIELD_LABELS = {
  email: "Email Address",
  password: "Password",
  remember_me: "Remember me",
} as const;

/**
 * Login form field placeholders
 */
export const LOGIN_FIELD_PLACEHOLDERS = {
  email: "Enter your email address",
  password: "Enter your password",
} as const;

/**
 * Login form ARIA labels
 */
export const LOGIN_ARIA_LABELS = {
  email: "Email address input field",
  password: "Password input field",
  remember_me: "Remember me checkbox",
  submit_button: "Sign in to your account",
  forgot_password: "Reset your password",
  create_account: "Create a new account",
  social_login: "Sign in with social account",
} as const;

/**
 * Login form success messages
 */
export const LOGIN_SUCCESS_MESSAGES = {
  login_success: "Login successful! Redirecting...",
  magic_link_sent: "Magic link sent to your email address",
  account_created: "Account created successfully. Please check your email.",
} as const;

/**
 * Login timing constants (in milliseconds)
 */
export const LOGIN_TIMING = {
  AUTO_REDIRECT_DELAY: 1500, // Delay before redirect after successful login
  ERROR_CLEAR_DELAY: 5000, // Auto-clear error messages after this time
  DEBOUNCE_DELAY: 300, // Form field debouncing
  LOADING_TIMEOUT: 30000, // Maximum time to wait for login response
} as const;

/**
 * Login feature flags
 */
export const LOGIN_FEATURES = {
  ENABLE_SOCIAL_LOGIN: true,
  ENABLE_MAGIC_LINK: true,
  ENABLE_REMEMBER_ME: true,
  ENABLE_PASSWORD_STRENGTH: false, // Only for registration
  ENABLE_BIOMETRIC_LOGIN: false, // Future feature
  ENABLE_TOTP: false, // Future feature
} as const;

/**
 * Social login providers configuration
 */
export const SOCIAL_LOGIN_CONFIG = {
  google: {
    enabled: true,
    name: "Continue with Google",
    icon: "google",
    color: "#4285f4",
    bgColor: "bg-white",
    textColor: "text-gray-700",
    borderColor: "border-gray-300",
  },
  github: {
    enabled: true,
    name: "Continue with GitHub",
    icon: "github",
    color: "#333",
    bgColor: "bg-gray-900",
    textColor: "text-white",
    borderColor: "border-gray-700",
  },
  // Future providers can be added here
  // microsoft: {
  //   enabled: false,
  //   name: 'Continue with Microsoft',
  //   icon: 'microsoft',
  //   color: '#0078d4',
  //   bgColor: 'bg-white',
  //   textColor: 'text-gray-700',
  //   borderColor: 'border-gray-300',
  // },
} as const;

/**
 * Login URLs and paths
 */
export const LOGIN_URLS = {
  LOGIN_PAGE: "/auth/login",
  REGISTER_PAGE: "/auth/register",
  FORGOT_PASSWORD: "/auth/forgot-password",
  VERIFY_EMAIL: "/auth/verify-email",
  DASHBOARD: "/dashboard",
  PROFILE: "/profile",
  ONBOARDING: "/onboarding",
  AUTH_CALLBACK: "/auth/callback",
} as const;

/**
 * Login localStorage keys
 */
export const LOGIN_STORAGE_KEYS = {
  REMEMBER_EMAIL: "auth_remember_email",
  LAST_LOGIN_ATTEMPT: "auth_last_login_attempt",
  FAILED_LOGIN_COUNT: "auth_failed_login_count",
  SOCIAL_LOGIN_PROVIDER: "auth_social_provider",
  REDIRECT_URL: "auth_redirect_url",
} as const;

/**
 * Login analytics events
 */
export const LOGIN_ANALYTICS_EVENTS = {
  LOGIN_ATTEMPT: "auth_login_attempt",
  LOGIN_SUCCESS: "auth_login_success",
  LOGIN_FAILED: "auth_login_failed",
  SOCIAL_LOGIN_STARTED: "auth_social_login_started",
  SOCIAL_LOGIN_SUCCESS: "auth_social_login_success",
  MAGIC_LINK_SENT: "auth_magic_link_sent",
  PASSWORD_RESET_REQUESTED: "auth_password_reset_requested",
} as const;

/**
 * Maximum login attempts before showing additional security measures
 */
export const LOGIN_SECURITY = {
  MAX_ATTEMPTS: 5,
  LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutes in milliseconds
  PASSWORD_MIN_LENGTH: 8,
  REQUIRE_EMAIL_VERIFICATION: true,
  ENABLE_RATE_LIMITING: true,
} as const;
