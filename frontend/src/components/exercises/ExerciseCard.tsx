import React from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { ExerciseDto, ExerciseWithMusclesDto } from '@shared/dto';
import { Difficulty } from '@shared/enums';

interface ExerciseCardProps {
    exercise: ExerciseDto | ExerciseWithMusclesDto;
    onView?: (id: string) => void;
    isAdmin?: boolean;
    onEdit?: (id: string) => void;
    onDelete?: (id: string) => void;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({ exercise, onView, isAdmin, onEdit, onDelete }) => {
    const difficultyVariant = 
        exercise.difficulty === Difficulty.BEGINNER ? 'success' :
        exercise.difficulty === Difficulty.INTERMEDIATE ? 'warning' : 'danger';

    const muscles = (exercise as ExerciseWithMusclesDto).muscles;

    return (
        <Card hoverEffect className="flex flex-col h-full">
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-bold text-white mb-1">{exercise.name}</h3>
                <Badge variant={difficultyVariant} size="sm">
                    {exercise.difficulty}
                </Badge>
            </div>
            
            <p className="text-gray-400 mb-4 flex-grow line-clamp-2">
                {exercise.description || 'No description provided.'}
            </p>

            {muscles && muscles.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-4">
                    {muscles.slice(0, 3).map(m => (
                        <span key={m.id} className="text-xs bg-white/5 text-gray-300 px-2 py-0.5 rounded">
                            {m.name}
                        </span>
                    ))}
                    {muscles.length > 3 && (
                        <span className="text-xs text-gray-500 px-1">+{muscles.length - 3}</span>
                    )}
                </div>
            )}

            <div className="mt-auto pt-4 border-t border-white/5 flex gap-2">
                <Button 
                    variant="secondary" 
                    size="sm"
                    fullWidth 
                    onClick={() => onView && onView(exercise.id)}
                >
                    View
                </Button>
                
                {isAdmin && (
                    <>
                        <Button 
                            variant="ghost" 
                            size="sm"
                            className="px-2"
                            onClick={() => onEdit && onEdit(exercise.id)}
                        >
                            Edit
                        </Button>
                         <Button 
                            variant="danger" 
                            size="sm"
                            className="px-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20"
                            onClick={() => onDelete && onDelete(exercise.id)}
                        >
                            Del
                        </Button>
                    </>
                )}
            </div>
        </Card>
    );
};
