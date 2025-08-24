import { Injectable } from '@nestjs/common';
import { SqsService } from '@shared/aws';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from 'src/app.config';
import { DependencyMessageSqsMapper } from './dependency.sqs-mapper.service';
import { Dependency } from '@shared/dependency';
import { ManagerProducer } from '@apps/manager/domain/ports/process.producer';

@Injectable()
export class DependencySqsProducer implements ManagerProducer {
    private readonly queueName;

    constructor(
        private readonly configService: ConfigService<AppConfig>,
        private readonly service: SqsService,
    ) {
        this.queueName = this.configService.getOrThrow('queues.dependencies', { infer: true, });
    }

    async send(
        jobUuid: string,
        data: Dependency,
    ): Promise<void> {
        const dependency = DependencyMessageSqsMapper.fromDomain(
            jobUuid,
            data,
        );

        // Convert to plain object for serialization
        const serializedDependency = {
            jobUuid: dependency.jobUuid,
            dependencyUuid: dependency.dependencyUuid,
            name: dependency.name,
            version: dependency.version,
        };

        await this.service.send(this.queueName, serializedDependency);
    }
}
