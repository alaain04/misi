import { Inject } from '@nestjs/common';
import {
  Job,
  JOB_SERVICE,
  JobData,
  JobStatus,
  JobService,
} from '@shared/job-tracker';
import { DependencyData } from '@shared/dependency';
import { PackageData } from '../domain/entities/package.entity';
import { JOB_PRODUCER, JobProducer } from '../domain/ports/process.producer';

export class CreateJobUseCase {
  constructor(
    @Inject(JOB_SERVICE)
    private readonly jobService: JobService,
    @Inject(JOB_PRODUCER)
    private readonly jobProducer: JobProducer,
  ) {}

  async execute(data: PackageData): Promise<Job> {
    const job = JobData.build({
      status: JobStatus.PENDING,
      packageMetadata: data,
    });

    const created = await this.jobService.createWithDependencies(
      job,
      DependencyData.fromRecord(data.dependencies),
    );

    this.jobProducer.send(created);
    return created;
  }
}
