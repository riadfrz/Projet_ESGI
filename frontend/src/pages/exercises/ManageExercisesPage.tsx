import { useEffect, useState } from 'react';
import { exerciseService } from '@/api/exerciseService';
import { muscleService } from '@/api/muscleService';
import { ExerciseDto, CreateExerciseDto, MuscleDto, ExerciseWithMusclesDto, UpdateExerciseDto } from '@shared/dto';
import { Difficulty } from '@shared/enums';
import { ExerciseCard } from '@/components/exercises/ExerciseCard';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { XMarkIcon } from '@heroicons/react/24/outline';
import Badge from '@/components/ui/Badge';

const ManageExercisesPage = () => {
    const [exercises, setExercises] = useState<ExerciseDto[]>([]);
    const [muscles, setMuscles] = useState<MuscleDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingExercise, setEditingExercise] = useState<ExerciseDto | null>(null);
    const [viewingExercise, setViewingExercise] = useState<ExerciseWithMusclesDto | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [difficultyFilter, setDifficultyFilter] = useState<Difficulty | ''>('');

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
            const query: any = { limit: '1000' };
            if (searchQuery) query.search = searchQuery;
            if (difficultyFilter) query.difficulty = difficultyFilter;

            const [exRes, musRes] = await Promise.all([
                exerciseService.getAllExercises(query),
                muscleService.getAllMuscles()
            ]);
            
            if (exRes.data && !Array.isArray(exRes.data)) {
                setExercises(exRes.data.data);
            } else {
                setExercises([]);
            }

            if (musRes.data && !Array.isArray(musRes.data)) {
                setMuscles(musRes.data.data);
            } else {
                setMuscles([]);
            }

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchData();
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [searchQuery, difficultyFilter]);

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

    const handleEdit = (exercise: ExerciseDto) => {
        setEditingExercise(exercise);
        const exWithMuscles = exercise as ExerciseWithMusclesDto;
        setFormData({
            name: exercise.name,
            description: exercise.description || '',
            difficulty: exercise.difficulty,
            muscleIds: exWithMuscles.muscles ? exWithMuscles.muscles.map(m => m.id) : []
        });
        setShowForm(true);
    };

    const handleView = (id: string) => {
        const exercise = exercises.find(e => e.id === id);
        if (exercise) {
            setViewingExercise(exercise as ExerciseWithMusclesDto);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingExercise) {
                await exerciseService.updateExercise(editingExercise.id, formData as UpdateExerciseDto);
            } else {
                await exerciseService.createExercise(formData as CreateExerciseDto);
            }
            
            setShowForm(false);
            setEditingExercise(null);
            setFormData({
                name: '',
                description: '',
                difficulty: Difficulty.BEGINNER,
                muscleIds: []
            });
            fetchData();
        } catch (error) {
            alert('Failed to save exercise');
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

    const resetForm = () => {
        setEditingExercise(null);
        setFormData({
            name: '',
            description: '',
            difficulty: Difficulty.BEGINNER,
            muscleIds: []
        });
        setShowForm(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-display font-bold">Manage Exercises</h1>
                    <p className="text-gray-400">Total exercises: {exercises.length}</p>
                </div>
                <Button onClick={() => showForm ? setShowForm(false) : resetForm()}>
                    {showForm ? 'Cancel' : 'Create Exercise'}
                </Button>
            </div>

            {/* Filters */}
            <Card className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <Input 
                            placeholder="Search exercises..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="w-full md:w-48">
                        <select 
                            className="w-full bg-dark-bg border border-white/10 rounded-lg px-4 py-2 text-white focus:border-neon-blue focus:ring-1 focus:ring-neon-blue outline-none transition-all h-[42px]"
                            value={difficultyFilter}
                            onChange={(e) => setDifficultyFilter(e.target.value as Difficulty)}
                        >
                            <option value="">All Difficulties</option>
                            {Object.values(Difficulty).map(d => (
                                <option key={d} value={d}>{d}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </Card>

            {showForm && (
                <Card className="mb-8 animate-in fade-in slide-in-from-top-4">
                    <h2 className="text-xl font-bold mb-4">{editingExercise ? 'Edit Exercise' : 'Create New Exercise'}</h2>
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
                            <Button type="submit">{editingExercise ? 'Update Exercise' : 'Save Exercise'}</Button>
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
                            onView={handleView}
                            onEdit={() => handleEdit(exercise)}
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

            {/* View Modal */}
            {viewingExercise && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-dark-card w-full max-w-lg rounded-xl border border-white/10 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-white/10 flex justify-between items-start">
                            <div>
                                <h3 className="text-2xl font-bold font-display">{viewingExercise.name}</h3>
                                <Badge variant={
                                    viewingExercise.difficulty === Difficulty.BEGINNER ? 'success' :
                                    viewingExercise.difficulty === Difficulty.INTERMEDIATE ? 'warning' : 'danger'
                                } className="mt-2">
                                    {viewingExercise.difficulty}
                                </Badge>
                            </div>
                            <button onClick={() => setViewingExercise(null)} className="text-gray-400 hover:text-white">
                                <XMarkIcon className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="p-6 space-y-6">
                            <div>
                                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Description</h4>
                                <p className="text-gray-300 leading-relaxed">
                                    {viewingExercise.description || 'No description provided.'}
                                </p>
                            </div>

                            <div>
                                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Target Muscles</h4>
                                {viewingExercise.muscles && viewingExercise.muscles.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {viewingExercise.muscles.map(m => (
                                            <span key={m.id} className="bg-white/5 text-neon-blue px-3 py-1 rounded-full text-sm border border-neon-blue/20">
                                                {m.name}
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 italic">No specific muscles targeted.</p>
                                )}
                            </div>
                        </div>
                        <div className="p-4 bg-white/5 flex justify-end">
                            <Button onClick={() => setViewingExercise(null)}>Close</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageExercisesPage;
