# Features

This directory contains self-contained features following the AI agent-first architecture pattern.

## Feature Structure

Each feature directory should follow this structure:

```
feature_name/
├── components/     # React components specific to this feature
├── pages/         # Next.js pages/routes for this feature
├── actions/       # Server Actions for this feature
├── hooks/         # Custom hooks specific to this feature
├── constants/     # Constants and configuration for this feature
└── types/         # TypeScript types specific to this feature
```

## Guidelines

- Each feature should be self-contained
- Use relative imports within the feature
- Import shared utilities and components from the `common` directory
- Keep feature-specific logic within the feature boundary
- Export clean public APIs from index files when needed