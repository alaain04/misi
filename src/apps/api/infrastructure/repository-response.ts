import { ResourceSingleResponse } from '@libs/api-utils/responses/resource-single.response';
import { ResourceListResponse } from '@libs/api-utils/responses/resource-list.response';
import { RepositoryResponseDto } from './dtos/repository.response.dto';
import { RepositoryIssueResponseDto } from './dtos/repository-issue.response.dto';
import { RepositoryVulnerabilityResponseDto } from './dtos/repository-vulnerability.response.dto';
import { RepositoryReleaseResponseDto } from './dtos/repository-release.response.dto';

export class RepositoryResponse extends ResourceSingleResponse<RepositoryResponseDto> {
    constructor(repository: RepositoryResponseDto) {
        super(repository);
    }
}

export class RepositoryIssuesResponse extends ResourceListResponse<RepositoryIssueResponseDto> {
    constructor(issues: RepositoryIssueResponseDto[]) {
        super(issues);
    }
}

export class RepositoryVulnerabilitiesResponse extends ResourceListResponse<RepositoryVulnerabilityResponseDto> {
    constructor(vulnerabilities: RepositoryVulnerabilityResponseDto[]) {
        super(vulnerabilities);
    }
}

export class RepositoryReleasesResponse extends ResourceListResponse<RepositoryReleaseResponseDto> {
    constructor(releases: RepositoryReleaseResponseDto[]) {
        super(releases);
    }
}
