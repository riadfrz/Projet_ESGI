# Frontend Architecture Guide

## Table of Contents
1. [API Layer](#api-layer)
2. [React Query Hooks](#react-query-hooks)
3. [Route Protection](#route-protection)
4. [Public vs Private Routes](#public-vs-private-routes)
5. [Complete Routing Examples](#complete-routing-examples)

---

## API Layer

The API layer is organized into **Services** and **Queries** following a clean separation of concerns.

### Structure

```
frontend/src/api/
├── interceptor.ts          # HTTP client with auth headers
├── authServices.ts         # Auth-specific API methods
└── queries/
    ├── authQueries.ts      # React Query hooks for auth
    └── index.ts
```

### 1. Interceptor (`api/interceptor.ts`)

The **Interceptor** is a singleton class that handles all HTTP requests with automatic:
- Base URL configuration
- Authentication header injection
- JSON/FormData handling
- Error handling
- Response parsing

#### Key Features

```typescript
import { api } from '@/api/interceptor';

// Automatically adds Authorization header if includeAuth = true
api.fetchRequest(endpoint, method, body, includeAuth);

// Example
const response = await api.fetchRequest('/api/users', 'GET', null, true);
```

#### Methods

| Method | Description | Parameters |
|--------|-------------|------------|
| `fetchRequest()` | Standard JSON request | `endpoint, method, body?, includeAuth?` |
| `fetchMultipartRequest()` | FormData/file upload | `endpoint, method, body, includeAuth?` |
| `getUrl()` | Get base API URL | - |

#### Configuration

```typescript
// Uses environment variable
VITE_API_BASE_URL=http://localhost:3000
```

### 2. Service Classes (`api/authServices.ts`)

Services are **class-based** and contain pure API method calls. They **do not** handle React state or side effects.

#### AuthService Structure

```typescript
class AuthService {
    // Each method returns a Promise with typed response
    public async devLogin(email, role?, firstName?, lastName?): Promise<ApiResponse<UserDto>>
    public async getCurrentUser(): Promise<ApiResponse<UserDto> | null>
    public async getSessions(): Promise<ApiResponse<SessionResponseDto[]>>
    public async logout(): Promise<ApiResponse<void>>
    public async deleteSession(sessionId: string): Promise<ApiResponse<void>>
    public initiateGoogleLogin(): void // Redirects to OAuth
}

// Export singleton instance
export const authService = new AuthService();
```

#### When to Use Services Directly

**❌ Don't use in components:**
```typescript
// BAD - No caching, no loading states, no error handling
const response = await authService.getCurrentUser();
```

**✅ Use through React Query hooks:**
```typescript
// GOOD - Automatic caching, loading, error handling
const { data: user, isLoading } = useCurrentUser();
```

**✅ Exception - Use directly for:**
- One-off actions that don't need caching
- Non-React contexts (middleware, utilities)
- Testing

---

## React Query Hooks

React Query hooks wrap service methods and provide:
- ✅ Automatic caching
- ✅ Loading states
- ✅ Error handling
- ✅ Refetching logic
- ✅ Optimistic updates

### Structure

```
frontend/src/api/queries/
├── authQueries.ts       # Auth-related hooks
└── index.ts             # Exports
```

### Hook Types

#### 1. **Mutations** (Create, Update, Delete)

Used for operations that **change** data on the server.

```typescript
const { mutate, isPending, isError, error } = useMutation({
    mutationFn: async (data) => {
        // API call
    },
    onSuccess: (data) => {
        // Handle success
    },
    onError: (error) => {
        // Handle error
    }
});
```

#### 2. **Queries** (Read)

Used for operations that **fetch** data from the server.

```typescript
const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['uniqueKey'],
    queryFn: async () => {
        // API call
    },
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
});
```

### Available Auth Hooks

#### `useDevLogin()` - Mutation

Development-only login for testing.

```typescript
import { useDevLogin } from '@/api/queries';

function LoginButton() {
    const { mutate: devLogin, isPending } = useDevLogin();
    
    const handleLogin = () => {
        devLogin({
            email: 'admin@test.com',
            role: 'ADMIN',
            firstName: 'Admin',
            lastName: 'User'
        }, {
            onSuccess: (user) => {
                console.log('Logged in:', user.email);
            }
        });
    };
    
    return (
        <button onClick={handleLogin} disabled={isPending}>
            {isPending ? 'Logging in...' : 'Login'}
        </button>
    );
}
```

#### `useAutoLogin()` - Query

Automatically checks for existing session on app load.

```typescript
import { useAutoLogin } from '@/api/queries';

function App() {
    const { data: isLoggedIn, isLoading } = useAutoLogin();
    
    if (isLoading) return <div>Loading...</div>;
    
    return (
        <div>
            {isLoggedIn ? <Dashboard /> : <Login />}
        </div>
    );
}
```

**⚠️ Important:** Call this **ONCE** in your root `<AuthLayout>` component.

#### `useCurrentUser()` - Query

Fetches current authenticated user data.

```typescript
import { useCurrentUser } from '@/api/queries';

function UserProfile() {
    const { data: user, isLoading, error } = useCurrentUser();
    
    if (isLoading) return <div>Loading user...</div>;
    if (error) return <div>Error: {error.message}</div>;
    if (!user) return <div>Not logged in</div>;
    
    return <div>Welcome, {user.firstName}!</div>;
}
```

#### `useLogout()` - Mutation

Logs out the current user.

```typescript
import { useLogout } from '@/api/queries';
import { useNavigate } from 'react-router-dom';

function LogoutButton() {
    const { mutate: logout, isPending } = useLogout();
    const navigate = useNavigate();
    
    const handleLogout = () => {
        logout(undefined, {
            onSuccess: () => {
                navigate('/login');
            }
        });
    };
    
    return (
        <button onClick={handleLogout} disabled={isPending}>
            Logout
        </button>
    );
}
```

#### `useUserSessions()` - Query

Fetches all active sessions for the current user.

```typescript
import { useUserSessions } from '@/api/queries';

function SessionsList() {
    const { data: sessions, isLoading } = useUserSessions();
    
    if (isLoading) return <div>Loading sessions...</div>;
    
    return (
        <div>
            {sessions?.map(session => (
                <div key={session.id}>
                    {session.authProvider} - Expires: {session.expiresAt}
                </div>
            ))}
        </div>
    );
}
```

#### `useDeleteSession(sessionId)` - Mutation

Deletes a specific session.

```typescript
import { useDeleteSession } from '@/api/queries';

function SessionItem({ session }) {
    const { mutate: deleteSession, isPending } = useDeleteSession();
    
    return (
        <div>
            <span>{session.authProvider}</span>
            <button 
                onClick={() => deleteSession(session.id)}
                disabled={isPending}
            >
                Delete
            </button>
        </div>
    );
}
```

#### `useGoogleLogin()` - Mutation

Initiates Google OAuth login (redirects to Google).

```typescript
import { useGoogleLogin } from '@/api/queries';

function GoogleLoginButton() {
    const { mutate: loginWithGoogle } = useGoogleLogin();
    
    return (
        <button onClick={() => loginWithGoogle()}>
            Login with Google
        </button>
    );
}
```

### Best Practices for Queries

1. **Use descriptive query keys**
   ```typescript
   queryKey: ['user', userId]  // ✅ Good
   queryKey: ['data']          // ❌ Bad
   ```

2. **Handle all states**
   ```typescript
   if (isLoading) return <Spinner />;
   if (isError) return <Error message={error.message} />;
   if (!data) return <NoData />;
   return <Component data={data} />;
   ```

3. **Use callbacks for side effects**
   ```typescript
   mutate(data, {
       onSuccess: () => { /* show toast */ },
       onError: (error) => { /* show error */ }
   });
   ```

4. **Invalidate queries after mutations**
   ```typescript
   import { useQueryClient } from '@tanstack/react-query';
   
   const queryClient = useQueryClient();
   
   mutate(data, {
       onSuccess: () => {
           queryClient.invalidateQueries({ queryKey: ['users'] });
       }
   });
   ```

---

## Route Protection

Route protection ensures that only authenticated and authorized users can access certain pages.

### Components

#### 1. **`<ProtectedRoute />`** - Route-Level Protection

Wraps routes in React Router to require authentication.

```typescript
import { ProtectedRoute } from '@/components/auth';
import { UserRole } from '@shared/enums';

// Basic protection - any authenticated user
<Route element={<ProtectedRoute />}>
    <Route path="/dashboard" element={<Dashboard />} />
</Route>

// Role-based protection - specific roles only
<Route element={<ProtectedRoute allowedRoles={[UserRole.ADMIN]} />}>
    <Route path="/admin" element={<AdminPanel />} />
</Route>

// Multiple roles allowed
<Route element={<ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.GYM_OWNER]} />}>
    <Route path="/management" element={<ManagementPanel />} />
</Route>

// Custom redirect
<Route element={<ProtectedRoute redirectTo="/unauthorized" />}>
    <Route path="/profile" element={<Profile />} />
</Route>
```

**How it works:**
1. Checks if user is authenticated (`useAuthStore`)
2. If not → Redirects to `/login` (or custom `redirectTo`)
3. If yes → Checks if user has required role (if `allowedRoles` specified)
4. If role matches → Renders child routes (`<Outlet />`)
5. If role doesn't match → Redirects to `/unauthorized`

#### 2. **`<RoleGuard />`** - Component-Level Protection

Conditionally renders components based on user role.

```typescript
import { RoleGuard } from '@/components/auth';
import { UserRole } from '@shared/enums';

// Show admin panel only to admins
<RoleGuard allowedRoles={[UserRole.ADMIN]}>
    <AdminPanel />
</RoleGuard>

// Show different content for non-admins
<RoleGuard 
    allowedRoles={[UserRole.ADMIN]} 
    fallback={<p>You need admin access</p>}
>
    <AdminPanel />
</RoleGuard>

// Multiple roles
<RoleGuard allowedRoles={[UserRole.ADMIN, UserRole.GYM_OWNER]}>
    <ManagementTools />
</RoleGuard>
```

**Use Cases:**
- Hiding/showing UI elements based on role
- Rendering different content for different roles
- Feature flags based on permissions

#### 3. **Role Check Hooks** - Programmatic Checks

Use in component logic for conditional behavior.

```typescript
import { useIsAdmin, useIsGymOwner, useIsClient, useHasRole } from '@/hooks/useRoles';
import { UserRole } from '@shared/enums';

function Dashboard() {
    const isAdmin = useIsAdmin();
    const isGymOwner = useIsGymOwner();
    const isClient = useIsClient();
    const canManage = useHasRole([UserRole.ADMIN, UserRole.GYM_OWNER]);
    
    return (
        <div>
            {isAdmin && <AdminStats />}
            {isGymOwner && <GymStats />}
            {isClient && <ClientStats />}
            {canManage && <ManagementButton />}
        </div>
    );
}
```

**Available Hooks:**
- `useIsAdmin()` → Returns `boolean`
- `useIsGymOwner()` → Returns `boolean`
- `useIsClient()` → Returns `boolean`
- `useHasRole([roles])` → Returns `boolean`

### Comparison: When to Use Each

| Scenario | Use |
|----------|-----|
| Protect entire route | `<ProtectedRoute />` |
| Hide UI element | `<RoleGuard>` or hooks |
| Conditional logic | Hooks (`useIsAdmin`, etc.) |
| Navigation guard | `<ProtectedRoute />` |
| Button visibility | `<RoleGuard>` or hooks |
| Multiple conditions | Hooks (`useHasRole`) |

---

## Public vs Private Routes

### Route Types

#### **Public Routes** 
Routes that **anyone** can access (authenticated or not).

Examples:
- Landing page
- Login page
- About page
- Contact page
- Terms of Service

#### **Private Routes**
Routes that require **authentication**.

Examples:
- Dashboard
- Profile
- Settings
- User-specific content

#### **Role-Protected Routes**
Private routes that also require **specific roles**.

Examples:
- Admin panel (ADMIN only)
- Gym management (GYM_OWNER only)
- Management tools (ADMIN + GYM_OWNER)

### User Roles

```typescript
// From shared/enums/userEnum.ts
export enum UserRole {
    CLIENT = 'CLIENT',           // Regular user
    GYM_OWNER = 'GYM_OWNER',     // Gym owner/manager
    ADMIN = 'ADMIN',             // System administrator
}
```

---

## Complete Routing Examples

### Example 1: Basic Setup

```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthLayout, LoginPage, ProtectedRoute } from '@/components/auth';

const queryClient = new QueryClient();

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <Routes>
                    {/* AuthLayout handles auto-login */}
                    <Route element={<AuthLayout />}>
                        {/* PUBLIC ROUTES */}
                        <Route path="/" element={<HomePage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/about" element={<AboutPage />} />
                        
                        {/* PRIVATE ROUTES - Require authentication */}
                        <Route element={<ProtectedRoute />}>
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/profile" element={<Profile />} />
                        </Route>
                    </Route>
                </Routes>
            </BrowserRouter>
        </QueryClientProvider>
    );
}
```

### Example 2: With Role-Based Routes

```typescript
import { UserRole } from '@shared/enums';

<Routes>
    <Route element={<AuthLayout />}>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        
        {/* PRIVATE ROUTES - Any authenticated user */}
        <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/challenges" element={<Challenges />} />
        </Route>
        
        {/* ADMIN ONLY */}
        <Route element={<ProtectedRoute allowedRoles={[UserRole.ADMIN]} />}>
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/admin/users" element={<UserManagement />} />
            <Route path="/admin/badges" element={<BadgeManagement />} />
        </Route>
        
        {/* GYM OWNER ONLY */}
        <Route element={<ProtectedRoute allowedRoles={[UserRole.GYM_OWNER]} />}>
            <Route path="/gym" element={<GymDashboard />} />
            <Route path="/gym/equipment" element={<EquipmentManagement />} />
        </Route>
        
        {/* ADMIN OR GYM OWNER */}
        <Route element={<ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.GYM_OWNER]} />}>
            <Route path="/management" element={<ManagementPanel />} />
        </Route>
        
        {/* ERROR PAGES */}
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<NotFound />} />
    </Route>
</Routes>
```

### Example 3: With Nested Layouts

```typescript
// Layout with navigation for authenticated users
function AppLayout() {
    return (
        <div>
            <Navbar />
            <Sidebar />
            <main>
                <Outlet /> {/* Child routes render here */}
            </main>
        </div>
    );
}

// Routes with nested layouts
<Routes>
    <Route element={<AuthLayout />}>
        {/* PUBLIC - No layout */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        
        {/* PRIVATE - With AppLayout */}
        <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/challenges" element={<Challenges />} />
            </Route>
        </Route>
        
        {/* ADMIN - With AdminLayout */}
        <Route element={<ProtectedRoute allowedRoles={[UserRole.ADMIN]} />}>
            <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="users" element={<UserManagement />} />
                <Route path="badges" element={<BadgeManagement />} />
            </Route>
        </Route>
    </Route>
</Routes>
```

### Example 4: With Conditional Redirects

```typescript
import { useAuthStore } from '@/stores';
import { Navigate } from 'react-router-dom';

function LoginPage() {
    const isAuthenticated = useAuthStore(state => state.isAuthenticated);
    
    // Redirect to dashboard if already logged in
    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }
    
    return <LoginForm />;
}

function HomePage() {
    const { isAuthenticated, user } = useAuthStore();
    
    // Redirect based on role
    if (isAuthenticated && user) {
        if (user.role === UserRole.ADMIN) {
            return <Navigate to="/admin" replace />;
        }
        if (user.role === UserRole.GYM_OWNER) {
            return <Navigate to="/gym" replace />;
        }
        return <Navigate to="/dashboard" replace />;
    }
    
    return <LandingPage />;
}
```

### Example 5: Complete Real-World Setup

```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthLayout, LoginPage, ProtectedRoute } from '@/components/auth';
import { UserRole } from '@shared/enums';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1,
            refetchOnWindowFocus: false,
            staleTime: 5 * 60 * 1000,
        },
    },
});

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <Routes>
                    <Route element={<AuthLayout />}>
                        {/* ============================================ */}
                        {/* PUBLIC ROUTES                                */}
                        {/* ============================================ */}
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/about" element={<AboutPage />} />
                        <Route path="/contact" element={<ContactPage />} />
                        <Route path="/pricing" element={<PricingPage />} />
                        
                        {/* ============================================ */}
                        {/* PRIVATE ROUTES - All Authenticated Users    */}
                        {/* ============================================ */}
                        <Route element={<ProtectedRoute />}>
                            <Route element={<AppLayout />}>
                                <Route path="/dashboard" element={<Dashboard />} />
                                <Route path="/profile" element={<Profile />} />
                                <Route path="/settings" element={<Settings />} />
                                
                                {/* Challenges */}
                                <Route path="/challenges" element={<ChallengesList />} />
                                <Route path="/challenges/:id" element={<ChallengeDetail />} />
                                
                                {/* Training */}
                                <Route path="/training" element={<TrainingHistory />} />
                                <Route path="/training/new" element={<NewTraining />} />
                                
                                {/* Leaderboard */}
                                <Route path="/leaderboard" element={<Leaderboard />} />
                                
                                {/* Badges */}
                                <Route path="/badges" element={<MyBadges />} />
                            </Route>
                        </Route>
                        
                        {/* ============================================ */}
                        {/* ADMIN ROUTES - Admin Only                    */}
                        {/* ============================================ */}
                        <Route element={<ProtectedRoute allowedRoles={[UserRole.ADMIN]} />}>
                            <Route path="/admin" element={<AdminLayout />}>
                                <Route index element={<AdminDashboard />} />
                                <Route path="users" element={<UserManagement />} />
                                <Route path="users/:id" element={<UserDetail />} />
                                <Route path="badges" element={<BadgeManagement />} />
                                <Route path="badges/new" element={<CreateBadge />} />
                                <Route path="gyms" element={<GymManagement />} />
                                <Route path="exercises" element={<ExerciseManagement />} />
                            </Route>
                        </Route>
                        
                        {/* ============================================ */}
                        {/* GYM OWNER ROUTES - Gym Owners Only          */}
                        {/* ============================================ */}
                        <Route element={<ProtectedRoute allowedRoles={[UserRole.GYM_OWNER]} />}>
                            <Route path="/gym" element={<GymLayout />}>
                                <Route index element={<GymDashboard />} />
                                <Route path="info" element={<GymInfo />} />
                                <Route path="equipment" element={<EquipmentList />} />
                                <Route path="equipment/new" element={<AddEquipment />} />
                                <Route path="members" element={<GymMembers />} />
                            </Route>
                        </Route>
                        
                        {/* ============================================ */}
                        {/* MANAGEMENT - Admin OR Gym Owner             */}
                        {/* ============================================ */}
                        <Route 
                            element={
                                <ProtectedRoute 
                                    allowedRoles={[UserRole.ADMIN, UserRole.GYM_OWNER]} 
                                />
                            }
                        >
                            <Route path="/management" element={<ManagementLayout />}>
                                <Route index element={<ManagementDashboard />} />
                                <Route path="reports" element={<Reports />} />
                                <Route path="analytics" element={<Analytics />} />
                            </Route>
                        </Route>
                        
                        {/* ============================================ */}
                        {/* ERROR PAGES                                  */}
                        {/* ============================================ */}
                        <Route path="/unauthorized" element={<UnauthorizedPage />} />
                        <Route path="/404" element={<NotFoundPage />} />
                        <Route path="*" element={<Navigate to="/404" replace />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </QueryClientProvider>
    );
}

export default App;
```

---

## Visual Route Structure

```
┌─────────────────────────────────────────────────┐
│ <AuthLayout /> (Auto-login wrapper)             │
├─────────────────────────────────────────────────┤
│                                                  │
│ PUBLIC ROUTES (No auth required)                │
│ ├─ / (Home)                                     │
│ ├─ /login                                       │
│ ├─ /about                                       │
│ └─ /contact                                     │
│                                                  │
├─────────────────────────────────────────────────┤
│                                                  │
│ PRIVATE ROUTES (Auth required)                  │
│ └─ <ProtectedRoute />                          │
│    ├─ /dashboard                                │
│    ├─ /profile                                  │
│    ├─ /challenges                               │
│    └─ /training                                 │
│                                                  │
├─────────────────────────────────────────────────┤
│                                                  │
│ ADMIN ROUTES (Admin role required)              │
│ └─ <ProtectedRoute allowedRoles={[ADMIN]} />  │
│    ├─ /admin                                    │
│    ├─ /admin/users                              │
│    └─ /admin/badges                             │
│                                                  │
├─────────────────────────────────────────────────┤
│                                                  │
│ GYM OWNER ROUTES (Gym owner role required)      │
│ └─ <ProtectedRoute allowedRoles={[GYM_OWNER]}/>│
│    ├─ /gym                                      │
│    ├─ /gym/equipment                            │
│    └─ /gym/members                              │
│                                                  │
├─────────────────────────────────────────────────┤
│                                                  │
│ MANAGEMENT (Admin OR Gym owner)                 │
│ └─ <ProtectedRoute allowedRoles={[ADMIN,       │
│                     GYM_OWNER]} />              │
│    ├─ /management                               │
│    └─ /management/reports                       │
│                                                  │
└─────────────────────────────────────────────────┘
```

---

## Authentication Flow Diagram

```
┌─────────────┐
│  App Start  │
└──────┬──────┘
       │
       v
┌──────────────────┐
│  <AuthLayout />  │
│  useAutoLogin()  │
└──────┬───────────┘
       │
       v
┌────────────────────────┐
│ Check HTTP-only cookie │
└──────┬─────────────────┘
       │
       ├─── Session Valid ────────┐
       │                          v
       │                   ┌─────────────────┐
       │                   │ Fetch User Data │
       │                   └────────┬────────┘
       │                            │
       │                            v
       │                   ┌─────────────────┐
       │                   │ Update Store    │
       │                   │ isAuthenticated │
       │                   │ = true          │
       │                   └────────┬────────┘
       │                            │
       │                            v
       │                   ┌─────────────────┐
       │                   │ Render Routes   │
       │                   └─────────────────┘
       │
       └─── Session Invalid ───────┐
                                   v
                          ┌─────────────────┐
                          │ Clear Store     │
                          │ isAuthenticated │
                          │ = false         │
                          └────────┬────────┘
                                   │
                                   v
                          ┌─────────────────┐
                          │ Redirect to     │
                          │ /login          │
                          └─────────────────┘
```

---

## Quick Reference

### Route Protection Patterns

```typescript
// 1. Any authenticated user
<Route element={<ProtectedRoute />}>
    <Route path="/dashboard" element={<Dashboard />} />
</Route>

// 2. Specific role
<Route element={<ProtectedRoute allowedRoles={[UserRole.ADMIN]} />}>
    <Route path="/admin" element={<AdminPanel />} />
</Route>

// 3. Multiple roles
<Route element={<ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.GYM_OWNER]} />}>
    <Route path="/management" element={<Management />} />
</Route>

// 4. Custom redirect
<Route element={<ProtectedRoute redirectTo="/no-access" />}>
    <Route path="/premium" element={<Premium />} />
</Route>
```

### Component Protection Patterns

```typescript
// 1. Hide component
<RoleGuard allowedRoles={[UserRole.ADMIN]}>
    <AdminButton />
</RoleGuard>

// 2. Show fallback
<RoleGuard allowedRoles={[UserRole.ADMIN]} fallback={<p>Access Denied</p>}>
    <AdminPanel />
</RoleGuard>

// 3. Use hook
const isAdmin = useIsAdmin();
{isAdmin && <AdminPanel />}
```

### Query Hook Patterns

```typescript
// 1. Simple fetch
const { data, isLoading } = useCurrentUser();

// 2. Mutation with callbacks
const { mutate, isPending } = useLogout();
mutate(undefined, {
    onSuccess: () => navigate('/login'),
    onError: (error) => toast.error(error.message)
});

// 3. Manual refetch
const { data, refetch } = useUserSessions();
<button onClick={() => refetch()}>Refresh</button>
```

---

## Summary

✅ **API Layer**: Interceptor + Services for all HTTP calls  
✅ **Queries**: React Query hooks for data fetching with caching  
✅ **Route Guards**: `<ProtectedRoute>` for route-level protection  
✅ **Component Guards**: `<RoleGuard>` for component-level protection  
✅ **Role Hooks**: `useIsAdmin()`, `useIsGymOwner()`, etc.  
✅ **Public Routes**: Open to everyone  
✅ **Private Routes**: Require authentication  
✅ **Role-Protected Routes**: Require specific roles  

**Your routing system is production-ready! 🚀**
