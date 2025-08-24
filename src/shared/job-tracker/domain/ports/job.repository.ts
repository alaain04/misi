import { Dependency, DependencyData } from '@shared/dependency';
import { Job, JobData } from '../entities/job.entity';
import { JobStatus } from '../entities';

export const JOB_SERVICE = Symbol('JOB_SERVICE');


export interface JobService {
  create(data: JobData): Promise<Job>;
  addDependencies(
    data: Job,
    dependencies: DependencyData[],
  ): Promise<Dependency[]>;
  get(uuid: string): Promise<Job | undefined>;
  exists(uuid: string): Promise<string | undefined>;
  setStatus(uuid: string, status: JobStatus, error?: string): Promise<void>;
  updateJobDependency(
    jobUuid: string,
    dependencyUuid: string,
    cmd: { status?: string; trace: string; error?: string },
  ): Promise<void>;
}
