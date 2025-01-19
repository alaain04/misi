import { BaseEntity, JustProps, ValueObject } from '@libs/entity';
import { JobStatus } from './job-status.enum';
import { Dependency } from '@shared/dependency';

type PackageData = {
  name: string;
  version: string;
  description?: string;
  author?: string;
};

export class JobData extends ValueObject {
  status: JobStatus;
  packageMetadata: PackageData;
  createdAt: Date;
  updatedAt: Date;
  dependencies: Dependency[];

  static build(data: Partial<JustProps<JobData>>): JobData {
    return new JobData(data);
  }
}

export class Job extends BaseEntity<JobData> {
  static build(uuid: string, data: JustProps<JobData>): Job {
    return new Job(uuid, data);
  }
}
