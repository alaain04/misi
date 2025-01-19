import { Injectable } from '@nestjs/common';
import { Message, SqsConsumer } from '@shared/aws';
import { AppConfig } from 'src/app.config';
import { JobMessage } from 'src/contracts/queue.types';
import { ConfigService } from '@nestjs/config';
import { ManageJobUseCase } from '@apps/manager/application/manage-process.use-case';

@Injectable()
export class JobConsumer extends SqsConsumer<JobMessage> {
  constructor(
    private readonly configService: ConfigService<AppConfig>,
    private readonly manageJobUseCase: ManageJobUseCase,
  ) {
    super();
  }

  protected queueName(): string {
    return this.configService.getOrThrow('QUEUE_DEPENDENCIES', {
      infer: true,
    });
  }

  async handleMessage(message: Message<JobMessage>): Promise<void> {
    const { content } = message;

    await this.manageJobUseCase.execute(content);
  }
}
