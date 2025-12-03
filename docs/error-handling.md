# Error Handling Standards

## 🚨 Critical Rule: Never Lose Error Context

**Always wrap errors, don't replace them.** When you catch an error, preserve the original error information and enhance it with context.

## Error Structure

All errors must follow this structured format:

```typescript
{
  code: 'ERROR_TYPE',           // Machine-readable code
  message: 'Human readable',    // User-friendly message
  details: {},                  // Additional context
  timestamp: 'ISO string',      // When error occurred
  requestId: 'uuid',           // For tracing
  retryable: boolean           // Can user retry?
}
```

## Error Types

### NetworkError
- **When**: API failures, timeouts, network issues
- **Display**: Toast notification with retry option
- **Retryable**: Yes

```typescript
class NetworkError extends AppError {
  constructor(message: string, details?: any) {
    super('NETWORK_ERROR', message, details, true)
  }
}
```

### ValidationError
- **When**: Form validation failures
- **Display**: Inline field errors
- **Retryable**: No (user needs to fix input)

```typescript
class ValidationError extends AppError {
  constructor(field: string, message: string) {
    super('VALIDATION_ERROR', message, { field }, false)
  }
}
```

### AuthorizationError
- **When**: Auth failures, insufficient permissions
- **Display**: Modal + redirect to login
- **Retryable**: No (requires re-authentication)

```typescript
class AuthorizationError extends AppError {
  constructor(message: string) {
    super('AUTHORIZATION_ERROR', message, {}, false)
  }
}
```

### BusinessLogicError
- **When**: Domain violations, business rule failures
- **Display**: Modal with explanation
- **Retryable**: No

```typescript
class BusinessLogicError extends AppError {
  constructor(message: string, details?: any) {
    super('BUSINESS_LOGIC_ERROR', message, details, false)
  }
}
```

### DatabaseError
- **When**: Constraint violations, database failures
- **Display**: Modal with technical details
- **Retryable**: Sometimes (depends on specific error)

```typescript
class DatabaseError extends AppError {
  constructor(message: string, details?: any) {
    super('DATABASE_ERROR', message, details, false)
  }
}
```

### ExternalServiceError
- **When**: Third-party API failures
- **Display**: Toast + retry option
- **Retryable**: Yes

```typescript
class ExternalServiceError extends AppError {
  constructor(service: string, message: string) {
    super('EXTERNAL_SERVICE_ERROR', message, { service }, true)
  }
}
```

### SystemError
- **When**: Unexpected errors, system failures
- **Display**: Modal with support contact
- **Retryable**: Sometimes

```typescript
class SystemError extends AppError {
  constructor(message: string, details?: any) {
    super('SYSTEM_ERROR', message, details, true)
  }
}
```

## Try/Catch Patterns

### ❌ WRONG: Losing Error Context
```typescript
try {
  await someOperation()
} catch (error) {
  throw new Error('Something went wrong') // ❌ Lost original error!
}
```

### ✅ RIGHT: Preserve and Enhance Context
```typescript
try {
  await someOperation()
} catch (error) {
  if (error instanceof AppError) {
    throw error // Already structured
  } else {
    throw new SystemError('OPERATION_FAILED', error.message, {
      originalError: error,
      context: { action: 'someOperation' }
    })
  }
}
```

## Layered Error Handling

### 1. Server Actions Layer
Convert raw errors to structured errors:

```typescript
// app/feature/actions/create-user.ts
export const createUser = authAction(userSchema, async (data, ctx) => {
  try {
    const { error } = await ctx.supabase
      .from('users')
      .insert(data)
    
    if (error) {
      throw new DatabaseError('Failed to create user', error)
    }
    
    return { success: true }
  } catch (error) {
    if (error instanceof AppError) {
      throw error
    }
    throw new SystemError('USER_CREATION_FAILED', error.message)
  }
})
```

### 2. React Query Layer
Route errors to global error handler:

```typescript
// app/(common)/hooks/use-mutation-wrapper.ts
export function useMutationWrapper(mutationFn: MutationFunction) {
  return useMutation({
    mutationFn,
    onError: (error) => {
      // Route to global error handler based on error type
      errorHandler.handleError(error)
    }
  })
}
```

### 3. Components Layer
Minimal catching, let error manager handle display:

```typescript
// ❌ WRONG: Catching errors unnecessarily
function MyComponent() {
  const handleSubmit = async () => {
    try {
      await createUserData(data)
    } catch (error) {
      // Don't handle here - let React Query handle it
      console.error(error)
    }
  }
}

// ✅ RIGHT: Let error manager handle display
function MyComponent() {
  const createMutation = useMutationWrapper(createUserData)
  
  const handleSubmit = () => {
    createMutation.mutate(data)
  }
}
```

## Error Display Routing

### Validation Errors
- **Location**: Inline form fields
- **When**: Form validation failures
- **User Action**: Fix input and retry

```typescript
// Form component
const form = useZodForm(userSchema)

// Validation errors automatically appear inline
<input {...form.register('email')} />
{form.formState.errors.email && (
  <span className="error">{form.formState.errors.email.message}</span>
)}
```

### Auth Errors
- **Location**: Modal + redirect to login
- **When**: Authentication failures
- **User Action**: Log in again

```typescript
// Error handler
if (error instanceof AuthorizationError) {
  showModal({
    title: 'Session Expired',
    message: 'Please log in again to continue.',
    actions: [{ label: 'Login', onClick: () => router.push(paths.auth.login) }]
  })
}
```

### Network Errors
- **Location**: Toast notification with retry option
- **When**: API failures, timeouts
- **User Action**: Retry or dismiss

```typescript
// Error handler
if (error instanceof NetworkError) {
  showToast({
    type: 'error',
    message: error.message,
    actions: error.retryable ? [
      { label: 'Retry', onClick: () => /* retry logic */ }
    ] : []
  })
}
```

### Critical Errors
- **Location**: Modal with recovery actions
- **When**: System failures, unexpected errors
- **User Action**: Contact support or try again

```typescript
// Error handler
if (error instanceof SystemError) {
  showModal({
    title: 'Something went wrong',
    message: error.message,
    actions: [
      { label: 'Try Again', onClick: () => window.location.reload() },
      { label: 'Contact Support', onClick: () => router.push('/support') }
    ]
  })
}
```

## Global Error Handler Implementation

```typescript
// app/(common)/lib/error-handler.ts
class ErrorHandler {
  handleError(error: unknown) {
    const structuredError = this.structureError(error)
    
    // Log error for debugging
    this.logError(structuredError)
    
    // Route to appropriate display
    this.routeError(structuredError)
  }
  
  private structureError(error: unknown): AppError {
    if (error instanceof AppError) {
      return error
    }
    
    if (error instanceof Error) {
      return new SystemError('UNEXPECTED_ERROR', error.message)
    }
    
    return new SystemError('UNKNOWN_ERROR', 'An unknown error occurred')
  }
  
  private routeError(error: AppError) {
    switch (error.code) {
      case 'VALIDATION_ERROR':
        // Handled by form validation system
        break
        
      case 'AUTHORIZATION_ERROR':
        // Show auth modal + redirect
        break
        
      case 'NETWORK_ERROR':
      case 'EXTERNAL_SERVICE_ERROR':
        // Show toast with retry
        break
        
      default:
        // Show modal for critical errors
        break
    }
  }
  
  private logError(error: AppError) {
    // Send to error tracking service
    console.error('Structured Error:', error)
    
    // Optional: Send to Sentry, LogRocket, etc.
  }
}

export const errorHandler = new ErrorHandler()
```

## Error Handling Best Practices

### 1. Be Specific
```typescript
// ❌ Too generic
catch (error) {
  throw new Error('Failed to process request')
}

// ✅ Specific and informative
catch (error) {
  if (error.code === 'PGRST116') {
    throw new BusinessLogicError('User already exists')
  } else if (error.code === 'PGRST301') {
    throw new DatabaseError('Database constraint violation', error.details)
  } else {
    throw new SystemError('USER_CREATION_FAILED', error.message)
  }
}
```

### 2. Include Context
```typescript
// ❌ Missing context
throw new Error('Validation failed')

// ✅ Rich context
throw new ValidationError('email', 'Email address is already registered', {
  field: 'email',
  value: data.email,
  conflict: 'duplicate_email'
})
```

### 3. Preserve Original Error
```typescript
// ❌ Lost original information
catch (error) {
  throw new BusinessLogicError('Payment failed')
}

// ✅ Preserve original error
catch (error) {
  throw new BusinessLogicError('Payment failed', {
    originalError: error.message,
    paymentMethod: data.method,
    amount: data.amount
  })
}
```

### 4. Provide Recovery Options
```typescript
// ❌ No recovery path
throw new SystemError('File upload failed')

// ✅ Clear recovery options
throw new SystemError('File upload failed', {
  originalError: error.message,
  fileName: file.name,
  fileSize: file.size,
  retryable: true,
  maxRetries: 3
})
```

## Error Recovery Patterns

### Automatic Retry
```typescript
// For retryable operations
const retryOperation = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 3
): Promise<T> => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation()
    } catch (error) {
      if (attempt === maxRetries || !isRetryableError(error)) {
        throw error
      }
      await delay(Math.pow(2, attempt) * 1000) // Exponential backoff
    }
  }
  throw new Error('Max retries exceeded')
}
```

### Graceful Degradation
```typescript
// Fallback when primary operation fails
const getUserData = async (userId: string) => {
  try {
    // Try primary data source
    return await fetchFromDatabase(userId)
  } catch (error) {
    // Fallback to cached data
    try {
      return await fetchFromCache(userId)
    } catch (cacheError) {
      throw new SystemError('USER_DATA_UNAVAILABLE', 'Unable to load user data', {
        primaryError: error.message,
        cacheError: cacheError.message
      })
    }
  }
}
```

## Error Monitoring and Logging

### Structured Logging
```typescript
// Log with consistent structure
logger.error('User creation failed', {
  error: {
    code: structuredError.code,
    message: structuredError.message,
    requestId: structuredError.requestId
  },
  context: {
    userId: authUser?.id,
    organizationId: authUser?.organization_id,
    action: 'create_user',
    timestamp: new Date().toISOString()
  }
})
```

### Error Tracking
- Use tools like Sentry, LogRocket, or similar
- Include relevant context for debugging
- Track error rates and patterns
- Set up alerts for critical errors

This comprehensive error handling strategy ensures users get helpful feedback while developers get the information needed to debug and fix issues effectively.