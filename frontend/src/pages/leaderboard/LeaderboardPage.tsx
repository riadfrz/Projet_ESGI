import { useEffect, useState } from 'react';
import { leaderboardService } from '@/api/leaderboardService';
import { GlobalLeaderboardEntryDto } from '@shared/dto';
import { LeaderboardTable } from '@/components/leaderboard/LeaderboardTable';
import { useAuthStore } from '@/stores/authStore';

const LeaderboardPage = () => {
    const { user } = useAuthStore();
    const [entries, setEntries] = useState<GlobalLeaderboardEntryDto[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const response = await leaderboardService.getGlobalLeaderboard();
                if (response.data) {
                    setEntries(response.data);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchLeaderboard();
    }, []);

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-display font-bold">Global Leaderboard</h1>
            <p className="text-gray-400">Compete with others and climb the ranks!</p>

            {loading ? (
                <div className="text-center py-12">Loading leaderboard...</div>
            ) : (
                <LeaderboardTable entries={entries} currentUserId={user?.id} />
            )}
        </div>
    );
};

export default LeaderboardPage;
