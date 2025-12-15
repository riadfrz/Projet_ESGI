import { useEffect, useState } from 'react';
import { challengeService } from '@/api/challengeService';
import { ChallengeDto, CreateChallengeDto } from '@shared/dto';
import { ChallengeType, ChallengeDifficulty } from '@shared/enums';
import { ChallengeCard } from '@/components/challenges/ChallengeCard';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

const ManageChallengesPage = () => {
    const [challenges, setChallenges] = useState<ChallengeDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    // Form State
    const [formData, setFormData] = useState<Partial<CreateChallengeDto>>({
        title: '',
        description: '',
        duration: 30,
        difficulty: ChallengeDifficulty.MEDIUM,
        objectiveType: ChallengeType.SESSIONS,
        objectiveValue: 10,
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        isPublic: true
    });

    const fetchChallenges = async () => {
        setLoading(true);
        try {
            // Fetch challenges created by me (as gym owner)
            const response = await challengeService.getMyChallenges();
            if (response.data) {
                setChallenges(response.data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchChallenges();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await challengeService.createChallenge({
                ...formData,
                startDate: new Date(formData.startDate!).toISOString(),
                endDate: new Date(formData.endDate!).toISOString(),
            } as CreateChallengeDto);
            setShowForm(false);
            fetchChallenges();
        } catch (error) {
            alert('Failed to create challenge');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-display font-bold">Manage Challenges</h1>
                <Button onClick={() => setShowForm(!showForm)}>
                    {showForm ? 'Cancel' : 'Create Challenge'}
                </Button>
            </div>

            {showForm && (
                <Card className="mb-8 animate-in fade-in slide-in-from-top-4">
                    <h2 className="text-xl font-bold mb-4">Create New Challenge</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input 
                            label="Title" 
                            value={formData.title} 
                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                            required
                        />
                         <Input 
                            label="Description" 
                            value={formData.description} 
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Objective Type</label>
                                <select 
                                    className="w-full bg-dark-bg border border-white/10 rounded-lg px-4 py-2 text-white focus:border-neon-blue focus:ring-1 focus:ring-neon-blue outline-none transition-all"
                                    value={formData.objectiveType}
                                    onChange={(e) => setFormData({...formData, objectiveType: e.target.value as ChallengeType})}
                                >
                                    {Object.values(ChallengeType).map(t => (
                                        <option key={t} value={t}>{t}</option>
                                    ))}
                                </select>
                            </div>
                            <Input 
                                label="Objective Value" 
                                type="number"
                                value={formData.objectiveValue} 
                                onChange={(e) => setFormData({...formData, objectiveValue: parseInt(e.target.value)})}
                                required
                            />
                        </div>

                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Difficulty</label>
                                <select 
                                    className="w-full bg-dark-bg border border-white/10 rounded-lg px-4 py-2 text-white focus:border-neon-blue focus:ring-1 focus:ring-neon-blue outline-none transition-all"
                                    value={formData.difficulty}
                                    onChange={(e) => setFormData({...formData, difficulty: e.target.value as ChallengeDifficulty})}
                                >
                                    {Object.values(ChallengeDifficulty).map(t => (
                                        <option key={t} value={t}>{t}</option>
                                    ))}
                                </select>
                            </div>
                            <Input 
                                label="Duration (Days)" 
                                type="number"
                                value={formData.duration} 
                                onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value)})}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input 
                                label="Start Date" 
                                type="date"
                                value={formData.startDate} 
                                onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                                required
                            />
                            <Input 
                                label="End Date" 
                                type="date"
                                value={formData.endDate} 
                                onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                                required
                            />
                        </div>

                        <div className="flex justify-end pt-4">
                            <Button type="submit">Publish Challenge</Button>
                        </div>
                    </form>
                </Card>
            )}

            {loading ? (
                <div className="text-center py-12">Loading...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {challenges.map(challenge => (
                        <ChallengeCard key={challenge.id} challenge={challenge} />
                    ))}
                    {challenges.length === 0 && (
                        <div className="col-span-full text-center py-12 text-gray-500">
                            You haven't created any challenges yet.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ManageChallengesPage;
