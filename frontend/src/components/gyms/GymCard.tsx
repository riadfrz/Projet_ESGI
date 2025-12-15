import React from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { GymDto } from '@shared/dto';
import { GymStatus } from '@shared/enums';

interface GymCardProps {
    gym: GymDto;
    onView?: (id: string) => void;
}

export const GymCard: React.FC<GymCardProps> = ({ gym, onView }) => {
    return (
        <Card hoverEffect className="flex flex-col h-full">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-xl font-bold text-white mb-1">{gym.name}</h3>
                    <p className="text-gray-400 text-sm">{gym.city}, {gym.country}</p>
                </div>
                <Badge variant={gym.status === GymStatus.APPROVED ? 'success' : gym.status === GymStatus.PENDING ? 'warning' : 'danger'}>
                    {gym.status}
                </Badge>
            </div>
            
            <p className="text-gray-400 mb-6 flex-grow line-clamp-3">
                {gym.description || 'No description provided.'}
            </p>

            <div className="mt-auto pt-4 border-t border-white/5">
                <Button 
                    variant="secondary" 
                    fullWidth 
                    onClick={() => onView && onView(gym.id)}
                >
                    View Details
                </Button>
            </div>
        </Card>
    );
};
