import { Injectable } from '@nestjs/common';
import {
  Dependency,
  DependencyData,
  DependencyService,
} from '@shared/dependency/domain';
import { PrismaService } from '@shared/database/prisma.service';
import { DependencySqlMapper } from './dependency.sql.mapper';

@Injectable()
export class DependencySqlService implements DependencyService {
  constructor(private readonly db: PrismaService) {}

  async get(uuid: string): Promise<Dependency> {
    const dependency = await this.db.dependency.findUnique({
      where: { uuid },
    });

    return DependencySqlMapper.toDomain(dependency);
  }

  async getJobDependencies(uuid: string): Promise<Dependency[]> {
    const job = await this.db.job.findFirst({
      select: { dependencies: { select: { dependency: true } } },
      where: { dependencies: { some: { jobUuid: uuid } } },
    });

    return job.dependencies.map((job) =>
      DependencySqlMapper.toDomain(job.dependency),
    );
  }

  async update(uuid: string, data: Partial<DependencyData>): Promise<void> {
    await this.db.dependency.update({
      where: { uuid: uuid },
      data,
    });
  }
}
