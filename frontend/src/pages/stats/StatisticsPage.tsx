import { useState, useEffect } from 'react';
import { TrainingStatsDto } from '@shared/dto';
import { trainingService } from '@/api/trainingService';
import { useToast } from '@/components/ui/Toast';
import { 
    FireIcon, 
    ClockIcon, 
    BoltIcon,
    CalendarIcon,
    ChartBarIcon,
    ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';

const StatisticsPage = () => {
    const [stats, setStats] = useState<TrainingStatsDto | null>(null);
    const [loading, setLoading] = useState(true);
    const { showToast } = useToast();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                const response = await trainingService.getStats();
                if (response.data) {
                    setStats(response.data);
                }
            } catch (error) {
                console.error('Error fetching stats:', error);
                showToast('Failed to load statistics', 'error');
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-neon-blue"></div>
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="text-center text-gray-400 py-12">
                <p>No statistics available yet. Start your first workout!</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-white mb-2">Your Statistics</h1>
                <p className="text-gray-400">Track your progress and achievements</p>
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="card p-6 bg-gradient-to-br from-dark-card to-dark-lighter border-l-4 border-neon-blue">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-gray-400 text-sm">Total Sessions</p>
                            <h3 className="text-3xl font-bold text-white mt-1">{stats.totalSessions}</h3>
                        </div>
                        <div className="p-3 bg-neon-blue/10 rounded-lg text-neon-blue">
                            <CalendarIcon className="w-6 h-6" />
                        </div>
                    </div>
                    <div className="text-sm text-gray-400">
                        <span className="text-neon-blue font-bold">{stats.sessionsThisMonth}</span> this month
                    </div>
                </div>

                <div className="card p-6 bg-gradient-to-br from-dark-card to-dark-lighter border-l-4 border-neon-purple">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-gray-400 text-sm">Total Duration</p>
                            <h3 className="text-3xl font-bold text-white mt-1">
                                {Math.round(stats.totalDuration / 60)} <span className="text-sm font-normal text-gray-400">hrs</span>
                            </h3>
                        </div>
                        <div className="p-3 bg-neon-purple/10 rounded-lg text-neon-purple">
                            <ClockIcon className="w-6 h-6" />
                        </div>
                    </div>
                    <div className="text-sm text-gray-400">
                        Avg: <span className="text-white">{stats.averageDuration} min</span> / session
                    </div>
                </div>

                <div className="card p-6 bg-gradient-to-br from-dark-card to-dark-lighter border-l-4 border-neon-pink">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-gray-400 text-sm">Total Calories</p>
                            <h3 className="text-3xl font-bold text-white mt-1">
                                {(stats.totalCalories / 1000).toFixed(1)}k
                            </h3>
                        </div>
                        <div className="p-3 bg-neon-pink/10 rounded-lg text-neon-pink">
                            <FireIcon className="w-6 h-6" />
                        </div>
                    </div>
                    <div className="text-sm text-gray-400">
                        Avg: <span className="text-white">{stats.averageCalories}</span> / session
                    </div>
                </div>

                <div className="card p-6 bg-gradient-to-br from-dark-card to-dark-lighter border-l-4 border-neon-cyan">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-gray-400 text-sm">Total Reps</p>
                            <h3 className="text-3xl font-bold text-white mt-1">
                                {(stats.totalRepetitions / 1000).toFixed(1)}k
                            </h3>
                        </div>
                        <div className="p-3 bg-neon-cyan/10 rounded-lg text-neon-cyan">
                            <BoltIcon className="w-6 h-6" />
                        </div>
                    </div>
                    <div className="text-sm text-gray-400">
                        Keep pushing your limits!
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Favorite Exercise */}
                <div className="card p-6">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <ArrowTrendingUpIcon className="w-6 h-6 text-neon-blue" />
                        Top Performance
                    </h3>
                    
                    {stats.favoriteExercise ? (
                        <div className="bg-dark-bg p-6 rounded-xl border border-white/5">
                            <p className="text-gray-400 text-sm mb-2">Favorite Exercise</p>
                            <h4 className="text-2xl font-bold text-white mb-1">
                                {stats.favoriteExercise.name}
                            </h4>
                            
                            <div className="grid grid-cols-1 gap-4 mt-4 pt-4 border-t border-white/5">
                                <div>
                                    <p className="text-xs text-gray-500">Sessions</p>
                                    <p className="text-lg font-bold text-white">{stats.favoriteExercise.count}</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-400">Not enough data to determine favorite exercise.</p>
                    )}
                </div>

                {/* Recent Activity */}
                <div className="card p-6">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <ChartBarIcon className="w-6 h-6 text-neon-purple" />
                        Recent Activity
                    </h3>
                    
                    <div className="space-y-4">
                        {stats.recentSessions.length === 0 ? (
                            <p className="text-gray-400">No recent sessions.</p>
                        ) : (
                            stats.recentSessions.slice(0, 5).map((session) => (
                                <div key={session.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-dark-bg transition-colors border border-transparent hover:border-white/5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-dark-lighter flex items-center justify-center text-xl">
                                            {session.exercise?.name.charAt(0) || '🏋️'}
                                        </div>
                                        <div>
                                            <p className="font-medium text-white">{session.exercise?.name || 'Unknown Exercise'}</p>
                                            <p className="text-xs text-gray-400">
                                                {format(new Date(session.date), 'MMM d, yyyy')}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-neon-blue">{session.duration} min</p>
                                        <p className="text-xs text-gray-400">{session.caloriesBurned} cal</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatisticsPage;
