import { Injectable } from '@nestjs/common';
import { Job, JobData } from '../../domain/entities/job.entity';
import { PrismaService } from '@shared/database/prisma.service';
import { JobSqlMapper } from './job.sql.mapper';
import { NotFoundError } from '@libs/errors/not-found.error';
import { JobService } from '@shared/job-tracker/domain/ports/job.repository';
import { DependencyData } from '@shared/dependency/domain/entities/dependency.entity';
import { DependencySqlMapper } from '@shared/dependency';

@Injectable()
export class JobSqlService implements JobService {
  constructor(private readonly db: PrismaService) {}

  async createWithDependencies(
    jobData: JobData,
    dependencies: DependencyData[],
  ): Promise<Job> {
    const created = await this.db.$transaction(async (tx) => {
      const job = await tx.job.create({
        select: { uuid: true },
        data: JobSqlMapper.fromDomainToCreate(jobData),
      });

      const createdDependencies = await tx.dependency.createManyAndReturn({
        select: { uuid: true, name: true, version: true },
        data: DependencySqlMapper.fromDomainToCreate(dependencies),
        skipDuplicates: true,
      });

      const noCreatedDependencies = [];
      for (const dep of dependencies) {
        const found = createdDependencies.find((d) => d.name === dep.name);
        if (!found) {
          noCreatedDependencies.push(dep);
        }
      }

      if (noCreatedDependencies.length) {
        const oldDependencies = await tx.dependency.findMany({
          select: { name: true, version: true, uuid: true },
          where: {
            AND: [
              { name: { in: noCreatedDependencies.map((d) => d.name) } },
              { version: { in: noCreatedDependencies.map((d) => d.version) } },
            ],
          },
        });

        createdDependencies.push(...oldDependencies);
      }

      await tx.jobDependency.createMany({
        data: createdDependencies.map((d) => ({
          dependencyUuid: d.uuid,
          jobUuid: job.uuid,
        })),
        skipDuplicates: true,
      });

      return job;
    });

    return JobSqlMapper.toDomain(created);
  }

  async get(uuid: string): Promise<Job> {
    const job = await this.db.job.findUnique({
      where: { uuid },
    });

    if (!job) {
      throw new NotFoundError('Job not found');
    }
    return JobSqlMapper.toDomain(job);
  }

  // async update(uuid: string, data: Partial<JobData>): Promise<void> {
  //   await this.db.job.update({
  //     where: { uuid },
  //     data: {
  //       ...data,
  //       packageMetadata: instanceToPlain(data.packageMetadata),
  //     },
  //   });
  // }

  async exists(uuid: string): Promise<boolean> {
    const job = await this.db.job.findUnique({
      where: { uuid },
    });

    return !!job;
  }

  // async getDependencies(uuid: string): Promise<Dependency[]> {
  //   const job = await this.db.job.findUnique({
  //     where: { uuid },
  //     include: { dependencies: true },
  //   });

  //   return job.dependencies.map((d) => Dependency.build(d.de.uuid, { ...d }));
  // }
}
