## Problem

Two bugs combine to make the Edit button look broken:

1. **Hydration mismatch in `src/routes/admin.tsx`** — `useState(() => sessionStorage.getItem(...))` returns `false` on the SSR server (no `window`) and `true` on the client. React detects the mismatch, throws (the runtime error you're seeing), and re-renders the whole tree. That's the "PIN panel flashes then closes" you described.

2. **`admin.tsx` never renders `<Outlet/>`** — In the generated route tree, `admin.designer.$lessonId` is a **child** of `admin`. So when you navigate to `/admin/designer/<id>`, TanStack first mounts `AdminPage`, which returns `<AdminPanel/>` — with no `<Outlet/>`, the designer route's component never gets a place to render. You end up looking at the lessons list (or, after the hydration glitch, a flash of the PIN screen) instead of the designer.

The previous "persist unlock in sessionStorage" change fixed the lock-out symptom but introduced bug #1, and bug #2 was always there — it just wasn't visible until you actually tried navigating to a child route.

## Fix (single file: `src/routes/admin.tsx`)

1. **Kill the hydration mismatch.** Initialise `unlocked` to `false`, then read `sessionStorage` inside a `useEffect` after mount. Server and first client render now agree.

2. **Render the child route.** Use `useMatchRoute` (or compare `useLocation().pathname`) to detect when a child route like `/admin/designer/...` is active. When it is, just render `<Outlet/>` (still gated by the PIN check). When at exactly `/admin`, render `<AdminPanel/>` as today.

3. **Avoid an unauthenticated flash on the designer route.** The PIN gate stays in front of `<Outlet/>` too, so refreshing directly on `/admin/designer/<id>` still requires the PIN once per browser session.

Resulting shape (conceptual):

```text
AdminPage
├─ unlocked? no  → <PinEntry/>
└─ unlocked? yes →
     ├─ on child route → <Outlet/>          (renders the Designer)
     └─ on /admin      → <AdminPanel/>      (lessons / data / settings)
```

No other files change. The Designer route itself, the PIN value, the route tree, and the Edit button all stay as they are.

## Verification

- Reload `/admin`, enter PIN `4158` → Lessons tab loads, no console hydration error.
- Click **Edit** on a lesson → URL becomes `/admin/designer/<id>`, the Stage Designer renders (no PIN re-prompt, no flash).
- Refresh while on the Designer → still renders directly (session is already unlocked).
- Open `/admin/designer/<id>` in a fresh tab → PIN gate appears once, then the Designer.