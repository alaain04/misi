import { Injectable } from '@nestjs/common';
import { Dependency, DependencyService } from '@shared/dependency/domain';
import { PrismaService } from '@shared/database/prisma.service';
import { DependencySqlMapper } from './dependency.sql.mapper';

@Injectable()
export class DependencySqlService implements DependencyService {
  constructor(private readonly db: PrismaService) {}

  async exists(uuid: string): Promise<boolean> {
    const job = await this.db.dependency.findUnique({
      where: { uuid },
    });

    return !!job;
  }

  async getJobDependencies(uuid: string): Promise<Dependency[]> {
    const job = await this.db.job.findFirst({
      select: { dependencies: { select: { dependency: true } } },
      where: { dependencies: { some: { jobUuid: uuid } } },
    });

    return job.dependencies.map((jobDepencency) =>
      DependencySqlMapper.toDomain(jobDepencency.dependency),
    );
  }
}
