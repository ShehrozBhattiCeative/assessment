# Skill: Add New Page

Use this skill when asked to add a new page to the NexusAI frontend.

## Step-by-Step

### 1. Determine the Route Group
- Public page (no auth needed) → `nexusai-frontend/src/app/(public)/`
- Auth page (login/register) → `nexusai-frontend/src/app/(auth)/`
- Admin page → `nexusai-frontend/src/app/admin/`

### 2. Create the Folder and page.tsx
```
src/app/(public)/new-page/
  page.tsx
```

### 3. Page Template — Server Component (no auth needed, static data)
```tsx
// src/app/(public)/new-page/page.tsx
import PageHeader from '@/components/ui/PageHeader';

export const metadata = {
  title: 'Page Title | NexusAI Hospital',
};

export default function NewPage() {
  return (
    <div className="container">
      <PageHeader title="Page Title" subtitle="Optional subtitle" />
      {/* page content */}
    </div>
  );
}
```

### 4. Page Template — Client Component (needs API data or interactivity)
```tsx
'use client';

import { useState, useEffect } from 'react';
import PageHeader from '@/components/ui/PageHeader';
import { someApi } from '@/lib/api';
import type { SomeType } from '@/types';

export default function NewPage() {
  const [data, setData] = useState<SomeType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    someApi.getAll()
      .then(setData)
      .catch(() => setError('Failed to load'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container">
      <PageHeader title="Page Title" />
      {/* render data */}
    </div>
  );
}
```

### 5. Admin Page Template (requires admin role)
```tsx
'use client';

import { withAuth } from '@/components/layout/withAuth';
import PageHeader from '@/components/ui/PageHeader';

function AdminNewPage() {
  return (
    <div>
      <PageHeader title="Admin Page" />
      {/* admin content */}
    </div>
  );
}

export default withAuth(AdminNewPage, ['admin']);
```

### 6. Add Navigation Link (if needed)
- Public page → `nexusai-frontend/src/components/layout/Navbar.tsx`
- Admin page → `nexusai-frontend/src/components/ui/Sidebar.tsx`

### 7. Verify
```bash
cd nexusai-frontend && npm run build
# Page should appear in the build output
```

## Checklist
- [ ] `'use client'` added if using hooks or event handlers
- [ ] CSS variables used (no hardcoded colors)
- [ ] API calls go through `@/lib/api` client
- [ ] Admin pages wrapped with `withAuth`
- [ ] Page renders in both light and dark theme
- [ ] Build passes after adding page
