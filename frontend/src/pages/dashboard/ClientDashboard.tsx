import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { useAuthStore } from '@/stores/authStore';

const ClientDashboard = () => {
    const { user } = useAuthStore();
    return (
        <div className="space-y-6">
            <header className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-display font-bold">Client Dashboard</h1>
                    <p className="text-gray-400">Welcome back, {user?.firstName}!</p>
                </div>
                <Badge variant="accent">Client</Badge>
            </header>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card variant="glass" className="p-6">
                    <h3 className="text-gray-400 text-sm">Active Challenges</h3>
                    <p className="text-3xl font-bold text-neon-blue">0</p>
                </Card>
                <Card variant="glass" className="p-6">
                    <h3 className="text-gray-400 text-sm">Points Earned</h3>
                    <p className="text-3xl font-bold text-neon-purple">{user?.points || 0}</p>
                </Card>
                 <Card variant="glass" className="p-6">
                    <h3 className="text-gray-400 text-sm">Workouts</h3>
                    <p className="text-3xl font-bold text-neon-cyan">0</p>
                </Card>
            </div>
            
            <div className="mt-8 p-8 border border-white/5 rounded-2xl bg-white/5 text-center">
                <p className="text-gray-400">Join a challenge to get started!</p>
            </div>
        </div>
    );
};

export default ClientDashboard;
