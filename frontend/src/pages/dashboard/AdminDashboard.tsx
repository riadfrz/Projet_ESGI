import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { useAuthStore } from '@/stores/authStore';

const AdminDashboard = () => {
    const { user } = useAuthStore();
    return (
        <div className="space-y-6">
            <header className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-display font-bold">Admin Dashboard</h1>
                    <p className="text-gray-400">Welcome, {user?.firstName}. System overview.</p>
                </div>
                <Badge variant="danger">Super Admin</Badge>
            </header>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card variant="glass" className="p-6">
                    <h3 className="text-gray-400 text-sm">Pending Gyms</h3>
                    <p className="text-3xl font-bold text-yellow-500">2</p>
                </Card>
                <Card variant="glass" className="p-6">
                    <h3 className="text-gray-400 text-sm">Total Users</h3>
                    <p className="text-3xl font-bold text-neon-purple">150</p>
                </Card>
                 <Card variant="glass" className="p-6">
                    <h3 className="text-gray-400 text-sm">Active Challenges</h3>
                    <p className="text-3xl font-bold text-neon-cyan">8</p>
                </Card>
            </div>
        </div>
    );
};

export default AdminDashboard;
