import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { challengeService } from '@/api/challengeService';
import { ChallengeWithDetailsDto } from '@shared/dto';
import { useAuthStore } from '@/stores/authStore';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

const ChallengeDetailsPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const [challenge, setChallenge] = useState<ChallengeWithDetailsDto | null>(null);
    const [loading, setLoading] = useState(true);
    const [joining, setJoining] = useState(false);

    useEffect(() => {
        if (!id) return;
        const fetchDetails = async () => {
            setLoading(true);
            try {
                const response = await challengeService.getChallengeById(id);
                if (response.data) {
                    setChallenge(response.data);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [id]);

    const handleJoin = async () => {
        if (!challenge) return;
        setJoining(true);
        try {
            await challengeService.joinChallenge(challenge.id);
            // Refresh details
            const response = await challengeService.getChallengeById(challenge.id);
            if (response.data) setChallenge(response.data);
        } catch (error) {
            alert('Failed to join challenge');
        } finally {
            setJoining(false);
        }
    };

    if (loading) return <div className="text-center py-12">Loading challenge...</div>;
    if (!challenge) return <div className="text-center py-12">Challenge not found</div>;

    const isParticipant = challenge.participants?.some(p => p.userId === user?.id);

    return (
        <div className="space-y-6">
            <Button variant="ghost" onClick={() => navigate(-1)} className="pl-0 hover:bg-transparent hover:text-white">
                ← Back
            </Button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <Badge variant="accent" className="mb-2">{challenge.difficulty}</Badge>
                                <h1 className="text-3xl font-display font-bold">{challenge.title}</h1>
                            </div>
                            {!isParticipant ? (
                                <Button onClick={handleJoin} isLoading={joining} size="lg">
                                    Join Challenge
                                </Button>
                            ) : (
                                <Badge variant="success" size="md">Joined</Badge>
                            )}
                        </div>
                        
                        <p className="text-gray-300 text-lg mb-6">{challenge.description}</p>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div className="bg-white/5 p-3 rounded-lg">
                                <p className="text-gray-500">Duration</p>
                                <p className="text-white font-bold">{challenge.duration} Days</p>
                            </div>
                            <div className="bg-white/5 p-3 rounded-lg">
                                <p className="text-gray-500">Goal</p>
                                <p className="text-white font-bold">{challenge.objectiveValue} {challenge.objectiveType.toLowerCase()}</p>
                            </div>
                            <div className="bg-white/5 p-3 rounded-lg">
                                <p className="text-gray-500">Start Date</p>
                                <p className="text-white font-bold">{new Date(challenge.startDate).toLocaleDateString()}</p>
                            </div>
                            <div className="bg-white/5 p-3 rounded-lg">
                                <p className="text-gray-500">Participants</p>
                                <p className="text-white font-bold">{challenge.participantCount || 0}</p>
                            </div>
                        </div>
                    </Card>

                    <Card>
                        <h2 className="text-xl font-bold mb-4">Included Exercises</h2>
                        {challenge.exercises && challenge.exercises.length > 0 ? (
                            <ul className="space-y-3">
                                {challenge.exercises.map(ex => (
                                    <li key={ex.id} className="flex justify-between items-center border-b border-white/5 pb-2 last:border-0">
                                        <span className="font-medium">{ex.name}</span>
                                        <span className="text-gray-500 text-sm">View Guide →</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500">No specific exercises linked.</p>
                        )}
                    </Card>
                </div>

                <div className="lg:col-span-1 space-y-6">
                    <Card>
                        <h2 className="text-xl font-bold mb-4">Participants</h2>
                        {challenge.participants && challenge.participants.length > 0 ? (
                            <ul className="space-y-3">
                                {challenge.participants.slice(0, 10).map((p, i) => (
                                    <li key={p.id} className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold">
                                            {i + 1}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium">{p.userName}</p>
                                            <div className="w-full bg-white/10 h-1.5 rounded-full mt-1">
                                                <div 
                                                    className="bg-neon-blue h-1.5 rounded-full" 
                                                    style={{ width: `${p.progress}%` }}
                                                />
                                            </div>
                                        </div>
                                        <span className="text-xs font-mono">{p.progress}%</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500">Be the first to join!</p>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default ChallengeDetailsPage;
