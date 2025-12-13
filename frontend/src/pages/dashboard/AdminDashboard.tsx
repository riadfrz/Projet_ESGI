import { Routes, Route } from 'react-router-dom';
import AdminDashboardHome from '@/pages/dashboard/home/AdminDashboardHome';
import ManageGymsAdminPage from '@/pages/gyms/ManageGymsAdminPage';
import ManageExercisesPage from '@/pages/exercises/ManageExercisesPage';

const AdminDashboard = () => {
    return (
        <Routes>
            <Route index element={<AdminDashboardHome />} />
            <Route path="gyms" element={<ManageGymsAdminPage />} />
            <Route path="exercises" element={<ManageExercisesPage />} />
        </Routes>
    );
};

export default AdminDashboard;
