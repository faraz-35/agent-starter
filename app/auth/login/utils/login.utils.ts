import { LoginError } from "../types";
import {
  LOGIN_STORAGE_KEYS,
  LOGIN_SECURITY,
  LOGIN_MESSAGES,
} from "../constants";

/**
 * Utility functions for login feature
 * Contains all login-specific helper functions and utilities
 */

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Check if password meets minimum requirements
 */
export const isValidPassword = (password: string): boolean => {
  return (
    password.length >= LOGIN_SECURITY.PASSWORD_MIN_LENGTH &&
    /[a-z]/.test(password) &&
    /[A-Z]/.test(password) &&
    /\d/.test(password)
  );
};

/**
 * Get password strength indicator
 */
export const getPasswordStrength = (
  password: string,
): {
  score: number;
  label: string;
  color: string;
} => {
  if (!password) {
    return { score: 0, label: "Very Weak", color: "bg-red-500" };
  }

  let score = 0;

  // Length check
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;

  // Complexity checks
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  const strengthLevels = [
    { score: 0, label: "Very Weak", color: "bg-red-500" },
    { score: 1, label: "Weak", color: "bg-orange-500" },
    { score: 2, label: "Fair", color: "bg-yellow-500" },
    { score: 3, label: "Good", color: "bg-blue-500" },
    { score: 4, label: "Strong", color: "bg-green-500" },
    { score: 5, label: "Very Strong", color: "bg-emerald-500" },
    { score: 6, label: "Excellent", color: "bg-emerald-600" },
  ];

  return strengthLevels[Math.min(score, strengthLevels.length - 1)];
};

/**
 * Handle localStorage operations for login
 */
export const loginStorage = {
  /**
   * Remember email for next login
   */
  rememberEmail: (email: string): void => {
    localStorage.setItem(LOGIN_STORAGE_KEYS.REMEMBER_EMAIL, email);
  },

  /**
   * Get remembered email
   */
  getRememberedEmail: (): string | null => {
    return localStorage.getItem(LOGIN_STORAGE_KEYS.REMEMBER_EMAIL);
  },

  /**
   * Clear remembered email
   */
  clearRememberedEmail: (): void => {
    localStorage.removeItem(LOGIN_STORAGE_KEYS.REMEMBER_EMAIL);
  },

  /**
   * Record login attempt
   */
  recordLoginAttempt: (): void => {
    const now = Date.now();
    localStorage.setItem(LOGIN_STORAGE_KEYS.LAST_LOGIN_ATTEMPT, now.toString());

    const failedCount = getFailedLoginCount();
    localStorage.setItem(
      LOGIN_STORAGE_KEYS.FAILED_LOGIN_COUNT,
      (failedCount + 1).toString(),
    );
  },

  /**
   * Record successful login (clears failed attempts)
   */
  recordSuccessfulLogin: (): void => {
    localStorage.removeItem(LOGIN_STORAGE_KEYS.FAILED_LOGIN_COUNT);
    localStorage.removeItem(LOGIN_STORAGE_KEYS.LAST_LOGIN_ATTEMPT);
  },

  /**
   * Get failed login count
   */
  getFailedLoginCount: (): number => {
    const count = localStorage.getItem(LOGIN_STORAGE_KEYS.FAILED_LOGIN_COUNT);
    return count ? parseInt(count, 10) : 0;
  },

  /**
   * Check if user should be rate limited
   */
  isRateLimited: (): boolean => {
    if (!LOGIN_SECURITY.ENABLE_RATE_LIMITING) return false;

    const failedCount = getFailedLoginCount();
    if (failedCount < LOGIN_SECURITY.MAX_ATTEMPTS) return false;

    const lastAttempt = localStorage.getItem(
      LOGIN_STORAGE_KEYS.LAST_LOGIN_ATTEMPT,
    );
    if (!lastAttempt) return false;

    const timeSinceLastAttempt = Date.now() - parseInt(lastAttempt, 10);
    return timeSinceLastAttempt < LOGIN_SECURITY.LOCKOUT_DURATION;
  },

  /**
   * Get remaining lockout time in seconds
   */
  getLockoutRemainingTime: (): number => {
    const lastAttempt = localStorage.getItem(
      LOGIN_STORAGE_KEYS.LAST_LOGIN_ATTEMPT,
    );
    if (!lastAttempt) return 0;

    const timeSinceLastAttempt = Date.now() - parseInt(lastAttempt, 10);
    const remainingTime =
      LOGIN_SECURITY.LOCKOUT_DURATION - timeSinceLastAttempt;

    return Math.max(0, Math.ceil(remainingTime / 1000));
  },
};

/**
 * Format error messages for user display
 */
export const formatLoginError = (error: unknown): string => {
  if (typeof error === "string") {
    return LOGIN_MESSAGES[error as keyof typeof LOGIN_MESSAGES] || error;
  }

  if (error instanceof Error) {
    return (
      LOGIN_MESSAGES[error.message as keyof typeof LOGIN_MESSAGES] ||
      error.message
    );
  }

  return LOGIN_MESSAGES[LoginError.UNKNOWN_ERROR];
};

/**
 * Sanitize and validate form data
 */
export const sanitizeLoginData = (data: {
  email?: string;
  password?: string;
  remember_me?: boolean;
}): {
  email: string;
  password: string;
  remember_me: boolean;
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];

  // Sanitize email
  const email = data.email?.trim().toLowerCase() || "";
  if (!email) {
    errors.push(LOGIN_MESSAGES.REQUIRED_EMAIL);
  } else if (!isValidEmail(email)) {
    errors.push(LOGIN_MESSAGES.INVALID_EMAIL);
  }

  // Validate password
  const password = data.password || "";
  if (!password) {
    errors.push(LOGIN_MESSAGES.REQUIRED_PASSWORD);
  }

  const remember_me = Boolean(data.remember_me);

  return {
    email,
    password,
    remember_me,
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Generate secure password suggestion
 */
export const generatePasswordSuggestion = (): string => {
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?";

  const allChars = lowercase + uppercase + numbers + symbols;
  let password = "";

  // Ensure at least one character from each category
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += symbols[Math.floor(Math.random() * symbols.length)];

  // Fill the rest with random characters
  for (let i = 4; i < 12; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }

  // Shuffle the password
  return password
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("");
};

/**
 * Track login analytics
 */
export const trackLoginEvent = (
  eventName: string,
  properties?: Record<string, any>,
): void => {
  // This would integrate with your analytics service
  // For now, we'll just log to console in development
  if (process.env.NODE_ENV === "development") {
    console.log(`Login Analytics: ${eventName}`, properties);
  }

  // Example integration with analytics service:
  // analytics.track(eventName, properties)
};

/**
 * Check if browser supports password autofill
 */
export const supportsPasswordAutofill = (): boolean => {
  // Modern browsers support password autofill
  return (
    "credentials" in navigator || "password" in document.createElement("input")
  );
};

/**
 * Debounce function for form inputs
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number,
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
};
