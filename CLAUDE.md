# CLAUDE.md - Next.js Production Starter Template

A comprehensive documentation for the production-ready Next.js starter template built with modern architecture principles and AI agent-first design.

## 🏗️ Project Architecture

### Core Philosophy
- **AI Agent-First**: Structure optimized for context engineering for AI agents to understand and modify
- **Feature-Centric**: Self-contained features with clear boundaries
- **Production Ready**: Built with scalability, maintainability, and performance in mind
- **Type Safety**: Full TypeScript integration throughout

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

We use a hybrid approach optimized for performance and user experience:

#### **Server Components (Initial Load)**
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

#### **React Query (Client-Side)**
- **When to use**: Real-time data, user interactions, cache management
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
