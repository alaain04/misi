import { Injectable } from '@nestjs/common';
import { PrismaService } from '@shared/database/prisma.service';
import {
  RepositoryCommitSqlMapper,
  RepositoryIssueSqlMapper,
  RepositorySqlMapper,
  RepositoryReleaseSqlMapper,
  RepositoryVulnerabilitySqlMapper,
} from './repository.sql-mapper';
import {
  RepositoryCommitData,
  RepositoryIssueData,
  Repository,
  RepositoryReleaseData,
  RepositoryVulnerabilityData,
  RepositoryData,
} from '@apps/repository-processor/domain/entities/repository.entity';
import { IRepositoryDbService } from '@apps/repository-processor/domain/ports/repository.db.interface';

@Injectable()
export class RepositoryDbService implements IRepositoryDbService {
  constructor(private readonly db: PrismaService) { }

  async get(path: string): Promise<Repository | undefined> {
    const res = await this.db.repository.findUnique({
      where: { path },
    });

    if (!res) return;

    return RepositorySqlMapper.toDomain(res);
  }

  async save(uuid: string, path: string, repository: RepositoryData): Promise<void> {
    const data = RepositorySqlMapper.fromDomainToUpsert(uuid, path, repository);

    await this.db.repository.upsert({
      where: { uuid, path },
      create: data,
      update: data,
    });
  }

  async saveReleases(
    repositoryPath: string,
    releases: RepositoryReleaseData[],
  ): Promise<void> {
    const data = releases.map((release) =>
      RepositoryReleaseSqlMapper.fromDomainToUpsert(repositoryPath, release),
    );

    await this.db.$transaction(async (tx) => {
      const res = await tx.repositoryRelease.createManyAndReturn({
        select: { releaseId: true },
        data,
        skipDuplicates: true,
      });
      const createdIds = res.map(({ releaseId }) => releaseId);

      const notCreated = data.filter(
        ({ releaseId }: { releaseId: string }) => !createdIds.includes(releaseId),
      );

      if (notCreated.length) {
        for (const release of notCreated) {
          await tx.repositoryRelease.update({
            where: { releaseId: release.releaseId },
            data: release,
          });
        }
      }
    });
  }

  async saveIssues(
    repositoryPath: string,
    issues: RepositoryIssueData[],
  ): Promise<void> {
    const data = issues.map((issue) =>
      RepositoryIssueSqlMapper.fromDomainToUpsert(repositoryPath, issue),
    );

    await this.db.$transaction(async (tx) => {
      const res = await tx.repositoryIssue.createManyAndReturn({
        select: { issueId: true },
        data,
        skipDuplicates: true,
      });
      const createdIds = res.map(({ issueId }) => issueId);

      const notCreated = data.filter(
        ({ issueId }: { issueId: string }) => !createdIds.includes(issueId),
      );

      if (notCreated.length) {
        for (const issue of notCreated) {
          await tx.repositoryIssue.update({
            where: { issueId: issue.issueId },
            data: issue,
          });
        }
      }
    });
  }

  async saveCommits(
    repositoryPath: string,
    commits: RepositoryCommitData[],
  ): Promise<void> {
    const data = commits.map((commit) =>
      RepositoryCommitSqlMapper.fromDomainToUpsert(repositoryPath, commit),
    );

    await this.db.$transaction(async (tx) => {
      const res = await tx.repositoryCommit.createManyAndReturn({
        select: { commitId: true },
        data,
        skipDuplicates: true,
      });
      const createdIds = res.map(({ commitId }) => commitId);

      const notCreated = data.filter(
        ({ commitId }: { commitId: string }) => !createdIds.includes(commitId),
      );

      if (notCreated.length) {
        for (const commit of notCreated) {
          await tx.repositoryCommit.update({
            where: { commitId: commit.commitId },
            data: commit,
          });
        }
      }
    });
  }

  async saveVulnerabilities(
    repositoryPath: string,
    vulnerabilities: RepositoryVulnerabilityData[],
  ): Promise<void> {
    const data = vulnerabilities.map((vulnerability) =>
      RepositoryVulnerabilitySqlMapper.fromDomainToUpsert(
        repositoryPath,
        vulnerability,
      ),
    );

    await this.db.$transaction(async (tx) => {
      const res = await tx.repositoryVulnerability.createManyAndReturn({
        select: { vulnerabilityId: true },
        data,
        skipDuplicates: true,
      });
      const createdIds = res.map(({ vulnerabilityId }) => vulnerabilityId);

      const notCreated = data.filter(
        ({ vulnerabilityId }: { vulnerabilityId: string }) => !createdIds.includes(vulnerabilityId),
      );

      if (notCreated.length) {
        for (const vulnerability of notCreated) {
          await tx.repositoryVulnerability.update({
            where: { vulnerabilityId: vulnerability.vulnerabilityId },
            data: vulnerability,
          });
        }
      }
    });
  }
}
