import { useEffect, useState } from 'react';
import { userService } from '@/api/userService';
import { UserDto, UpdateUserDto } from '@shared/dto';
import { UserRole } from '@shared/enums';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

const ManageUsersPage = () => {
    const [users, setUsers] = useState<UserDto[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await userService.getAllUsers();
            if (Array.isArray(response)) {
                setUsers(response);
            } else if (response && Array.isArray(response.data)) {
                setUsers(response.data);
            } else {
                setUsers([]);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this user?')) return;
        try {
            await userService.deleteUser(id);
            fetchUsers();
        } catch (error) {
            alert('Failed to delete user');
        }
    };

    const handleRoleChange = async (user: UserDto) => {
        const newRole = prompt('Enter new role (CLIENT, GYM_OWNER, ADMIN):', user.role);
        if (!newRole || newRole === user.role) return;
        
        // Basic validation
        if (!['CLIENT', 'GYM_OWNER', 'ADMIN'].includes(newRole)) {
            alert('Invalid role');
            return;
        }

        try {
            await userService.updateUser(user.id, { role: newRole as UserRole } as UpdateUserDto);
            fetchUsers();
        } catch (error) {
            alert('Failed to update role');
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-display font-bold">Manage Users</h1>

            <Card className="overflow-hidden p-0">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/10 text-gray-400 text-sm uppercase tracking-wider">
                                <th className="p-4">User</th>
                                <th className="p-4">Role</th>
                                <th className="p-4">Email</th>
                                <th className="p-4">Joined</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {users.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-gray-500">
                                        No users found.
                                    </td>
                                </tr>
                            ) : (
                                users.map(user => (
                                    <tr key={user.id} className="hover:bg-white/5 transition-colors">
                                        <td className="p-4 font-medium">
                                            {user.firstName} {user.lastName}
                                        </td>
                                        <td className="p-4">
                                            <Badge variant={
                                                user.role === 'ADMIN' ? 'danger' : 
                                                user.role === 'GYM_OWNER' ? 'accent' : 'primary'
                                            }>
                                                {user.role}
                                            </Badge>
                                        </td>
                                        <td className="p-4 text-gray-300">{user.email}</td>
                                        <td className="p-4 text-gray-400 text-sm">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="p-4 text-right space-x-2">
                                            <Button 
                                                variant="secondary" 
                                                size="sm"
                                                onClick={() => handleRoleChange(user)}
                                            >
                                                Role
                                            </Button>
                                            <Button 
                                                variant="danger" 
                                                size="sm"
                                                onClick={() => handleDelete(user.id)}
                                            >
                                                Delete
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default ManageUsersPage;
