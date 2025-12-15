import { useEffect, useState } from 'react';
import { userService } from '@/api/userService';
import { UserDto, UserBadgeDto, UpdateUserDto } from '@shared/dto';
import { useAuthStore } from '@/stores/authStore';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';

const UserProfilePage = () => {
    const { setUser } = useAuthStore();
    const [profile, setProfile] = useState<UserDto | null>(null);
    const [badges, setBadges] = useState<UserBadgeDto[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);

    const [formData, setFormData] = useState<Partial<UpdateUserDto>>({});

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // In a real app, /me might return more details than auth user
                const [profileRes, badgesRes] = await Promise.all([
                    userService.getProfile(),
                    userService.getMyBadges()
                ]);

                if (profileRes.data) {
                    setProfile(profileRes.data);
                    setFormData({
                        firstName: profileRes.data.firstName,
                        lastName: profileRes.data.lastName,
                        email: profileRes.data.email,
                        phone: profileRes.data.phone || '',
                        birthDate: profileRes.data.birthDate?.split('T')[0] || ''
                    });
                }
                
                // Safe badge handling
                if (Array.isArray(badgesRes)) {
                    setBadges(badgesRes);
                } else if (badgesRes && Array.isArray(badgesRes.data)) {
                    setBadges(badgesRes.data);
                } else {
                    setBadges([]);
                }

            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await userService.updateProfile(formData);
            if (response.data) {
                setProfile(response.data);
                setUser(response.data); // Update global store
                setIsEditing(false);
                alert('Profile updated!');
            }
        } catch (error) {
            alert('Failed to update profile');
        }
    };

    if (loading) return <div className="text-center py-12">Loading profile...</div>;
    if (!profile) return <div className="text-center py-12">Profile not found</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-display font-bold">My Profile</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Profile Card */}
                <div className="md:col-span-2">
                    <Card>
                        <div className="flex justify-between items-start mb-6">
                            <div className="flex items-center gap-4">
                                <div className="w-20 h-20 rounded-full bg-linear-to-br from-neon-blue to-neon-purple flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-neon-blue/20">
                                    {(profile.firstName?.[0] || 'U').toUpperCase()}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold">{profile.firstName} {profile.lastName}</h2>
                                    <p className="text-gray-400">{profile.email}</p>
                                    <div className="mt-2">
                                        <Badge variant="accent">{profile.role}</Badge>
                                    </div>
                                </div>
                            </div>
                            <Button variant="secondary" size="sm" onClick={() => setIsEditing(!isEditing)}>
                                {isEditing ? 'Cancel' : 'Edit Profile'}
                            </Button>
                        </div>

                        {isEditing ? (
                            <form onSubmit={handleSave} className="space-y-4 animate-in fade-in">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Input 
                                        label="First Name" 
                                        value={formData.firstName}
                                        onChange={(e) => setFormData({...formData, firstName: e.target.value})} 
                                    />
                                    <Input 
                                        label="Last Name" 
                                        value={formData.lastName}
                                        onChange={(e) => setFormData({...formData, lastName: e.target.value})} 
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Input 
                                        label="Phone" 
                                        value={formData.phone || ''}
                                        onChange={(e) => setFormData({...formData, phone: e.target.value})} 
                                    />
                                    <Input 
                                        label="Birth Date" 
                                        type="date"
                                        value={formData.birthDate || ''}
                                        onChange={(e) => setFormData({...formData, birthDate: e.target.value})} 
                                    />
                                </div>
                                <div className="flex justify-end">
                                    <Button type="submit">Save Changes</Button>
                                </div>
                            </form>
                        ) : (
                            <div className="grid grid-cols-2 gap-4 text-sm mt-6 border-t border-white/5 pt-6">
                                <div>
                                    <p className="text-gray-500">Member Since</p>
                                    <p className="text-white">{new Date(profile.createdAt).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Total Points</p>
                                    <p className="text-neon-purple font-bold">{profile.points}</p>
                                </div>
                            </div>
                        )}
                    </Card>
                </div>

                {/* Badges Card */}
                <div className="md:col-span-1">
                    <Card className="h-full">
                        <h3 className="text-xl font-bold mb-4">Badges ({badges.length})</h3>
                        {badges.length === 0 ? (
                            <p className="text-gray-500 text-sm">No badges earned yet. Keep training!</p>
                        ) : (
                            <div className="grid grid-cols-2 gap-3">
                                {badges.map(ub => (
                                    <div key={ub.id} className="bg-white/5 p-3 rounded-lg text-center hover:bg-white/10 transition-colors cursor-help group relative">
                                        <div className="text-2xl mb-1">🏆</div>
                                        <p className="text-xs font-bold truncate">{ub.badge.name}</p>
                                        
                                        {/* Tooltip */}
                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-dark-surface border border-white/10 p-2 rounded shadow-xl text-xs text-left hidden group-hover:block z-10">
                                            <p className="font-bold text-white">{ub.badge.name}</p>
                                            <p className="text-gray-400">{ub.badge.description}</p>
                                            <p className="text-neon-blue mt-1">+{ub.badge.points} pts</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default UserProfilePage;
