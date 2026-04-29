# NexusAI Agentic Workflow

## Flow Overview

```
User Request
     │
     ▼
┌─────────────┐
│   Identify  │  What kind of task is this?
│    Task     │
└──────┬──────┘
       │
       ├── New feature / bug fix ──► Implement ──► Review ──► Test ──► Done
       │
       ├── Review / audit only ────► Specialist Agent ──► Report ──► Done
       │
       └── Multi-part task ─────────► Plan ──► Implement ──► Review ──► Test ──► Done
```

---

## Agent Selection

| Task | Agent |
|------|-------|
| Add/modify API endpoint or NestJS module | `be-developer` |
| Add/modify UI page or component | `fe-developer` |
| Review code before merging | `code-reviewer` |
| Write or run tests | `qa-tester` |
| Audit REST API contracts | `api-reviewer` |
| Security audit | `security-reviewer` |
| Improve UI visuals / spacing / animation | `design-enhancer` |
| Fix accessibility (ARIA, keyboard nav) | `accessibility-reviewer` |
| Optimize bundle / API performance | `performance-reviewer` |
| Update README, HOW_TO_RUN, Swagger docs | `doc-reviewer` |
| Validate types, JSON seed data, DTOs | `schema-reviewer` |

---

## Standard Dev Loop

```
1. Implement   →  be-developer  or  fe-developer
2. Review      →  code-reviewer
3. Test        →  qa-tester
4. Type-check  →  npx tsc --noEmit  (both frontend + backend)
5. Build       →  npm run build  (both frontend + backend)
```

---

## Build Commands

```bash
# Backend
cd nexusai-backend && npm run build

# Frontend
cd nexusai-frontend && npm run build

# Full type-check
cd nexusai-frontend && npx tsc --noEmit
cd nexusai-backend  && npx tsc --noEmit

# All tests
cd nexusai-frontend && npm test -- --watchAll=false
cd nexusai-backend  && npm test
```

---

## Pre-Merge Checklist

- [ ] `npm run build` passes for both frontend and backend
- [ ] All existing tests pass
- [ ] No new TypeScript errors
- [ ] No hardcoded colors (grep `#[0-9a-fA-F]{3,6}` in `.tsx` files)
- [ ] No missing `'use client'` directives
- [ ] No `console.log` statements

---

## Common Errors & Fixes

| Error | Cause | Fix |
|-------|-------|-----|
| `Event handlers cannot be passed to Client Component props` | Missing `'use client'` | Add `'use client'` as first line |
| `Cannot read properties of undefined` | API response shape mismatch | Check `context/api-contracts.md` |
| `Module not found: @/components/...` | Wrong import path | Use `@/` prefix from `src/` |
| `Type error: Property X does not exist` | Using `any` or wrong type | Import correct type from `.claude/context/types.ts` |
| JSON data not loading | File not in `src/data/` | Verify path in service's `dataFile` property |
| `Cannot find module` in backend | New module not registered | Add to `app.module.ts` imports |
