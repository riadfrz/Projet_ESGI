import { Gym } from '@/config/client';
import { transformDateToString } from '@/utils';
import { GymDto } from '@shared/dto';
import { GymStatus } from '@shared/enums';

class GymTransform {
    /**
     * Transform Prisma Gym to GymDto
     */
    public toGymDto(gym: Gym): GymDto {
        const gymDate = transformDateToString(gym);
        return {
            ...gymDate,
            status: gymDate.status as GymStatus,
        };
    }

    /**
     * Transform array of Prisma Gyms to GymDto array
     */
    public toGymDtoArray(gyms: Gym[]): GymDto[] {
        return gyms.map(gym => this.toGymDto(gym));
    }
}

export const gymTransform = new GymTransform();
