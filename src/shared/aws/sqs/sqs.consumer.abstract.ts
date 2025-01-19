import { Message as SQSMessage } from '@aws-sdk/client-sqs';
import { NotFoundError, ValidationError } from '@libs/errors';
import {
  Inject,
  Logger,
  OnModuleInit,
  type OnModuleDestroy,
} from '@nestjs/common';
import { type Consumer } from 'sqs-consumer';
import * as util from 'util';
import { SqsService } from './sqs.service';
import { type Message } from './sqs.types';

export abstract class SqsConsumer<T extends Partial<Record<keyof T, unknown>>>
  implements OnModuleInit, OnModuleDestroy
{
  protected logger = new Logger(this.constructor.name);

  @Inject(SqsService)
  private readonly service: SqsService;

  private consumer?: Consumer;

  async onModuleInit(): Promise<void> {
    const queueName = this.queueName();

    const consumer = await this.service.subscribe(
      queueName,
      async (message) => {
        const deserializedMessage = this.deserialize<T>(message);

        if (!deserializedMessage) {
          throw new Error(
            `Message could not be deserialized: ${JSON.stringify(message)}`,
          );
        }

        await this.handleMessage(deserializedMessage);
      },
    );

    this.consumer = consumer;

    this.consumer.on('error', (error: Error, message: unknown) => {
      this.onError(error, message, queueName);
    });

    this.consumer.on('processing_error', (error: Error, message: unknown) => {
      this.onError(error, message, queueName);
    });

    this.consumer.start();

    this.logger.log(`Subscribed to ${queueName}`);
  }

  onModuleDestroy(): void {
    if (this.consumer) {
      this.consumer.stop();
    }
  }

  private deserialize<T>(message: SQSMessage): Message<T> | undefined {
    const { Body: body, MessageId: id } = message;

    if (!body || !id) {
      return;
    }

    const content = JSON.parse(body) as T;

    return {
      content,
      ...(id && { id }),
    };
  }

  protected onError(error: Error, message: unknown, queueName: string): void {
    this.logger.error(
      `Error processing message from ${queueName}`,
      util.format('%O', error),
    );
  }

  protected shouldExclude(exception: unknown): boolean {
    return (
      exception instanceof ValidationError || exception instanceof NotFoundError
    );
  }

  protected abstract handleMessage(message: Message<T>): Promise<void>;

  protected abstract queueName(): string;
}
