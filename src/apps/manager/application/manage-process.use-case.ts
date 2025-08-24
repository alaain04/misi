import { Inject, Logger } from '@nestjs/common';
import { JobMessage } from 'src/contracts/queue.types';
import { Job, JOB_SERVICE, JobService, JobStatus } from '@shared/job-tracker';
import { NotFoundError, RuntimeError } from '@libs/errors';
import {
  MANAGER_PRODUCER,
  ManagerProducer,
} from '../domain/ports/process.producer';
import { NPM_OS_SERVICE, NpmService } from '../domain/ports/npm.os.service';
import { PackageJsonData } from '@shared/job-tracker/domain/entities/package-json.entities';
import { DependencyData } from '@shared/dependency';

export class ManageJobUseCase {
  private readonly logger = new Logger(ManageJobUseCase.name);
  private packageJsonId: string;

  constructor(
    @Inject(JOB_SERVICE) private readonly jobService: JobService,
    @Inject(MANAGER_PRODUCER) private readonly managerProducer: ManagerProducer,
    @Inject(NPM_OS_SERVICE) private readonly npmService: NpmService,
  ) { }

  async execute(message: JobMessage): Promise<void> {
    const uuid = await this.jobService.exists(message.jobUuid);

    if (!uuid) {
      throw new NotFoundError('Job not found: ' + message.jobUuid);
    }

    this.logger.debug(`Processing job ${message.jobUuid}`);

    const dependencies = await this.extractFullDependencyList(
      message.packageJson,
    ).catch(async (error) => {
      this.logger.error(`Failed to extract dependencies: ${error.message}`);
      await this.jobService.setStatus(uuid, JobStatus.FAILED, 'Failed to extract dependencies from the given package.json');
      throw new RuntimeError('Failed to extract dependencies');
    });

    const createdDependencies = await this.jobService.addDependencies(
      Job.build(message.jobUuid, { status: JobStatus.RUNNING }),
      dependencies,
    );

    this.logger.debug(
      `Job updated with ${dependencies.length}. Preparing to send them the queue`,
    );

    for await (const created of createdDependencies) {
      this.managerProducer.send(message.jobUuid, created);
    }
  }

  private async extractFullDependencyList(
    packageJson: Partial<PackageJsonData>,
  ): Promise<DependencyData[]> {
    this.setPackageJsonId(packageJson.name);

    await this.npmService.installDependencies(this.packageJsonId, packageJson);

    this.logger.debug(`Package ${packageJson.name} fully installed.`);

    const dependencies = await this.npmService.extractInstalledDependencies(
      this.packageJsonId,
    );

    return dependencies;
  }

  private setPackageJsonId(name: string) {
    this.packageJsonId =
      name.replace(/[^a-zA-Z]/g, '_') + '_' + new Date().getTime();
  }
}
