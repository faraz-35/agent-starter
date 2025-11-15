/**
 * Shared auth utilities - used within auth feature
 * Contains ONLY utility functions, no business logic
 */

/**
 * Common email validation regex
 */
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Common password validation patterns
 */
export const PASSWORD_PATTERNS = {
  UPPERCASE: /[A-Z]/,
  LOWERCASE: /[a-z]/,
  NUMBER: /\d/,
  SPECIAL: /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/,
  MIN_LENGTH: 8,
} as const;

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  return EMAIL_REGEX.test(email);
};

/**
 * Validate password meets basic requirements
 */
export const isValidPassword = (password: string): boolean => {
  return (
    password.length >= PASSWORD_PATTERNS.MIN_LENGTH &&
    PASSWORD_PATTERNS.UPPERCASE.test(password) &&
    PASSWORD_PATTERNS.LOWERCASE.test(password) &&
    PASSWORD_PATTERNS.NUMBER.test(password)
  );
};

/**
 * Get password strength score (0-4)
 */
export const getPasswordStrengthScore = (password: string): number => {
  let score = 0;

  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (PASSWORD_PATTERNS.UPPERCASE.test(password)) score++;
  if (PASSWORD_PATTERNS.LOWERCASE.test(password)) score++;
  if (PASSWORD_PATTERNS.NUMBER.test(password)) score++;
  if (PASSWORD_PATTERNS.SPECIAL.test(password)) score++;

  return Math.min(Math.floor(score / 1.5), 4);
};

/**
 * Common auth form field names
 */
export const AUTH_FIELDS = {
  EMAIL: "email",
  PASSWORD: "password",
  CONFIRM_PASSWORD: "confirmPassword",
  REMEMBER_ME: "rememberMe",
  FIRST_NAME: "firstName",
  LAST_NAME: "lastName",
} as const;

/**
 * Common auth error types
 */
export const AUTH_ERRORS = {
  INVALID_EMAIL: "INVALID_EMAIL",
  INVALID_PASSWORD: "INVALID_PASSWORD",
  PASSWORD_MISMATCH: "PASSWORD_MISMATCH",
  USER_NOT_FOUND: "USER_NOT_FOUND",
  EMAIL_EXISTS: "EMAIL_EXISTS",
  WEAK_PASSWORD: "WEAK_PASSWORD",
  NETWORK_ERROR: "NETWORK_ERROR",
} as const;
