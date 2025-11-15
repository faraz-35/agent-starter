/**
 * Auth common components barrel export
 * Shared components within the auth feature to avoid code duplication
 * Contains ONLY presentational components, no business logic
 */

export { AuthFormWrapper } from "./auth-form-wrapper";
export { AuthCard } from "./auth-card";
export { AuthFormField } from "./auth-form-field";
export { SocialLoginButtons } from "./social-login-buttons";
export { PasswordStrengthIndicator } from "./password-strength-indicator";

// Types for shared components
export type { AuthFormWrapperProps } from "./auth-form-wrapper";
export type { AuthCardProps } from "./auth-card";
export type { AuthFormFieldProps } from "./auth-form-field";
export type { SocialLoginButtonsProps } from "./social-login-buttons";
export type { PasswordStrengthIndicatorProps } from "./password-strength-indicator";
