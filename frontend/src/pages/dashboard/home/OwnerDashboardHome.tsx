import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { useAuthStore } from '@/stores/authStore';

const OwnerDashboardHome = () => {
    const { user } = useAuthStore();
    return (
        <div className="space-y-6">
            <header className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-display font-bold">Gym Owner Dashboard</h1>
                    <p className="text-gray-400">Manage your gym, {user?.firstName}.</p>
                </div>
                <div className="flex gap-4">
                     <Badge variant="primary">Owner</Badge>
                     <Button size="sm" variant="secondary" href="/dashboard/owner/gym">Edit Gym</Button>
                </div>
            </header>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card variant="glass" className="p-6">
                    <h3 className="text-gray-400 text-sm">My Gym Status</h3>
                    <p className="text-xl font-bold text-yellow-400">Pending</p>
                </Card>
                <Card variant="glass" className="p-6">
                    <h3 className="text-gray-400 text-sm">Active Members</h3>
                    <p className="text-3xl font-bold text-neon-purple">0</p>
                </Card>
                 <Card variant="glass" className="p-6">
                    <h3 className="text-gray-400 text-sm">Challenges Created</h3>
                    <p className="text-3xl font-bold text-neon-blue">0</p>
                </Card>
            </div>
        </div>
    );
};

export default OwnerDashboardHome;
