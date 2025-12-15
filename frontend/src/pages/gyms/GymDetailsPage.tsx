import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { gymService } from '@/api/gymService';
import { equipmentService } from '@/api/equipmentService';
import { GymDto, EquipmentDto } from '@shared/dto';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

const GymDetailsPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [gym, setGym] = useState<GymDto | null>(null);
    const [equipment, setEquipment] = useState<EquipmentDto[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        const fetchData = async () => {
            setLoading(true);
            try {
                const [gymRes, eqRes] = await Promise.all([
                    gymService.getGymById(id),
                    equipmentService.getAllEquipments({ gymId: id })
                ]);

                if (gymRes.data) setGym(gymRes.data);
                
                // Safe handling for equipment response
                if (eqRes.data && !Array.isArray(eqRes.data)) {
                    setEquipment(eqRes.data.data); // Handle paginated response
                } else if (Array.isArray(eqRes.data)) {
                    setEquipment(eqRes.data); // Handle direct array
                } else if (Array.isArray(eqRes)) {
                    setEquipment(eqRes); // Handle direct array (legacy)
                } else {
                    setEquipment([]);
                }

            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    if (loading) return <div className="text-center py-12">Loading gym details...</div>;
    if (!gym) return <div className="text-center py-12">Gym not found</div>;

    return (
        <div className="space-y-6">
            <Button variant="ghost" onClick={() => navigate(-1)} className="pl-0 hover:bg-transparent hover:text-white">
                ← Back
            </Button>

            <Card className="relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-10 text-9xl">🏋️</div>
                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h1 className="text-4xl font-display font-bold text-transparent bg-clip-text bg-linear-to-r from-neon-blue to-neon-purple mb-2">{gym.name}</h1>
                            <p className="text-xl text-gray-400">{gym.city}, {gym.country}</p>
                        </div>
                        <Badge variant="success" size="md">{gym.status}</Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-lg font-bold text-neon-blue mb-2">About</h3>
                            <p className="text-gray-300 leading-relaxed mb-6">
                                {gym.description || "No description provided."}
                            </p>
                            
                            <h3 className="text-lg font-bold text-neon-blue mb-2">Contact</h3>
                            <ul className="space-y-2 text-gray-300">
                                <li>📍 {gym.address}, {gym.zipCode}</li>
                                {gym.email && <li>📧 {gym.email}</li>}
                                {gym.phone && <li>📞 {gym.phone}</li>}
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold text-neon-blue mb-4">Equipment Available</h3>
                            {equipment.length > 0 ? (
                                <div className="grid grid-cols-2 gap-3">
                                    {equipment.map(eq => (
                                        <div key={eq.id} className="bg-white/5 p-3 rounded-lg flex justify-between items-center">
                                            <span>{eq.name}</span>
                                            <Badge size="sm" variant="secondary">x{eq.quantity}</Badge>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 italic">No equipment listed yet.</p>
                            )}
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default GymDetailsPage;
