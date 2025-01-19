import { JobStatus } from '@shared/job-tracker/domain';
import {
  Job as JobEntity,
  JobData as JobDataEntity,
} from '../../domain/entities/job.entity';
import { Prisma, Job as JobModel } from '@prisma/client';
import { instanceToPlain, plainToInstance } from 'class-transformer';
export type JobPrismaModel = JobModel;

class PackageData {
  name: string;
  version: string;
  description?: string;
  author?: string;
}
export class JobSqlMapper {
  static toDomain(data: Partial<JobPrismaModel>): JobEntity {
    const packageMetadata = plainToInstance(PackageData, data.packageMetadata);

    return JobEntity.build(data.uuid, {
      status: data.status as JobStatus,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      packageMetadata,
      dependencies: [],
    });
  }

  static fromDomainToCreate(data: JobDataEntity): Prisma.JobCreateInput {
    return {
      status: data.status,
      packageMetadata: instanceToPlain(data.packageMetadata),
    };
  }
}
