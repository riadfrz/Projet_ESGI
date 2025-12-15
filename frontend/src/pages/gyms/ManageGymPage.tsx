import { useEffect, useState } from 'react';
import { gymService } from '@/api/gymService';
import { equipmentService } from '@/api/equipmentService';
import { GymDto, CreateGymDto, UpdateGymDto, EquipmentDto } from '@shared/dto';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';
import { useAuthStore } from '@/stores/authStore';

const ManageGymPage = () => {
    const { user } = useAuthStore();
    const [gym, setGym] = useState<GymDto | null>(null);
    const [equipments, setEquipments] = useState<EquipmentDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    
    // Equipment Form State
    const [newEquipment, setNewEquipment] = useState({ name: '', quantity: 1 });
    const [addingEquip, setAddingEquip] = useState(false);

    // Form State
    const [formData, setFormData] = useState<Partial<CreateGymDto>>({
        name: '',
        description: '',
        address: '',
        city: '',
        zipCode: '',
        country: '',
        phone: '',
        email: '',
        capacity: 0
    });

    const fetchMyGym = async () => {
        setLoading(true);
        try {
            const response = await gymService.getAllGyms({ ownerId: user?.id });
            if (response.data && response.data.data && response.data.data.length > 0) {
                const myGym = response.data.data[0];
                setGym(myGym);
                setFormData({
                    name: myGym.name,
                    description: myGym.description || '',
                    address: myGym.address,
                    city: myGym.city,
                    zipCode: myGym.zipCode,
                    country: myGym.country,
                    phone: myGym.phone || '',
                    email: myGym.email || '',
                    capacity: myGym.capacity || 0
                });

                // Fetch equipment for this gym
                const equipRes = await equipmentService.getAllEquipments({ gymId: myGym.id });
                if (Array.isArray(equipRes)) setEquipments(equipRes);
                else if (equipRes && Array.isArray(equipRes.data)) setEquipments(equipRes.data);
                else setEquipments([]);
            } else {
                setIsEditing(true); // Force create mode if no gym
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user?.id) fetchMyGym();
    }, [user?.id]);

    const handleAddEquipment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!gym) return;
        setAddingEquip(true);
        try {
            await equipmentService.createEquipment({
                ...newEquipment,
                gymId: gym.id
            });
            setNewEquipment({ name: '', quantity: 1 });
            // Refresh equipment
            const equipRes = await equipmentService.getAllEquipments({ gymId: gym.id });
             if (Array.isArray(equipRes)) setEquipments(equipRes);
            else if (equipRes && Array.isArray(equipRes.data)) setEquipments(equipRes.data);
        } catch (error) {
            alert('Failed to add equipment');
        } finally {
            setAddingEquip(false);
        }
    };

    const handleDeleteEquipment = async (id: string) => {
        if (!confirm('Remove this equipment?')) return;
        try {
            await equipmentService.deleteEquipment(id);
            setEquipments(prev => prev.filter(e => e.id !== id));
        } catch (error) {
            alert('Failed to remove equipment');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (gym) {
                await gymService.updateGym(gym.id, formData as UpdateGymDto);
                alert('Gym updated successfully');
            } else {
                await gymService.createGym(formData as CreateGymDto);
                alert('Gym created successfully! Waiting for approval.');
            }
            window.location.reload();
        } catch (error) {
            alert('Operation failed');
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-display font-bold">Manage My Gym</h1>

            {!isEditing && gym ? (
                <Card>
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h2 className="text-2xl font-bold">{gym.name}</h2>
                            <p className="text-gray-400">{gym.city}, {gym.country}</p>
                        </div>
                        <div className="flex gap-2">
                            <Badge variant={gym.status === 'APPROVED' ? 'success' : 'warning'}>{gym.status}</Badge>
                            <Button size="sm" onClick={() => setIsEditing(true)}>Edit</Button>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6 text-gray-300">
                        <div>
                            <p className="text-gray-500 text-sm">Address</p>
                            <p>{gym.address}, {gym.zipCode}</p>
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm">Contact</p>
                            <p>{gym.email}</p>
                            <p>{gym.phone}</p>
                        </div>
                        <div className="col-span-2">
                            <p className="text-gray-500 text-sm">Description</p>
                            <p>{gym.description}</p>
                        </div>
                    </div>

                    <div className="mt-8 border-t border-white/5 pt-6">
                        <h3 className="text-xl font-bold mb-4">Equipment</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            {equipments.map(eq => (
                                <div key={eq.id} className="flex justify-between items-center bg-white/5 p-3 rounded-lg">
                                    <span>{eq.name} <span className="text-gray-500">x{eq.quantity}</span></span>
                                    <Button variant="danger" size="sm" onClick={() => handleDeleteEquipment(eq.id)}>Remove</Button>
                                </div>
                            ))}
                        </div>
                        <form onSubmit={handleAddEquipment} className="flex gap-2">
                            <div className="flex-1">
                                <Input 
                                    placeholder="Equipment Name" 
                                    value={newEquipment.name}
                                    onChange={(e) => setNewEquipment({...newEquipment, name: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="w-24">
                                <Input 
                                    type="number"
                                    placeholder="Qty" 
                                    value={newEquipment.quantity}
                                    onChange={(e) => setNewEquipment({...newEquipment, quantity: parseInt(e.target.value)})}
                                    required
                                    min={1}
                                />
                            </div>
                            <Button type="submit" isLoading={addingEquip}>Add</Button>
                        </form>
                    </div>
                </Card>
            ) : (
                <Card>
                    <h2 className="text-xl font-bold mb-6">{gym ? 'Edit Gym' : 'Register Your Gym'}</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input 
                            label="Gym Name" 
                            value={formData.name} 
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            required
                        />
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input 
                                label="City" 
                                value={formData.city} 
                                onChange={(e) => setFormData({...formData, city: e.target.value})}
                                required
                            />
                            <Input 
                                label="Country" 
                                value={formData.country} 
                                onChange={(e) => setFormData({...formData, country: e.target.value})}
                                required
                            />
                        </div>

                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input 
                                label="Address" 
                                value={formData.address} 
                                onChange={(e) => setFormData({...formData, address: e.target.value})}
                                required
                            />
                            <Input 
                                label="Zip Code" 
                                value={formData.zipCode} 
                                onChange={(e) => setFormData({...formData, zipCode: e.target.value})}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input 
                                label="Email" 
                                type="email"
                                value={formData.email} 
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                            />
                            <Input 
                                label="Phone" 
                                value={formData.phone} 
                                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                            />
                        </div>

                        <Input 
                            label="Description" 
                            value={formData.description} 
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                        />
                         <Input 
                            label="Capacity" 
                            type="number"
                            value={formData.capacity} 
                            onChange={(e) => setFormData({...formData, capacity: parseInt(e.target.value)})}
                        />

                        <div className="flex justify-end gap-4 pt-4">
                            {gym && <Button type="button" variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>}
                            <Button type="submit">Save Changes</Button>
                        </div>
                    </form>
                </Card>
            )}
        </div>
    );
};

export default ManageGymPage;
