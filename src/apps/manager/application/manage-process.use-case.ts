import { Inject } from '@nestjs/common';
import { JobMessage } from 'src/contracts/queue.types';
import { JOB_SERVICE, JobService } from '@shared/job-tracker';
import { NotFoundError } from '@libs/errors';
import { LOGGER } from '@shared/logger';
import { DEPENDENCY_SERVICE, DependencyService } from '@shared/dependency';
import {
  MANAGER_PRODUCER,
  ManagerProducer,
} from '../domain/ports/process.producer';

export class ManageJobUseCase {
  constructor(
    @Inject(JOB_SERVICE)
    private readonly jobService: JobService,
    @Inject(DEPENDENCY_SERVICE)
    private readonly dependencyService: DependencyService,
    @Inject(MANAGER_PRODUCER)
    private readonly managerProducer: ManagerProducer,
  ) {}

  async execute(message: JobMessage): Promise<void> {
    const exists = await this.jobService.exists(message.jobUuid);
    if (!exists) {
      throw new NotFoundError('Job not found: ' + message.jobUuid);
    }

    LOGGER.debug(`Processing job ${message.jobUuid}`);
    const dependencies = await this.dependencyService.getJobDependencies(
      message.jobUuid,
    );

    LOGGER.debug(`Sending ${dependencies.length} dependencies to the queue`);

    for await (const dependency of dependencies) {
      this.managerProducer.send(message.jobUuid, dependency);
    }
  }
}
