import { Injectable } from '@nestjs/common';
import { PrismaService } from '@shared/database/prisma.service';
import { RepositoryResponseDto } from '../infrastructure/dtos/repository.response.dto';
import { NotFoundError } from '@libs/errors';

@Injectable()
export class GetRepositoryUseCase {
    constructor(private readonly prisma: PrismaService) { }

    async execute(repositoryUuid: string): Promise<RepositoryResponseDto> {
        const repository = await this.prisma.repository.findUnique({
            where: {
                uuid: repositoryUuid,
            },
        });

        if (!repository) {
            throw new NotFoundError(`Repository not found with UUID ${repositoryUuid}`);
        }

        return RepositoryResponseDto.fromPrisma(repository);
    }
}
