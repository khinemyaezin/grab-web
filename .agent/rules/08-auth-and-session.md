# Authentication, Session & Security Rules

This document defines session state management, authentication flows, and security constraints across the platform.

---

## 1. Architecture Overview

Authentication state is centrally managed by the Shell (`grab-seller`) and exposed to remotes through `SellerPlatform.session`:

```text
Host Shell (AuthContext)
  ↓ Injects SellerPlatform into <PlatformProvider>
Remote MFEs (usePlatform() / useAuth())
```

Remotes access session state via `usePlatform()` or `useAuth()` (provided by `@khinemyaezin/seller-ui`).

---

## 2. Session API (`platform.session`)

```ts
interface SessionApi {
  getSnapshot(): SessionSnapshot;    // Synchronous state reader
  subscribe(listener: () => void): () => void; // State subscription
  refresh(): Promise<void>;          // Coordinated token refresh
  logout(): Promise<void>;           // Session sign-out
}
```

### SessionSnapshot (Discriminated Union)

Session state is strictly typed as a discriminated union:

```ts
type SessionSnapshot =
  | { status: "loading" }
  | { status: "anonymous" }
  | {
      status: "authenticated";
      user: SessionUser;
      roles: string[];
      permissions: string[];
    };
```

Consumers MUST check `snapshot.status === "authenticated"` before accessing user properties or authorization roles.

---

## 3. AuthContext Contract

```ts
type AuthContextValue = {
  snapshot: SessionSnapshot;
  user: SessionUser | null;
  roles: string[];
  permissions: string[];
  isAuthenticated: boolean;
  isLoading: boolean;
  platform: SellerPlatform;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
};
```

- Accessible within the Shell and remotes via `useAuth()`.
- Throws an error if invoked outside of `AuthProvider` / `PlatformProvider`.

---

## 4. Security Constraints

1. **HttpOnly Cookies**:
   - Access and refresh tokens are transmitted strictly via secure `HttpOnly` cookies.
   - Tokens MUST NOT be stored in `localStorage`, `sessionStorage`, or JavaScript-accessible memory.
2. **CSRF Protection**:
   - Requests enforce `SameSite=Lax` cookie policies and CSRF tokens where required.
3. **Coordinated Token Refresh**:
   - The Shell's `RefreshCoordinator` ensures only a single concurrent token rotation occurs, preventing race conditions across simultaneous API calls.
4. **Tab Re-activation**:
   - Revalidate the session snapshot when the browser tab gains focus to promptly detect expired sessions.
