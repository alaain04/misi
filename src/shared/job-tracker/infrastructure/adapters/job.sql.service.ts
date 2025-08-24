import { Injectable } from '@nestjs/common';
import { Job, JobData } from '../../domain/entities/job.entity';
import { PrismaService } from '@shared/database/prisma.service';
import { JobSqlMapper } from './job.sql.mapper';
import { NotFoundError } from '@libs/errors/not-found.error';
import { JobService } from '@shared/job-tracker/domain/ports/job.repository';
import {
  Dependency,
  DependencyData,
  DependencySqlMapper,
} from '@shared/dependency';
import { JobStatus } from '@shared/job-tracker/domain';
import { JobDependencyStatus } from '@prisma/client';
import { JobDependencyCmd } from '@shared/job-tracker/domain/events/entity-change.type';


@Injectable()
export class JobSqlService implements JobService {
  constructor(private readonly db: PrismaService) { }

  async create(jobData: JobData): Promise<Job> {
    const job = await this.db.job.create({
      select: { uuid: true, packageJson: true, status: true },
      data: JobSqlMapper.fromDomainToCreate(jobData),
    });

    return JobSqlMapper.toDomain(job);
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

  async exists(uuid: string): Promise<string | undefined> {
    const job = await this.db.job.findUnique({
      where: { uuid },
    });

    return job?.uuid;
  }

  async addDependencies(
    job: Job,
    dependencies: DependencyData[],
  ): Promise<Dependency[]> {
    const upsertedDeps = await this.db.$transaction(async (tx) => {
      const { status } = job.getData();

      const updatedJob = await tx.job.update({
        select: { uuid: true },
        where: { uuid: job.uuid },
        data: { status, totalDependencies: dependencies.length },
      });

      const selectDepQuery = {
        uuid: true,
        name: true,
        version: true,
        createdAt: true,
        updatedAt: true,
      };

      const createdDependencies = await tx.dependency.createManyAndReturn({
        select: selectDepQuery,
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
          select: selectDepQuery,
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
          status: JobDependencyStatus.RUNNING,
          dependencyUuid: d.uuid,
          jobUuid: updatedJob.uuid,
        })),
        skipDuplicates: true,
      });

      return createdDependencies;
    });

    return upsertedDeps.map((d) => DependencySqlMapper.toDomain(d));
  }

  async setStatus(uuid: string, status: JobStatus, error?: string): Promise<void> {
    await this.db.job.update({
      where: { uuid },
      data: { status, error },
    });
  }

  async updateJobDependency(jobUuid: string, dependencyUuid: string, data: JobDependencyCmd): Promise<void> {
    await this.db.jobDependency.update({
      where: {
        jobUuid_dependencyUuid: {
          jobUuid,
          dependencyUuid,
        },
      },
      data: {
        status: data.status,
        trace: { push: data.trace },
        error: data.error,
      },
    });
  }
}
