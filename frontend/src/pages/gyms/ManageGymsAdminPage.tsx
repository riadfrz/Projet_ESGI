import { useEffect, useState } from 'react';
import { gymService } from '@/api/gymService';
import { GymDto, UpdateGymStatusDto } from '@shared/dto';
import { GymStatus } from '@shared/enums';
import { GymCard } from '@/components/gyms/GymCard';
import Button from '@/components/ui/Button';

const ManageGymsAdminPage = () => {
    const [gyms, setGyms] = useState<GymDto[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchGyms = async () => {
        setLoading(true);
        try {
            const response = await gymService.getAllGyms();
            if (response.data && !Array.isArray(response.data)) {
                setGyms(response.data.data);
            } else {
                setGyms([]);
            }
        } catch (error) {
            console.error(error);
            setGyms([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGyms();
    }, []);

    const handleStatusChange = async (id: string, status: GymStatus) => {
        try {
            await gymService.updateGymStatus(id, { status } as UpdateGymStatusDto);
            fetchGyms();
        } catch (error) {
            alert('Failed to update status');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this gym?')) return;
        try {
            await gymService.deleteGym(id);
            fetchGyms();
        } catch (error) {
            alert('Failed to delete gym');
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-display font-bold">Manage Gyms</h1>

            {loading ? (
                <div className="text-center py-12">Loading gyms...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {gyms.map(gym => (
                        <div key={gym.id} className="relative group">
                            <GymCard gym={gym} />
                            <div className="absolute inset-0 bg-dark-bg/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 rounded-xl">
                                {gym.status === GymStatus.PENDING && (
                                    <>
                                        <Button size="sm" onClick={() => handleStatusChange(gym.id, GymStatus.APPROVED)} className="bg-green-600 hover:bg-green-700">Approve</Button>
                                        <Button size="sm" onClick={() => handleStatusChange(gym.id, GymStatus.REJECTED)} className="bg-red-600 hover:bg-red-700">Reject</Button>
                                    </>
                                )}
                                {gym.status !== GymStatus.PENDING && (
                                     <Button size="sm" onClick={() => handleStatusChange(gym.id, GymStatus.PENDING)} variant="secondary">Reset to Pending</Button>
                                )}
                                <Button size="sm" variant="danger" onClick={() => handleDelete(gym.id)}>Delete</Button>
                            </div>
                        </div>
                    ))}
                    {gyms.length === 0 && (
                        <div className="col-span-full text-center py-12 text-gray-500">
                            No gyms found.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ManageGymsAdminPage;
