import { Logger } from '@nestjs/common';
import { differenceInDays } from 'date-fns';
import { NotFoundError } from '@libs/errors';
import { IRepositoryDbService } from '../domain/ports/repository.db.interface';
import { IRepositoryApiService } from '../domain/ports/repository.api.interface';
import { Repository } from '../domain/entities/repository.entity';

export class UpdateRepositoryDataUseCase {
  private readonly logger = new Logger(UpdateRepositoryDataUseCase.name);
  private readonly path: string;

  constructor(
    private readonly repositoryApiService: IRepositoryApiService,
    private readonly repositoryDbService: IRepositoryDbService,
    private readonly repository: Repository,
  ) {
    this.path = this.repository.getData().path;
  }

  async updateMetadata(): Promise<void> {
    const metadata = await this.repositoryApiService.getMetadata(this.path);

    if (!metadata) throw new NotFoundError(`${this.path} not found`);

    await this.repositoryDbService.save(this.repository.uuid, this.path, metadata);
  }

  async updateReleases(): Promise<void> {
    const releases = await this.repositoryApiService.getReleases(this.path);

    if (!releases?.length) return;

    await this.repositoryDbService.saveReleases(this.repository.uuid, releases);
  }

  async updateIssues(): Promise<void> {
    const issues = await this.repositoryApiService.getIssues(this.path);

    if (!issues?.length) return;

    await this.repositoryDbService.saveIssues(this.repository.uuid, issues);
  }

  async updateCommits(): Promise<void> {
    const commits = await this.repositoryApiService.getCommits(this.path);

    if (!commits?.length) return;

    await this.repositoryDbService.saveCommits(this.repository.uuid, commits);
  }

  async updateVulnerabilities(): Promise<void> {
    const vulnerabilities = await this.repositoryApiService.getVulnerabilities(this.path);

    if (!vulnerabilities?.length) return;

    await this.repositoryDbService.saveVulnerabilities(this.repository.uuid, vulnerabilities);
  }
}
