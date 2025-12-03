# Data Fetching Patterns

## Data Fetching Strategy

We use a three-tier approach optimized for different use cases while maintaining feature self-containment:

1. **Server Actions (Primary)** - Feature-specific data mutations and interactions
2. **Server Components (Initial Load)** - Page initial loads and static content  
3. **React Query (Client-Side)** - Real-time data, complex caching, shared data

## 1. Server Actions (Primary)

### When to Use
- Feature-specific data mutations
- Form submissions and user inputs
- Internal business logic
- Direct user interactions
- When the operation is closely tied to a feature

### How to Implement
Use `authAction` and `publicAction` in feature `actions/` directories:

```typescript
// app/user-management/actions/create-user.ts
import { authAction } from '@/(common)/lib/safe-action'
import { userSchemas } from '@/(common)/lib/schemas'

export const createUser = authAction(userSchemas.create, async (data, ctx) => {
  const { supabase, authUser } = ctx
  
  const { error } = await supabase
    .from('users')
    .insert({ 
      ...data, 
      organization_id: authUser.organization_id,
      created_by: authUser.id 
    })
    
  if (error) throw new Error(error.message)
  
  return { success: true, userId: data.id }
})
```

### Client-Side Usage
```typescript
// In component
import { useAction } from 'next-safe-action/hooks'
import { createUser } from '@/user-management/actions/create-user'
import { queryClient } from '@/(common)/lib/query-client'
import { QueryKeys } from '@/(common)/lib/query-keys'

export function CreateUserForm() {
  const create = useAction(createUser, {
    onSuccess: () => {
      // Invalidate related queries if needed
      queryClient.invalidateQueries({ queryKey: [QueryKeys.USERS] })
      toast.success('User created successfully')
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })
  
  const onSubmit = (data: CreateUserInput) => {
    create.execute(data)
  }
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Form fields */}
      <Button type="submit" disabled={create.isPending}>
        {create.isPending ? 'Creating...' : 'Create User'}
      </Button>
    </form>
  )
}
```

### Benefits
- Type-safe with automatic validation
- Minimal client code
- Works seamlessly with our architecture
- Built-in error handling
- Authentication context automatically provided

## 2. Server Components (Initial Load)

### When to Use
- Page initial loads
- Static or infrequently changing data
- SEO-critical content
- When data doesn't need client-side interactivity

### How to Implement
Direct Supabase calls in Server Components:

```typescript
// app/dashboard/page.tsx
import { createSupabaseServerClient } from '@/(common)/lib/supabase-server'
import { DashboardComponent } from './components/dashboard-component'

export default async function DashboardPage() {
  const supabase = createSupabaseServerClient()
  
  // Fetch initial data
  const { data: user } = await supabase
    .from('profiles')
    .select('*')
    .single()
    
  const { data: recentActivity } = await supabase
    .from('activities')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10)
  
  return (
    <DashboardComponent 
      user={user} 
      recentActivity={recentActivity}
    />
  )
}
```

### Benefits
- No client-side JavaScript for initial load
- Faster initial paint
- SEO friendly
- Automatic caching with Next.js

## 3. React Query (Client-Side)

### When to Use
- Real-time data updates needed
- Complex caching requirements
- External API integration
- Data shared across multiple features
- Background synchronization needed

### How to Implement
Use `useQuery` hooks with authenticated query wrappers:

```typescript
// app/(common)/hooks/auth-query.ts
import { createSupabaseClient } from '@/(common)/lib/supabase'
import { z } from 'zod'

export function authQuery<TParams, TResult>(
  queryFn: (params: { 
    supabase: SupabaseClient 
    user: User 
    params: TParams 
  }) => Promise<TResult>,
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

### Feature-Specific Query Hooks
```typescript
// app/user-management/hooks/use-users.ts
import { useQuery } from '@tanstack/react-query'
import { authQuery } from '@/(common)/hooks/auth-query'
import { QueryKeys } from '@/(common)/lib/query-keys'
import { userSchemas } from '@/(common)/lib/schemas'

export function useUsers(params?: { organizationId?: string }) {
  return useQuery({
    queryKey: [QueryKeys.USERS, params],
    queryFn: authQuery(
      async ({ supabase }) => {
        let query = supabase.from('users').select('*')
        
        if (params?.organizationId) {
          query = query.eq('organization_id', params.organizationId)
        }
        
        const { data, error } = await query
        if (error) throw new Error(error.message)
        return data
      },
      {
        paramsSchema: userSchemas.listParams.optional()
      }
    ),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useUser(userId: string) {
  return useQuery({
    queryKey: [QueryKeys.USER_DETAIL, userId],
    queryFn: authQuery(async ({ supabase }) => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()
        
      if (error) throw new Error(error.message)
      return data
    }),
    enabled: !!userId,
  })
}
```

## Query Keys and Cache Management

### Query Keys Pattern
Use centralized enum for consistent cache management:

```typescript
// app/(common)/lib/query-keys.ts
export enum QueryKeys {
  // User-related
  PROFILE = 'profile',
  USER_PREFERENCES = 'user-preferences',
  USERS = 'users',
  USER_DETAIL = 'user-detail',
  
  // Dashboard
  DASHBOARD_STATS = 'dashboard-stats',
  ANALYTICS = 'analytics',
  RECENT_ACTIVITY = 'recent-activity',
  
  // Feature-specific
  ITEMS = 'items',
  ITEM_DETAIL = 'item-detail',
  PROJECTS = 'projects',
  PROJECT_DETAIL = 'project-detail',
}
```

### Key Construction Patterns
```typescript
// Simple queries
[QueryKeys.PROFILE]

// Parameterized queries  
[QueryKeys.USER_DETAIL, userId]

// Complex filters
[QueryKeys.USERS, { organizationId, status, page }]

// Nested queries
[QueryKeys.PROJECT_DETAIL, projectId, QueryKeys.PROJECT_TASKS]
```

### Cache Invalidation Strategies
```typescript
// In mutations - invalidate related queries
queryClient.invalidateQueries({ queryKey: [QueryKeys.USERS] })

// Precise invalidation - only specific cached items
queryClient.invalidateQueries({ 
  queryKey: [QueryKeys.USER_DETAIL, userId] 
})

// Complex invalidation - invalidate all user-related caches
queryClient.invalidateQueries({ 
  predicate: (query) => 
    query.queryKey[0] === QueryKeys.USERS ||
    query.queryKey[0] === QueryKeys.USER_DETAIL
})

// Optimistic updates
queryClient.setQueryData([QueryKeys.USER_DETAIL, userId], updatedUser)
```

## Data Mutations

### Server Actions vs React Query Mutations
- **Server Actions**: Database writes, form submissions, file uploads
- **React Query Mutations**: Complex operations, external API calls

### Server Action Pattern
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

### Client-Side Usage with Cache Updates
```typescript
// In component
import { useAction } from 'next-safe-action/hooks'
import { updateProfile } from './actions/update-profile'

export function ProfileForm() {
  const queryClient = useQueryClient()
  
  const updateProfileAction = useAction(updateProfile, {
    onSuccess: (data) => {
      // Update local cache with new data
      queryClient.setQueryData([QueryKeys.PROFILE], data.updatedProfile)
      
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: [QueryKeys.USER_PREFERENCES] })
      
      toast.success('Profile updated successfully')
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })
  
  return (
    <form onSubmit={form.handleSubmit(updateProfileAction.execute)}>
      {/* Form fields */}
      <Button type="submit" disabled={updateProfileAction.isPending}>
        {updateProfileAction.isPending ? 'Saving...' : 'Save Changes'}
      </Button>
    </form>
  )
}
```

## Real-Time Data Patterns

### Supabase Real-time Subscriptions
For features requiring real-time updates:

```typescript
// app/(common)/hooks/use-realtime-subscription.ts
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
}
```

### Usage in Feature Components
```typescript
// In a feature component
export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([])
  const { data: initialTasks } = useTasks({ projectId })

  // Real-time updates
  useRealtimeSubscription('tasks', 
    { column: 'project_id', value: projectId },
    (newTask) => {
      setTasks(prev => prev.map(task => 
        task.id === newTask.id ? newTask : task
      ))
    }
  )

  // Update local cache when real-time data arrives
  const queryClient = useQueryClient()
  
  useRealtimeSubscription('tasks',
    { column: 'project_id', value: projectId },
    (updatedTask) => {
      queryClient.setQueryData(
        [QueryKeys.PROJECT_TASKS, projectId],
        (old: Task[] | undefined) => 
          old?.map(task => task.id === updatedTask.id ? updatedTask : task)
      )
    }
  )

  return <TaskListItems tasks={tasks} />
}
```

## Data Validation & Type Safety

### Input Validation Layers
1. **Zod Schemas**: Runtime validation and TypeScript inference
2. **Database Constraints**: Column types, foreign keys, check constraints
3. **RLS Policies**: Row-level security validation
4. **API Validation**: Request/response validation

### Schema Organization
```typescript
// app/(common)/lib/schemas/users.ts
export const userSchemas = {
  create: z.object({
    email: z.string().email(),
    first_name: z.string().min(1),
    last_name: z.string().min(1),
    role: z.enum(['user', 'admin']).default('user'),
    organization_id: z.string().uuid(),
  }),
  
  update: z.object({
    first_name: z.string().min(1).optional(),
    last_name: z.string().min(1).optional(),
    avatar_url: z.string().url().optional().nullable(),
    preferences: z.record(z.any()).optional(),
  }),
  
  listParams: z.object({
    organization_id: z.string().uuid().optional(),
    role: z.enum(['user', 'admin']).optional(),
    status: z.enum(['active', 'inactive']).optional(),
    page: z.number().min(1).default(1),
    limit: z.number().min(1).max(100).default(20),
  }).optional(),
}

// Type inference
export type CreateUserInput = z.infer<typeof userSchemas.create>
export type UpdateUserInput = z.infer<typeof userSchemas.update>
export type ListUsersParams = z.infer<typeof userSchemas.listParams>
```

## Caching Strategies

### Multi-Level Caching
1. **React Query**: Client-side query caching
2. **Supabase Edge Caching**: CDN-level caching
3. **Database Indexing**: Query optimization
4. **Application Cache**: Redis for complex computations

### Cache Key Strategy
```typescript
// app/(common)/lib/cache-keys.ts
export const CacheKeys = {
  // User-specific cache (never shared)
  user: (userId: string) => `user:${userId}`,
  userProfile: (userId: string) => `user:${userId}:profile`,
  userPreferences: (userId: string) => `user:${userId}:preferences`,
  
  // Organization cache (shared within org)
  orgMembers: (orgId: string) => `org:${orgId}:members`,
  orgSettings: (orgId: string) => `org:${orgId}:settings`,
  
  // Public cache (shared globally)
  systemSettings: 'system:settings',
  featureFlags: 'system:feature-flags',
} as const
```

### Query Configuration Examples
```typescript
// Frequently accessed data with long cache
const { data: user } = useQuery({
  queryKey: [QueryKeys.PROFILE],
  queryFn: authQuery(fetchProfile),
  staleTime: 10 * 60 * 1000, // 10 minutes
  cacheTime: 30 * 60 * 1000,  // 30 minutes
})

// Real-time data with short cache
const { data: notifications } = useQuery({
  queryKey: [QueryKeys.NOTIFICATIONS],
  queryFn: authQuery(fetchNotifications),
  staleTime: 0, // Always fresh
  refetchInterval: 30 * 1000, // Refetch every 30 seconds
})

// Static data with very long cache
const { data: countries } = useQuery({
  queryKey: [QueryKeys.COUNTRIES],
  queryFn: fetchCountries,
  staleTime: 24 * 60 * 60 * 1000, // 24 hours
  cacheTime: 7 * 24 * 60 * 60 * 1000, // 7 days
})
```

## Decision Guidelines

### Use Server Actions when
- Feature-specific data mutations
- Form submissions and user inputs
- Internal business logic
- Direct user interactions
- When the operation is closely tied to a feature

### Use Server Components when
- Initial page loads
- Static or infrequently changing data
- SEO-critical content
- When data doesn't need client-side interactivity

### Use React Query when
- Real-time data updates needed
- Complex caching requirements
- External API integration
- Data shared across multiple features
- Background synchronization needed

This three-tier approach ensures optimal performance and developer experience while maintaining our architectural principles of feature self-containment.