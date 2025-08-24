import { Injectable } from '@nestjs/common';
import { Message, SqsConsumer, SqsService } from '@shared/aws';
import { AppConfig } from 'src/app.config';
import { ConfigService } from '@nestjs/config';
import { plainToInstance } from 'class-transformer';
import { RateLimitService } from '@shared/cache';
import { RegistryMessage } from 'src/contracts/queue.types';
import { ProcessRepositoryUseCase } from '@apps/repository-processor/application/process-repository.use-case';

@Injectable()
export class RegistryConsumer extends SqsConsumer<RegistryMessage> {
    constructor(
        private readonly configService: ConfigService<AppConfig>,
        private readonly manageJobUseCase: ProcessRepositoryUseCase,
        private readonly rateLimit: RateLimitService,
        private readonly sqsService: SqsService,
    ) {
        super();
    }

    protected queueName(): string {
        return this.configService.getOrThrow('queues.registries', { infer: true, });
    }

    async handleMessage(message: Message<RegistryMessage>): Promise<void> {
        const { content } = message;
        const data = plainToInstance(RegistryMessage, content);

        const delay = await this.rateLimit.getProcessorDelay('repository');

        if (delay) {
            const retry = {
                jobUuid: data.jobUuid,
                dependencyUuid: data.dependencyUuid,
                repositoryPath: data.repositoryPath,
                nextTrace: data.nextTrace
            };

            await this.sendMessageToQueue(retry, delay + 0.3);
            return;
        }

        await this.manageJobUseCase.execute(data)
            .catch((error) => this.logger.error(error));
    }

    private async sendMessageToQueue(
        message: Record<string, unknown>,
        delay: number,
    ): Promise<void> {
        await this.sqsService.send(this.queueName(), message, delay);
    }
}
