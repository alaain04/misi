import { JobDependencyTrace } from '@prisma/client';
import {
  RepositoryCommitData,
  RepositoryIssueData,
  Repository,
  RepositoryReleaseData,
  RepositoryVulnerabilityData,
  RepositoryData,
} from '../entities/repository.entity';

export const REPOSITORY_DB_SERVICE = Symbol('REPOSITORY_DB_SERVICE');

export interface IRepositoryDbService {
  get(path: string): Promise<Repository>;
  save(uuid: string, path: string, metadata?: RepositoryData): Promise<void>;

  getLastSearch(dependencyUuid: string, trace: JobDependencyTrace): Promise<Date | null>

  saveReleases(
    repositoryPath: string,
    releases: RepositoryReleaseData[],
  ): Promise<void>;

  saveIssues(
    repositoryPath: string,
    issues: RepositoryIssueData[],
  ): Promise<void>;

  saveCommits(
    repositoryPath: string,
    commits: RepositoryCommitData[],
  ): Promise<void>;

  saveVulnerabilities(
    repositoryPath: string,
    vulnerabilities: RepositoryVulnerabilityData[],
  ): Promise<void>;
}
