import { Routes, Route } from 'react-router-dom';
import GymListPage from '@/pages/gyms/GymListPage';
import ChallengeListPage from '@/pages/challenges/ChallengeListPage';
import LeaderboardPage from '@/pages/leaderboard/LeaderboardPage';
import TrainingLogPage from '@/pages/training/TrainingLogPage';
import ClientDashboardHome from '@/pages/dashboard/home/ClientDashboardHome';

const ClientDashboard = () => {
    return (
        <Routes>
            <Route index element={<ClientDashboardHome />} />
            <Route path="gyms" element={<GymListPage />} />
            <Route path="challenges" element={<ChallengeListPage />} />
            <Route path="leaderboard" element={<LeaderboardPage />} />
            <Route path="workouts" element={<TrainingLogPage />} />
        </Routes>
    );
};

export default ClientDashboard;
