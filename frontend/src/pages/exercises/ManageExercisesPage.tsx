import { useEffect, useState } from 'react';
import { exerciseService } from '@/api/exerciseService';
import { muscleService } from '@/api/muscleService';
import { ExerciseDto, CreateExerciseDto, MuscleDto } from '@shared/dto';
import { Difficulty } from '@shared/enums';
import { ExerciseCard } from '@/components/exercises/ExerciseCard';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';

const ManageExercisesPage = () => {
    const [exercises, setExercises] = useState<ExerciseDto[]>([]);
    const [muscles, setMuscles] = useState<MuscleDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    // Form State
    const [formData, setFormData] = useState<Partial<CreateExerciseDto>>({
        name: '',
        description: '',
        difficulty: Difficulty.BEGINNER,
        muscleIds: []
    });

    const fetchData = async () => {
        setLoading(true);
        try {
            const [exRes, musRes] = await Promise.all([
                exerciseService.getAllExercises(),
                muscleService.getAllMuscles()
            ]);
            
            if (Array.isArray(exRes)) setExercises(exRes);
            else if (exRes && Array.isArray(exRes.data)) setExercises(exRes.data);
            else setExercises([]);

            if (Array.isArray(musRes)) setMuscles(musRes);
            else if (musRes && Array.isArray(musRes.data)) setMuscles(musRes.data);
            else setMuscles([]);

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const toggleMuscle = (id: string) => {
        setFormData(prev => {
            const current = prev.muscleIds || [];
            if (current.includes(id)) {
                return { ...prev, muscleIds: current.filter(m => m !== id) };
            } else {
                return { ...prev, muscleIds: [...current, id] };
            }
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await exerciseService.createExercise(formData as CreateExerciseDto);
            setShowForm(false);
            setFormData({
                name: '',
                description: '',
                difficulty: Difficulty.BEGINNER,
                muscleIds: []
            });
            fetchData();
        } catch (error) {
            alert('Failed to create exercise');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure?')) return;
        try {
            await exerciseService.deleteExercise(id);
            fetchData();
        } catch (error) {
            alert('Failed to delete');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-display font-bold">Manage Exercises</h1>
                <Button onClick={() => setShowForm(!showForm)}>
                    {showForm ? 'Cancel' : 'Create Exercise'}
                </Button>
            </div>

            {showForm && (
                <Card className="mb-8 animate-in fade-in slide-in-from-top-4">
                    <h2 className="text-xl font-bold mb-4">Create New Exercise</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input 
                            label="Name" 
                            value={formData.name} 
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            required
                        />
                         <Input 
                            label="Description" 
                            value={formData.description} 
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                        />

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Difficulty</label>
                            <select 
                                className="w-full bg-dark-bg border border-white/10 rounded-lg px-4 py-2 text-white focus:border-neon-blue focus:ring-1 focus:ring-neon-blue outline-none transition-all"
                                value={formData.difficulty}
                                onChange={(e) => setFormData({...formData, difficulty: e.target.value as Difficulty})}
                            >
                                {Object.values(Difficulty).map(t => (
                                    <option key={t} value={t}>{t}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Target Muscles</label>
                            <div className="flex flex-wrap gap-2">
                                {muscles.map(muscle => {
                                    const isSelected = formData.muscleIds?.includes(muscle.id);
                                    return (
                                        <button
                                            key={muscle.id}
                                            type="button"
                                            onClick={() => toggleMuscle(muscle.id)}
                                            className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                                                isSelected 
                                                    ? 'bg-neon-blue text-white shadow-lg shadow-neon-blue/20' 
                                                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                            }`}
                                        >
                                            {muscle.name} {isSelected && '✓'}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <Button type="submit">Save Exercise</Button>
                        </div>
                    </form>
                </Card>
            )}

            {loading ? (
                <div className="text-center py-12">Loading exercises...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {exercises.map(exercise => (
                        <ExerciseCard 
                            key={exercise.id} 
                            exercise={exercise} 
                            isAdmin
                            onDelete={handleDelete}
                        />
                    ))}
                    {exercises.length === 0 && (
                        <div className="col-span-full text-center py-12 text-gray-500">
                            No exercises found.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ManageExercisesPage;
