# Development Guidelines

## Adding New Features

### 1. Determine Feature Type

**Single page feature →** Create `app/feature_name/`
```bash
app/
├── simple-feature/
│   ├── page.tsx               # /simple-feature
│   ├── components/            # Feature components
│   ├── hooks/                 # Feature hooks
│   ├── actions/               # Server actions
│   ├── types/                 # Feature types
│   └── utils/                 # Feature utilities
```

**Multi-page feature →** Create `app/combined_feature/`
```bash
app/
├── dashboard/                 # Feature with nested sub-features
│   ├── (common)/              # Shared components WITHIN dashboard only
│   ├── (root)/                # Main dashboard view (if has sub-features)
│   │   ├── page.tsx           # /dashboard (main page)
│   │   ├── components/        # Components specific to main view
│   │   └── api/               # API specific to main view
│   └── settings/              # Settings sub-feature
│       ├── page.tsx           # /dashboard/settings
│       └── components/        # Settings-specific components
```

### 2. Follow Structure

**Use established directory patterns:**
- **components/**: React components specific to this feature
- **hooks/**: React Query hooks and custom React hooks
- **actions/**: Server actions implemented with Safe Action Client
- **types/**: TypeScript interfaces and types
- **utils/**: Utility functions specific to this feature
- **api/**: API routes (proxied from root app/api/)

**Include all necessary subdirectories**
- Even if some directories are empty initially, include them for future growth
- Follow the same naming conventions across all features

### 3. Keep Features Self-Contained

**All feature-specific code stays in the feature directory:**
- Components, hooks, actions, types, utils
- Don't create shared utilities prematurely
- Only extract to shared when actual duplication occurs

## Code Organization Principles

### 1. Feature Boundaries

**Keep feature-specific code within feature directory:**
```typescript
// ✅ GOOD - Feature component in feature directory
// app/user-management/components/user-list.tsx
export function UserList() {
  // User list logic
}

// ❌ BAD - Feature code in common directory
// app/(common)/components/user-list.tsx
export function UserList() {
  // This should be in user-management feature
}
```

**Use shared utilities for cross-feature functionality:**
```typescript
// ✅ GOOD - Import from shared UI primitives
import { Button, Input, Card } from '@/(common)/components/ui'

// ✅ GOOD - Import from shared hooks
import { useZodForm } from '@/(common)/hooks/use-zod-form'

// ✅ GOOD - Import from shared utilities
import { formatDate } from '@/(common)/utils/date-helpers'
```

### 2. Type Safety

**Define types in feature `types/` directories:**
```typescript
// app/user-management/types/index.ts
export interface User {
  id: string
  email: string
  first_name: string
  last_name: string
  role: UserRole
  organization_id: string
  created_at: string
  updated_at: string
}

export interface CreateUserInput {
  email: string
  first_name: string
  last_name: string
  role?: UserRole
}

export type UserRole = 'user' | 'admin' | 'owner'
```

**Use shared types from `types/` directory:**
```typescript
// app/(common)/types/database.ts
export interface Database {
  public: {
    Tables: {
      users: {
        Row: User
        Insert: CreateUserInput
        Update: Partial<CreateUserInput>
      }
    }
  }
}
```

### 3. Component Design

**Build reusable components in `app/(common)/components/ui/`:**
```typescript
// app/(common)/components/ui/button.tsx
export interface ButtonProps {
  variant?: 'default' | 'secondary' | 'destructive'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
  onClick?: () => void
  // ... other props
}

export function Button({ variant = 'default', size = 'md', children, ...props }: ButtonProps) {
  return (
    <button className={buttonVariants({ variant, size })} {...props}>
      {children}
    </button>
  )
}
```

**Feature-specific components in feature directories:**
```typescript
// app/user-management/components/user-card.tsx
import { Card, CardHeader, CardContent } from '@/(common)/components/ui/card'
import type { User } from '../types'

interface UserCardProps {
  user: User
  onEdit: (user: User) => void
  onDelete: (userId: string) => void
}

export function UserCard({ user, onEdit, onDelete }: UserCardProps) {
  return (
    <Card>
      <CardHeader>
        <h3>{user.first_name} {user.last_name}</h3>
      </CardHeader>
      <CardContent>
        <p>{user.email}</p>
        <div className="flex gap-2">
          <Button onClick={() => onEdit(user)}>Edit</Button>
          <Button variant="destructive" onClick={() => onDelete(user.id)}>
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
```

## Import Path Guidelines

### Standard Import Patterns
```typescript
// UI Components
import { Button, Input, Card } from '@/(common)/components/ui'

// Feature Components
import { LoginForm } from './components/login-form'
import { UserCard } from '@/user-management/components/user-card'

// Shared Hooks
import { useZodForm } from '@/(common)/hooks/use-zod-form'
import { useAuth } from '@/(common)/hooks/use-auth'

// Feature Hooks
import { useUsers } from './hooks/use-users'
import { useUserManagement } from '@/user-management/hooks/use-user-management'

// Server Actions
import { createProfile } from './actions/create-profile'
import { updateSettings } from '@/settings/actions/update-settings'

// Utilities
import { formatDate } from '@/(common)/utils/date-helpers'
import { validateEmail } from './utils/validation'

// Types
import type { User } from '@/types/database'
import type { CreateUserInput } from './types'
```

### Path Aliases
```typescript
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/(common)": ["./app/(common)"],
      "@/": ["./app/"]
    }
  }
}
```

## Global Paths Convention

### Critical Rule
**Never hardcode paths anywhere in the codebase. Always use the global `paths` object.**

### Why This Matters
- **Type Safety**: Prevents typos and provides autocomplete
- **Maintainability**: Single source of truth when routes change
- **Refactoring Safety**: Routes update in one place only
- **Nested Route Clarity**: Hierarchy is explicitly shown (e.g., `paths.dashboard.settings`)

### Implementation
```typescript
// app/(common)/lib/paths.ts
export const paths = {
  home: '/',
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    forgot: '/auth/forgot-password',
    reset: '/auth/reset-password',
  },
  dashboard: {
    root: '/dashboard',
    settings: '/dashboard/settings',
    profile: '/dashboard/profile',
    team: '/dashboard/team',
    projects: '/dashboard/projects',
  },
  api: {
    auth: '/api/auth',
    users: '/api/users',
    dashboard: '/api/dashboard',
  },
} as const
```

### Usage Patterns
```typescript
// Import paths
import { paths } from '@/(common)/lib/paths'

// In components
<Link href={paths.dashboard.root}>Dashboard</Link>
<Link href={paths.auth.login}>Login</Link>
<Link href={paths.dashboard.settings}>Settings</Link>

// In redirects
import { useRouter } from 'next/navigation'

const router = useRouter()
router.push(paths.dashboard.settings)
window.location.href = paths.auth.login

// In API calls
fetch(paths.api.users, { 
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(userData)
})

// In server-side redirects
import { redirect } from 'next/navigation'
redirect(paths.auth.login)
```

### Rules
1. **No hardcoded strings**: Never use `"/dashboard"` directly
2. **Import paths**: Always `import { paths } from '@/(common)/lib/paths'`
3. **Type safety**: The `as const` assertion provides complete TypeScript inference
4. **Consistency**: Follow nested object structure matching your app directory

## Naming Conventions

### Files and Directories
```typescript
// ✅ GOOD - kebab-case for files and directories
app/user-management/
app/user-management/components/
app/user-management/components/user-card.tsx
app/user-management/hooks/use-users.ts
app/user-management/actions/create-user.ts

// ❌ BAD - inconsistent naming
app/UserManagement/
app/userManagement/components/
app/user-management/components/UserCard.tsx
app/user-management/hooks/useUsers.ts
```

### Components
```typescript
// ✅ GOOD - PascalCase for components
export function UserCard() {}
export function UserProfileForm() {}
export function DashboardLayout() {}

// ❌ BAD - incorrect casing
export function userCard() {}
export function userProfile_form() {}
```

### Hooks
```typescript
// ✅ GOOD - camelCase starting with 'use'
export function useUsers() {}
export function useUserManagement() {}
export function useFormValidation() {}

// ❌ BAD - incorrect hook naming
export function Users() {}
export function getUser() {}
export function use_user_management() {}
```

### Actions
```typescript
// ✅ GOOD - verb-noun pattern
export const createUser = authAction(...)
export const updateProfile = authAction(...)
export const deleteProject = authAction(...)

// ❌ BAD - unclear naming
export const user = authAction(...)
export const doUpdate = authAction(...)
export const removeStuff = authAction(...)
```

## Code Style and Formatting

### ESLint Configuration
```json
// .eslintrc.json
{
  "extends": [
    "next/core-web-vitals",
    "@typescript-eslint/recommended"
  ],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/explicit-function-return-type": "warn",
    "prefer-const": "error",
    "no-var": "error"
  }
}
```

### Prettier Configuration
```json
// .prettierrc
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2
}
```

### TypeScript Best Practices
```typescript
// ✅ GOOD - explicit return types
export function getUserById(id: string): Promise<User | null> {
  return db.user.findUnique({ where: { id } })
}

// ✅ GOOD - union types for discriminated unions
type LoadingState = 'idle' | 'loading' | 'success' | 'error'

// ✅ GOOD - generic components
interface ListProps<T> {
  items: T[]
  renderItem: (item: T) => React.ReactNode
}

function List<T>({ items, renderItem }: ListProps<T>) {
  return <div>{items.map(renderItem)}</div>
}

// ❌ BAD - implicit any
export function getUserById(id) {
  return db.user.findUnique({ where: { id } })
}
```

## Performance Considerations

### Code Splitting
```typescript
// ✅ GOOD - dynamic imports for large components
const ChartComponent = dynamic(() => import('./chart-component'), {
  loading: () => <div>Loading chart...</div>,
  ssr: false
})

// ✅ GOOD - route-based code splitting (automatic with Next.js)
// Page components are automatically code-split
```

### Image Optimization
```typescript
// ✅ GOOD - use Next.js Image component
import Image from 'next/image'

<Image
  src="/profile.jpg"
  alt="Profile picture"
  width={150}
  height={150}
  className="rounded-full"
  priority={isAboveFold}
/>

// ❌ BAD - regular img tag
<img src="/profile.jpg" alt="Profile picture" className="rounded-full" />
```

### Bundle Analysis
```bash
# Analyze bundle size
npm run build
npm run analyze

# Use @next/bundle-analyzer
npm install --save-dev @next/bundle-analyzer
```

## Environment Variables

### Configuration
```bash
# .env.local.example
# Database
DATABASE_URL="postgresql://..."
SUPABASE_URL="https://..."
SUPABASE_ANON_KEY="..."

# Authentication
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="http://localhost:3000"

# External APIs
STRIPE_SECRET_KEY="sk_test_..."
RESEND_API_KEY="re_..."

# App Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"
```

### Usage
```typescript
// Server-side
const databaseUrl = process.env.DATABASE_URL
const supabaseKey = process.env.SUPABASE_ANON_KEY

// Client-side (must be prefixed with NEXT_PUBLIC_)
const appUrl = process.env.NEXT_PUBLIC_APP_URL

// ✅ GOOD - type-safe environment variables
// app/(common)/lib/env.ts
import { z } from 'zod'

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  SUPABASE_URL: z.string().url(),
  SUPABASE_ANON_KEY: z.string(),
  NEXT_PUBLIC_APP_URL: z.string().url(),
})

export const env = envSchema.parse(process.env)
```

## Git Workflow

### Branch Naming
```bash
# Feature branches
feature/user-management
feature/dashboard-analytics
feature/payment-processing

# Bugfix branches
bugfix/login-validation-error
bugfix/memory-leak-in-dashboard

# Hotfix branches
hotfix/critical-security-fix
hotfix/production-deployment-issue
```

### Commit Messages
```bash
# Format: type(scope): description

feat(auth): add OAuth integration
fix(dashboard): resolve memory leak on large datasets
docs(readme): update installation instructions
refactor(user-management): extract user card component
test(api): add integration tests for user endpoints
chore(deps): update react to v18.2.0
```

## Debugging

### Debug Tools
```typescript
// ✅ GOOD - use proper debugging
console.log('User data:', userData) // For production debugging
console.debug('API response:', response) // For development only
console.error('Database error:', error) // For errors

// ✅ GOOD - use browser dev tools
debugger // Pause execution

// ✅ GOOD - use React DevTools
// Component names, props, and state inspection
```

### Error Tracking
```typescript
// ✅ GOOD - structured error logging
try {
  await operation()
} catch (error) {
  console.error('Operation failed:', {
    error: error.message,
    stack: error.stack,
    context: { userId, action: 'create-user' }
  })
  
  // Send to error tracking service
  if (process.env.NODE_ENV === 'production') {
    sendToErrorTracking(error, { userId, action: 'create-user' })
  }
}
```

These development guidelines ensure consistency, maintainability, and quality across the entire codebase while supporting both individual and team development workflows.