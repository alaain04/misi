import { Module } from '@nestjs/common';
import { DependencyModule } from '@shared/dependency';
import { JobTrackerModule } from '@shared/job-tracker';
import { MANAGER_PRODUCER } from './domain/ports/process.producer';
import { ManageJobUseCase } from './application/manage-process.use-case';
import { NPM_OS_SERVICE } from './domain/ports/npm.os.service';
import { JobConsumer } from './infrastructure/adapters/sqs/job.sqs.consumer';
import NpmOsService from './infrastructure/adapters/os/npm.os';
import { DependencySqsProducer } from './infrastructure/adapters/sqs/dependency.sqs.producer';

@Module({
  imports: [JobTrackerModule, DependencyModule],
  controllers: [],
  providers: [
    { provide: MANAGER_PRODUCER, useClass: DependencySqsProducer },
    { provide: NPM_OS_SERVICE, useClass: NpmOsService },
    JobConsumer,
    ManageJobUseCase,
  ],
})
export class ManagerModule { }
