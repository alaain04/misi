import { Module } from '@nestjs/common';
import {
  NotFoundExceptionFilter,
  ValidationExceptionFilter,
} from '@libs/api-utils/exception-filter';
import { APP_FILTER } from '@nestjs/core';
import { JobTrackerModule } from '@shared/job-tracker';
import { PrismaModule } from '@shared/database/prisma.module';
import { JobController } from './infrastructure/process.controller';
import { RegistryController } from './infrastructure/registry.controller';
import { RepositoryController } from './infrastructure/repository.controller';
import { CreateJobUseCase } from './application/create-process.use-case';
import { GetJobUseCase } from './application/get-process.use-case';
import { GetRegistryUseCase } from './application/get-registry.use-case';
import { GetRepositoryUseCase } from './application/get-repository.use-case';
import { GetRepositoryIssuesUseCase } from './application/get-repository-issues.use-case';
import { GetRepositoryVulnerabilitiesUseCase } from './application/get-repository-vulnerabilities.use-case';
import { GetRepositoryReleasesUseCase } from './application/get-repository-releases.use-case';
import { JOB_PRODUCER } from './domain/ports/process.producer';
import { JobSqsProducer } from './infrastructure/adapters/process.sqs.producer';

@Module({
  imports: [JobTrackerModule, PrismaModule],
  controllers: [JobController, RegistryController, RepositoryController],
  providers: [
    CreateJobUseCase,
    GetJobUseCase,
    GetRegistryUseCase,
    GetRepositoryUseCase,
    GetRepositoryIssuesUseCase,
    GetRepositoryVulnerabilitiesUseCase,
    GetRepositoryReleasesUseCase,
    {
      provide: JOB_PRODUCER,
      useClass: JobSqsProducer,
    },
    {
      provide: APP_FILTER,
      useClass: ValidationExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: NotFoundExceptionFilter,
    },
  ],
})
export class ApiModule { }
