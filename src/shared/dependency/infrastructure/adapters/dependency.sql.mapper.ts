import { Dependency, Prisma } from '@prisma/client';
import {
  DependencyData as DependencyDataEntity,
  Dependency as DependencyEntity,
} from '@shared/dependency/domain/entities/dependency.entity';

export class DependencySqlMapper {
  static fromDomainToCreate(
    dependencies: DependencyDataEntity[],
  ): Prisma.DependencyCreateManyInput[] {
    return dependencies.map((dependency) => ({
      name: dependency.name,
      version: dependency.version,
    }));
  }

  static toDomain(dependency: Dependency): DependencyEntity {
    return DependencyEntity.build(dependency.uuid, {
      name: dependency.name,
      version: dependency.version,
    });
  }
}
