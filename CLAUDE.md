# CLAUDE.md - Next.js Production Starter Template

A comprehensive documentation for the production-ready Next.js starter template built with modern architecture principles and AI agent-first design.

## 🏗️ Project Architecture

### Core Philosophy
- **AI Agent-First**: Structure optimized for context engineering for AI agents to understand and modify
- **Feature-Centric**: Self-contained features with clear boundaries
- **Production Ready**: Built with scalability, maintainability, and performance in mind
- **Type Safety**: Full TypeScript integration throughout

### Architecture Benefits for AI Agent Development

**1. Complete Feature Self-Containment**
Every feature contains all its code:
- Components, pages, actions, hooks, types, and API routes
- No need to navigate outside feature directories
- Clear feature boundaries prevent cross-contamination

**2. Predictable Context Engineering**
AI agents can easily understand:
- Where to find feature-specific code
- How to extend existing features
- What patterns to follow for new features
- How APIs relate to their features

**3. Proxy Pattern Benefits**
- Feature APIs live in feature directories (`app/feature/api/`)
- Minimal proxy boilerplate in `app/api/feature/`
- Type-safe import/export maintains IDE support
- Zero runtime overhead

**4. Three-Tier Data Strategy**
- **Server Actions**: Feature-specific mutations (90% of cases)
- **Server Components**: Initial page loads and static content
- **React Query**: Complex caching and shared data
- Clear decision guidelines for each approach

**5. Minimal Configuration**
- Works with native Next.js routing
- No custom middleware or rewrites
- Leverages existing Next.js patterns
- Reduces cognitive load for AI agents

### Directory Structure
note no file or dir outside either 'common' or a feature folder
```
├── app/                           # Next.js App Router
│   ├── common/                    # Shared utilities and components
│   │   ├── components/ui/         # Reusable UI component library
│   │   ├── components/icons/      # Icons
│   │   ├── hooks/                 # Global custom hooks
│   │   ├── lib/                   # Third-party library configurations
│   │   ├── store/                 # Zustand state management
│   │   ├── styles/                # Global styles and theme
│   │   ├── utils/                 # Utility functions
│   │   ├── types/                 # Shared TypeScript types
│   │       ├── database.ts        # Database type definitions
│   │       └── global.ts          # Global shared types
│   │   └── layout.tsx             # Root layout (moved into common/)
│   ├── auth/                      # Multi-page combined feature (authentication)
│   │   ├── common/                # Shared auth utilities
│   │   │   ├── components/        # Auth shared components
│   │   │   ├── hooks/             # Auth-specific hooks
│   │   │   ├── actions/           # Server Actions for auth
│   │   │   ├── types/             # Auth TypeScript types
│   │   │   └── layout.tsx         # Auth feature layout k
│   │   ├── login/                 # Login sub-feature
│   │   │   └── page.tsx           # /auth/login
│   │   │   ├── components/        # Auth shared components
│   │   │   ├── hooks/             # Auth-specific hooks
│   │   │   ├── actions/           # Server Actions for auth
│   │   │   ├── types/             # Auth TypeScript types
│   │   ├── register/              # Register sub-feature
│   │   │   └── page.tsx           # /auth/register
│   │   │   ├── components/        # Auth shared components
│   │   │   ├── hooks/             # Auth-specific hooks
│   │   │   ├── actions/           # Server Actions for auth
│   │   │   ├── types/             # Auth TypeScript types
│   ├── dashboard/                 # Multi-page combined feature
│   │   ├── (common)/              # Route group - no URL segment
│   │   │   ├── layout.tsx         # Dashboard layout
│   │   │   ├── components/        # Dashboard shared components
│   │   │   └── hooks/             # Dashboard-specific hooks
│   │   ├── (root)/                # Route group - no URL segment
│   │   │   └── page.tsx           # /dashboard (main page)
│   │   ├── settings/              # Sub-feature
│   │   │   └── page.tsx           # /dashboard/settings
│   ├── (home)/                    # Home Page
│   │   ├── components/            # Home components
│   │   ├── page.tsx               # / (main page)
│   │   └── layout.tsx             # Optional home layout
└── public/                        # Static assets
```

## 🛠️ Technology Stack

### Core Technologies
- **Next.js 16**: React framework with App Router
- **React 19**: UI library with latest features
- **TypeScript**: Strict type safety throughout
- **Tailwind CSS v4**: Modern utility-first CSS framework

### Backend & Database
- **Supabase**: Authentication, database, Storage and real-time features
- **Supabase CLI**: Database management and migrations

### State Management & Forms
- **Zustand**: Lightweight, performant state management
- **TanStack Query (React Query)**: Server-state fetching, caching, background updates and mutation management for robust client-server sync
- **React Hook Form**: Optimized form handling
- **Zod**: TypeScript-first schema validation
- **Safe Action Client**: Type-safe server actions

### UI & Styling
- **Radix UI**: Accessible component primitives
- **Lucide React**: Modern icon library
- **Tailwind CSS v4**: CSS-based configuration
- **Class Variance Authority**: Variant-based component styling

### Development Tools
- **ESLint**: Code quality and consistency
- **TypeScript**: Static type checking
- **PostCSS**: CSS processing

## 📁 Feature Architecture Patterns

### Single-Page Features
Structure for features with only one main page:

```
app/feature_name/
├── page.tsx           # Main route (/feature_name)
├── layout.tsx         # Feature-specific layout (optional)
├── components/        # Feature components
├── actions/           # Server Actions
├── hooks/             # Feature hooks
├── types/             # Feature types
└── constants/         # Feature constants
```

Notes:
- actions/ should expose server actions implemented and invoked via the Safe Action Client (type-safe, validated server calls).
- hooks/ should contain the feature's React Query (TanStack Query) logic — queries and mutations (e.g. useFeatureQuery, useCreateFeatureMutation) — and wrap or compose shared hooks as needed to provide a consistent client-side API for data fetching, caching, and optimistic updates.

### Multi-Page Combined Features
```
app/combined_feature/
├── (common)/          # Route group - no URL segment
│   ├── layout.tsx     # Layout for all sub-features
│   ├── components/    # Shared components
│   ├── hooks/         # Shared hooks
│   └── utils/         # Shared utilities
├── (root)/            # Route group - no URL segment
│   └── page.tsx       # Main route (/combined_feature)
├── sub_feature_1/
│   ├── page.tsx       # /combined_feature/sub_feature_1
│   └── components/    # Sub-feature specific components
└── sub_feature_2/
    ├── page.tsx       # /combined_feature/sub_feature_2
    └── components/    # Sub-feature specific components
```

## 🎨 Styling & UI System

### Tailwind CSS v4 Configuration
Theme configuration is in `app/common/styles/globals.css`:

```css
@import "tailwindcss";

@theme {
  --color-primary: #3b82f6;
  --color-secondary: #64748b;
  /* Custom theme variables */
}

@layer base {
  /* Global base styles */
}
```

### Component Library
All UI components are in `app/common/components/ui/`:
- Consistent design system
- Full TypeScript support
- Accessibility first (Radix UI)
- Dark mode support

### Custom Hooks
Common hooks in `app/common/hooks/`:
- `useZodForm`: Form handling with React Hook Form + Zod
- `useAuth`: Authentication state management
- Additional utility hooks

## 🔄 State Management

### Zustand Stores
Global state is managed with Zustand in `app/common/store/`:

```typescript
interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  logout: () => void
}
```

### Server State
- Server Actions with enhanced `safe-action-client`
- Type-safe error handling with `authActionClient`
- Automatic validation with Zod schemas
- React Query for client-side data fetching and caching

## 📝 Forms & Validation

### Form Handling Pattern
Use the `useZodForm` hook for consistent form handling:

```typescript
import { useZodForm } from '@/common/hooks/use-zod-form'
import { mySchema } from '@/common/lib/schemas'

const form = useZodForm(mySchema, defaultValues)
```

### Validation Schemas
All validation schemas are in `app/common/lib/schemas.ts` using Zod:

```typescript
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})
```

### Server Actions

Enhanced safe actions with authentication support in feature `actions/` directories:

#### Public Actions
```typescript
import { publicAction } from '@/common/lib/safe-action'

export const publicAction = publicAction(mySchema, async (data) => {
  // Public server-side logic with automatic validation
})
```

#### Authenticated Actions
```typescript
import { authAction } from '@/common/lib/safe-action'

export const authenticatedAction = authAction(mySchema, async (data, ctx) => {
  const { supabase, authUser } = ctx
  // Authenticated server-side logic - user is guaranteed to be logged in
  // authUser contains the authenticated user object
  // supabase is a server client with the user's session
})
```

#### Action Usage Pattern
- **`publicAction`**: For operations that don't require authentication
- **`authAction`**: For operations that must be executed by logged-in users
- **`action`**: Base safe action client for custom authentication logic

## 📊 Data Fetching Patterns

### Data Fetching Strategy

We use a three-tier approach optimized for different use cases while maintaining feature self-containment:

#### **1. Server Actions (Primary)**
- **When to use**: Feature-specific data mutations, form submissions, user interactions
- **How**: `authAction` and `publicAction` in feature `actions/` directories
- **Benefits**: Type-safe, automatic validation, minimal client code, works with our architecture

```typescript
// In feature actions directory
// app/user-management/actions/create-user.ts
export const createUser = authAction(userSchemas.create, async (data, ctx) => {
  const { supabase, authUser } = ctx
  
  const { error } = await supabase
    .from('users')
    .insert({ ...data, organization_id: authUser.organization_id })
    
  if (error) throw new Error(error.message)
  
  return { success: true }
})

// In component
import { useAction } from 'next-safe-action/hooks'
import { createUser } from '@/user-management/actions/create-user'

export function CreateUserForm() {
  const create = useAction(createUser, {
    onSuccess: () => {
      // Invalidate related queries if needed
      queryClient.invalidateQueries({ queryKey: [QueryKeys.USERS] })
    }
  })
}
```

#### **2. Server Components (Initial Load)**
- **When to use**: Page initial loads, static data, SEO-critical content
- **How**: Direct Supabase calls in Server Components
- **Benefits**: No client-side JavaScript, faster initial paint, SEO friendly

```typescript
// In a Server Component
import { createSupabaseServerClient } from '@/common/lib/supabase-server'

export default async function DashboardPage() {
  const supabase = createSupabaseServerClient()
  const { data: user } = await supabase.from('profiles').select('*').single()
  
  return <DashboardComponent user={user} />
}
```

#### **3. React Query (Client-Side)**
- **When to use**: Real-time data, complex caching, external API calls, shared data
- **How**: `useQuery` hooks with authenticated query wrappers
- **Benefits**: Automatic caching, background refetching, optimistic updates

```typescript
// In a Client Component
import { useQuery } from '@tanstack/react-query'
import { authQuery } from '@/common/hooks/auth-query'
import { QueryKeys } from '@/common/lib/query-keys'

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

#### **Decision Guidelines**

**Use Server Actions when**:
- Feature-specific data mutations
- Form submissions and user inputs
- Internal business logic
- Direct user interactions
- When the operation is closely tied to a feature

**Use Server Components when**:
- Initial page loads
- Static or infrequently changing data
- SEO-critical content
- When data doesn't need client-side interactivity

**Use React Query when**:
- Real-time data updates needed
- Complex caching requirements
- External API integration
- Data shared across multiple features
- Background synchronization needed

### Query Keys and Cache Management

#### **Query Keys Pattern**
Use centralized enum for consistent cache management:

```typescript
// app/common/lib/query-keys.ts
export enum QueryKeys {
  // User-related
  PROFILE = 'profile',
  USER_PREFERENCES = 'user-preferences',
  
  // Dashboard
  DASHBOARD_STATS = 'dashboard-stats',
  ANALYTICS = 'analytics',
  
  // Feature-specific
  ITEMS = 'items',
  ITEM_DETAIL = 'item-detail',
}
```

#### **Key Construction**
- **Simple queries**: `[QueryKeys.PROFILE]`
- **Parameterized**: `[QueryKeys.ITEM_DETAIL, itemId]`
- **Complex filters**: `[QueryKeys.ITEMS, { category, status }]`

#### **Cache Invalidation**
```typescript
// In mutations
queryClient.invalidateQueries({ queryKey: [QueryKeys.ITEMS] })

// Precise invalidation
queryClient.invalidateQueries({ 
  queryKey: [QueryKeys.ITEM_DETAIL, itemId] 
})
```

### Authenticated Query Hooks

#### **authQuery Wrapper**
Centralizes authentication and validation for client-side queries:

```typescript
// app/common/hooks/auth-query.ts
export function authQuery<TParams, TResult>(
  queryFn: (params: { supabase: SupabaseClient; user: User; params: TParams }) => Promise<TResult>,
  options?: {
    paramsSchema?: z.ZodSchema<TParams>
    requiredRole?: string
  }
) {
  return async (params: TParams) => {
    const supabase = createSupabaseClient()
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user) {
      throw new Error('Unauthorized')
    }
    
    // Optional role check
    if (options?.requiredRole && user.user_metadata.role !== options.requiredRole) {
      throw new Error('Insufficient permissions')
    }
    
    // Optional input validation
    if (options?.paramsSchema) {
      const validatedParams = options.paramsSchema.parse(params)
      return queryFn({ supabase, user, params: validatedParams })
    }
    
    return queryFn({ supabase, user, params })
  }
}
```

### Data Mutations

#### **Server Actions vs React Query**
- **Server Actions**: Database writes, form submissions, file uploads
- **React Query Mutations**: Complex operations, external API calls

#### **Server Action Pattern**
```typescript
// In actions directory
export const updateProfile = authAction(profileUpdateSchema, async (data, ctx) => {
  const { supabase, authUser } = ctx
  
  const { error } = await supabase
    .from('profiles')
    .update(data)
    .eq('id', authUser.id)
    
  if (error) throw new Error(error.message)
  
  return { success: true }
})
```

#### **Client-Side Usage**
```typescript
// In component
import { useAction } from 'next-safe-action/hooks'
import { updateProfile } from './actions/update-profile'

export function ProfileForm() {
  const updateProfileAction = useAction(updateProfile, {
    onSuccess: () => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: [QueryKeys.PROFILE] })
      toast.success('Profile updated successfully')
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })
  
  return (
    <form onSubmit={form.handleSubmit(updateProfileAction.execute)}>
      {/* Form fields */}
    </form>
  )
}
```

## 🔐 Authentication

### Supabase Integration
- Client and server-side Supabase configurations
- Session management with Next.js middleware
- Protected routes handling

### Auth Feature Structure
`app/auth/` contains complete authentication system:
- Login/Register forms
- Session management hooks
- Server Actions for auth operations
- Type-safe user management

## 🎯 Development Guidelines

### Adding New Features

1. **Determine Feature Type**:
   - Single page → Create `app/feature_name/`
   - Multiple related pages → Create `app/combined_feature/`

2. **Follow Structure**:
   - Use established directory patterns
   - Include all necessary subdirectories
   - Keep features self-contained

3. **Use Shared Utilities**:
   - Import from `@/common/components/ui` for UI components
   - Import from `@/common/utils` for utility functions
   - Import from `@/common/hooks` for shared hooks

### Code Organization Principles

1. **Feature Boundaries**:
   - Keep feature-specific code within feature directory
   - Use shared utilities for cross-feature functionality
   - Maintain clear import/export boundaries

2. **Type Safety**:
   - Define types in feature `types/` directories
   - Use shared types from `types/` directory
   - Maintain strict TypeScript configuration

3. **Component Design**:
   - Build reusable components in `app/common/components/ui/`
   - Feature-specific components in feature directories
   - Follow consistent naming conventions

### Import Path Guidelines

```typescript
// UI Components
import { Button, Input } from '@/common/components/ui'

// Feature Components
import { LoginForm } from './components/login-form'

// Shared Hooks
import { useZodForm } from '@/common/hooks/use-zod-form'

// Feature Hooks
import { useAuth } from '@/auth/hooks/use-auth'

// Utilities
import { formatDate } from '@/common/utils/helpers'

// Types
import type { User } from '@/types/database'
```

## 🚀 Getting Started

### Environment Setup

1. **Install Dependencies**:
   ```bash
   pnpm install
   ```

2. **Environment Variables**:
   ```bash
   cp .env.local.example .env.local
   # Add your Supabase credentials
   ```

3. **Database Setup**:
   ```bash
   npm run db:push
   npm run db:generate-types
   ```

4. **Development Server**:
   ```bash
   npm run dev
   ```

### Available Scripts

- `pnpm dev`: Start development server
- `pnpm build`: Build for production
- `pnpm start`: Start production server
- `pnpm lint`: Run ESLint
- `pnpm type-check`: TypeScript type checking
- `pnpm db:push`: Push database changes
- `pnpm db:diff`: Show database differences
- `pnpm db:reset`: Reset database
- `pnpm db:generate-types`: Generate TypeScript types

## 🌐 API & Data Patterns

### Custom API Routes

Custom API routes are used for:
- External service integrations
- Third-party webhooks
- File processing
- Complex business logic that requires HTTP endpoints

**Primary Approach**: Use Server Actions for feature-specific operations and limit API routes to shared/external concerns.

#### **Feature-Contained API Architecture**

We use a proxy pattern that maintains feature self-containment while working with Next.js routing:

**Feature Directory Structure**:
```
app/user-management/
├── page.tsx                   # Main page (/user-management)
├── components/                # Feature components
├── actions/                   # Server Actions (primary approach)
├── hooks/                     # Feature hooks
├── types/                     # Feature types
└── api/                       # Feature-specific API routes
    ├── route.ts               # API logic for /api/user-management
    ├── [id]/
    │   └── route.ts           # API logic for /api/user-management/[id]
    ├── handlers/              # Business logic handlers
    │   ├── get-users.ts
    │   ├── create-user.ts
    │   └── update-user.ts
    ├── middleware/            # Feature-specific middleware
    │   └── validation.ts
    ├── types.ts              # API-specific types
    └── utils.ts              # API utilities
```

**API Route Directory Structure**:
```
app/api/
├── user-management/
│   └── route.ts               # Simple import/export proxy
├── dashboard/
│   └── route.ts               # Simple import/export proxy
├── webhooks/                  # Global webhooks (shared)
│   ├── stripe/
│   │   └── route.ts
│   └── github/
│       └── route.ts
└── (common)/                  # Shared API utilities
    ├── middleware.ts          # Common middleware
    ├── handlers.ts            # Common handlers
    ├── types.ts               # Shared API types
    └── route-proxy.ts         # Route proxy utilities
```

#### **Feature API Implementation Pattern**

**Feature API Route** (Complete logic lives in feature):
```typescript
// app/user-management/api/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { authMiddleware } from '@/api/(common)/middleware'
import { handleApiError } from '@/api/(common)/handlers'
import { createApiResponse } from '@/api/(common)/handlers'
import { userSchemas } from './types'

export async function GET(request: NextRequest) {
  try {
    const { user } = await authMiddleware(request)
    
    // Business logic for getting users
    const users = await getUsersForOrganization(user.organization_id)
    
    return createApiResponse(users)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const { user } = await authMiddleware(request)
    const body = await request.json()
    
    // Validate input using feature schema
    const validatedData = userSchemas.create.parse(body)
    
    // Business logic for creating user
    const newUser = await createUser(validatedData, user.organization_id)
    
    return createApiResponse(newUser, 201)
  } catch (error) {
    return handleApiError(error)
  }
}
```

**API Route Proxy** (Minimal boilerplate):
```typescript
// app/api/user-management/route.ts
export { GET, POST } from '@/user-management/api/route'
```

#### **Advanced Feature API Patterns**

**Nested Routes**:
```typescript
// Feature structure
app/user-management/api/[id]/permissions/route.ts

// Proxy structure
app/api/user-management/[id]/permissions/route.ts
export * from '@/user-management/api/[id]/permissions/route'
```

**Feature-Specific Middleware**:
```typescript
// app/user-management/api/middleware/validation.ts
export const validateUserAccess = async (request: NextRequest) => {
  const { user } = await authMiddleware(request)
  
  // Feature-specific validation logic
  if (!user.user_metadata.can_manage_users) {
    throw new Error('Insufficient permissions')
  }
  
  return { user }
}
```

**Business Logic Handlers**:
```typescript
// app/user-management/api/handlers/get-users.ts
import { createApiResponse } from '@/api/(common)/handlers'

export const getUsersHandler = async (request: NextRequest) => {
  const { user } = await authMiddleware(request)
  
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '10')
  
  const users = await getUsersPaginated({
    organizationId: user.organization_id,
    page,
    limit,
  })
  
  return createApiResponse(users)
}
```

#### **When to Use Each Approach**

**Use Server Actions (Primary)**:
- Feature-specific data mutations
- Form submissions
- Internal business logic
- User-initiated actions

**Use Feature API Routes**:
- External integrations specific to a feature
- Feature-specific webhooks
- Complex HTTP operations
- Third-party service callbacks

**Use Shared API Routes**:
- Global authentication endpoints
- Shared webhooks (Stripe, GitHub, etc.)
- System-level operations
- Cross-feature APIs

### Real-Time Data Patterns

#### **Supabase Real-time Subscriptions**
For features requiring real-time updates:

```typescript
// app/[common/feature]/hooks/use-realtime-subscription.ts
export function useRealtimeSubscription<T>(
  table: string,
  filter?: { column: string; value: any },
  callback: (payload: T) => void
) {
  const { data: { user } } = useAuth()
  const supabase = createSupabaseClient()

  useEffect(() => {
    if (!user) return

    const channel = supabase
      .channel(`${table}-changes`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table,
          filter: filter ? `${filter.column}=eq.${filter.value}` : undefined
        },
        (payload) => callback(payload.new as T)
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user, table, filter])

  return supabase
}
```

#### **Usage Pattern**
```typescript
// In a feature component
export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([])
  const { data: initialTasks } = useTasks()

  // Real-time updates
  useRealtimeSubscription('tasks', 
    { column: 'project_id', value: projectId },
    (newTask) => {
      setTasks(prev => prev.map(task => 
        task.id === newTask.id ? newTask : task
      ))
    }
  )

  return <TaskListItems tasks={tasks} />
}
```

### Data Validation & Type Safety

#### **Input Validation Layers**
1. **Zod Schemas**: Runtime validation and TypeScript inference
2. **Database Constraints**: Column types, foreign keys, check constraints
3. **RLS Policies**: Row-level security validation
4. **API Validation**: Request/response validation

#### **Schema Organization**
```typescript
// app/common/lib/schemas/
export const userSchemas = {
  create: z.object({
    email: z.string().email(),
    first_name: z.string().min(1),
    last_name: z.string().min(1),
    role: z.enum(['user', 'admin']).default('user'),
  }),
  
  update: z.object({
    first_name: z.string().min(1).optional(),
    last_name: z.string().min(1).optional(),
    avatar_url: z.string().url().optional().nullable(),
  }),
  
  bulkUpdate: z.object({
    user_ids: z.array(z.string().uuid()),
    updates: z.object({
      role: z.enum(['user', 'admin']).optional(),
      status: z.enum(['active', 'inactive']).optional(),
    }),
  }),
}

// Type inference
export type CreateUserInput = z.infer<typeof userSchemas.create>
export type UpdateUserInput = z.infer<typeof userSchemas.update>
export type BulkUpdateUsersInput = z.infer<typeof userSchemas.bulkUpdate>
```

### Caching Strategies

#### **Multi-Level Caching**
1. **React Query**: Client-side query caching
2. **Supabase Edge Caching**: CDN-level caching
3. **Database Indexing**: Query optimization
4. **Application Cache**: Redis for complex computations

#### **Cache Key Strategy**
```typescript
// app/common/lib/cache-keys.ts
export const CacheKeys = {
  // User-specific cache (never shared)
  user: (userId: string) => `user:${userId}`,
  userProfile: (userId: string) => `user:${userId}:profile`,
  
  // Organization cache (shared within org)
  orgMembers: (orgId: string) => `org:${orgId}:members`,
  orgSettings: (orgId: string) => `org:${orgId}:settings`,
  
  // Public cache (shared globally)
  systemSettings: 'system:settings',
  featureFlags: 'system:feature-flags',
} as const
```

## 🎨 UI/UX Standards

### Design System Principles

#### **Component Hierarchy**
```typescript
// app/common/components/ui/
// 1. Primitive Components (lowest level)
export { Button } from './button'          // Interactive elements
export { Input } from './input'            // Form inputs
export { Card } from './card'              // Layout containers
export { Badge } from './badge'            // Status indicators
export { Avatar } from './avatar'          // User representations

// 2. Composite Components (built from primitives)
export { DataTable } from './data-table'   // Data display
export { FormField } from './form-field'   // Form structure
export { Navigation } from './navigation'   // Navigation patterns
export { Modal } from './modal'            // Overlay patterns

// 3. Feature Components (business logic)
export { UserProfile } from './user-profile'
export { TaskBoard } from './task-board'
export { ChartContainer } from './chart-container'
```

#### **Component Design Guidelines**

**1. Accessibility First**
- Use semantic HTML elements
- Implement ARIA attributes correctly
- Ensure keyboard navigation
- Test with screen readers

**2. Responsive Design**
- Mobile-first approach
- Consistent breakpoint usage:
  ```typescript
  const breakpoints = {
    sm: '640px',    // Mobile landscape
    md: '768px',    // Tablet
    lg: '1024px',   // Desktop
    xl: '1280px',   // Large desktop
  }
  ```

**3. Consistent Spacing**
- Use Tailwind's spacing scale consistently
- Maintain visual rhythm (8px grid)
- Avoid magic numbers

### Visual Design Standards

#### **Color System**
```css
/* app/common/styles/globals.css */
@theme {
  /* Primary brand colors */
  --color-primary-50: #eff6ff;
  --color-primary-500: #3b82f6;
  --color-primary-900: #1e3a8a;
  
  /* Semantic colors */
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
  --color-info: #06b6d4;
}
```

#### **Typography Scale**
```css
@theme {
  /* Font sizes */
  --text-xs: 0.75rem;    /* 12px */
  --text-sm: 0.875rem;   /* 14px */
  --text-base: 1rem;     /* 16px */
  --text-lg: 1.125rem;   /* 18px */
  --text-xl: 1.25rem;    /* 20px */
  --text-2xl: 1.5rem;    /* 24px */
  --text-3xl: 1.875rem;  /* 30px */
  --text-4xl: 2.25rem;   /* 36px */
}
```

#### **Component Variants**
```typescript
// app/common/components/ui/button.tsx
const buttonVariants = cva(
  // Base styles
  "inline-flex items-center justify-center rounded-md text-sm font-medium",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground hover:bg-primary/90",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        default: "h-10 px-4 py-2",
        lg: "h-11 px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)
```

### State & Loading Patterns

#### **Loading States**
```typescript
// 1. Skeleton screens for content loading
export function PostSkeleton() {
  return (
    <div className="space-y-3">
      <div className="skeleton h-4 w-[250px]" />
      <div className="skeleton h-4 w-[200px]" />
      <div className="skeleton h-4 w-[300px]" />
    </div>
  )
}

// 2. Spinners for actions
export function LoadingSpinner({ size = 'sm' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6', 
    lg: 'w-8 h-8',
  }
  
  return (
    <div className={`animate-spin ${sizeClasses[size]}`}>
      <SpinnerIcon />
    </div>
  )
}

// 3. Progress bars for uploads/processing
export function ProgressBar({ progress }: { progress: number }) {
  return (
    <div className="w-full bg-secondary rounded-full h-2">
      <div 
        className="bg-primary h-2 rounded-full transition-all duration-300"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}
```

#### **Error States**
```typescript
// app/common/components/ui/error-boundary.tsx
export function ErrorBoundary({
  children,
  fallback,
}: {
  children: React.ReactNode
  fallback?: (error: Error, reset: () => void) => React.ReactNode
}) {
  return (
    <ErrorBoundaryComponent
      fallback={({ error, reset }) => 
        fallback ? fallback(error, reset) : (
          <div className="flex flex-col items-center justify-center p-8">
            <h2 className="text-lg font-semibold mb-2">Something went wrong</h2>
            <p className="text-muted-foreground mb-4">{error.message}</p>
            <Button onClick={reset}>Try again</Button>
          </div>
        )
      }
    >
      {children}
    </ErrorBoundaryComponent>
  )
}
```

### Animation & Transitions

#### **Motion Guidelines**
- **Purposeful animations**: Only animate to draw attention or show state changes
- **Performance**: Use CSS transforms and opacity for smooth animations
- **Accessibility**: Respect `prefers-reduced-motion`

#### **Animation Utilities**
```css
/* app/common/styles/globals.css */
@layer utilities {
  .fade-in {
    animation: fadeIn 0.2s ease-in-out;
  }
  
  .slide-up {
    animation: slideUp 0.3s ease-out;
  }
  
  .scale-in {
    animation: scaleIn 0.2s ease-out;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes slideUp {
    from { 
      opacity: 0;
      transform: translateY(10px);
    }
    to { 
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes scaleIn {
    from { 
      opacity: 0;
      transform: scale(0.95);
    }
    to { 
      opacity: 1;
      transform: scale(1);
    }
  }
}
```

## 🗄️ Database & Schema Management

### Schema Design Principles

#### **Naming Conventions**
```sql
-- Tables: plural snake_case
CREATE TABLE users (
  -- Columns: snake_case
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Foreign keys: {table}_id
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes: idx_{table}_{columns}
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
```

#### **Table Design Patterns**

**1. Audit Trail**
```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name TEXT NOT NULL,
  record_id UUID NOT NULL,
  action TEXT NOT NULL, -- 'INSERT', 'UPDATE', 'DELETE'
  old_values JSONB,
  new_values JSONB,
  user_id UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**2. Soft Deletes**
```sql
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT,
  deleted_at TIMESTAMPTZ, -- NULL means not deleted
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Query for non-deleted records
SELECT * FROM posts WHERE deleted_at IS NULL;
```

**3. Polymorphic Relationships**
```sql
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  commentable_type TEXT NOT NULL, -- 'post', 'project', 'task'
  commentable_id UUID NOT NULL,
  user_id UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Row Level Security (RLS)

#### **RLS Policy Patterns**
```sql
-- Enable RLS on the table
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- 1. User can see their own posts
CREATE POLICY "Users can view own posts" ON posts
  FOR SELECT USING (auth.uid() = user_id);

-- 2. User can insert their own posts
CREATE POLICY "Users can insert own posts" ON posts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 3. User can update their own posts
CREATE POLICY "Users can update own posts" ON posts
  FOR UPDATE USING (auth.uid() = user_id);

-- 4. User can delete their own posts
CREATE POLICY "Users can delete own posts" ON posts
  FOR DELETE USING (auth.uid() = user_id);

-- 5. Admins can do anything (role-based)
CREATE POLICY "Admins full access" ON posts
  FOR ALL USING (
    auth.jwt() ->> 'role' = 'admin'
  );
```

#### **Complex RLS with Functions**
```sql
-- Helper function for organization-based access
CREATE OR REPLACE FUNCTION user_has_organization_access(org_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM organization_members 
    WHERE organization_id = org_id 
    AND user_id = auth.uid()
    AND deleted_at IS NULL
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Use in policies
CREATE POLICY "Organization access" ON projects
  FOR ALL USING (
    user_has_organization_access(organization_id)
  );
```

### Migration Strategy

#### **Migration File Organization**
```sql
-- migrations/001_initial_schema.sql
-- migrations/002_add_user_profiles.sql  
-- migrations/003_add_audit_logs.sql
-- migrations/004_add_soft_deletes.sql
```

#### **Migration Pattern**
```sql
-- Each migration includes up and down migrations
-- Example: 003_add_audit_logs.sql

-- Up migration
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name TEXT NOT NULL,
  record_id UUID NOT NULL,
  action TEXT NOT NULL,
  old_values JSONB,
  new_values JSONB,
  user_id UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create trigger function
CREATE OR REPLACE FUNCTION audit_trigger()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO audit_logs (table_name, record_id, action, old_values, new_values, user_id)
  VALUES (
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    TG_OP,
    CASE WHEN TG_OP = 'DELETE' THEN row_to_json(OLD) ELSE NULL END,
    CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN row_to_json(NEW) ELSE NULL END,
    auth.uid()
  );
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Down migration
DROP TRIGGER IF EXISTS audit_trigger ON users;
DROP TRIGGER IF EXISTS audit_trigger ON posts;
DROP FUNCTION IF EXISTS audit_trigger();
DROP TABLE IF EXISTS audit_logs;
```

### Database Performance

#### **Indexing Strategy**
```sql
-- 1. Primary keys (automatic)
-- 2. Foreign keys
CREATE INDEX idx_posts_user_id ON posts(user_id);

-- 3. Columns used in WHERE clauses
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);

-- 4. Composite indexes for complex queries
CREATE INDEX idx_posts_user_status ON posts(user_id, status);
CREATE INDEX idx_posts_status_created_at ON posts(status, created_at DESC);

-- 5. Partial indexes for specific conditions
CREATE INDEX idx_active_users ON users(id) WHERE status = 'active';
CREATE INDEX idx_published_posts ON posts(id) WHERE published = true;
```

#### **Query Optimization Patterns**
```typescript
// Use database functions for complex operations
// app/common/lib/database-functions.ts

export const databaseFunctions = {
  // Get user with their latest activity
  getUserWithActivity: `
    SELECT 
      u.*,
      (
        SELECT json_agg(p.* ORDER BY p.created_at DESC LIMIT 5)
        FROM posts p 
        WHERE p.user_id = u.id 
        AND p.deleted_at IS NULL
      ) as recent_posts
    FROM users u 
    WHERE u.id = $1
  `,
  
  // Get organization stats
  getOrganizationStats: `
    SELECT 
      (SELECT COUNT(*) FROM users WHERE organization_id = $1 AND deleted_at IS NULL) as user_count,
      (SELECT COUNT(*) FROM projects WHERE organization_id = $1 AND deleted_at IS NULL) as project_count,
      (SELECT COUNT(*) FROM posts p 
       JOIN projects pr ON p.project_id = pr.id 
       WHERE pr.organization_id = $1 AND p.deleted_at IS NULL) as post_count
  `,
}
```

### Backup & Recovery

#### **Backup Strategy**
```typescript
// app/common/lib/backup.ts
export const backupStrategy = {
  // Daily automated backups
  daily: {
    retention: '30 days',
    tables: ['users', 'posts', 'projects', 'comments'],
  },
  
  // Weekly full backups
  weekly: {
    retention: '90 days',
    includeAllTables: true,
  },
  
  // Point-in-time recovery for critical data
  pointInTime: {
    tables: ['users', 'financial_transactions'],
    frequency: 'hourly',
    retention: '7 days',
  },
}
```

## 🔧 Configuration Files

### TypeScript Configuration
Strict TypeScript setup with path aliases in `tsconfig.json`.

### Tailwind CSS v4
CSS-based configuration in `app/common/styles/globals.css`.

### ESLint
Customized rules for consistent code quality.

### Supabase
Database and authentication configuration via environment variables.

## 📊 Performance Considerations

### Bundle Optimization
- Code splitting by feature
- Dynamic imports where appropriate
- Minimal dependencies

### Database Performance
- Optimized queries with Supabase
- Proper indexing strategies
- Connection pooling

### Rendering Performance
- Server Components for static content
- Client Components for interactivity
- Proper state management to avoid re-renders

## 🔒 Security

### Authentication
- Secure session management
- Protected routes implementation
- CSRF protection

### Data Validation
- Server-side validation with Zod
- Input sanitization
- Type-safe database operations

### Environment Security
- Environment variable management
- API key protection
- CORS configuration

## 🧪 Testing Strategy

### Type Safety
- Compile-time error catching
- Strict TypeScript configuration
- Schema validation testing

## 📈 Scaling Guidelines

### Feature Expansion
- Create new feature directories following established patterns
- Use shared utilities to maintain consistency
- Implement proper TypeScript types

### Team Development
- Clear feature boundaries for parallel development
- Consistent code style and patterns
- Comprehensive documentation

### Performance Scaling
- Implement caching strategies
- Database optimization
- Bundle size monitoring

## 🔄 Maintenance

### Regular Updates
- Dependency updates
- Security patches
- Performance optimizations

### Code Quality
- Regular linting
- Type checking
- Code review processes

### Documentation
- Keep documentation current
- Update README with new features
- Maintain inline code documentation

---

This template provides a solid foundation for building production applications with modern best practices, AI agent-friendly architecture, and excellent developer experience.
