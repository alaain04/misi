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
    this.queueName = this.configService.getOrThrow('QUEUE_JOBS', {
      infer: true,
    });
  }

  async send(jobUuid: string, data: Dependency): Promise<void> {
    await this.service.send(
      this.queueName,
      DependencyMessageSqsMapper.fromDomain(jobUuid, data),
    );
  }
}
