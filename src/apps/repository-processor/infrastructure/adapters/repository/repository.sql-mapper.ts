import {
  RepositoryCommitData,
  RepositoryIssueData,
  Repository as RepositoryEntity,
  RepositoryReleaseData,
  RepositoryVulnerabilityData,
  RepositoryData,
} from '@apps/repository-processor/domain/entities/repository.entity';
import { Prisma, Repository, RepositoryRelease, RepositoryIssue, RepositoryCommit, RepositoryVulnerability } from '@prisma/client';

export class RepositorySqlMapper {
  static fromDomainToUpsert(
    uuid: string,
    path: string,
    data: RepositoryData,
  ): Prisma.RepositoryCreateInput {
    return {
      ...data,
      uuid,
      path,
    };
  }

  static toDomain(data: Repository): RepositoryEntity {
    return RepositoryEntity.build(data.uuid, {
      path: data.path,
      name: data.name,
      fullName: data.fullName,
      url: data.url,
      description: data.description,
      size: data.size,
      topics: data.topics,
      language: data.language,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }
}

export class RepositoryReleaseSqlMapper {
  static toDomain(data: RepositoryRelease): Partial<RepositoryReleaseData> {
    return {
      repository: { uuid: data.repositoryUuid } as RepositoryEntity,
      updatedAt: data.updatedAt,
    };
  }

  static fromDomainToUpsert(
    repositoryUuid: string,
    data: RepositoryReleaseData,
  ): Prisma.RepositoryReleaseCreateManyInput {
    return {
      ...data,
      repositoryUuid,
    };
  }
}

export class RepositoryIssueSqlMapper {
  static toDomain(data: RepositoryIssue): Partial<RepositoryIssueData> {
    return {
      repository: { uuid: data.repositoryUuid } as RepositoryEntity,
      updatedAt: data.updatedAt,
    };
  }

  static fromDomainToUpsert(
    repositoryUuid: string,
    data: RepositoryIssueData,
  ): Prisma.RepositoryIssueCreateManyInput {
    return {
      ...data,
      body: data.body ?? '',
      repositoryUuid,
    };
  }
}

export class RepositoryCommitSqlMapper {
  static toDomain(data: RepositoryCommit): Partial<RepositoryCommitData> {
    return {
      repository: { uuid: data.repositoryUuid } as RepositoryEntity,
      updatedAt: data.updatedAt,
    };
  }

  static fromDomainToUpsert(
    repositoryUuid: string,
    data: RepositoryCommitData,
  ): Prisma.RepositoryCommitCreateManyInput {
    return {
      ...data,
      repositoryUuid,
    };
  }
}

export class RepositoryVulnerabilitySqlMapper {
  static toDomain(data: RepositoryVulnerability): Partial<RepositoryVulnerabilityData> {
    return {
      repository: { uuid: data.repositoryUuid } as RepositoryEntity,
      updatedAt: data.updatedAt,
    };
  }

  static fromDomainToUpsert(
    repositoryUuid: string,
    data: RepositoryVulnerabilityData,
  ): Prisma.RepositoryVulnerabilityCreateManyInput {
    return {
      ...data,
      repositoryUuid,
    };
  }
}
