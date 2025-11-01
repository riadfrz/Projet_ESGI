# Frontend Source Directory Structure

This document explains the purpose and usage of each directory and file in the `src` folder.

## 📁 Directory Overview

```
src/
├── api/              # Backend API communication
├── assets/           # Static assets (images, icons, fonts)
├── components/       # Reusable UI components
├── configs/          # Application configurations
├── data/             # Static data files
├── features/         # Feature-based modules
├── hooks/            # Custom React hooks
├── i18n/             # Internationalization
├── lib/              # Third-party library configurations
├── locales/          # Locale files
├── mocks/            # Mock data for development
├── providers/        # React context providers
├── routes/           # Routing configuration
├── services/         # Business logic services
├── stores/           # State management (Zustand)
├── types/            # TypeScript type definitions
├── utils/            # Pure utility functions
├── App.tsx           # Root component
├── main.tsx          # Application entry point
├── index.css         # Global styles
└── vite-env.d.ts     # TypeScript environment declarations
```

---

## 📄 Core Application Files

### `main.tsx`
**Purpose:** Application entry point that initializes React and sets up global providers.

**Usage:**
- Initializes React with `createRoot`
- Sets up providers: `QueryClientProvider`, `BrowserRouter`
- Imports global styles and i18n configuration
- **When to modify:** Only when adding new global providers or initialization logic

**Example:**
```typescript
// Already configured with:
// - QueryClientProvider (React Query)
// - BrowserRouter (React Router)
// - i18n initialization
// - Global CSS
```

---

### `App.tsx`
**Purpose:** Root component that renders the main routing component.

**Usage:**
- Minimal wrapper component
- Renders `AppRoutes` component
- **When to modify:** Rarely - this is usually a simple wrapper

---

### `vite-env.d.ts`
**Purpose:** TypeScript environment declarations for Vite.

**Usage:**
- Provides TypeScript types for `import.meta.env`
- Enables autocomplete for `VITE_*` environment variables
- **When to modify:** Already configured - no changes needed

**Example:**
```typescript
// Allows you to use:
import.meta.env.VITE_API_BASE_URL
```

---

### `index.css`
**Purpose:** Global styles and CSS imports.

**Usage:**
- Base CSS/Tailwind imports
- Global CSS variables
- Reset styles
- **When to modify:** Add global styles or CSS variables here

---

## 📁 `/api` - Backend Communication

**Purpose:** All backend API communication and data fetching logic.

**Contains:**
- `interceptor.ts` - HTTP client configuration and request/response handling
- `*Service.ts` - API service functions (auth, user, dossier, etc.)
- `queries/` - React Query hooks for data fetching
- `websocket/` - WebSocket service

**When to use:**
- ✅ Creating new API endpoints → Add `*Service.ts` file
- ✅ Using data fetching → Import hooks from `queries/`
- ✅ Configuring HTTP client → Modify `interceptor.ts`
- ✅ Adding WebSocket functionality → Use `websocket/websocketService.ts`

**Example:**
```typescript
// Using API service
import { api } from '@/api';
await api.fetchRequest('/api/users', 'GET', null, true);

// Using React Query hooks
import { useUsers } from '@/api/queries/userQueries';
const { data: users, isLoading } = useUsers();
```

**Structure:**
```
api/
├── interceptor.ts           # HTTP client
├── authService.ts           # Authentication API
├── userService.ts           # User API
├── queries/                 # React Query hooks
│   ├── authQueries.ts
│   ├── userQueries.ts
│   └── ...
└── websocket/               # WebSocket services
```

---

## 📁 `/components` - Reusable UI Components

**Purpose:** Reusable UI components organized by category.

**Contains:**
- `ui/` - Base UI components (Button, Input, Modal, Table, etc.)
- `layout/` - Layout components (Header, Sidebar, Footer, Topbar)
- `categories/` - Feature-specific component categories

**When to use:**
- ✅ Creating reusable UI elements → `components/ui/`
- ✅ Layout components → `components/layout/`
- ✅ Feature-specific shared components → `components/[feature]/`
- ✅ Components used across multiple features

**Example:**
```typescript
// Importing UI components
import Button from '@/components/ui/Button/Button';
import Modal from '@/components/ui/Modal/Modal';
import Input from '@/components/ui/Input/Input';

// Importing layout components
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
```

**Available UI Components:**
- Button, Input, SelectInput, MultiSelectInput
- Modal, Card, Badge
- Table, Pagination
- DatePicker, TimePicker
- FileUpload, DebounceInput
- Loader, Tooltip
- And more...

---

## 📁 `/features` - Feature Modules

**Purpose:** Feature-based architecture - complete features with their own components, logic, and styles.

**Contains:**
- `analytics/` - Analytics feature
- `budget/` - Budget management
- `dashboard/` - Dashboard feature
- `transactions/` - Transaction management
- `settigns/` - Settings (note: typo in folder name)
- `Error.tsx` - Error page component

**When to use:**
- ✅ Complete feature with components, logic, and styles → Create in `features/`
- ✅ Self-contained functionality
- ✅ Feature-specific routes and state
- ✅ Feature-specific API calls

**Example Structure:**
```
features/
└── dashboard/
    ├── components/
    │   ├── BudgetChart/
    │   ├── QuickExpenseEntry/
    │   └── RecentTransactions/
    ├── hooks/
    ├── services/
    └── types/
```

**Best Practices:**
- Each feature should be self-contained
- Can have its own components, hooks, services, and types
- Import shared components from `/components/ui`
- Use stores for global state, local state for feature-specific state

---

## 📁 `/stores` - State Management (Zustand)

**Purpose:** Global state management using Zustand.

**Contains:**
- `authStore.ts` - Authentication state (user, tokens, login status)
- `userStore.ts` - User data and profile
- `settingsStore.ts` - Application settings and parameters
- `sidebarStore.ts` - Sidebar state (open/closed, expanded)
- `breadcrumbStore.ts` - Breadcrumb navigation state
- `messagesStore.ts` - Messages/notifications state
- `notificationsStore.ts` - Notification state
- `userPresenceStore.ts` - User presence/online status

**When to use:**
- ✅ Global/shared state across multiple components
- ✅ Authentication state
- ✅ UI state (sidebar, modals)
- ✅ Application settings
- ✅ User data that needs to be accessed globally

**Example:**
```typescript
// Using stores
import { useAuthStore } from '@/stores/authStore';
import { useSettingsStore } from '@/stores/settingsStore';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuthStore();
  const { settings, updateSettings } = useSettingsStore();
  
  // Use store values and methods
}
```

**Creating a new store:**
```typescript
// stores/myStore.ts
import { create } from 'zustand';

interface MyStore {
  value: string;
  setValue: (value: string) => void;
}

export const useMyStore = create<MyStore>((set) => ({
  value: '',
  setValue: (value) => set({ value }),
}));
```

---

## 📁 `/routes` - Routing Configuration

**Purpose:** Application routing and route protection.

**Contains:**
- `AppRoutes.tsx` - Main routing component with layout
- `PrivateRoutes.tsx` - Protected/authenticated routes
- `PublicRoutes.tsx` - Public/unauthenticated routes

**When to use:**
- ✅ Adding new routes → Modify route files
- ✅ Route protection → Use `PrivateRoutes.tsx`
- ✅ Public pages → Use `PublicRoutes.tsx`
- ✅ Route structure → Managed in `AppRoutes.tsx`

**Example:**
```typescript
// In PrivateRoutes.tsx
<Route path="/dashboard" element={<Dashboard />} />
<Route path="/users" element={<Users />} />

// In PublicRoutes.tsx
<Route path="/login" element={<Login />} />
<Route path="/register" element={<Register />} />
```

---

## 📁 `/services` - Business Logic Services

**Purpose:** Business logic and utility services (non-pure functions with side effects).

**Contains:**
- `badgeService.ts` - Badge logic
- `breadcrumbService.ts` - Breadcrumb navigation logic
- `formatRoleService.ts` - Role formatting
- `formattedDateService.ts` - Date formatting
- `notificationIcon.tsx` - Notification icon logic
- `phoneNumberFormatService.ts` - Phone number formatting

**When to use:**
- ✅ Business logic or utility services
- ✅ Reusable formatting/transformation functions
- ✅ Services that may have side effects
- ✅ Functions that don't fit in `/utils` (which should be pure)

**Example:**
```typescript
// Using services
import { formatPhoneNumber } from '@/services/phoneNumberFormatService';
import { formatDate } from '@/services/formattedDateService';

const formatted = formatPhoneNumber('1234567890');
const date = formatDate(new Date());
```

**Difference from `/utils`:**
- `/services` - Can have side effects, business logic
- `/utils` - Pure functions, no side effects

---

## 📁 `/hooks` - Custom React Hooks

**Purpose:** Reusable React hooks.

**Contains:**
- `useBreadcrumb.ts` - Breadcrumb hook
- `useChat.ts` - Chat functionality hook
- `useWebSocket.ts` - WebSocket hook

**When to use:**
- ✅ Reusable React hooks
- ✅ Share logic across multiple components
- ✅ Custom hooks that encapsulate component logic

**Example:**
```typescript
// Using hooks
import { useBreadcrumb } from '@/hooks/useBreadcrumb';
import { useChat } from '@/hooks/useChat';

function MyComponent() {
  const { breadcrumb, setBreadcrumb } = useBreadcrumb();
  const { messages, sendMessage } = useChat();
  
  // Use hook functionality
}
```

**Creating a custom hook:**
```typescript
// hooks/useMyHook.ts
import { useState, useEffect } from 'react';

export function useMyHook() {
  const [value, setValue] = useState('');
  
  useEffect(() => {
    // Hook logic
  }, []);
  
  return { value, setValue };
}
```

---

## 📁 `/types` - TypeScript Type Definitions

**Purpose:** TypeScript interfaces and type definitions.

**Contains:**
- `apiTypes.ts` - API-related types
- `authTypes.ts` - Authentication types
- `userType.ts` - User type definitions
- `index.ts` - Type exports

**When to use:**
- ✅ Define TypeScript interfaces/types
- ✅ API response types
- ✅ Component prop types
- ✅ Shared type definitions

**Example:**
```typescript
// types/userType.ts
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

// Using types
import type { User } from '@/types/userType';
```

---

## 📁 `/utils` - Pure Utility Functions

**Purpose:** Pure utility functions with no side effects.

**Contains:**
- `dateUtils.ts` - Date manipulation utilities

**When to use:**
- ✅ Pure utility functions (no side effects)
- ✅ Date manipulation
- ✅ String formatting
- ✅ Calculations
- ✅ Data transformations

**Example:**
```typescript
// utils/dateUtils.ts
export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

// Using utils
import { formatDate } from '@/utils/dateUtils';
const formatted = formatDate(new Date());
```

**Difference from `/services`:**
- `/utils` - Pure functions, no side effects, simple transformations
- `/services` - Business logic, can have side effects, more complex

---

## 📁 `/lib` - Third-Party Library Configurations

**Purpose:** Setup and configuration for external libraries.

**Contains:**
- `utils.ts` - Usually contains utility functions like `cn()` for className merging

**When to use:**
- ✅ Setup/config for external libraries
- ✅ Wrapper functions for libraries
- ✅ Library-specific utilities

**Example:**
```typescript
// lib/utils.ts (common pattern)
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}
```

---

## 📁 `/i18n` - Internationalization

**Purpose:** Internationalization configuration and translation files.

**Contains:**
- `index.ts` - i18n configuration
- `locales/` - Translation files
  - `en/` - English translations
  - `fr/` - French translations

**When to use:**
- ✅ Adding translations → Modify JSON files in `locales/`
- ✅ Configuring i18n → Modify `index.ts`
- ✅ Using translations in components

**Example:**
```typescript
// Using i18n
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();
  
  return <h1>{t('common.welcome')}</h1>;
}
```

**Translation file structure:**
```json
// locales/en/common.json
{
  "welcome": "Welcome",
  "hello": "Hello"
}
```

---

## 📁 `/providers` - React Context Providers

**Purpose:** Global React Context providers.

**Contains:**
- (Currently empty)

**When to use:**
- ✅ Creating global React Context providers
- ✅ Theme providers
- ✅ Feature-specific providers
- ✅ When you need context but Zustand stores aren't suitable

**Example:**
```typescript
// providers/ThemeProvider.tsx
import { createContext, useContext } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  // Provider logic
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);
```

---

## 📁 `/mocks` - Mock Data

**Purpose:** Mock data for development and testing.

**Contains:**
- Mock JSON files for API responses

**When to use:**
- ✅ Mock API responses during development
- ✅ Testing without backend
- ✅ Development demos
- ✅ Storybook stories

**Example:**
```typescript
// Using mocks
import mockUsers from '@/mocks/users.json';

// In development
const users = isDevelopment ? mockUsers : await fetchUsers();
```

---

## 📁 `/configs` - Configuration Files

**Purpose:** Application-wide configuration files.

**Contains:**
- `queryClient.ts` - React Query client configuration

**When to use:**
- ✅ App-wide configurations
- ✅ Third-party library setups
- ✅ Configuration that needs to be imported

**Example:**
```typescript
// configs/queryClient.ts
import { QueryClient } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export default queryClient;
```

---

## 📁 `/data` - Static Data

**Purpose:** Static data files that don't change.

**Contains:**
- Static JSON/data files

**When to use:**
- ✅ Static data that doesn't change
- ✅ Country codes, categories, enums
- ✅ Reference data

**Example:**
```typescript
// data/countries.json
{
  "US": "United States",
  "FR": "France"
}

// Using static data
import countries from '@/data/countries.json';
```

---

## 📁 `/assets` - Static Assets

**Purpose:** Static files like images, icons, and fonts.

**Contains:**
- Images (`.png`, `.jpg`, `.svg`)
- Icons
- Fonts

**When to use:**
- ✅ Static files (images, SVGs, fonts)
- ✅ Assets imported in components

**Example:**
```typescript
// Using assets
import logo from '@/assets/logo.svg';
import heroImage from '@/assets/hero.png';

<img src={logo} alt="Logo" />
```

---

## 📁 `/locales` - Alternative Locale Files

**Purpose:** Alternative location for locale files (may overlap with `/i18n/locales`).

**When to use:**
- Check if this is a duplicate of `/i18n/locales` or serves a different purpose
- Consolidate if duplicate

---

## 🗺️ Quick Reference: Where to Create Files

| What you're creating | Where to put it |
|---------------------|-----------------|
| **New API endpoint** | `/api` → Create `*Service.ts` and `queries/*Queries.ts` |
| **Reusable UI component** | `/components/ui/` |
| **Layout component** | `/components/layout/` |
| **Complete feature** | `/features/[feature-name]/` |
| **Global state** | `/stores/` → Create `*Store.ts` |
| **Custom React hook** | `/hooks/` → Create `use*.ts` |
| **TypeScript types** | `/types/` → Create `*Types.ts` |
| **Pure utility function** | `/utils/` → Create `*Utils.ts` |
| **Business logic service** | `/services/` → Create `*Service.ts` |
| **New route** | `/routes/` → Modify route files |
| **Translation strings** | `/i18n/locales/[lang]/` |
| **Configuration** | `/configs/` → Create config file |
| **Static data** | `/data/` → Add JSON file |
| **Images/icons** | `/assets/` → Add image file |
| **Mock data** | `/mocks/` → Add JSON file |

---

## 🏗️ Architecture Principles

### 1. **Feature-Based Architecture**
- Complete features live in `/features`
- Each feature is self-contained
- Features can have their own components, hooks, services, and types

### 2. **Separation of Concerns**
- `/api` - Backend communication
- `/components` - UI components
- `/stores` - Global state
- `/services` - Business logic
- `/utils` - Pure utilities

### 3. **Reusability**
- Shared components → `/components/ui/`
- Shared hooks → `/hooks/`
- Shared utilities → `/utils/`
- Shared types → `/types/`

### 4. **State Management**
- Global state → Zustand stores in `/stores`
- Local state → React `useState` in components
- Server state → React Query hooks in `/api/queries`

### 5. **Type Safety**
- All TypeScript types in `/types`
- Import types: `import type { User } from '@/types/userType'`

---

## 📝 Naming Conventions

- **Components:** PascalCase (e.g., `Button.tsx`, `UserProfile.tsx`)
- **Hooks:** camelCase with `use` prefix (e.g., `useAuth.ts`, `useBreadcrumb.ts`)
- **Services:** camelCase with `Service` suffix (e.g., `authService.ts`)
- **Stores:** camelCase with `Store` suffix (e.g., `authStore.ts`)
- **Types:** camelCase with `Type` suffix (e.g., `userType.ts`, `authTypes.ts`)
- **Utils:** camelCase with `Utils` suffix (e.g., `dateUtils.ts`)
- **Configs:** camelCase (e.g., `queryClient.ts`)

---

## 🔗 Import Paths

The project uses path aliases configured in `tsconfig.json`:

- `@/` → `src/` (e.g., `@/components`, `@/api`)
- `@shared/` → `../shared/` (shared types/DTOs with backend)

**Examples:**
```typescript
import Button from '@/components/ui/Button/Button';
import { useAuthStore } from '@/stores/authStore';
import { api } from '@/api';
import type { User } from '@/types/userType';
```

---

## 🚀 Getting Started

1. **Adding a new API endpoint:**
   - Create service in `/api/[name]Service.ts`
   - Create queries in `/api/queries/[name]Queries.ts`
   - Export from `/api/index.ts`

2. **Adding a new feature:**
   - Create folder in `/features/[feature-name]/`
   - Add components, hooks, services as needed
   - Add routes in `/routes/PrivateRoutes.tsx` or `PublicRoutes.tsx`

3. **Adding a new component:**
   - If reusable → `/components/ui/[ComponentName]/`
   - If feature-specific → `/features/[feature]/components/`

4. **Adding global state:**
   - Create store in `/stores/[name]Store.ts`
   - Export hook: `export const use[Name]Store = create(...)`

---

## 📚 Additional Resources

- [React Query Documentation](https://tanstack.com/query/latest)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [React Router Documentation](https://reactrouter.com/)
- [Vite Documentation](https://vitejs.dev/)

---

**Last Updated:** This structure follows modern React best practices with TypeScript, Vite, React Query, and Zustand.

