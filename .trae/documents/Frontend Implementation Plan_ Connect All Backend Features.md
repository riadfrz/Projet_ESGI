# Frontend Implementation Plan

I have analyzed the backend routes and the existing frontend structure. I will now create a comprehensive plan to connect the frontend to all backend features.

## Backend Coverage Analysis

| Feature | Backend Routes | Frontend Status | Action Required |
| :--- | :--- | :--- | :--- |
| **Auth** | `/auth/*` | ✅ Implemented & Fixed | None |
| **Gyms** | `/gyms/*` | ❌ Missing | Create `GymService`, `GymList`, `GymCreate`, `GymDetails` |
| **Challenges** | `/challenges/*` | ❌ Missing | Create `ChallengeService`, `ChallengeList`, `ChallengeCreate`, `ChallengeDetails` |
| **Exercises** | `/exercises/*` | ❌ Missing | Create `ExerciseService`, `ExerciseList` (Admin), `ExerciseDetails` |
| **Training** | `/training-sessions/*` | ❌ Missing | Create `TrainingService`, `TrainingLog`, `TrainingStats` |
| **Leaderboard** | `/leaderboard/*` | ❌ Missing | Create `LeaderboardService`, `LeaderboardPage` |
| **Profile** | `/users/*` (implied) | ❌ Partial | Enhance `UserProfile` |

## Implementation Steps

### Phase 1: API Layer Setup
Create dedicated service files in `src/api/` for each module to handle API requests cleanly.
1.  `gymService.ts`
2.  `challengeService.ts`
3.  `exerciseService.ts`
4.  `trainingService.ts`
5.  `leaderboardService.ts`

### Phase 2: Core UI Components
Create reusable UI components to display these entities.
1.  `GymCard` & `GymList`
2.  `ChallengeCard` & `ChallengeList`
3.  `ExerciseCard` & `ExerciseList`
4.  `LeaderboardTable`

### Phase 3: Dashboard Integration
Integrate these features into the role-based dashboards.

#### Client Dashboard (`/dashboard/client`)
-   **Home**: Overview of active challenges and recent training.
-   **Find Gyms**: List of gyms.
-   **Challenges**: List of available challenges + "My Challenges".
-   **Training**: Log a new session, view history.
-   **Leaderboard**: View global rankings.

#### Gym Owner Dashboard (`/dashboard/owner`)
-   **My Gym**: Manage gym details.
-   **Create Challenge**: Create challenges for their gym.

#### Admin Dashboard (`/dashboard/admin`)
-   **Manage Exercises**: CRUD exercises.
-   **Manage Gyms**: Approve/Reject gyms.

### Phase 4: Routing
Update `AppRoutes.tsx` to include routes for these new pages.
-   `/dashboard/client/gyms`
-   `/dashboard/client/challenges`
-   `/dashboard/client/training`
-   `/dashboard/client/leaderboard`
-   (And corresponding Owner/Admin routes)

## Execution Order
I will start by creating the API services, then build the Client Dashboard features one by one, as that covers the most ground.
