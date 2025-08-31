import { Controller, Get, Param } from '@nestjs/common';
import { ResourceSingleResponse } from '@libs/api-utils/responses/resource-single.response';
import { ResourceListResponse } from '@libs/api-utils/responses/resource-list.response';
import { GetRepositoryUseCase } from '../application/get-repository.use-case';
import { GetRepositoryIssuesUseCase } from '../application/get-repository-issues.use-case';
import { GetRepositoryVulnerabilitiesUseCase } from '../application/get-repository-vulnerabilities.use-case';
import { GetRepositoryReleasesUseCase } from '../application/get-repository-releases.use-case';
import { RepositoryResponseDto } from './dtos/repository.response.dto';
import { RepositoryIssueResponseDto } from './dtos/repository-issue.response.dto';
import { RepositoryVulnerabilityResponseDto } from './dtos/repository-vulnerability.response.dto';
import { RepositoryReleaseResponseDto } from './dtos/repository-release.response.dto';
import {
    RepositoryResponse,
    RepositoryIssuesResponse,
    RepositoryVulnerabilitiesResponse,
    RepositoryReleasesResponse
} from './repository-response';

@Controller('repositories')
export class RepositoryController {
    constructor(
        private readonly getRepositoryUseCase: GetRepositoryUseCase,
        private readonly getRepositoryIssuesUseCase: GetRepositoryIssuesUseCase,
        private readonly getRepositoryVulnerabilitiesUseCase: GetRepositoryVulnerabilitiesUseCase,
        private readonly getRepositoryReleasesUseCase: GetRepositoryReleasesUseCase,
    ) { }

    @Get(':repositoryUuid')
    async getRepository(
        @Param('repositoryUuid') repositoryUuid: string,
    ): Promise<ResourceSingleResponse<RepositoryResponseDto>> {
        const repository = await this.getRepositoryUseCase.execute(repositoryUuid);
        return new RepositoryResponse(repository);
    }

    @Get(':repositoryUuid/issues')
    async getRepositoryIssues(
        @Param('repositoryUuid') repositoryUuid: string,
    ): Promise<ResourceListResponse<RepositoryIssueResponseDto>> {
        const issues = await this.getRepositoryIssuesUseCase.execute(repositoryUuid);
        return new RepositoryIssuesResponse(issues);
    }

    @Get(':repositoryUuid/vulnerabilities')
    async getRepositoryVulnerabilities(
        @Param('repositoryUuid') repositoryUuid: string,
    ): Promise<ResourceListResponse<RepositoryVulnerabilityResponseDto>> {
        const vulnerabilities = await this.getRepositoryVulnerabilitiesUseCase.execute(repositoryUuid);
        return new RepositoryVulnerabilitiesResponse(vulnerabilities);
    }

    @Get(':repositoryUuid/releases')
    async getRepositoryReleases(
        @Param('repositoryUuid') repositoryUuid: string,
    ): Promise<ResourceListResponse<RepositoryReleaseResponseDto>> {
        const releases = await this.getRepositoryReleasesUseCase.execute(repositoryUuid);
        return new RepositoryReleasesResponse(releases);
    }
}
