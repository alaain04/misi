import { Injectable } from '@nestjs/common';
import { PrismaService } from '@shared/database/prisma.service';
import { RepositoryIssueResponseDto } from '../infrastructure/dtos/repository-issue.response.dto';

@Injectable()
export class GetRepositoryIssuesUseCase {
    constructor(private readonly prisma: PrismaService) { }

    async execute(repositoryUuid: string): Promise<RepositoryIssueResponseDto[]> {
        const issues = await this.prisma.repositoryIssue.findMany({
            where: {
                repositoryUuid,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return issues.map(issue => RepositoryIssueResponseDto.fromPrisma(issue));
    }
}
