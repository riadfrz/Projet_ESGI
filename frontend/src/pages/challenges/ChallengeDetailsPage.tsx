import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { challengeService } from '@/api/challengeService';
import { userService } from '@/api/userService';
import { ChallengeWithDetailsDto, UserDto } from '@shared/dto';
import { useAuthStore } from '@/stores/authStore';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Input from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';
import { UserPlusIcon, XMarkIcon, CheckIcon, TrashIcon } from '@heroicons/react/24/outline';

const ChallengeDetailsPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const { showToast } = useToast();
    const [challenge, setChallenge] = useState<ChallengeWithDetailsDto | null>(null);
    const [loading, setLoading] = useState(true);
    const [joining, setJoining] = useState(false);
    
    // Invitation State
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<UserDto[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [inviting, setInviting] = useState(false);

    useEffect(() => {
        if (!id) return;
        fetchDetails();
    }, [id]);

    const fetchDetails = async () => {
        setLoading(true);
        try {
            const response = await challengeService.getChallengeById(id!);
            if (response.data) {
                setChallenge(response.data);
            }
        } catch (error) {
            console.error(error);
            showToast('Failed to load challenge details', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleJoin = async () => {
        if (!challenge) return;
        setJoining(true);
        try {
            await challengeService.joinChallenge(challenge.id);
            showToast('Joined challenge successfully!', 'success');
            fetchDetails();
        } catch (error: any) {
            showToast(error.message || 'Failed to join challenge', 'error');
        } finally {
            setJoining(false);
        }
    };

    const handleLeave = async () => {
        if (!challenge) return;
        if (!confirm('Are you sure you want to leave this challenge?')) return;
        
        try {
            await challengeService.leaveChallenge(challenge.id);
            showToast('Left challenge successfully', 'success');
            fetchDetails();
        } catch (error) {
            showToast('Failed to leave challenge', 'error');
        }
    };

    // Invite Logic
    useEffect(() => {
        if (showInviteModal && searchQuery.length > 2) {
            const delaySearch = setTimeout(async () => {
                try {
                    const response = await userService.getAllUsers({ search: searchQuery });
                    if (response.data) {
                        // Filter out existing participants
                        const participants = challenge?.participants?.map(p => p.userId) || [];
                        const filtered = response.data.filter(u => !participants.includes(u.id));
                        setSearchResults(filtered);
                    }
                } catch (error) {
                    console.error('Search failed', error);
                }
            }, 500);
            return () => clearTimeout(delaySearch);
        } else {
            setSearchResults([]);
        }
    }, [searchQuery, showInviteModal, challenge]);

    const handleInvite = async () => {
        if (!challenge || selectedUsers.length === 0) return;
        setInviting(true);
        try {
            await challengeService.inviteUsers(challenge.id, selectedUsers);
            showToast(`Invited ${selectedUsers.length} users`, 'success');
            setShowInviteModal(false);
            setSelectedUsers([]);
            setSearchQuery('');
            fetchDetails();
        } catch (error) {
            showToast('Failed to invite users', 'error');
        } finally {
            setInviting(false);
        }
    };

    const toggleUserSelection = (userId: string) => {
        if (selectedUsers.includes(userId)) {
            setSelectedUsers(prev => prev.filter(id => id !== userId));
        } else {
            setSelectedUsers(prev => [...prev, userId]);
        }
    };

    // Participant Management (Kick/Accept)
    const handleUpdateStatus = async (userId: string, status: string) => {
        if (!challenge) return;
        try {
            await challengeService.updateParticipantStatus(challenge.id, userId, status);
            showToast(`Participant ${status === 'ACCEPTED' ? 'accepted' : 'updated'}`, 'success');
            fetchDetails();
        } catch (error) {
            showToast('Failed to update participant status', 'error');
        }
    };

    if (loading) return <div className="text-center py-12">Loading challenge...</div>;
    if (!challenge) return <div className="text-center py-12">Challenge not found</div>;

    const isParticipant = challenge.participants?.some(p => p.userId === user?.id);
    const isCreator = challenge.createdBy === user?.id;

    return (
        <div className="space-y-6 relative">
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
                            <div className="flex gap-2">
                                {isCreator && (
                                    <Button variant="secondary" onClick={() => setShowInviteModal(true)}>
                                        <UserPlusIcon className="w-5 h-5 mr-2" />
                                        Invite
                                    </Button>
                                )}
                                {!isParticipant ? (
                                    <Button onClick={handleJoin} isLoading={joining} size="lg">
                                        Join Challenge
                                    </Button>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <Badge variant="success" size="md">Joined</Badge>
                                        {!isCreator && (
                                            <Button variant="danger" size="sm" onClick={handleLeave}>Leave</Button>
                                        )}
                                    </div>
                                )}
                            </div>
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
                                {challenge.participants.map((p, i) => (
                                    <li key={p.id} className="flex flex-col gap-2 border-b border-white/5 pb-3 last:border-0">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold">
                                                {i + 1}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between">
                                                    <p className="text-sm font-medium">{p.userName}</p>
                                                    <span className={`text-xs px-2 py-0.5 rounded ${
                                                        p.status === 'COMPLETED' ? 'bg-green-500/20 text-green-400' :
                                                        p.status === 'ACCEPTED' ? 'bg-blue-500/20 text-blue-400' :
                                                        'bg-yellow-500/20 text-yellow-400'
                                                    }`}>
                                                        {p.status}
                                                    </span>
                                                </div>
                                                <div className="w-full bg-white/10 h-1.5 rounded-full mt-1">
                                                    <div 
                                                        className="bg-neon-blue h-1.5 rounded-full" 
                                                        style={{ width: `${p.progress}%` }}
                                                    />
                                                </div>
                                            </div>
                                            <span className="text-xs font-mono">{p.progress}%</span>
                                        </div>
                                        
                                        {isCreator && p.userId !== user?.id && (
                                            <div className="flex justify-end gap-2 mt-1">
                                                {p.status === 'INVITED' && (
                                                    <button 
                                                        onClick={() => handleUpdateStatus(p.userId, 'ACCEPTED')}
                                                        className="text-xs text-green-400 hover:text-green-300 flex items-center"
                                                    >
                                                        <CheckIcon className="w-3 h-3 mr-1" /> Force Join
                                                    </button>
                                                )}
                                                <button 
                                                    onClick={() => handleUpdateStatus(p.userId, 'FAILED')} // Using FAILED as Kick for now or need remove endpoint
                                                    className="text-xs text-red-400 hover:text-red-300 flex items-center"
                                                >
                                                    <TrashIcon className="w-3 h-3 mr-1" /> Kick
                                                </button>
                                            </div>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500">Be the first to join!</p>
                        )}
                    </Card>
                </div>
            </div>

            {/* Invite Modal */}
            {showInviteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-dark-card w-full max-w-lg rounded-xl border border-white/10 shadow-2xl overflow-hidden">
                        <div className="p-4 border-b border-white/10 flex justify-between items-center">
                            <h3 className="font-bold text-lg">Invite Users</h3>
                            <button onClick={() => setShowInviteModal(false)} className="text-gray-400 hover:text-white">
                                <XMarkIcon className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="p-4 space-y-4">
                            <Input 
                                placeholder="Search users by name or email..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                autoFocus
                            />
                            
                            <div className="max-h-60 overflow-y-auto space-y-2">
                                {searchResults.map(u => (
                                    <div 
                                        key={u.id} 
                                        onClick={() => toggleUserSelection(u.id)}
                                        className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors border ${
                                            selectedUsers.includes(u.id) 
                                                ? 'bg-neon-blue/10 border-neon-blue' 
                                                : 'hover:bg-white/5 border-transparent'
                                        }`}
                                    >
                                        <div className={`w-5 h-5 rounded border mr-3 flex items-center justify-center ${
                                            selectedUsers.includes(u.id) ? 'bg-neon-blue border-neon-blue' : 'border-gray-500'
                                        }`}>
                                            {selectedUsers.includes(u.id) && <CheckIcon className="w-3 h-3 text-white" />}
                                        </div>
                                        <div>
                                            <p className="font-medium">{u.firstName} {u.lastName}</p>
                                            <p className="text-xs text-gray-400">{u.email}</p>
                                        </div>
                                    </div>
                                ))}
                                {searchQuery.length > 2 && searchResults.length === 0 && (
                                    <p className="text-center text-gray-500 py-4">No users found.</p>
                                )}
                                {searchQuery.length <= 2 && (
                                    <p className="text-center text-gray-500 py-4">Type at least 3 characters to search.</p>
                                )}
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <Button variant="ghost" onClick={() => setShowInviteModal(false)}>Cancel</Button>
                                <Button onClick={handleInvite} disabled={selectedUsers.length === 0} isLoading={inviting}>
                                    Invite Selected ({selectedUsers.length})
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChallengeDetailsPage;
