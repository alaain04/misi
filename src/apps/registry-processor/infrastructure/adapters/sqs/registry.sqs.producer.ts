import { Injectable } from '@nestjs/common';
import { SqsService } from '@shared/aws';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from 'src/app.config';
import { RegistryProducer } from '@apps/registry-processor/domain/ports/registry.producer';
import { JobDependencyTrace } from '@shared/job-tracker';
import { RegistryMessage } from 'src/contracts/queue.types';

@Injectable()
export class RegistrySqsProducer implements RegistryProducer {
    private readonly queueName;

    constructor(
        private readonly configService: ConfigService<AppConfig>,
        private readonly service: SqsService,
    ) {
        this.queueName = this.configService.getOrThrow('queues.registries', { infer: true });
    }

    async send(jobUuid: string, dependencyUuid: string, repositoryPath: string, nextTrace: JobDependencyTrace,): Promise<void> {

        const message = new RegistryMessage();
        message.jobUuid = jobUuid;
        message.dependencyUuid = dependencyUuid;
        message.repositoryPath = repositoryPath;
        message.nextTrace = nextTrace;

        // Convert to plain object for serialization
        const serializedMessage = {
            jobUuid: message.jobUuid,
            dependencyUuid: message.dependencyUuid,
            repositoryPath: message.repositoryPath,
            nextTrace: message.nextTrace,
        };

        await this.service.send(this.queueName, serializedMessage);
    }
}
