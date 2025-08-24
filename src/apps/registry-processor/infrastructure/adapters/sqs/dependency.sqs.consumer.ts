import { Injectable } from '@nestjs/common';
import { Message, SqsConsumer, SqsService } from '@shared/aws';
import { AppConfig } from 'src/app.config';
import { DependencyMessage } from 'src/contracts/queue.types';
import { ConfigService } from '@nestjs/config';
import { ProcessDependencyUseCase } from '@apps/registry-processor/application/process-dependency.use-case';
import { plainToInstance } from 'class-transformer';
import { DependencyMessageSqsMapper } from '@apps/manager/infrastructure/adapters/sqs/dependency.sqs-mapper.service';
import { RateLimitService } from '@shared/cache';

@Injectable()
export class DependencyConsumer extends SqsConsumer<DependencyMessage> {
    constructor(
        private readonly configService: ConfigService<AppConfig>,
        private readonly manageJobUseCase: ProcessDependencyUseCase,
        private readonly rateLimit: RateLimitService,
        private readonly sqsService: SqsService,
    ) {
        super();
    }

    protected queueName(): string {
        return this.configService.getOrThrow('queues.dependencies', {
            infer: true,
        });
    }

    async handleMessage(message: Message<DependencyMessage>): Promise<void> {
        const { content } = message;
        const data = plainToInstance(DependencyMessage, content);

        const delay = await this.rateLimit.getProcessorDelay('registry');

        if (delay) {
            const retry = DependencyMessageSqsMapper.fromDomain(
                data.jobUuid,
                data.toDomain(),
            );
            this.sendMessageToQueue(retry, delay + 0.3);
            return;
        }

        await this.manageJobUseCase.execute(data)
            .catch((error) => {
                this.logger.error(error);
            });
    }

    private async sendMessageToQueue(
        message: DependencyMessage,
        delay: number,
    ): Promise<void> {
        const serializedMessage = {
            jobUuid: message.jobUuid,
            dependencyUuid: message.dependencyUuid,
            name: message.name,
            version: message.version,
        };
        await this.sqsService.send(this.queueName(), serializedMessage, delay);
    }
}
