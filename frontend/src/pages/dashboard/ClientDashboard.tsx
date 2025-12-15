import { Routes, Route } from 'react-router-dom';
import GymListPage from '@/pages/gyms/GymListPage';
import GymDetailsPage from '@/pages/gyms/GymDetailsPage';
import ChallengeListPage from '@/pages/challenges/ChallengeListPage';
import LeaderboardPage from '@/pages/leaderboard/LeaderboardPage';
import TrainingLogPage from '@/pages/training/TrainingLogPage';
import ClientDashboardHome from '@/pages/dashboard/home/ClientDashboardHome';
import StatisticsPage from '@/pages/stats/StatisticsPage';

import ChallengeDetailsPage from '@/pages/challenges/ChallengeDetailsPage';

const ClientDashboard = () => {
    return (
        <Routes>
            <Route index element={<ClientDashboardHome />} />
            <Route path="gyms" element={<GymListPage />} />
            <Route path="gyms/:id" element={<GymDetailsPage />} />
            <Route path="challenges" element={<ChallengeListPage />} />
            <Route path="challenges/:id" element={<ChallengeDetailsPage />} />
            <Route path="leaderboard" element={<LeaderboardPage />} />
            <Route path="workouts" element={<TrainingLogPage />} />
            <Route path="stats" element={<StatisticsPage />} />
        </Routes>
    );
};

export default ClientDashboard;
