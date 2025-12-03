# Quick Reference - Next.js Agent Starter

A condensed guide to the key architectural principles and conventions.

## 🎯 Core Architectural Principle

### Adaptive Self-Containment

**The Golden Rule:**
> Start with complete feature self-containment. Extract to `(common)` directories ONLY when actual code duplication occurs.

**The Process:**
1. Build features with 100% self-containment initially
2. Identify actual code duplication as it naturally occurs
3. Extract ONLY the duplicated portions to parent common directories
4. Keep unique business logic within feature directories

**No artificial percentages. Architecture evolves based on real duplication patterns.**

---

## 📁 Directory Structure

```
app/
├── (common)/              # TRULY shared utilities ONLY
│   ├── components/ui/     # Reusable UI primitives
│   ├── hooks/             # Global custom hooks
│   ├── lib/               # Third-party configurations
│   ├── store/             # Zustand state management
│   ├── styles/            # Global styles (Tailwind v4)
│   ├── types/             # Shared TypeScript types
│   ├── utils/             # Universal utility functions
│   └── layout.tsx         # Root layout implementation
│
├── [feature]/             # Feature-specific (100% self-contained)
│   ├── (common)/          # Shared WITHIN feature only
│   │   ├── components/    # Shared feature components
│   │   ├── hooks/         # Shared feature hooks
│   │   ├── utils/         # Shared feature utilities
│   │   └── layout.tsx     # Feature layout
│   │
│   ├── [sub-feature]/     # Sub-feature (unique business logic)
│   │   ├── page.tsx       # Route page
│   │   ├── components/    # Sub-feature components
│   │   ├── hooks/         # Sub-feature hooks
│   │   ├── actions/       # Server actions
│   │   ├── types/         # Sub-feature types
│   │   ├── constants/     # Sub-feature constants
│   │   └── utils/         # Sub-feature utilities
│   │
│   └── api/               # Feature API routes
│       └── route.ts       # API logic (self-contained)
│
├── api/                   # API proxies (MINIMAL)
│   └── [feature]/
│       └── route.ts       # export * from '@/feature/api/route'
│
└── layout.tsx             # Root layout proxy
                           # export { default } from '@/(common)/layout'
```

---

## 🔑 Critical Conventions

### 1. Global Paths Object
**Never hardcode routes.** Always use the global `paths` object.

```typescript
// app/(common)/lib/paths.ts
export const paths = {
  home: '/',
  auth: {
    login: '/auth/login',
    register: '/auth/register',
  },
  dashboard: {
    root: '/dashboard',
    settings: '/dashboard/settings',
  },
} as const

// Usage
import { paths } from '@/(common)/lib/paths'
<Link href={paths.dashboard.settings}>Settings</Link>
```

### 2. Actions vs Hooks
- **`actions/`**: Server actions with `next-safe-action` (authAction, publicAction)
- **`hooks/`**: React Query logic (queries, mutations) + client-side composition

### 3. Test File Location
Tests live **alongside source files**:
- `my-function.ts` → `my-function.test.ts`
- `use-my-hook.tsx` → `use-my-hook.test.tsx`

### 4. Error Handling
**Critical Rule**: Never lose error context. Always wrap errors, don't replace them.

```typescript
// ❌ WRONG
catch (error) {
  throw new Error('Something went wrong') // Lost original error!
}

// ✅ RIGHT
catch (error) {
  if (error instanceof AppError) throw error
  throw new SystemError('OPERATION_FAILED', error.message, {
    originalError: error,
    context: { action: 'someOperation' }
  })
}
```

---

## 📊 Three-Tier Data Fetching Strategy

### 1. Server Actions (Primary - 90% of cases)
**When:** Feature-specific mutations, form submissions, user interactions

```typescript
// app/feature/actions/create-user.ts
export const createUser = authAction(schema, async (data, ctx) => {
  const { supabase, authUser } = ctx
  // Type-safe, validated server logic
})

// In component
const create = useAction(createUser, {
  onSuccess: () => queryClient.invalidateQueries({ queryKey: [QueryKeys.USERS] })
})
```

### 2. Server Components (Initial Load)
**When:** Page initial loads, static data, SEO-critical content

```typescript
export default async function DashboardPage() {
  const supabase = createSupabaseServerClient()
  const { data } = await supabase.from('profiles').select('*').single()
  return <DashboardComponent user={data} />
}
```

### 3. React Query (Client-Side)
**When:** Real-time updates, complex caching, external APIs, shared data

```typescript
export function useProfile() {
  return useQuery({
    queryKey: [QueryKeys.PROFILE],
    queryFn: authQuery(async ({ supabase }) => {
      const { data, error } = await supabase.from('profiles').select('*')
      if (error) throw new Error(error.message)
      return data
    }),
  })
}
```

---

## 🎨 Key Patterns

### Query Keys (Centralized Cache Management)
```typescript
// app/(common)/lib/query-keys.ts
export enum QueryKeys {
  PROFILE = 'profile',
  USER_PREFERENCES = 'user-preferences',
  DASHBOARD_STATS = 'dashboard-stats',
  ITEMS = 'items',
}

// Usage
queryClient.invalidateQueries({ queryKey: [QueryKeys.ITEMS] })
queryClient.invalidateQueries({ queryKey: [QueryKeys.ITEM_DETAIL, itemId] })
```

### Schema Organization
```typescript
// app/(common)/lib/schemas.ts
export const userSchemas = {
  create: z.object({ email: z.string().email(), ... }),
  update: z.object({ firstName: z.string().optional(), ... }),
}

// Type inference
export type CreateUserInput = z.infer<typeof userSchemas.create>
```

### Form Handling
```typescript
import { useZodForm } from '@/(common)/hooks/use-zod-form'
const form = useZodForm(mySchema, defaultValues)
```

---

## 🛠️ Technology Stack

- **Framework**: Next.js 15 (App Router) + React 19
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4 (CSS-based config)
- **Database**: Supabase (auth, database, storage, real-time)
- **State**: Zustand (client state) + TanStack Query (server state)
- **Forms**: React Hook Form + Zod validation
- **Server Actions**: next-safe-action (type-safe server calls)
- **UI Components**: Radix UI primitives
- **Icons**: Lucide React
- **Testing**: Vitest + Testing Library

---

## 🚀 Quick Start Commands

```bash
# Install dependencies
pnpm install

# Database setup
npm run db:push
npm run db:generate-types

# Development
npm run dev

# Testing
pnpm test               # Run tests
pnpm test:watch         # Watch mode
pnpm test:coverage      # Coverage report

# Type checking
pnpm type-check
```

---

## 📋 Import Path Patterns

```typescript
// UI Components
import { Button, Input } from '@/(common)/components/ui'

// Feature Components (relative)
import { LoginForm } from './components/login-form'

// Shared Hooks
import { useZodForm } from '@/(common)/hooks/use-zod-form'

// Feature Hooks (absolute from feature root)
import { useAuth } from '@/auth/hooks/use-auth'

// Utilities
import { formatDate } from '@/(common)/utils/helpers'

// Types
import type { User } from '@/(common)/types/database'
```

---

## 🎯 AI Agent Context Engineering Benefits

1. **Complete Feature Context**: Feature directories contain 100% of necessary code
2. **Predictable Patterns**: Every feature follows the same structure
3. **Clear Boundaries**: No cross-contamination between features
4. **Minimal Parent Usage**: Shared utilities are truly shared, not feature-specific
5. **Context Guarantee**: Providing a feature directory = complete context for AI agents

---

## 📝 Development Workflow

### Adding a New Feature

1. **Create feature directory**: `app/my-feature/`
2. **Build self-contained**: Add all components, hooks, actions within feature
3. **Watch for duplication**: If code duplicates across sub-features, extract to `my-feature/(common)/`
4. **Use shared utilities**: Import from `@/(common)/*` only for truly global utilities
5. **Add API routes**: Keep API logic in `app/my-feature/api/`, create proxy in `app/api/my-feature/`

### Testing Complex Logic

1. **Identify complexity**: Multi-condition logic, async operations, critical business logic
2. **Create test file**: Next to source file (e.g., `action.ts` → `action.test.ts`)
3. **Mock dependencies**: Supabase, external APIs, Next.js router
4. **Test scenarios**: Happy path, error paths, edge cases

---

## 🔐 Security Essentials

- **RLS Policies**: Enable on all tables, define user/org access patterns
- **Input Validation**: Zod schemas on all server actions
- **Auth Context**: Use `authAction` for authenticated operations
- **Environment Variables**: Never commit `.env.local`, use `.env.local.example`
