import { Injectable } from '@nestjs/common';
import { PrismaService } from '@shared/database/prisma.service';
import { RepositoryReleaseResponseDto } from '../infrastructure/dtos/repository-release.response.dto';

@Injectable()
export class GetRepositoryReleasesUseCase {
    constructor(private readonly prisma: PrismaService) { }

    async execute(repositoryUuid: string): Promise<RepositoryReleaseResponseDto[]> {
        const releases = await this.prisma.repositoryRelease.findMany({
            where: {
                repositoryUuid,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return releases.map(release => RepositoryReleaseResponseDto.fromPrisma(release));
    }
}
