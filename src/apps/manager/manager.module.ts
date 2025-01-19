import { Module } from '@nestjs/common';
import { DependencySqsProducer } from './infrastructure/adapters/dependency.sqs.producer';
import { DependencyModule } from '@shared/dependency';
import { JobTrackerModule } from '@shared/job-tracker';
import { MANAGER_PRODUCER } from './domain/ports/process.producer';
import { ManageJobUseCase } from './application/manage-process.use-case';
import { JobConsumer } from './infrastructure/adapters/process.sqs.consumer';

@Module({
  imports: [JobTrackerModule, DependencyModule],
  controllers: [],
  providers: [
    {
      provide: MANAGER_PRODUCER,
      useClass: DependencySqsProducer,
    },
    JobConsumer,
    ManageJobUseCase,
  ],
})
export class ManagerModule {}
