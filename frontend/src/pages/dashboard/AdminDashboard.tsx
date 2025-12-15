import { Routes, Route } from 'react-router-dom';
import AdminDashboardHome from '@/pages/dashboard/home/AdminDashboardHome';
import ManageGymsAdminPage from '@/pages/gyms/ManageGymsAdminPage';
import ManageExercisesPage from '@/pages/exercises/ManageExercisesPage';
import ManageUsersPage from '@/pages/users/ManageUsersPage';
import ManageBadgesPage from '@/pages/admin/ManageBadgesPage';
import ManageMusclesPage from '@/pages/admin/ManageMusclesPage';

const AdminDashboard = () => {
    return (
        <Routes>
            <Route index element={<AdminDashboardHome />} />
            <Route path="gyms" element={<ManageGymsAdminPage />} />
            <Route path="exercises" element={<ManageExercisesPage />} />
            <Route path="users" element={<ManageUsersPage />} />
            <Route path="badges" element={<ManageBadgesPage />} />
            <Route path="muscles" element={<ManageMusclesPage />} />
        </Routes>
    );
};

export default AdminDashboard;
