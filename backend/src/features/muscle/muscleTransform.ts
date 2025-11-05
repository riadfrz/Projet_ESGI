import { Muscle } from '@/config/client';
import { transformDateToString } from '@/utils';
import { MuscleDto } from '@shared/dto';

class MuscleTransform {
    /**
     * Transform Prisma Muscle to MuscleDto
     */
    public toMuscleDto(muscle: Muscle): MuscleDto {
        const muscleDate = transformDateToString(muscle);
        return {
            ...muscleDate,
        };
    }

    /**
     * Transform array of Prisma Muscles to MuscleDto array
     */
    public toMuscleDtoArray(muscles: Muscle[]): MuscleDto[] {
        return muscles.map(muscle => this.toMuscleDto(muscle));
    }
}

export const muscleTransform = new MuscleTransform();
