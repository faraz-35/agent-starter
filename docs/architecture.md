# Architecture Documentation

## 🏗️ Core Philosophy

- **AI Agent-First**: Structure optimized for context engineering for AI agents to understand and modify
- **Feature-Centric**: Self-contained features with clear boundaries
- **Production Ready**: Built with scalability, maintainability, and performance in mind
- **Type Safety**: Full TypeScript integration throughout
- **Complete Context Containment**: Feature directories contain 100% of necessary code

## 🎯 Critical Architectural Principle: Adaptive Self-Containment

This is the most important concept in our architecture:

> **Proceed with self-containment UNTIL code duplication occurs, then move ONLY the duplicated portions to parent common directories.**

### The Self-Containment Rule
1. **Build features with complete self-containment initially**
2. **Identify actual code duplication as it naturally occurs**
3. **Extract ONLY duplicated code to parent common directories**
4. **Keep unique business logic within feature directories**

**No hard percentages or artificial rules** - architecture evolves naturally based on real duplication patterns.

## Architecture Benefits for AI Agent Development

### 1. Complete Feature Self-Containment
Every feature contains ALL its code:
- **All components** for that feature live in the feature directory
- **All hooks** for that feature live in the feature directory  
- **All actions** for that feature live in the feature directory
- **All types** for that feature live in the feature directory
- **All API routes** for that feature live in the feature directory
- **All constants** and **utils** for that feature live in the feature directory
- No need to navigate outside feature directories for feature-specific code
- Clear feature boundaries prevent cross-contamination

### 2. Predictable Context Engineering
AI agents can easily understand:
- Where to find feature-specific code (everything is in the feature directory)
- How to extend existing features (follow the same patterns within the feature)
- What patterns to follow for new features (look at existing features as complete examples)
- How APIs relate to their features (API code is in the same feature directory)

### 3. Minimal Parent Directory Usage
- **Root `app/(common)/`**: Contains ONLY truly shared utilities (UI primitives, global types, base configurations)
- **Feature `common/` directories**: Contain ONLY shared components within that specific feature
- **80/20 Rule**: 80% of code should be in specific feature directories, 20% in shared utilities
- **Parent directories are configuration-only**: Layout files, route groups, and minimal shared utilities

### 4. Context Engineering Guarantee
- When providing a feature directory to an AI agent, you're providing 100% of the necessary context
- No missing components, hooks, or logic that lives outside the feature
- No need for agents to "guess" or "assume" where code might be located
- Complete examples and patterns within each feature

### 5. Hierarchical Common Directory Strategy
- **Root `app/(common)/`**: Truly shared utilities (UI primitives, global types, base configurations)
- **Feature `app/feature/(common)/`**: Shared components within that specific feature (anti-duplication)
- **Shared components move UP only when actually duplicated across sub-features**

### 6. Proxy Pattern Benefits
- Feature APIs live in feature directories (`app/feature/api/`)
- Minimal proxy boilerplate in `app/api/feature/` (just import/export)
- Type-safe import/export maintains IDE support
- Zero runtime overhead
- Complete API logic remains in feature directory
- **Layout Proxy Pattern**: Root layout exports from `@/(common)/layout` to maintain architecture while respecting Next.js requirements

### 7. Three-Tier Data Strategy
- **Server Actions**: Feature-specific mutations (90% of cases) - live in feature `actions/`
- **Server Components**: Initial page loads and static content - live in feature
- **React Query**: Complex caching and shared data - feature hooks use shared utilities
- Clear decision guidelines for each approach

### 8. Minimal Configuration
- Works with native Next.js routing
- No custom middleware or rewrites
- Leverages existing Next.js patterns
- Reduces cognitive load for AI agents

## Directory Structure

**🎯 CRITICAL: No file or directory exists outside either `common` or a feature folder**

```
├── app/                           # Next.js App Router
│   ├── (common)/                  # TRULY shared utilities ONLY (20% of code) 
│   │   ├── components/ui/         # Reusable UI primitives (Button, Input, etc.)
│   │   ├── components/icons/      # Icon components
│   │   ├── hooks/                 # GLOBAL custom hooks ONLY (useZodForm, etc.)
│   │   ├── lib/                   # Third-party library configurations
│   │   ├── store/                 # Zustand state management
│   │   ├── styles/                # Global styles and theme
│   │   ├── utils/                 # UNIVERSAL utility functions ONLY
│   │   ├── types/                 # SHARED TypeScript types ONLY
│   │   │   ├── database.ts        # Database type definitions
│   │   │   └── global.ts          # Global shared types
│   │   └── layout.tsx             # Root layout implementation (exported to app/layout.tsx)
│   │   
│   ├── auth/                      # Multi-page authentication feature
│   │   ├── (common)/              # Shared components ONLY when duplicated across login/register
│   │   │   ├── components/        # Shared auth components
│   │   │   └── layout.tsx         # Auth feature layout
│   │   ├── login/                 # Login sub-feature (unique business logic)
│   │   │   ├── page.tsx           # /auth/login
│   │   │   └── components/        # Login-specific components
│   │   └── register/              # Register sub-feature
│   │       ├── page.tsx           # /auth/register
│   │       └── components/        # Register-specific components
│   │       
│   ├── dashboard/                 # Feature with nested sub-features -> NEEDS (root)
│   │   ├── (common)/              # Shared components WITHIN dashboard only
│   │   ├── (root)/                # Main dashboard view (isolated from container)
│   │   │   ├── page.tsx           # /dashboard (main page)
│   │   │   ├── components/        # Components specific to the main dashboard view
│   │   │   └── api/               # API specific to the main dashboard view
│   │   └── settings/              # Settings sub-feature
│   │       ├── page.tsx           # /dashboard/settings
│   │       └── components/        # Settings-specific components
│   │       
│   ├── simple-feature/            # Single-page feature -> NO (root) needed
│   │   ├── page.tsx               # /simple-feature
│   │   ├── components/            # Feature components
│   │   └── api/                   # Feature API
│   │       
│   └── api/                       # API proxy routes (MINIMAL - just import/export)
│       ├── auth/
│       │   └── route.ts           // export * from '@/auth/api/route'
│       └── dashboard/
│           └── route.ts           // export * from '@/dashboard/(root)/api/route'
│           
├── layout.tsx                     # Root layout proxy (exports from @/(common)/layout)
└── public/                        # Static assets
```

## Adaptive Self-Containment Rules

### 1. The `(root)` Directory Pattern
- **Use `(root)` ONLY when a feature has nested sub-features** (e.g., `dashboard/settings`).
- **Why?** It separates the "main view" logic from the "feature container" logic.
- **If a feature is single-page**, put `page.tsx` directly in the feature folder.

### 2. Build with Self-Containment First
- Start each feature completely self-contained
- Keep all business logic within feature directories
- Don't pre-emptively create shared components

### 3. Extract Only When Duplication Occurs
- Move ACTUALLY duplicated code to `feature/(common)/` directories
- Keep unique business logic within sub-feature directories

## Real-World Examples

### Extracted to `app/auth/(common)/`:
- `AuthFormField`: Used by login, register, forgot password
- `SocialLoginButtons`: Used by login and register
- `useAuthForm`: Shared form state management pattern
- `isValidEmail`: Common validation utility

### Kept in Feature Directories:
- `loginAction`: Login-specific authentication logic
- `useLogin`: Login-specific business logic hooks
- `LOGIN_REDIRECTS`: Login-specific configuration
- Remember me functionality: Login-specific feature

## Layout Proxy Pattern

The root layout follows the same export/import pattern as API routes to maintain architecture integrity:

```typescript
// app/layout.tsx (Next.js requirement - minimal proxy)
export { default } from '@/(common)/layout'

// app/(common)/layout.tsx (all real layout logic)
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/(common)/styles/globals.css";

const geistSans = Geist({...});
const geistMono = Geist_Mono({...});

export const metadata: Metadata = {...};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
```

This pattern maintains your architecture principle while respecting Next.js requirements:
- **Single Exception**: Only `app/layout.tsx` exists outside the structure, but it's just a proxy
- **Real Logic in Common**: All meaningful layout logic lives in `app/(common)/layout.tsx`
- **Server Component Benefits**: Full Next.js layout capabilities (metadata, fonts, etc.)

## Actions vs Hooks

- **actions/** should expose server actions implemented and invoked via the Safe Action Client (type-safe, validated server calls).
- **hooks/** should contain the feature's React Query (TanStack Query) logic — queries and mutations (e.g. useFeatureQuery, useCreateFeatureMutation) — and wrap or compose shared hooks as needed to provide a consistent client-side API for data fetching, caching, and optimistic updates.