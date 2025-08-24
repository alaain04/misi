import {
  RepositoryCommitData,
  RepositoryIssueData,
  Repository as RepositoryEntity,
  RepositoryReleaseData,
  RepositoryVulnerabilityData,
  RepositoryData,
} from '@apps/repository-processor/domain/entities/repository.entity';
import { Prisma, Repository } from '@prisma/client';

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
