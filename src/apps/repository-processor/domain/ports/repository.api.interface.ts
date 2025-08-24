import {
  RepositoryCommitData,
  RepositoryIssueData,
  RepositoryReleaseData,
  RepositoryVulnerabilityData,
  RepositoryData,
} from '../entities/repository.entity';

export const REPOSITORY_API_SERVICE = Symbol('REPOSITORY_API_SERVICE');

export interface IRepositoryApiService {
  getMetadata(repository: string): Promise<RepositoryData>;
  getReleases(repository: string): Promise<RepositoryReleaseData[]>;
  getIssues(repository: string): Promise<RepositoryIssueData[]>;
  getCommits(repository: string): Promise<RepositoryCommitData[]>;
  getVulnerabilities(
    repository: string,
  ): Promise<RepositoryVulnerabilityData[]>;
}
