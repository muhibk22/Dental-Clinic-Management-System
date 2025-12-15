# DCMS - Dental Clinic Management System

Monorepo for a full-stack dental clinic management system using Turborepo.

## Structure

```
dcms/
├── apps/
│   ├── api/          # NestJS backend (port 4000)
│   └── web/          # Next.js frontend (port 3000)
└── packages/
    └── shared/       # Shared TypeScript types
```

## Setup

```bash
# Install dependencies
npm install

# Build shared package
npm run build --workspace=@dcms/shared
```

## Development

```bash
# Run all apps in dev mode
npm run dev

# Run specific app
npm run dev --workspace=api
npm run dev --workspace=web
```

## Build

```bash
# Build all
npm run build

# Build specific workspace
npm run build --workspace=@dcms/shared
npm run build --workspace=api
npm run build --workspace=web
```

## Testing

```bash
# Run tests in API
npm run test --workspace=api

# Run E2E tests
npm run test:e2e --workspace=api
```

## Tech Stack

- **Backend**: NestJS, TypeScript
- **Frontend**: Next.js 14, React 19, TypeScript, Tailwind CSS
- **Shared**: TypeScript
- **Build**: Turborepo, NPM Workspaces
