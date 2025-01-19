import { Job } from '@shared/job-tracker';
import { JobMessage } from 'src/contracts/queue.types';

export class CreateJobSqsMapper {
  static fromDomain(data: Job): JobMessage {
    return {
      jobUuid: data.uuid,
    };
  }
}
