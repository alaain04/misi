import { Injectable } from '@nestjs/common';
import { PrismaService } from '@shared/database/prisma.service';
import { IRegistryDbService } from '@apps/registry-processor/domain/ports/registry.repository.interface';
import { Registry, RegistryData } from '@apps/registry-processor/domain/entities/registry.entity';
import { RegistrySqlMapper } from './registry.sql-mapper';

@Injectable()
export class RegistrySqlService implements IRegistryDbService {
  constructor(private readonly db: PrismaService) { }

  async get(dependencyUuid: string): Promise<Registry | undefined> {
    const res = await this.db.registry.findUnique({
      select: {
        uuid: true,
        registryId: true,
        keywords: true,
        description: true,
        dependencyUuid: true,
        repositoryPath: true,
        author: true,
        maintainers: true,
        licenses: true,
        downloads: true,
        createdAt: true,
        updatedAt: true,
        repositoryUuid: true,
      },
      where: { dependencyUuid },
    });

    if (!res) return;

    return RegistrySqlMapper.toDomain(res);
  }

  async save(
    dependencyUuid: string,
    repositoryPath: string,
    registry: RegistryData,
  ): Promise<Registry> {
    const data = RegistrySqlMapper.fromDomainToUpsert(
      dependencyUuid,
      repositoryPath,
      registry,
    );

    const saved = await this.db.registry.upsert({
      where: { dependencyUuid },
      create: data,
      update: data,
    });

    return RegistrySqlMapper.toDomain(saved);
  }
}
