import { useEffect, useState } from 'react';
import { challengeService } from '@/api/challengeService';
import { ChallengeDto, QueryChallengesDto } from '@shared/dto';
import { ChallengeCard } from '@/components/challenges/ChallengeCard';
import Input from '@/components/ui/Input';

const ChallengeListPage = () => {
    const [challenges, setChallenges] = useState<ChallengeDto[]>([]);
    const [myChallenges, setMyChallenges] = useState<ChallengeDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    const fetchData = async (query?: QueryChallengesDto) => {
        setLoading(true);
        try {
            const [allRes, myRes] = await Promise.all([
                challengeService.getAllChallenges(query),
                challengeService.getMyChallenges()
            ]);
            
            // Safe handling for all challenges
            if (Array.isArray(allRes)) {
                setChallenges(allRes);
            } else if (allRes && Array.isArray(allRes.data)) {
                setChallenges(allRes.data);
            } else {
                setChallenges([]);
            }

            // Safe handling for my challenges
            if (Array.isArray(myRes)) {
                 setMyChallenges(myRes);
            } else if (myRes && Array.isArray(myRes.data)) {
                setMyChallenges(myRes.data);
            } else {
                 setMyChallenges([]);
            }

        } catch (error) {
            console.error(error);
            setChallenges([]);
            setMyChallenges([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleJoin = async (id: string) => {
        try {
            await challengeService.joinChallenge(id);
            fetchData({ search }); // Refresh
        } catch (error) {
            alert('Failed to join challenge');
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchData({ search });
    };

    const isJoined = (id: string) => myChallenges.some(c => c.id === id);

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-display font-bold">Challenges</h1>

            <form onSubmit={handleSearch} className="flex gap-4">
                <div className="flex-1">
                    <Input 
                        placeholder="Search challenges..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </form>

            {loading ? (
                <div className="text-center py-12">Loading challenges...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {challenges.map(challenge => (
                        <ChallengeCard 
                            key={challenge.id} 
                            challenge={challenge} 
                            isJoined={isJoined(challenge.id)}
                            onJoin={handleJoin}
                        />
                    ))}
                    {challenges.length === 0 && (
                        <div className="col-span-full text-center py-12 text-gray-500">
                            No challenges found.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ChallengeListPage;
