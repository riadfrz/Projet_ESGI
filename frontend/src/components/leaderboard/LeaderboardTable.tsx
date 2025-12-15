import React from 'react';
import Card from '@/components/ui/Card';
import { GlobalLeaderboardEntryDto } from '@shared/dto';

interface LeaderboardTableProps {
    entries: GlobalLeaderboardEntryDto[];
    currentUserId?: string;
}

export const LeaderboardTable: React.FC<LeaderboardTableProps> = ({ entries, currentUserId }) => {
    return (
        <Card className="overflow-hidden p-0">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-white/5 border-b border-white/10 text-gray-400 text-sm uppercase tracking-wider">
                            <th className="p-4 text-center w-16">Rank</th>
                            <th className="p-4">User</th>
                            <th className="p-4 text-center">Badges</th>
                            <th className="p-4 text-center">Sessions</th>
                            <th className="p-4 text-right">Points</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {entries.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-gray-500">
                                    No entries yet. Be the first!
                                </td>
                            </tr>
                        ) : (
                            entries.map((entry, index) => {
                                const isCurrentUser = entry.userId === currentUserId;
                                const rank = index + 1;
                                const rankColor = 
                                    rank === 1 ? 'text-yellow-400 font-bold text-lg' : 
                                    rank === 2 ? 'text-gray-300 font-bold text-lg' : 
                                    rank === 3 ? 'text-amber-600 font-bold text-lg' : 
                                    'text-gray-500';

                                return (
                                    <tr 
                                        key={entry.userId} 
                                        className={`transition-colors hover:bg-white/5 ${isCurrentUser ? 'bg-neon-blue/5 border-l-2 border-neon-blue' : ''}`}
                                    >
                                        <td className={`p-4 text-center ${rankColor}`}>
                                            {rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : rank}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-linear-to-br from-neon-blue to-neon-purple flex items-center justify-center text-xs font-bold text-white">
                                                    {(entry.firstName?.[0] || entry.email[0]).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className={`font-medium ${isCurrentUser ? 'text-neon-blue' : 'text-white'}`}>
                                                        {entry.firstName ? `${entry.firstName} ${entry.lastName || ''}` : entry.email.split('@')[0]}
                                                    </div>
                                                    {isCurrentUser && <div className="text-xs text-gray-500">You</div>}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-center text-gray-300">
                                            {entry.totalBadges}
                                        </td>
                                        <td className="p-4 text-center text-gray-300">
                                            {entry.totalSessions}
                                        </td>
                                        <td className="p-4 text-right font-mono font-bold text-neon-purple">
                                            {entry.totalPoints.toLocaleString()}
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};
