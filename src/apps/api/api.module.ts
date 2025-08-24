import { Module } from '@nestjs/common';
import {
  NotFoundExceptionFilter,
  ValidationExceptionFilter,
} from '@libs/api-utils/exception-filter';
import { APP_FILTER } from '@nestjs/core';
import { JobTrackerModule } from '@shared/job-tracker';
import { JobController } from './infrastructure/process.controller';
import { CreateJobUseCase } from './application/create-process.use-case';
import { GetJobUseCase } from './application/get-process.use-case';
import { JOB_PRODUCER } from './domain/ports/process.producer';
import { JobSqsProducer } from './infrastructure/adapters/process.sqs.producer';

@Module({
  imports: [JobTrackerModule],
  controllers: [JobController],
  providers: [
    CreateJobUseCase,
    GetJobUseCase,
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
