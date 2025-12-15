/**
 * Example: User Profile Component
 * 
 * Displays current user information and provides logout functionality.
 */

import { useLogout, useUserSessions } from '@/api/queries';
import { useAuthStore } from '@/stores';
import { useNavigate } from 'react-router-dom';

export function UserProfile() {
    const navigate = useNavigate();
    const user = useAuthStore((state) => state.user);
    const { mutate: logout, isPending: isLoggingOut } = useLogout();
    const { data: sessions, isLoading: isLoadingSessions } = useUserSessions();

    if (!user) {
        return (
            <div className="p-4">
                <p>Not logged in</p>
            </div>
        );
    }

    const handleLogout = () => {
        logout(undefined, {
            onSuccess: () => {
                navigate('/login');
            },
        });
    };

    return (
        <div className="max-w-2xl mx-auto p-6 space-y-6">
            {/* User Info Card */}
            <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-4">Profile</h2>
                
                <div className="space-y-2">
                    <div className="flex justify-between">
                        <span className="text-gray-600">Name:</span>
                        <span className="font-medium">
                            {user.firstName} {user.lastName}
                        </span>
                    </div>
                    
                    <div className="flex justify-between">
                        <span className="text-gray-600">Email:</span>
                        <span className="font-medium">{user.email}</span>
                    </div>
                    
                    <div className="flex justify-between">
                        <span className="text-gray-600">Role:</span>
                        <span className="font-medium">{user.role}</span>
                    </div>
                    
                    <div className="flex justify-between">
                        <span className="text-gray-600">Points:</span>
                        <span className="font-medium text-green-600">
                            {user.points}
                        </span>
                    </div>

                    {user.phone && (
                        <div className="flex justify-between">
                            <span className="text-gray-600">Phone:</span>
                            <span className="font-medium">{user.phone}</span>
                        </div>
                    )}

                    {user.birthDate && (
                        <div className="flex justify-between">
                            <span className="text-gray-600">Birth Date:</span>
                            <span className="font-medium">
                                {new Date(user.birthDate).toLocaleDateString()}
                            </span>
                        </div>
                    )}
                </div>

                <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="mt-6 w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 disabled:opacity-50"
                >
                    {isLoggingOut ? 'Logging out...' : 'Logout'}
                </button>
            </div>

            {/* Active Sessions */}
            <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4">Active Sessions</h3>
                
                {isLoadingSessions ? (
                    <p className="text-gray-600">Loading sessions...</p>
                ) : sessions && sessions.length > 0 ? (
                    <div className="space-y-3">
                        {sessions.map((session: any) => (
                            <div
                                key={session.id}
                                className="border rounded p-3 text-sm"
                            >
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Provider:</span>
                                    <span className="font-medium">
                                        {session.authProvider}
                                    </span>
                                </div>
                                
                                {session.ipAddress && (
                                    <div className="flex justify-between mt-1">
                                        <span className="text-gray-600">IP:</span>
                                        <span className="font-medium">
                                            {session.ipAddress}
                                        </span>
                                    </div>
                                )}
                                
                                <div className="flex justify-between mt-1">
                                    <span className="text-gray-600">Expires:</span>
                                    <span className="font-medium">
                                        {new Date(session.expiresAt).toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-600">No active sessions</p>
                )}
            </div>
        </div>
    );
}

/**
 * Example Usage in Router:
 * 
 * import { UserProfile } from '@/components/auth/UserProfile';
 * 
 * <Route path="/profile" element={<UserProfile />} />
 */
