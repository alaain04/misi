import { Module } from '@nestjs/common';
import { DependencyModule } from '@shared/dependency';
import { JobTrackerModule } from '@shared/job-tracker';
import { ProcessDependencyUseCase } from './application/process-dependency.use-case';
import { RedisModule } from '@shared/cache';
import { REGISTRY_API_SERVICE } from './domain/ports/registry.service.interface';
import NpmJsRegistryService from './infrastructure/adapters/registry/npmjs.service';
import { RegistrySqlService } from './infrastructure/adapters/registry/registry.sql.service';
import { REGISTRY_DB_SERVICE } from './domain/ports/registry.repository.interface';
import { DependencyConsumer } from './infrastructure/adapters/sqs/dependency.sqs.consumer';
import { RegistrySqsProducer } from './infrastructure/adapters/sqs/registry.sqs.producer';
import { REGISTRY_PRODUCER } from './domain/ports/registry.producer';

@Module({
  imports: [RedisModule, JobTrackerModule, DependencyModule],
  controllers: [],
  providers: [
    DependencyConsumer,
    ProcessDependencyUseCase,
    { provide: REGISTRY_PRODUCER, useClass: RegistrySqsProducer },
    { provide: REGISTRY_API_SERVICE, useClass: NpmJsRegistryService },
    { provide: REGISTRY_DB_SERVICE, useClass: RegistrySqlService },
  ],
})
export class RegistryProcessorModule { }
