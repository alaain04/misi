import { Inject, Logger } from '@nestjs/common';
import {
  Job,
  JOB_SERVICE,
  JobData,
  JobStatus,
  JobService,
} from '@shared/job-tracker';
import { JOB_PRODUCER, JobProducer } from '../domain/ports/process.producer';
import { PackageJsonData } from '@shared/job-tracker/domain/entities/package-json.entities';
import { RuntimeError } from '@libs/errors';

export class CreateJobUseCase {
  private readonly logger = new Logger(CreateJobUseCase.name);
  constructor(
    @Inject(JOB_SERVICE)
    private readonly jobService: JobService,
    @Inject(JOB_PRODUCER)
    private readonly jobProducer: JobProducer,
  ) { }

  async execute(data: PackageJsonData): Promise<Job> {
    const job = JobData.build({
      status: JobStatus.PENDING,
      packageJson: data,
    });

    let created: Job;
    try {
      created = await this.jobService.create(job);

      await this.jobProducer.send(created);
    } catch (error) {
      if (created)
        await this.jobService.setStatus(created.uuid, JobStatus.FAILED, 'Failed to initialize job: ' + error.message);

      throw new RuntimeError('Failed to initialize job:');
    }

    return created;
  }
}
