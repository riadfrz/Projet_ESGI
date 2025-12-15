import { api } from '@/api/interceptor';
import { ApiResponse } from '@/types';
import { 
    EquipmentDto, 
    CreateEquipmentDto, 
    UpdateEquipmentDto, 
    QueryEquipmentsDto,
    PaginatedResponse 
} from '@shared/dto';

class EquipmentService {
    public async getAllEquipments(query?: QueryEquipmentsDto): Promise<ApiResponse<PaginatedResponse<EquipmentDto>>> {
        const queryString = query ? '?' + new URLSearchParams(query as any).toString() : '';
        return api.fetchRequest(`/api/equipment${queryString}`, 'GET');
    }

    public async createEquipment(data: CreateEquipmentDto): Promise<ApiResponse<EquipmentDto>> {
        return api.fetchRequest('/api/equipment', 'POST', data, true);
    }

    public async updateEquipment(id: string, data: UpdateEquipmentDto): Promise<ApiResponse<EquipmentDto>> {
        return api.fetchRequest(`/api/equipment/${id}`, 'PUT', data, true);
    }

    public async deleteEquipment(id: string): Promise<ApiResponse<void>> {
        return api.fetchRequest(`/api/equipment/${id}`, 'DELETE', null, true);
    }
}

export const equipmentService = new EquipmentService();
