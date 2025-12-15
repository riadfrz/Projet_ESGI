import { useEffect, useState } from 'react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { useAuthStore } from '@/stores/authStore';
import { trainingService } from '@/api/trainingService';
import { challengeService } from '@/api/challengeService';
import { TrainingStatsDto, ChallengeDto } from '@shared/dto';

const ClientDashboardHome = () => {
    const { user } = useAuthStore();
    const [stats, setStats] = useState<TrainingStatsDto | null>(null);
    const [myChallenges, setMyChallenges] = useState<ChallengeDto[]>([]);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [statsRes, challengesRes] = await Promise.all([
                    trainingService.getStats(),
                    challengeService.getMyChallenges()
                ]);
                
                if (statsRes.data) setStats(statsRes.data);
                if (challengesRes.data) setMyChallenges(challengesRes.data);
            } catch (error) {
                console.error('Failed to load dashboard data', error);
            }
        };
        loadData();
    }, []);

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
                    <p className="text-3xl font-bold text-neon-blue">{myChallenges.length}</p>
                </Card>
                <Card variant="glass" className="p-6">
                    <h3 className="text-gray-400 text-sm">Points Earned</h3>
                    <p className="text-3xl font-bold text-neon-purple">{user?.points || 0}</p>
                </Card>
                 <Card variant="glass" className="p-6">
                    <h3 className="text-gray-400 text-sm">Workouts</h3>
                    <p className="text-3xl font-bold text-neon-cyan">{stats?.totalSessions || 0}</p>
                </Card>
            </div>
            
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                 <Card className="p-6">
                    <h3 className="text-xl font-bold mb-4">My Challenges</h3>
                    {myChallenges.length > 0 ? (
                        <ul className="space-y-3">
                            {myChallenges.map(c => (
                                <li key={c.id} className="bg-white/5 p-3 rounded-lg flex justify-between items-center">
                                    <span>{c.title}</span>
                                    <Badge size="sm">{c.status}</Badge>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-400">No active challenges. Join one!</p>
                    )}
                 </Card>

                 <Card className="p-6">
                    <h3 className="text-xl font-bold mb-4">Recent Activity</h3>
                    {stats?.recentSessions && stats.recentSessions.length > 0 ? (
                        <ul className="space-y-3">
                            {stats.recentSessions.map(s => (
                                <li key={s.id} className="bg-white/5 p-3 rounded-lg">
                                    <div className="flex justify-between">
                                        <span className="font-medium">{s.exercise.name}</span>
                                        <span className="text-gray-400 text-sm">{new Date(s.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <div className="text-sm text-gray-500 mt-1">
                                        {s.duration} mins • {s.caloriesBurned} kcal
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-400">No recent activity recorded.</p>
                    )}
                 </Card>
            </div>
        </div>
    );
};

export default ClientDashboardHome;
