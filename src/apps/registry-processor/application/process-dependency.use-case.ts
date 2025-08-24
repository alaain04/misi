import { Inject, Logger } from '@nestjs/common';
import { DependencyMessage } from 'src/contracts/queue.types';
import { NotFoundError } from '@libs/errors';
import { Dependency, DEPENDENCY_SERVICE, DependencyService } from '@shared/dependency';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from 'src/app.config';
import {
  IRegistryApiService,
  REGISTRY_API_SERVICE,
} from '../domain/ports/registry.service.interface';
import {
  IRegistryDbService,
  REGISTRY_DB_SERVICE,
} from '../domain/ports/registry.repository.interface';
import { Registry } from '../domain/entities/registry.entity';
import { differenceInDays } from 'date-fns';
import { REGISTRY_PRODUCER, RegistryProducer } from '../domain/ports/registry.producer';
import { JOB_SERVICE, JobDependencyTrace, JobService } from '@shared/job-tracker';
import { ENTITY_CHANGE_EVENT, EntityChangeEvent } from '@shared/job-tracker/domain/events/entity-change.interface';
import { EntityChangePayload } from '@shared/job-tracker/domain/events/entity-change.type';

export class ProcessDependencyUseCase {
  private readonly logger = new Logger(ProcessDependencyUseCase.name);
  private jobUuid: string;
  private repositoryPath: string;;
  private dependency: Dependency;
  private trace: JobDependencyTrace;

  constructor(
    protected readonly config: ConfigService<AppConfig>,
    @Inject(JOB_SERVICE) private readonly jobService: JobService,
    @Inject(DEPENDENCY_SERVICE) private readonly dependencyService: DependencyService,
    @Inject(REGISTRY_API_SERVICE) private readonly registryApiService: IRegistryApiService,
    @Inject(REGISTRY_DB_SERVICE) private readonly registryDbService: IRegistryDbService,
    @Inject(REGISTRY_PRODUCER) private readonly registryProducer: RegistryProducer,
    @Inject(ENTITY_CHANGE_EVENT) private readonly entityChangeEvent: EntityChangeEvent
  ) { }

  async execute(message: DependencyMessage): Promise<void> {
    this.jobUuid = message.jobUuid;

    this.dependency = await this.dependencyService.get(message.dependencyUuid);

    if (!this.dependency) {
      throw new NotFoundError('Dependency not found: ' + message.dependencyUuid);
    }

    this.logger.debug(`Processing dependency ${this.dependency.getData().name} `);


    await this.callFunction(this.updateMetadata.bind(this));

    if (!this.dependency) {
      throw new NotFoundError('Dependency not found in Github: ' + message.dependencyUuid);
    }

    // await this.callFunction(this.updateDownloads.bind(this));

    const nextTargets = Object.values(JobDependencyTrace).filter(
      (trace) => trace !== JobDependencyTrace.REG_METADATA && trace !== JobDependencyTrace.REG_DOWNLOADED
    );

    for await (const target of nextTargets) {
      await this.registryProducer.send(
        this.jobUuid,
        this.dependency.uuid,
        this.repositoryPath,
        target,
      );
    }
  }

  private needsUpdate(registry: Registry): boolean {
    const refreshRate = 30;

    return (
      registry && differenceInDays(new Date(), registry.getData().updatedAt) > refreshRate
    );
  }

  private async updateMetadata(): Promise<Registry> {
    this.trace = JobDependencyTrace.REG_METADATA;
    const saved = await this.registryDbService.get(this.dependency.uuid);

    if (saved && !this.needsUpdate(saved)) {
      this.logger.debug(
        `Skipping: ${this.dependency.getName()}. Last update at: ${saved.getData().updatedAt.toISOString()}`,
      );
      this.repositoryPath = saved.getData().repositoryPath;
      return saved;
    }

    const metadata = await this.registryApiService.getMetadata(
      this.dependency.getName(),
      this.dependency.getVersion(),
    );

    if (!metadata)
      throw new NotFoundError(`${saved.getData().repositoryPath} not found`);

    this.repositoryPath = metadata.repositoryPath;

    const downloads = await this.registryApiService.getDownloads(
      this.dependency.getName(),
    );

    metadata.setDownloads(downloads);

    const registry = await this.registryDbService.save(
      this.dependency.uuid,
      metadata.repositoryPath,
      metadata,
    );

    return registry;
  }

  private async updateDownloads(): Promise<void> {
    this.trace = JobDependencyTrace.REG_DOWNLOADED;
    const saved = await this.registryDbService.get(this.dependency.uuid);

    const downloads = await this.registryApiService.getDownloads(
      this.dependency.getName(),
    );

    await this.registryDbService.save(this.dependency.uuid, saved.getData()?.repositoryUuid, {
      ...saved.getData(),
      downloads,
    });
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
        dependencyUuid: this.dependency.uuid,
        jobDependencyCmd: { trace: this.trace, error },
      }));
    }
  }
}
