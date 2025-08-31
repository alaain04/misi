import { ResourceSingleResponse } from '@libs/api-utils/responses/resource-single.response';
import { RegistryResponseDto } from './dtos/registry.response.dto';

export class RegistryResponse extends ResourceSingleResponse<RegistryResponseDto> {
    constructor(registry: RegistryResponseDto) {
        super(registry);
    }
}
