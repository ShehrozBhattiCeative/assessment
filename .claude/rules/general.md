# General Coding Rules

These rules apply to the entire codebase (frontend + backend).

## TypeScript
- Strict mode is ON — no `any`, no implicit `any`
- Use types from `agents/types.ts` for shared entities
- Prefer interfaces over type aliases for object shapes
- Enums for fixed sets of values (or string unions)

## Code Quality
- Functions do one thing
- Maximum function length: ~40 lines — split if longer
- No deeply nested code — extract to named functions
- No magic numbers — use named constants

## Comments
- Write comments only when the WHY is non-obvious
- No commented-out code — delete it
- No TODO comments without a reason
- No doc-block comments on obvious functions

## Git Conventions
- Commit message format: `type: short description`
  - Types: `feat`, `fix`, `refactor`, `test`, `docs`, `style`, `chore`
  - Example: `feat: add doctor profile page`
- Keep commits focused — one logical change per commit

## No Console Logs
```ts
// WRONG in production code
console.log('debugging...');
console.error('caught error:', err);

// CORRECT — use NestJS Logger in backend
import { Logger } from '@nestjs/common';
this.logger.log('Doctor created');
this.logger.error('Failed to create doctor', err.stack);
```

## No Unused Code
- Remove unused imports (TypeScript will warn)
- Remove unused variables
- Remove dead code paths

## File Naming
| Type | Convention | Example |
|------|-----------|---------|
| React components | PascalCase | `DoctorCard.tsx` |
| Next.js pages | `page.tsx` | `app/(public)/doctors/page.tsx` |
| NestJS files | kebab-case | `doctors.service.ts` |
| Type files | kebab-case | `types/index.ts` |
| Constants | kebab-case | `constants/index.ts` |
| Tests | Same name + `.test` or `.spec` | `Button.test.tsx` |

## Environment Variables
- Never hardcode secrets — use `process.env.VARIABLE_NAME`
- Always provide fallbacks in development:
  ```ts
  const secret = process.env.JWT_SECRET ?? 'dev-fallback-secret';
  ```
- Frontend env vars must be prefixed with `NEXT_PUBLIC_` to be accessible client-side
