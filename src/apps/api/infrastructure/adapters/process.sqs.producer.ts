import { Injectable } from '@nestjs/common';
import { SqsService } from '@shared/aws';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from 'src/app.config';
import { Job } from '@shared/job-tracker';
import { JobProducer } from '@apps/api/domain/ports/process.producer';
import { CreateJobSqsMapper } from './process.sqs-mapper.service';

@Injectable()
export class JobSqsProducer implements JobProducer {
  private readonly queueName;

  constructor(
    private readonly configService: ConfigService<AppConfig>,
    private readonly service: SqsService,
  ) {
    this.queueName = this.configService.getOrThrow('queues.jobs', {
      infer: true,
    });
  }

  async send(job: Job): Promise<void> {
    await this.service.send(this.queueName, CreateJobSqsMapper.fromDomain(job));
  }
}