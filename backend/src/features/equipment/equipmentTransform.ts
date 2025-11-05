import { GymEquipment } from '@/config/client';
import { transformDateToString } from '@/utils';
import { EquipmentDto } from '@shared/dto';

class EquipmentTransform {
    /**
     * Transform Prisma GymEquipment to EquipmentDto
     */
    public toEquipmentDto(equipment: GymEquipment): EquipmentDto {
        const equipmentDate = transformDateToString(equipment);
        return {
            ...equipmentDate,
        };
    }

    /**
     * Transform array of Prisma GymEquipments to EquipmentDto array
     */
    public toEquipmentDtoArray(equipments: GymEquipment[]): EquipmentDto[] {
        return equipments.map(equipment => this.toEquipmentDto(equipment));
    }
}

export const equipmentTransform = new EquipmentTransform();
