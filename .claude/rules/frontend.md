# Frontend Coding Rules

These rules apply to all files in `nexusai-frontend/src/`.

## MANDATORY — Breaking These Will Break the App

### 1. `'use client'` Directive
Every file that uses any of these MUST have `'use client'` as the very first line:
- React hooks (`useState`, `useEffect`, `useCallback`, `useMemo`, `useRef`)
- Event handlers (`onClick`, `onChange`, `onSubmit`)
- Browser APIs (`localStorage`, `window`, `document`)
- Zustand store (`useAuthStore`)

```tsx
'use client';  // ← Must be line 1, before imports
import { useState } from 'react';
```

### 2. CSS Variables — No Hardcoded Colors
```css
/* WRONG */
color: #2563eb;
background: #ffffff;

/* CORRECT */
color: var(--accent);
background: var(--bg-primary);
```

### 3. Use the API Client
```ts
// WRONG
const res = await fetch('http://localhost:3001/api/doctors');
const res = await axios.get('/api/doctors');

// CORRECT
import { doctorsApi } from '@/lib/api';
const doctors = await doctorsApi.getAll();
```

### 4. Admin Pages Must Use withAuth
```tsx
// WRONG
export default function AdminPage() { ... }

// CORRECT
function AdminPage() { ... }
export default withAuth(AdminPage, ['admin']);
```

## Style Rules

### Spacing
- Use `rem` units for font sizes, `px` for borders/borders-radius
- Spacing multiples: 4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px
- No magic numbers — use CSS variables or named spacing

### Components
- Prefer existing components from `src/components/ui/`
- New components go in `src/components/ui/` if reusable, page folder if page-specific
- Component files: PascalCase (`DoctorCard.tsx`)
- One component per file

### Imports
- Use `@/` alias for `src/` imports (configured in `tsconfig.json`)
- Group: React → external libs → internal (`@/components`, `@/lib`, `@/store`) → types

## TypeScript Rules
- No `any` — use types from `@/types` or `agents/types.ts`
- Props interfaces defined above the component
- Async functions always have `try/catch` with error state

## Naming
- Components: PascalCase (`DoctorCard`)
- Hooks: camelCase starting with `use` (`useAuth`)
- Constants: SCREAMING_SNAKE_CASE (`API_BASE_URL`)
- Regular variables/functions: camelCase
