import {
  RegistryAuthor,
  RegistryData,
  Registry as RegistryEntity,
} from '@apps/registry-processor/domain/entities/registry.entity';
import { Prisma, Registry } from '@prisma/client';

export class RegistrySqlMapper {
  static fromDomainToUpsert(
    dependencyUuid: string,
    repositoryPath: string,
    data: RegistryData,
  ): Prisma.RegistryCreateInput {

    return {
      ...data,
      dependency: dependencyUuid
        ? { connect: { uuid: dependencyUuid } }
        : undefined,
      repository: !repositoryPath
        ? undefined
        : {
          connectOrCreate: {
            where: { path: repositoryPath },
            create: { path: repositoryPath },
          },
        },
    };
  }

  static toDomain(data: Registry): RegistryEntity {
    return RegistryEntity.build(data.uuid, {
      registryId: data.registryId,
      keywords: data.keywords,
      description: data.description,
      repositoryPath: data.repositoryPath,
      author: data.author as RegistryAuthor,
      maintainers: data.maintainers,
      repositoryUuid: data.repositoryUuid,
      licenses: data.licenses,
      downloads: data.downloads,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }
}
