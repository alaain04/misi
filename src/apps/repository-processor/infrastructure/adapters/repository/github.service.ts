import {
  RepositoryCommitData,
  RepositoryIssueData,
  RepositoryReleaseData,
  RepositoryVulnerabilityData,
  RepositoryData,
} from '@apps/repository-processor/domain/entities/repository.entity';
import { IRepositoryApiService } from '@apps/repository-processor/domain/ports/repository.api.interface';
import axios, { AxiosInstance } from 'axios';
import {
  GHCommit,
  GHIssue,
  GHMetadata,
  GHRelease,
  GHSecurityAdvisory,
} from './github.service.response';
import { Inject, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from 'src/app.config';
import { RateLimitService } from '@shared/cache';

export default class RepositoryApiService implements IRepositoryApiService {
  private readonly logger = new Logger(RepositoryApiService.name);
  private readonly repositoryToken: string;
  private readonly baseUrl: string;
  private readonly axiosInstance: AxiosInstance;

  constructor(
    @Inject() private readonly config: ConfigService<AppConfig>,
    protected readonly rateLimit: RateLimitService,
  ) {
    this.repositoryToken = this.config.getOrThrow(
      'integrations.GH.config.token',
      {
        infer: true,
      },
    );
    this.baseUrl = this.config.getOrThrow('integrations.GH.config.baseUrl', {
      infer: true,
    });

    this.axiosInstance = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28',
        Accept: 'application/vnd.github+json',
        Authorization: 'Bearer ' + this.repositoryToken,
      },
    });

    this.axiosInstance.interceptors.request.use((config) => {
      this.logger.debug(
        `${config.method.toUpperCase()} - ${this.baseUrl}${config.url}`,
      );

      this.rateLimit.setRateLimit();

      return config;
    });
  }

  async getMetadata(repository: string): Promise<RepositoryData> {
    const { data } = await this.axiosInstance.get<GHMetadata>(
      `/repos/${repository}`,
    );

    return GHMetadata.toDomain(data);
  }

  async getReleases(repository: string): Promise<RepositoryReleaseData[]> {
    const { data: releases } = await this.axiosInstance.get<GHRelease[]>(
      `/repos/${repository}/releases`,
    );

    return releases.map((release) => GHRelease.toDomain(release));
  }

  async getIssues(repository: string): Promise<RepositoryIssueData[]> {
    const issues = await this.getPaginatedData<GHIssue>(repository);

    return issues.map((issue) => GHIssue.toDomain(issue));
  }

  async getCommits(repository: string): Promise<RepositoryCommitData[]> {
    const { data: commits } = await this.axiosInstance.get<GHCommit[]>(
      `/repos/${repository}/commits`,
    );

    return commits.map((commit) => GHCommit.toDomain(commit));
  }

  async getVulnerabilities(
    repository: string,
  ): Promise<RepositoryVulnerabilityData[]> {
    const { data: vulnerabilities } = await this.axiosInstance.get<
      GHSecurityAdvisory[]
    >(`/repos/${repository}/security-advisories`);

    return vulnerabilities.map((vulnerability) =>
      GHSecurityAdvisory.toDomain(vulnerability),
    );
  }

  private async getPaginatedData<T>(repository: string): Promise<T[]> {
    const uri = `/repos/${repository}/issues`;
    const params = { per_page: 100 };
    const { data: page, headers } = await this.axiosInstance.get<T[]>(uri, {
      params,
    });

    if (headers.link) {
      const link = headers.link
        .split(',')
        .find((link) => link.includes('rel="last"'));

      if (link) {
        const lastPage = parseInt(link.match(/page=(\d+)>; rel="last"/)[1]);

        for (let i = 2; i <= lastPage; i++) {
          const { data: nextPage } = await this.axiosInstance.get<T[]>(uri, {
            params: { ...params, page: i },
          });
          page.push(...nextPage);

          // sleep a few milliseconds to avoid rate limiting
          const delay = await this.rateLimit.getProcessorDelay('github');
          await new Promise((resolve) =>
            setTimeout(resolve, Math.random() * delay),
          );
        }
      }
    }
    return page;
  }
}
