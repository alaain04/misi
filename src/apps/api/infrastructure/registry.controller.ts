import { Controller, Get, Param } from '@nestjs/common';
import { ResourceSingleResponse } from '@libs/api-utils/responses/resource-single.response';
import { GetRegistryUseCase } from '../application/get-registry.use-case';
import { RegistryResponseDto } from './dtos/registry.response.dto';
import { RegistryResponse } from './registry-response';

@Controller('registries')
export class RegistryController {
    constructor(
        private readonly getRegistryUseCase: GetRegistryUseCase,
    ) { }

    @Get(':dependencyUuid')
    async getRegistry(
        @Param('dependencyUuid') dependencyUuid: string,
    ): Promise<ResourceSingleResponse<RegistryResponseDto>> {
        const registry = await this.getRegistryUseCase.execute(dependencyUuid);
        return new RegistryResponse(registry);
    }
}
