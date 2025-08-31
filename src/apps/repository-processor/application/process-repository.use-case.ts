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
import { JobDependencyTrace } from '@shared/job-tracker';
import { ENTITY_CHANGE_EVENT, EntityChangeEvent } from '@shared/job-tracker/domain/events/entity-change.interface';
import { EntityChangePayload } from '@shared/job-tracker/domain/events/entity-change.type';
import { differenceInDays } from 'date-fns';

export class ProcessRepositoryUseCase {
  private readonly logger = new Logger(ProcessRepositoryUseCase.name);
  private nextTrace: JobDependencyTrace;
  private jobUuid: string;
  private dependencyUuid: string;

  constructor(
    protected readonly config: ConfigService<AppConfig>,
    @Inject(REPOSITORY_API_SERVICE) private readonly repositoryApiService: IRepositoryApiService,
    @Inject(REPOSITORY_DB_SERVICE) private readonly repositoryDbService: IRepositoryDbService,
    @Inject(ENTITY_CHANGE_EVENT) private readonly entityChangeEvent: EntityChangeEvent
  ) { }

  async execute({ nextTrace, repositoryPath, jobUuid, dependencyUuid }: RegistryMessage): Promise<void> {
    this.logger.debug(`${nextTrace} - Repository ${repositoryPath}`);
    this.nextTrace = nextTrace;
    this.jobUuid = jobUuid;
    this.dependencyUuid = dependencyUuid;

    if (!repositoryPath) {
      const message = `Repository path can not be empty. JobUuid: ${jobUuid}, DependencyUuid: ${dependencyUuid}`;
      this.emitJobStatusUpdateEvent(message);
      return;
    }

    const lastUpdatedAt = await this.repositoryDbService.getLastSearch(dependencyUuid, nextTrace);

    if (lastUpdatedAt && !this.needsUpdate(dependencyUuid, lastUpdatedAt)) {
      this.emitJobStatusUpdateEvent();
      return;
    }

    const repository = await this.repositoryDbService.get(repositoryPath);

    const updateRepositoryUseCase = new UpdateRepositoryDataUseCase(
      this.repositoryApiService,
      this.repositoryDbService,
      repository
    );

    switch (nextTrace) {
      case JobDependencyTrace.REP_METADATA:
        await this.callFunction(updateRepositoryUseCase.updateMetadata.bind(updateRepositoryUseCase));
        break;
      case JobDependencyTrace.REP_RELEASES:
        await this.callFunction(updateRepositoryUseCase.updateReleases.bind(updateRepositoryUseCase));
        break;
      case JobDependencyTrace.REP_ISSUES:
        await this.callFunction(updateRepositoryUseCase.updateIssues.bind(updateRepositoryUseCase));
        break;
      case JobDependencyTrace.REP_COMMITS:
        await this.callFunction(updateRepositoryUseCase.updateCommits.bind(updateRepositoryUseCase));
        break;
      case JobDependencyTrace.REP_VULNERABILITIES:
        await this.callFunction(updateRepositoryUseCase.updateVulnerabilities.bind(updateRepositoryUseCase));
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
      this.emitJobStatusUpdateEvent(error);
    }
  }

  private emitJobStatusUpdateEvent(error?: string): void {
    this.entityChangeEvent.emit('events.job-status-update', EntityChangePayload.build({
      jobUuid: this.jobUuid,
      dependencyUuid: this.dependencyUuid,
      jobDependencyCmd: { trace: this.nextTrace, error },
    }));
  }

  private needsUpdate(uuid: string, updatedAt: Date): boolean {
    const refreshRateInDays = 30;

    if (updatedAt && differenceInDays(new Date(), updatedAt) < refreshRateInDays) {
      this.logger.debug(
        `Skipping: ${uuid}. Last update at: ${updatedAt.toISOString()}`,
      );
      return false;
    }
    return true;
  }
}
