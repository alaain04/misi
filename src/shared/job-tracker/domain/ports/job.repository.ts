import {
  Dependency,
  DependencyData,
} from '@shared/dependency/domain/entities/dependency.entity';
import { Job, JobData } from '../entities/job.entity';

export const JOB_SERVICE = Symbol('JOB_SERVICE');

export interface JobService {
  createWithDependencies(
    data: JobData,
    dependencies: DependencyData[],
  ): Promise<Job>;
  get(uuid: string): Promise<Job | undefined>;
  // update(uuid: string, data: Partial<JobData>): Promise<void>;
  exists(uuid: string): Promise<boolean>;
  // getDependencies(uuid: string): Promise<Dependency[]>;
}
