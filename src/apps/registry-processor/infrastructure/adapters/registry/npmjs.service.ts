import { IRegistryApiService } from '@apps/registry-processor/domain/ports/registry.service.interface';
import { Inject, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosError, AxiosInstance } from 'axios';
import { AppConfig } from 'src/app.config';
import { NpmJsDownloads, NpmJsMetadata } from './npmjs.service.response';
import { RegistryData } from '@apps/registry-processor/domain/entities/registry.entity';
import { LOGGER } from '@shared/logger';

export default class NpmJsRegistryService implements IRegistryApiService {
  private readonly logger = new Logger(NpmJsRegistryService.name);
  private readonly baseUrl: string;
  private readonly baseUrlExtra: string;
  private readonly axiosInstance: AxiosInstance;

  constructor(@Inject() private readonly config: ConfigService<AppConfig>) {
    this.baseUrl = this.config.getOrThrow('integrations.NPM.config.baseUrl', {
      infer: true,
    });

    this.baseUrlExtra = this.config.getOrThrow(
      'integrations.NPM.config.baseUrlExtra',
      {
        infer: true,
      },
    );

    this.axiosInstance = axios.create({
      validateStatus: (status: number) => {
        return (status >= 200 && status < 300) || status == 404;
      },
    });

    this.axiosInstance.interceptors.request.use((config) => {
      this.logger.debug(`${config.method.toUpperCase()} - ${config.url}`);
      return config;
    });
  }

  async getMetadata(
    name: string,
    version: string,
  ): Promise<RegistryData | void> {
    const { data } = await this.axiosInstance
      .get<NpmJsMetadata>(`${this.baseUrl}/${name}/${version}`)
      .catch(this.handleError);

    return NpmJsMetadata.toDomain(data);
  }

  async getDownloads(name: string) {
    const { data } = await this.axiosInstance
      .get<NpmJsDownloads>(
        `${this.baseUrlExtra}/downloads/point/last-month/${name}`,
      )
      .catch(this.handleError);

    return data.downloads;
  }

  private handleError(err: Error | AxiosError): any {
    if (axios.isAxiosError(err)) {
      if (err.response?.status === 404) {
        LOGGER.error('Registry not error');
      }
    }

    throw err;
  }
}
