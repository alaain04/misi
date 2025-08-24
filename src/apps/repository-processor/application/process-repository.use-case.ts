import { Inject, Logger } from '@nestjs/common';
import { RegistryMessage } from 'src/contracts/queue.types';
import { RuntimeError } from '@libs/errors';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from 'src/app.config';
import {
  IRepositoryApiService,
  REPOSITORY_API_SERVICE,
} from '../domain/ports/repository.api.interface';
import { UpdateRepositoryDataUseCase } from './update-repository-data.use-case';
import {
  IRepositoryDbService,
  REPOSITORY_DB_SERVICE,
} from '../domain/ports/repository.db.interface';
import { JOB_SERVICE, JobDependencyTrace, JobService } from '@shared/job-tracker';
import { ENTITY_CHANGE_EVENT, EntityChangeEvent } from '@shared/job-tracker/domain/events/entity-change.interface';
import { EntityChangePayload } from '@shared/job-tracker/domain/events/entity-change.type';
import { trace } from 'console';

export class ProcessRepositoryUseCase {
  private readonly logger = new Logger(ProcessRepositoryUseCase.name);
  private readonly getRepositoryUseCase: UpdateRepositoryDataUseCase;
  private repositoryPath: string;
  private nextTrace: JobDependencyTrace;
  private jobUuid: string;
  private dependencyUuid: string;

  constructor(
    protected readonly config: ConfigService<AppConfig>,
    @Inject(JOB_SERVICE) private readonly jobService: JobService,
    @Inject(REPOSITORY_API_SERVICE) private readonly repositoryApiService: IRepositoryApiService,
    @Inject(REPOSITORY_DB_SERVICE) private readonly repositoryDbService: IRepositoryDbService,
    @Inject(ENTITY_CHANGE_EVENT) private readonly entityChangeEvent: EntityChangeEvent
  ) {
    this.getRepositoryUseCase = new UpdateRepositoryDataUseCase(
      this.repositoryApiService,
      this.repositoryDbService,
    );
  }

  async execute(message: RegistryMessage): Promise<void> {
    this.logger.debug(`${message.nextTrace} - Repository ${message.repositoryPath}`);
    this.repositoryPath = message.repositoryPath;
    this.nextTrace = message.nextTrace;
    this.jobUuid = message.jobUuid;
    this.dependencyUuid = message.dependencyUuid;

    if (!this.repositoryPath) {
      const message = `Repository path can not be empty. JobUuid: ${this.jobUuid}, DependencyUuid: ${this.dependencyUuid}`;

      await this.entityChangeEvent.emit('events.job-status-update', EntityChangePayload.build({
        jobUuid: this.jobUuid,
        dependencyUuid: this.dependencyUuid,
        jobDependencyCmd: { trace: this.nextTrace, error: message },
      }));
      throw new RuntimeError(message);
    }

    this.getRepositoryUseCase.setRepositoryPath(this.repositoryPath);

    switch (this.nextTrace) {
      case JobDependencyTrace.REP_METADATA:
        await this.callFunction(this.getRepositoryUseCase.updateMetadata.bind(this.getRepositoryUseCase));
        break;
      case JobDependencyTrace.REP_RELEASES:
        await this.callFunction(this.getRepositoryUseCase.updateReleases.bind(this.getRepositoryUseCase));
        break;
      case JobDependencyTrace.REP_ISSUES:
        await this.callFunction(this.getRepositoryUseCase.updateIssues.bind(this.getRepositoryUseCase));
        break;
      case JobDependencyTrace.REP_COMMITS:
        await this.callFunction(this.getRepositoryUseCase.updateCommits.bind(this.getRepositoryUseCase));
        break;
      case JobDependencyTrace.REP_VULNERABILITIES:
        await this.callFunction(this.getRepositoryUseCase.updateVulnerabilities.bind(this.getRepositoryUseCase));
        break;
      default:
        throw new RuntimeError('Invalid data target');
    }
  }

  private async callFunction(fn: () => Promise<void>): Promise<void> {
    let error: undefined;

    try {
      await fn();
    } catch (err) {
      error = err.message;
    } finally {
      await this.entityChangeEvent.emit('events.job-status-update', EntityChangePayload.build({
        jobUuid: this.jobUuid,
        dependencyUuid: this.dependencyUuid,
        jobDependencyCmd: { trace: this.nextTrace, error },
      }));
    }
  }
}
