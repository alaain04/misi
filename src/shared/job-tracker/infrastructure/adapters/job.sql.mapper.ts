import { JobStatus } from '@shared/job-tracker/domain';
import {
  Job as JobEntity,
  JobData as JobDataEntity,
} from '../../domain/entities/job.entity';
import { Prisma, Job as JobModel } from '@prisma/client';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { PackageJsonData } from '@shared/job-tracker/domain/entities/package-json.entities';
export type JobPrismaModel = JobModel;

export class JobSqlMapper {
  static toDomain(data: Partial<JobPrismaModel>): JobEntity {
    const packageJson = plainToInstance(PackageJsonData, data.packageJson);

    return JobEntity.build(data.uuid, {
      status: data.status as JobStatus,
      packageJson,
      totalDependencies: data.totalDependencies,
      downloadedSuccessfully: data.downloadedSuccessfully,
      downloadedFailed: data.downloadedFailed,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }

  static fromDomainToCreate(data: JobDataEntity): Prisma.JobCreateInput {
    return {
      status: data.status,
      packageJson: instanceToPlain(data.packageJson),
    };
  }
}
