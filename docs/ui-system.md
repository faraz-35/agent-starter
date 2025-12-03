# UI System & Design Standards

## Design System Principles

### Component Hierarchy
```typescript
// app/(common)/components/ui/
// 1. Primitive Components (lowest level)
export { Button } from './button'          // Interactive elements
export { Input } from './input'            // Form inputs

// 2. Composite Components (built from primitives)
// should be in app/(common)/components/patterns/
export { DataTable } from './data-table'   // Data display
export { FormField } from './form-field'   // Form structure

// 3. Feature Components (business logic)
// would be inside [feature]/components
export { UserProfile } from './user-profile'
```

## Component Design Guidelines

### 1. Accessibility First
- Use semantic HTML elements
- Implement ARIA attributes correctly
- Ensure keyboard navigation
- Test with screen readers

```typescript
// ✅ Good - Semantic HTML with proper ARIA
<button
  type="button"
  aria-label="Delete item"
  aria-describedby="delete-help"
  disabled={isDeleting}
>
  <TrashIcon />
</button>
<div id="delete-help" className="sr-only">
  This action cannot be undone
</div>

// ❌ Bad - Non-semantic without accessibility
<div onClick={handleDelete}>
  <TrashIcon />
</div>
```

### 2. Responsive Design
- Mobile-first approach
- Consistent breakpoint usage

```typescript
const breakpoints = {
  sm: '640px',    // Mobile landscape
  md: '768px',    // Tablet
  lg: '1024px',   // Desktop
  xl: '1280px',   // Large desktop
}

// Usage in components
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {items.map(item => <ItemCard key={item.id} item={item} />)}
</div>
```

### 3. Consistent Spacing
- Use Tailwind's spacing scale consistently
- Maintain visual rhythm (8px grid)
- Avoid magic numbers

```typescript
// ✅ Good - Consistent spacing scale
<div className="p-4 space-y-3">
  <h2 className="text-lg font-semibold mb-2">Title</h2>
  <p className="text-sm text-muted-foreground">Description</p>
  <Button className="mt-4">Action</Button>
</div>

// ❌ Bad - Magic numbers
<div className="p-[17px] space-y-[13px]">
  <h2 className="text-lg font-semibold mb-[7px]">Title</h2>
  <p className="text-sm text-muted-foreground">Description</p>
  <Button className="mt-[21px]">Action</Button>
</div>
```

## Visual Design Standards

### Color System
Configuration in `app/(common)/styles/globals.css`:

```css
@theme {
  /* Primary brand colors */
  --color-primary-50: #eff6ff;
  --color-primary-100: #dbeafe;
  --color-primary-500: #3b82f6;
  --color-primary-600: #2563eb;
  --color-primary-900: #1e3a8a;
  
  /* Semantic colors */
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
  --color-info: #06b6d4;
  
  /* Neutral colors */
  --color-gray-50: #f9fafb;
  --color-gray-100: #f3f4f6;
  --color-gray-500: #6b7280;
  --color-gray-900: #111827;
}
```

### Typography Scale
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
  
  /* Font weights */
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
}
```

### Component Variants
Example with Class Variance Authority (CVA):

```typescript
// app/(common)/components/ui/button.tsx
import { cva, type VariantProps } from 'class-variance-authority'

const buttonVariants = cva(
  // Base styles
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "underline-offset-4 hover:underline text-primary",
      },
      size: {
        default: "h-10 py-2 px-4",
        sm: "h-9 px-3 rounded-md",
        lg: "h-11 px-8 rounded-md",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
```

## State & Loading Patterns

### Loading States

#### 1. Skeleton Screens
For content loading:

```typescript
export function PostSkeleton() {
  return (
    <div className="space-y-3">
      <div className="skeleton h-4 w-[250px]" />
      <div className="skeleton h-4 w-[200px]" />
      <div className="skeleton h-4 w-[300px]" />
    </div>
  )
}

// Usage
{isLoading ? (
  <PostSkeleton />
) : (
  <PostContent post={post} />
)}
```

#### 2. Spinners
For actions and operations:

```typescript
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

// Usage in buttons
<Button disabled={isLoading}>
  {isLoading ? <LoadingSpinner size="sm" /> : 'Submit'}
</Button>
```

#### 3. Progress Bars
For uploads and processing:

```typescript
export function ProgressBar({ progress }: { progress: number }) {
  return (
    <div className="w-full bg-secondary rounded-full h-2">
      <div 
        className="bg-primary h-2 rounded-full transition-all duration-300"
        style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
      />
    </div>
  )
}
```

### Error States
```typescript
// app/(common)/components/ui/error-boundary.tsx
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
            <div className="text-error text-4xl mb-4">⚠️</div>
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

## Animation & Transitions

### Motion Guidelines
- **Purposeful animations**: Only animate to draw attention or show state changes
- **Performance**: Use CSS transforms and opacity for smooth animations
- **Accessibility**: Respect `prefers-reduced-motion`

### Animation Utilities
```css
/* app/(common)/styles/globals.css */
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

### Animated Components
```typescript
// Animated modal
export function Modal({ children, isOpen, onClose }: ModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black/50 fade-in"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-lg shadow-lg scale-in">
        {children}
      </div>
    </div>
  )
}
```

## Form Components

### FormField Pattern
```typescript
// app/(common)/components/ui/form-field.tsx
export function FormField({
  label,
  error,
  description,
  required,
  children,
}: FormFieldProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}
      {children}
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
      {error && (
        <p className="text-xs text-error">{error}</p>
      )}
    </div>
  )
}

// Usage
<FormField
  label="Email Address"
  error={errors.email?.message}
  required
>
  <Input
    {...register('email')}
    placeholder="Enter your email"
    aria-invalid={!!errors.email}
  />
</FormField>
```

### Input Variants
```typescript
const inputVariants = cva(
  "flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "",
        error: "border-error focus-visible:ring-error",
      },
      size: {
        default: "h-10",
        sm: "h-9",
        lg: "h-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)
```

## Tailwind CSS v4 Configuration

### Theme Setup
```css
/* app/(common)/styles/globals.css */
@import "tailwindcss";

@theme {
  /* Color palette */
  --color-primary: #3b82f6;
  --color-secondary: #64748b;
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
  --color-info: #06b6d4;
  
  /* Spacing scale (default Tailwind values) */
  --spacing-0: 0;
  --spacing-1: 0.25rem;
  --spacing-2: 0.5rem;
  --spacing-3: 0.75rem;
  --spacing-4: 1rem;
  --spacing-5: 1.25rem;
  --spacing-6: 1.5rem;
  --spacing-8: 2rem;
  --spacing-10: 2.5rem;
  --spacing-12: 3rem;
  --spacing-16: 4rem;
  
  /* Border radius */
  --radius-sm: 0.125rem;
  --radius-md: 0.375rem;
  --radius-lg: 0.5rem;
  --radius-xl: 0.75rem;
  --radius-full: 9999px;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
}

@layer base {
  /* Global base styles */
  * {
    @apply border-border;
  }
  
  body {
    @apply bg-background text-foreground;
  }
}

@layer components {
  /* Reusable component classes */
  .skeleton {
    @apply animate-pulse rounded-md bg-muted;
  }
  
  .btn-primary {
    @apply bg-primary text-primary-foreground hover:bg-primary/90;
  }
  
  .card {
    @apply rounded-lg border bg-card text-card-foreground shadow-sm;
  }
}

@layer utilities {
  /* Custom utility classes */
  .text-balance {
    text-wrap: balance;
  }
}
```

## Icon System

### Icon Usage
```typescript
// app/(common)/components/icons/index.ts
export { ChevronDown } from './chevron-down'
export { Search } from './search'
export { User } from './user'
export { Settings } from './settings'
export { LogOut } from './log-out'

// Icon component with consistent sizing
interface IconProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function Icon({ size = 'md', className, children }: IconProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  }
  
  return (
    <div className={cn(sizeClasses[size], className)}>
      {children}
    </div>
  )
}
```

## Dark Mode Support

### Theme Provider
```typescript
// app/(common)/components/theme-provider.tsx
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(theme)
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
```

### Dark Mode CSS
```css
/* app/(common)/styles/globals.css */
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 84% 4.9%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 210 40% 98%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 212.7 26.8% 83.9%;
  }
}
