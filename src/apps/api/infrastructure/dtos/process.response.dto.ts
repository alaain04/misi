import { Job, JobStatus } from '@shared/job-tracker';

export class JobResponseDto {
  uuid: string;
  status: JobStatus;
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
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }
}
