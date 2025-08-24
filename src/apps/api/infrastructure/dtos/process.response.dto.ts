import { Job, JobStatus } from '@shared/job-tracker';

export class JobResponseDto {
  uuid: string;
  status: JobStatus;
  downloadedFailed: number;
  downloadedSuccessful: number;
  totalDependencies: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: JobResponseDto) {
    Object.assign(this, data);
  }

  static fromDomain(entity: Job): JobResponseDto {
    const data = entity.getData();

    return new JobResponseDto({
      uuid: data.uuid,
      status: data.status,
      downloadedFailed: data.downloadedFailed ?? 0,
      downloadedSuccessful: data.downloadedSuccessfully ?? 0,
      totalDependencies: data.totalDependencies ?? 0,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }
}
