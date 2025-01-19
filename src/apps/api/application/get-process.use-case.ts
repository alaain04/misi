import { NotFoundError } from '@libs/errors/not-found.error';
import { Inject } from '@nestjs/common';
import { Job, JOB_SERVICE, JobService } from '@shared/job-tracker';

export class GetJobUseCase {
  constructor(
    @Inject(JOB_SERVICE)
    private readonly jobService: JobService,
  ) {}

  async execute(uuid: string): Promise<Job> {
    const job = await this.jobService.get(uuid);

    if (!job) {
      throw new NotFoundError(`Job not found: ${uuid}`);
    }

    return job;
  }
}
