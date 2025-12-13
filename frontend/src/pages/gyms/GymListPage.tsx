import { useEffect, useState } from 'react';
import { gymService } from '@/api/gymService';
import { GymDto, QueryGymsDto } from '@shared/dto';
import { GymCard } from '@/components/gyms/GymCard';
import Input from '@/components/ui/Input';

const GymListPage = () => {
    const [gyms, setGyms] = useState<GymDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    const fetchGyms = async (query?: QueryGymsDto) => {
        setLoading(true);
        try {
            const response = await gymService.getAllGyms(query);
            // Handle both structure formats (direct array or nested data)
            if (Array.isArray(response)) {
                 setGyms(response);
            } else if (response && Array.isArray(response.data)) {
                setGyms(response.data);
            } else if (response && response.data && Array.isArray(response.data.data)) {
                 // Pagination structure sometimes has data.data
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

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchGyms({ search });
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-display font-bold">Find a Gym</h1>
            </div>

            <form onSubmit={handleSearch} className="flex gap-4">
                <div className="flex-1">
                    <Input 
                        placeholder="Search gyms by name, city..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </form>

            {loading ? (
                <div className="text-center py-12">Loading gyms...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {gyms.map(gym => (
                        <GymCard key={gym.id} gym={gym} />
                    ))}
                    {gyms.length === 0 && (
                        <div className="col-span-full text-center py-12 text-gray-500">
                            No gyms found matching your criteria.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default GymListPage;
