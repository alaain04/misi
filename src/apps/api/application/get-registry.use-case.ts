import { Injectable } from '@nestjs/common';
import { PrismaService } from '@shared/database/prisma.service';
import { RegistryResponseDto } from '../infrastructure/dtos/registry.response.dto';
import { NotFoundError } from '@libs/errors';

@Injectable()
export class GetRegistryUseCase {
    constructor(private readonly prisma: PrismaService) { }

    async execute(dependencyUuid: string): Promise<RegistryResponseDto> {
        const registry = await this.prisma.registry.findUnique({
            where: {
                dependencyUuid,
            },
        });

        if (!registry) {
            throw new NotFoundError(`Registry not found for dependency ${dependencyUuid}`);
        }

        return RegistryResponseDto.fromPrisma(registry);
    }
}
