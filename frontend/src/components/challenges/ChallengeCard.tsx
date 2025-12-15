import React from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { ChallengeDto } from '@shared/dto';
import { ChallengeDifficulty } from '@shared/enums';
import { useNavigate } from 'react-router-dom';

interface ChallengeCardProps {
    challenge: ChallengeDto;
    onView?: (id: string) => void;
    onJoin?: (id: string) => void;
    isJoined?: boolean;
}

export const ChallengeCard: React.FC<ChallengeCardProps> = ({ challenge, onView, onJoin, isJoined }) => {
    const navigate = useNavigate();
    const handleView = () => {
        if (onView) onView(challenge.id);
        else navigate(`/dashboard/client/challenges/${challenge.id}`);
    };

    const difficultyVariant = 
        challenge.difficulty === ChallengeDifficulty.EASY ? 'success' :
        challenge.difficulty === ChallengeDifficulty.MEDIUM ? 'warning' : 'danger';

    return (
        <Card hoverEffect className="flex flex-col h-full relative overflow-hidden group">
            {/* Hover glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-neon-blue/0 to-neon-purple/0 group-hover:from-neon-blue/5 group-hover:to-neon-purple/5 transition-all duration-500" />
            
            <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                    <Badge variant={difficultyVariant} size="sm">
                        {challenge.difficulty}
                    </Badge>
                    <span className="text-xs text-gray-500 bg-white/5 px-2 py-1 rounded">
                        {challenge.duration} Days
                    </span>
                </div>

                <h3 className="text-xl font-bold text-white mb-2">{challenge.title}</h3>
                
                <p className="text-gray-400 mb-6 flex-grow line-clamp-2">
                    {challenge.description || 'No description provided.'}
                </p>

                <div className="flex flex-col gap-2 mt-auto pt-4 border-t border-white/5">
                    <div className="flex justify-between text-sm text-gray-400 mb-2">
                        <span>Goal: {challenge.objectiveValue} {challenge.objectiveType.toLowerCase()}</span>
                        <span>{challenge.status}</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                        <Button 
                            variant="secondary" 
                            size="sm"
                            onClick={handleView}
                        >
                            Details
                        </Button>
                        {!isJoined && onJoin && (
                            <Button 
                                variant="primary" 
                                size="sm"
                                onClick={() => onJoin(challenge.id)}
                            >
                                Join
                            </Button>
                        )}
                        {isJoined && (
                            <Button 
                                variant="ghost" 
                                size="sm"
                                disabled
                                className="text-green-400 border border-green-500/30"
                            >
                                Joined
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </Card>
    );
};
