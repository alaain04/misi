import { Job } from '@shared/job-tracker';
import { JobMessage } from 'src/contracts/queue.types';

export class CreateJobSqsMapper {
  static fromDomain(data: Job): JobMessage {
    const { packageJson } = data.getData();
    return {
      jobUuid: data.uuid,
      packageJson,
    };
  }
}
