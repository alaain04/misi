import { type DynamicModule, Module } from '@nestjs/common';

import { SQSClient } from '@aws-sdk/client-sqs';
import { awsConfiguration } from '../common/aws.config';
import { SqsService } from './sqs.service';

type SqsModuleAsyncOptions = {
  imports?: never[];
  inject?: never[];
  global?: boolean;
};

@Module({})
export class SqsModule {
  static forRoot(options?: SqsModuleAsyncOptions): DynamicModule {
    return {
      global: options?.global,
      module: SqsModule,
      imports: options?.imports,
      providers: [
        {
          provide: SqsService,
          useFactory(): SqsService {
            const config = awsConfiguration();
            const sqs = new SQSClient(config);

            const service = new SqsService(sqs);

            return service;
          },
        },
      ],
      exports: [SqsService],
    };
  }
}
