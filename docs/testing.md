# Testing Strategy

## 🚨 AI Agent Testing Detection Protocol

**Critical Rule**: AI agents must identify and flag complex business logic that requires unit testing. When a file or function is complex, business logic impact.

## 🛠️ Testing Configuration & Conventions

### Testing Setup
```bash
# Install testing dependencies
pnpm add -D vitest @testing-library/react @testing-library/jest-dom jsdom
pnpm add -D @supabase/supabase-js @vitest/coverage-v8
```

### Test File Location Convention
```
app/
├── (common)/
│   ├── lib/
│   │   ├── safe-action.ts
│   │   └── safe-action.test.ts      # Test alongside source file
├── auth/
│   ├── actions/
│   │   ├── login.ts
│   │   └── login.test.ts            # Feature actions tests
│   ├── hooks/
│   │   ├── use-auth.tsx
│   │   └── use-auth.test.tsx        # Hook tests
│   └── utils/
│       ├── email-validator.ts
│       └── email-validator.test.ts  # Utility tests
```

### Test File Naming Convention
- **Source**: `my-function.ts` → **Test**: `my-function.test.ts`
- **Source**: `use-my-hook.tsx` → **Test**: `use-my-hook.test.tsx`
- **Source**: `MyComponent.tsx` → **Test**: `MyComponent.test.tsx`

## Testing Patterns

### 1. Server Actions Testing Pattern
```typescript
// app/feature/actions/complex-action.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { complexAction } from './complex-action'

describe('complexAction', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should handle success scenario', async () => {
    // Mock supabase, external APIs, etc.
    const result = await complexAction(validData, mockContext)
    expect(result).toEqual(expectedResult)
  })

  it('should handle edge cases', async () => {
    // Test error scenarios, edge cases
  })
})
```

### 2. React Hook Testing Pattern
```typescript
// app/feature/hooks/use-custom-hook.test.tsx
import { renderHook, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useCustomHook } from './use-custom-hook'

describe('useCustomHook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useCustomHook())
    expect(result.current.isLoading).toBe(false)
  })

  it('should handle data fetching', async () => {
    const { result } = renderHook(() => useCustomHook())
    
    // Test async behavior
    await waitFor(() => {
      expect(result.current.data).toBeDefined()
    })
  })
})
```

### 3. Component Testing Pattern
```typescript
// app/feature/components/my-component.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { MyComponent } from './my-component'

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />)
    expect(screen.getByText('Expected Text')).toBeInTheDocument()
  })

  it('should handle user interactions', async () => {
    render(<MyComponent />)
    
    fireEvent.click(screen.getByRole('button'))
    
    await waitFor(() => {
      expect(screen.getByText('Updated Text')).toBeInTheDocument()
    })
  })
})
```

## AI Agent Testing Checklist

### Before Writing Tests
1. ✅ Identify the function complexity (lines, async ops, branches)
2. ✅ Determine business impact (financial, user data, integrations)
3. ✅ Mock all external dependencies (Supabase, APIs, services)
4. ✅ Define test scenarios (success, error, edge cases)

### Test Coverage Requirements
- **Happy Path**: Normal operation success
- **Error Paths**: All error handling branches
- **Edge Cases**: Boundary conditions, empty data, invalid inputs
- **Integration Points**: External API failures, database errors
- **Business Logic**: Complex calculations, validations, permissions

### After Writing Tests
1. ✅ Tests should be readable and self-documenting
2. ✅ Mocks should be realistic and consistent
3. ✅ Test file should be located next to source file
4. ✅ Update documentation if new testing patterns emerge

## Configuration Files

### vitest.config.ts
```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./app/(common)/lib/test-setup.ts'],
    coverage: {
      reporter: ['text', 'html'],
      exclude: [
        'node_modules/',
        '.next/',
        '**/*.d.ts',
        '**/*.config.*',
        'app/(common)/lib/test-setup.ts'
      ]
    }
  },
  resolve: {
    alias: {
      '@/(common)': path.resolve(__dirname, './app/(common)'),
      '@/': path.resolve(__dirname, './app/')
    }
  }
})
```

### Test Setup
```typescript
// app/(common)/lib/test-setup.ts
import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
  usePathname: () => '/',
}))

// Mock Supabase
vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn(),
    })),
    auth: {
      getUser: vi.fn()
    }
  }))
}))
```

## AI Agent Testing Workflow

1. **Identify**: Scan code for complexity triggers
2. **Flag**: Alert user with specific reasoning
3. **Propose**: Suggest test file location and scenarios
4. **Create**: Write tests following established patterns
5. **Verify**: Ensure tests provide meaningful coverage

This approach ensures critical business logic is properly tested while avoiding over-testing simple components and utilities.

## Complex Function Triggers

AI agents should flag functions that meet any of these criteria:

### Complexity Triggers
- **50+ lines of code**: Large functions with multiple responsibilities
- **Multiple async operations**: Functions with await calls
- **Complex conditional logic**: Deep nesting or multiple branches
- **State mutations**: Functions that modify complex state
- **External integrations**: API calls, database operations, third-party services

### Business Impact Triggers
- **Financial transactions**: Payment processing, billing, subscriptions
- **User data handling**: Authentication, authorization, personal data
- **External API dependencies**: Third-party service integrations
- **Critical business logic**: Core application functionality
- **Error handling**: Functions with try/catch blocks and error recovery

### When to Write Tests

**Always Test:**
- Server actions with business logic
- Database operations with complex queries
- External API integration functions
- Authentication and authorization logic
- Data transformation and validation functions
- Complex React hooks with state management

**Consider Testing:**
- Large components with complex interactions
- Utility functions with edge cases
- Form validation logic
- State management reducers

**Usually Skip:**
- Simple UI components without logic
- Basic utility functions (e.g., date formatting)
- Static configuration objects
- Simple type definitions
- Mock data or constants