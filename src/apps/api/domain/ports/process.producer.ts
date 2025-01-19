import { Job } from '@shared/job-tracker';

export const JOB_PRODUCER = Symbol('JOB_PRODUCER');

export interface JobProducer {
  send(data: Job): Promise<void>;
}
