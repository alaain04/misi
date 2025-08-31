import { Module } from '@nestjs/common';
import { JobTrackerModule } from '@shared/job-tracker';
import { ProcessRepositoryUseCase } from './application/process-repository.use-case';
import { RedisModule } from '@shared/cache';
import { REPOSITORY_API_SERVICE } from './domain/ports/repository.api.interface';
import RepositoryApiService from './infrastructure/adapters/repository/github.service';
import { REPOSITORY_DB_SERVICE } from './domain/ports/repository.db.interface';
import { RepositoryDbService } from './infrastructure/adapters/repository/repository.sql.service';
import { RegistryConsumer } from './infrastructure/adapters/sqs/registry.sqs.consumer';

@Module({
  imports: [RedisModule, JobTrackerModule],
  controllers: [],
  providers: [
    RegistryConsumer,
    ProcessRepositoryUseCase,
    { provide: REPOSITORY_API_SERVICE, useClass: RepositoryApiService },
    { provide: REPOSITORY_DB_SERVICE, useClass: RepositoryDbService },
  ],
})
export class RepositoryProcessorModule { }
