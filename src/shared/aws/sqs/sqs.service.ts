import {
  GetQueueUrlCommand,
  Message,
  QueueDoesNotExist,
  SendMessageBatchCommand,
  SendMessageCommand,
  SQSClient,
} from '@aws-sdk/client-sqs';
import { Injectable } from '@nestjs/common';
import { Consumer } from 'sqs-consumer';

@Injectable()
export class SqsService {
  constructor(private readonly client: SQSClient) {}

  async subscribe(
    queueName: string,
    handler: (message: Message) => Promise<void>,
  ): Promise<Consumer> {
    const queueUrl = await this.getQueueUrl(queueName);

    const consumer = Consumer.create({
      queueUrl,
      attributeNames: ['All'],
      visibilityTimeout: 30,
      heartbeatInterval: 25,
      sqs: this.client,
      async handleMessage(message: Message) {
        await handler(message);
      },
    });

    return consumer;
  }

  async send(
    queueName: string,
    payload: Record<string, unknown>,
    delay: number = 0,
  ): Promise<void> {
    const queueUrl = await this.getQueueUrl(queueName);
    const command = new SendMessageCommand({
      QueueUrl: queueUrl,
      MessageBody: JSON.stringify(payload),
      DelaySeconds: delay,
    });

    await this.client.send(command);
  }

  async sendBatch(
    queueName: string,
    messages: Record<string, unknown>[],
  ): Promise<void> {
    const queueUrl = await this.getQueueUrl(queueName);

    const command = new SendMessageBatchCommand({
      QueueUrl: queueUrl,
      Entries: messages.map((message, index) => ({
        Id: index.toString(),
        MessageBody: JSON.stringify(message),
      })),
    });

    await this.client.send(command);
  }

  private async getQueueUrl(queueName: string): Promise<string> {
    try {
      const queueUrl = await this.client.send(
        new GetQueueUrlCommand({
          QueueName: queueName,
        }),
      );

      if (!queueUrl.QueueUrl) {
        throw new Error(`Queue ${queueName} not found`);
      }

      return queueUrl.QueueUrl;
    } catch (error) {
      if (error instanceof QueueDoesNotExist) {
        throw new Error(`Queue ${queueName} not found`);
      }

      throw error as Error;
    }
  }
}
