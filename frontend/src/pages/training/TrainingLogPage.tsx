import { useEffect, useState } from 'react';
import { trainingService } from '@/api/trainingService';
import { exerciseService } from '@/api/exerciseService';
import { TrainingSessionDto, ExerciseDto } from '@shared/dto';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

const TrainingLogPage = () => {
    const [sessions, setSessions] = useState<TrainingSessionDto[]>([]);
    const [exercises, setExercises] = useState<ExerciseDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        exerciseId: '',
        duration: 30,
        caloriesBurned: 0,
        repetitions: 0,
        notes: '',
        date: new Date().toISOString().split('T')[0]
    });

    const fetchData = async () => {
        setLoading(true);
        try {
            const [sessionsRes, exercisesRes] = await Promise.all([
                trainingService.getAllSessions(),
                exerciseService.getAllExercises()
            ]);
            
            // Safe handling for sessions
            if (Array.isArray(sessionsRes)) {
                setSessions(sessionsRes);
            } else if (sessionsRes && Array.isArray(sessionsRes.data)) {
                setSessions(sessionsRes.data);
            } else {
                setSessions([]);
            }

            // Safe handling for exercises
            if (Array.isArray(exercisesRes)) {
                setExercises(exercisesRes);
            } else if (exercisesRes && Array.isArray(exercisesRes.data)) {
                setExercises(exercisesRes.data);
            } else {
                setExercises([]);
            }

        } catch (error) {
            console.error(error);
            setSessions([]);
            setExercises([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await trainingService.createSession({
                ...formData,
                date: new Date(formData.date).toISOString()
            });
            setShowForm(false);
            fetchData(); // Refresh list
        } catch (error) {
            alert('Failed to log session');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-display font-bold">Training Log</h1>
                <Button onClick={() => setShowForm(!showForm)}>
                    {showForm ? 'Cancel' : 'Log Workout'}
                </Button>
            </div>

            {showForm && (
                <Card className="mb-8 animate-in fade-in slide-in-from-top-4">
                    <h2 className="text-xl font-bold mb-4">Log New Session</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Exercise</label>
                            <select 
                                className="w-full bg-dark-bg border border-white/10 rounded-lg px-4 py-2 text-white focus:border-neon-blue focus:ring-1 focus:ring-neon-blue outline-none transition-all"
                                value={formData.exerciseId}
                                onChange={(e) => setFormData({...formData, exerciseId: e.target.value})}
                                required
                            >
                                <option value="">Select an exercise...</option>
                                {exercises.map(ex => (
                                    <option key={ex.id} value={ex.id}>{ex.name} ({ex.difficulty})</option>
                                ))}
                            </select>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input 
                                label="Duration (minutes)" 
                                type="number" 
                                value={formData.duration}
                                onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value)})}
                                required
                            />
                            <Input 
                                label="Calories Burned" 
                                type="number" 
                                value={formData.caloriesBurned}
                                onChange={(e) => setFormData({...formData, caloriesBurned: parseInt(e.target.value)})}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <Input 
                                label="Repetitions" 
                                type="number" 
                                value={formData.repetitions}
                                onChange={(e) => setFormData({...formData, repetitions: parseInt(e.target.value)})}
                            />
                            <Input 
                                label="Date" 
                                type="date" 
                                value={formData.date}
                                onChange={(e) => setFormData({...formData, date: e.target.value})}
                                required
                            />
                        </div>
                        
                         <Input 
                            label="Notes" 
                            value={formData.notes}
                            onChange={(e) => setFormData({...formData, notes: e.target.value})}
                        />

                        <div className="flex justify-end pt-4">
                            <Button type="submit">Save Workout</Button>
                        </div>
                    </form>
                </Card>
            )}

            {loading ? (
                <div className="text-center py-12">Loading history...</div>
            ) : (
                <div className="space-y-4">
                    {sessions.map(session => {
                        const exercise = exercises.find(e => e.id === session.exerciseId);
                        return (
                            <Card key={session.id} className="flex justify-between items-center">
                                <div>
                                    <h3 className="font-bold text-lg">{exercise?.name || 'Unknown Exercise'}</h3>
                                    <p className="text-gray-400 text-sm">
                                        {new Date(session.createdAt).toLocaleDateString()} • {session.duration} mins
                                    </p>
                                    {session.notes && <p className="text-gray-500 text-sm mt-1">"{session.notes}"</p>}
                                </div>
                                <div className="text-right">
                                    <p className="text-neon-cyan font-bold">{session.caloriesBurned} kcal</p>
                                    {session.repetitions && <p className="text-sm text-gray-400">{session.repetitions} reps</p>}
                                </div>
                            </Card>
                        );
                    })}
                    {sessions.length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                            No workouts logged yet. Start training!
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default TrainingLogPage;
