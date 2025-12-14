import React, { useState, useEffect } from 'react';
import { 
    MuscleDto, 
    CreateMuscleDto, 
    UpdateMuscleDto 
} from '@shared/dto';
import { muscleService } from '@/api/muscleService';
import { useToast } from '@/components/ui/Toast';
import { 
    PlusIcon, 
    PencilIcon, 
    TrashIcon, 
    XMarkIcon
} from '@heroicons/react/24/outline';

const ManageMusclesPage = () => {
    const [muscles, setMuscles] = useState<MuscleDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingMuscle, setEditingMuscle] = useState<MuscleDto | null>(null);
    const { showToast } = useToast();

    // Form State
    const [formData, setFormData] = useState<Partial<CreateMuscleDto>>({
        name: '',
        description: '',
        identifier: ''
    });

    useEffect(() => {
        fetchMuscles();
    }, []);

    const fetchMuscles = async () => {
        try {
            setLoading(true);
            const response = await muscleService.getAllMuscles({ limit: '100' });
            if (response.data) {
                // Handle pagination response structure
                const musclesData = Array.isArray(response.data) 
                    ? response.data 
                    : (response.data as any).data || [];
                setMuscles(musclesData);
            }
        } catch (error) {
            console.error('Error fetching muscles:', error);
            showToast('Failed to load muscles', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (muscle: MuscleDto) => {
        setEditingMuscle(muscle);
        setFormData({
            name: muscle.name,
            description: muscle.description || undefined,
            identifier: muscle.identifier || undefined
        });
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this muscle? This might affect exercises using it.')) return;

        try {
            await muscleService.deleteMuscle(id);
            showToast('Muscle deleted successfully', 'success');
            fetchMuscles();
        } catch (error) {
            console.error('Error deleting muscle:', error);
            showToast('Failed to delete muscle', 'error');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            if (editingMuscle) {
                await muscleService.updateMuscle(editingMuscle.id, formData as UpdateMuscleDto);
                showToast('Muscle updated successfully', 'success');
            } else {
                await muscleService.createMuscle(formData as CreateMuscleDto);
                showToast('Muscle created successfully', 'success');
            }
            
            setShowForm(false);
            setEditingMuscle(null);
            resetForm();
            fetchMuscles();
        } catch (error) {
            console.error('Error saving muscle:', error);
            showToast('Failed to save muscle', 'error');
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            identifier: ''
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white">Manage Muscles</h1>
                    <p className="text-gray-400">Create and manage muscle groups</p>
                </div>
                <button
                    onClick={() => {
                        setEditingMuscle(null);
                        resetForm();
                        setShowForm(true);
                    }}
                    className="btn btn-primary flex items-center gap-2"
                >
                    <PlusIcon className="w-5 h-5" />
                    Add Muscle
                </button>
            </div>

            {/* Muscles List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <p className="text-gray-400">Loading muscles...</p>
                ) : muscles.length === 0 ? (
                    <p className="text-gray-400">No muscles found.</p>
                ) : (
                    muscles.map((muscle) => (
                        <div key={muscle.id} className="card p-6 flex flex-col gap-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold text-lg text-white">{muscle.name}</h3>
                                    <p className="text-xs font-mono text-primary">{muscle.identifier}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(muscle)}
                                        className="p-2 hover:bg-dark-lighter rounded-lg text-gray-400 hover:text-white transition-colors"
                                    >
                                        <PencilIcon className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(muscle.id)}
                                        className="p-2 hover:bg-dark-lighter rounded-lg text-red-400 hover:text-red-300 transition-colors"
                                    >
                                        <TrashIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                            
                            <p className="text-gray-400 text-sm flex-grow">
                                {muscle.description || 'No description provided.'}
                            </p>
                        </div>
                    ))
                )}
            </div>

            {/* Create/Edit Modal */}
            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="card w-full max-w-lg">
                        <div className="p-6 border-b border-dark-lighter flex justify-between items-center">
                            <h2 className="text-xl font-bold text-white">
                                {editingMuscle ? 'Edit Muscle' : 'Create New Muscle'}
                            </h2>
                            <button
                                onClick={() => setShowForm(false)}
                                className="text-gray-400 hover:text-white"
                            >
                                <XMarkIcon className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">
                                    Muscle Name
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="input w-full"
                                    required
                                    placeholder="e.g. Pectoralis Major"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">
                                    Identifier (Code)
                                </label>
                                <input
                                    type="text"
                                    value={formData.identifier}
                                    onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                                    className="input w-full"
                                    placeholder="e.g. CHEST_UPPER"
                                />
                                <p className="text-xs text-gray-500 mt-1">Unique code for system references</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">
                                    Description
                                </label>
                                <textarea
                                    value={formData.description || ''}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="input w-full h-24 resize-none"
                                    placeholder="Describe the muscle group..."
                                />
                            </div>

                            <div className="pt-4 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="btn btn-ghost"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                >
                                    {editingMuscle ? 'Update Muscle' : 'Create Muscle'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageMusclesPage;
