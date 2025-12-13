import { Routes, Route } from 'react-router-dom';
import OwnerDashboardHome from '@/pages/dashboard/home/OwnerDashboardHome';
import ManageGymPage from '@/pages/gyms/ManageGymPage';
import ManageChallengesPage from '@/pages/challenges/ManageChallengesPage';

const OwnerDashboard = () => {
    return (
        <Routes>
            <Route index element={<OwnerDashboardHome />} />
            <Route path="gym" element={<ManageGymPage />} />
            <Route path="challenges" element={<ManageChallengesPage />} />
        </Routes>
    );
};

export default OwnerDashboard;
