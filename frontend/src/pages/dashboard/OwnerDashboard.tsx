import { Routes, Route } from 'react-router-dom';
import OwnerDashboardHome from '@/pages/dashboard/home/OwnerDashboardHome';
import ManageGymPage from '@/pages/gyms/ManageGymPage';
import ManageChallengesPage from '@/pages/challenges/ManageChallengesPage';
import ManageMembersPage from '@/pages/members/ManageMembersPage';

const OwnerDashboard = () => {
    return (
        <Routes>
            <Route index element={<OwnerDashboardHome />} />
            <Route path="gym" element={<ManageGymPage />} />
            <Route path="challenges" element={<ManageChallengesPage />} />
            <Route path="members" element={<ManageMembersPage />} />
        </Routes>
    );
};

export default OwnerDashboard;
