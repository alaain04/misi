import { Injectable } from '@nestjs/common';
import { PrismaService } from '@shared/database/prisma.service';
import { RepositoryVulnerabilityResponseDto } from '../infrastructure/dtos/repository-vulnerability.response.dto';

@Injectable()
export class GetRepositoryVulnerabilitiesUseCase {
    constructor(private readonly prisma: PrismaService) { }

    async execute(repositoryUuid: string): Promise<RepositoryVulnerabilityResponseDto[]> {
        const vulnerabilities = await this.prisma.repositoryVulnerability.findMany({
            where: {
                repositoryUuid,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return vulnerabilities.map(vulnerability =>
            RepositoryVulnerabilityResponseDto.fromPrisma(vulnerability)
        );
    }
}
