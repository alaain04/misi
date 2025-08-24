import { BaseEntity, JustProps, ValueObject } from '@libs/entity';
import { JobStatus } from './job-status.enum';
import { PackageJsonData } from './package-json.entities';

export class JobData extends ValueObject {
  status: JobStatus;
  packageJson: PackageJsonData;
  error?: string;
  totalDependencies?: number;
  downloadedSuccessfully?: number;
  downloadedFailed?: number;
  createdAt: Date;
  updatedAt: Date;

  static build(data: Partial<JustProps<JobData>>): JobData {
    return new JobData(data);
  }
}

export class Job extends BaseEntity<JobData> {
  static build(uuid: string, data: Partial<JustProps<JobData>>): Job {
    return new Job(uuid, JobData.build(data));
  }
}
