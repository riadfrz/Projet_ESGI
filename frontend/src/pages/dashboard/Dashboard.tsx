import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

import { useAuthStore } from '@/stores/authStore';

const Dashboard = () => {
    const { user } = useAuthStore();

    return (
        <div className="min-h-screen bg-dark-bg text-white">
            <Navbar />
            <Sidebar />
            
            <main className="ml-0 md:ml-64 pt-20 p-6">
                <div className="max-w-7xl mx-auto">
                    <header className="mb-8 flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-display font-bold">Dashboard</h1>
                            <p className="text-gray-400">Welcome back, {user?.firstName || 'Athlete'}.</p>
                        </div>
                        <div className="flex gap-2">
                             <Badge variant="accent">Week 4</Badge>
                             <Badge variant="primary">Level 5</Badge>
                        </div>
                    </header>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <Card variant="glass" hoverEffect>
                            <div className="text-gray-400 text-sm mb-1">Active Challenges</div>
                            <div className="text-3xl font-bold text-neon-blue">3</div>
                        </Card>
                        <Card variant="glass" hoverEffect>
                            <div className="text-gray-400 text-sm mb-1">Workouts Completed</div>
                            <div className="text-3xl font-bold text-neon-purple">12</div>
                        </Card>
                        <Card variant="glass" hoverEffect>
                            <div className="text-gray-400 text-sm mb-1">Calories Burned</div>
                            <div className="text-3xl font-bold text-neon-cyan">8,450</div>
                        </Card>
                         <Card variant="glass" hoverEffect>
                            <div className="text-gray-400 text-sm mb-1">Global Rank</div>
                            <div className="text-3xl font-bold text-white">#42</div>
                        </Card>
                    </div>

                    {/* Main Content Area */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Recent Activity */}
                        <div className="lg:col-span-2 space-y-6">
                            <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
                            <Card className="min-h-[300px]">
                                <div className="space-y-4">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-neon-blue/20 flex items-center justify-center text-neon-blue">
                                                    🏃‍♂️
                                                </div>
                                                <div>
                                                    <div className="font-semibold">Morning Run</div>
                                                    <div className="text-xs text-gray-400">5km • 25 mins</div>
                                                </div>
                                            </div>
                                            <Badge variant="success" size="sm">+250 pts</Badge>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </div>

                        {/* Leaderboard/Sidebar Widgets */}
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold mb-4">Top Performers</h2>
                             <Card>
                                <div className="space-y-4">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <div key={i} className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <span className={`font-display font-bold w-6 ${i === 1 ? 'text-yellow-400' : i===2 ? 'text-gray-300' : i===3 ? 'text-orange-400' : 'text-gray-600'}`}>#{i}</span>
                                                <div className="w-8 h-8 rounded-full bg-gray-700"></div>
                                                <span className="text-sm">User_{i}</span>
                                            </div>
                                            <span className="text-sm font-bold text-neon-blue">{1000 - i * 50}</span>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
