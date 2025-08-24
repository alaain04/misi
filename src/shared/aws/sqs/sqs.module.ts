import { type DynamicModule, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { SQSClient } from '@aws-sdk/client-sqs';
import { awsConfiguration } from '../common/aws.config';
import { SqsService } from './sqs.service';
import { AppConfig } from 'src/app.config';

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
                    useFactory(configService: ConfigService<AppConfig>): SqsService {
                        const awsConfig = configService.getOrThrow('aws', { infer: true });
                        const config = awsConfiguration(
                            awsConfig.region,
                            awsConfig.endpoint,
                            awsConfig.environment
                        );
                        const sqs = new SQSClient(config);

                        const service = new SqsService(sqs, configService);

                        return service;
                    },
                    inject: [ConfigService],
                },
            ],
            exports: [SqsService],
        };
    }
}
