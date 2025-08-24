import { Logger } from '@nestjs/common';
import { differenceInDays } from 'date-fns';
import { NotFoundError } from '@libs/errors';
import { IRepositoryDbService } from '../domain/ports/repository.db.interface';
import { IRepositoryApiService } from '../domain/ports/repository.api.interface';
import { Repository } from '../domain/entities/repository.entity';

export class UpdateRepositoryDataUseCase {
  private readonly logger = new Logger(UpdateRepositoryDataUseCase.name);
  private repositoryPath: string;
  constructor(
    private readonly repositoryApiService: IRepositoryApiService,
    private readonly repositoryDbService: IRepositoryDbService,
  ) { }

  setRepositoryPath(path: string): void {
    this.repositoryPath = path;
  }

  async updateMetadata(): Promise<void> {
    const repository = await this.repositoryDbService.get(this.repositoryPath);

    if (!this.needsUpdate(repository)) return;

    const metadata = await this.repositoryApiService.getMetadata(this.repositoryPath);

    if (!metadata) throw new NotFoundError(`${this.repositoryPath} not found`);

    await this.repositoryDbService.save(repository.uuid, this.repositoryPath, metadata);
  }

  async updateReleases(): Promise<void> {
    const repository = await this.repositoryDbService.get(this.repositoryPath);

    if (!repository) {
      this.logger.warn(`Repository not found: ${this.repositoryPath}`);
      return;
    }

    if (!this.needsUpdate(repository)) return;

    const releases = await this.repositoryApiService.getReleases(this.repositoryPath);

    if (!releases?.length) return;

    await this.repositoryDbService.saveReleases(repository.uuid, releases);
  }

  async updateIssues(): Promise<void> {
    const repository = await this.repositoryDbService.get(this.repositoryPath);

    if (!repository) {
      this.logger.warn(`Repository not found: ${this.repositoryPath}`);
      return;
    }

    if (!this.needsUpdate(repository)) return;

    const issues = await this.repositoryApiService.getIssues(this.repositoryPath);

    if (!issues?.length) return;

    await this.repositoryDbService.saveIssues(repository.uuid, issues);
  }

  async updateCommits(): Promise<void> {
    const repository = await this.repositoryDbService.get(this.repositoryPath);

    if (!repository) {
      this.logger.warn(`Repository not found: ${this.repositoryPath}`);
      return;
    }

    if (!this.needsUpdate(repository)) return;

    const commits = await this.repositoryApiService.getCommits(this.repositoryPath);

    if (!commits?.length) return;

    await this.repositoryDbService.saveCommits(repository.uuid, commits);
  }

  async updateVulnerabilities(): Promise<void> {
    const repository = await this.repositoryDbService.get(this.repositoryPath);

    if (!repository) {
      this.logger.warn(`Repository not found: ${this.repositoryPath}`);
      return;
    }

    if (!this.needsUpdate(repository)) return;

    const vulnerabilities =
      await this.repositoryApiService.getVulnerabilities(this.repositoryPath);

    if (!vulnerabilities?.length) return;

    await this.repositoryDbService.saveVulnerabilities(
      repository.uuid,
      vulnerabilities,
    );
  }

  private needsUpdate(repository: Repository): boolean {
    const refreshRate = 30;
    const updatedAt = repository.getData().updatedAt;
    const name = repository.getData().name;

    if (name && updatedAt && differenceInDays(new Date(), updatedAt) < refreshRate) {
      this.logger.debug(
        `Skipping: ${repository.uuid}. Last update at: ${updatedAt.toISOString()}`,
      );
      return false;
    }
    return true;
  }
}
