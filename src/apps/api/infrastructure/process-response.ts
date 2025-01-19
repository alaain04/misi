import { ResourceSingleResponse } from '@libs/api-utils/responses/resource-single.response';
import { Job } from '@shared/job-tracker';
import { JobResponseDto } from './dtos/process.response.dto';

export class JobResponse extends ResourceSingleResponse<JobResponseDto> {
  constructor(job: Job) {
    super(JobResponseDto.fromDomain(job));
  }
}
