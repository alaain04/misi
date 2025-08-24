import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { differenceInSeconds } from 'date-fns';
import { AppConfig } from 'src/app.config';
import { CacheService } from './cache.service';

type RequestRate = {
  lastCall: Date;
};

@Injectable()
export class RateLimitService {
  private readonly maxRatePerSec: number;

  constructor(
    private readonly config: ConfigService<AppConfig>,
    private readonly cacheService: CacheService,
  ) {
    this.maxRatePerSec = this.config.getOrThrow(
      'integrations.GH.limit.maxRatePerSec',
      {
        infer: true,
      },
    );
  }

  async getProcessorDelay(project?: string): Promise<number | undefined> {
    const value = await this.cacheService.get<RequestRate>(this.getKey(project));

    if (value?.lastCall) {
      const diff = differenceInSeconds(new Date(), value.lastCall);

      if (diff < this.maxRatePerSec) {
        return this.maxRatePerSec - diff;
      }
    }

    await this.setRateLimit();
  }

  async setRateLimit(project?: string): Promise<void> {
    const value: RequestRate = {
      lastCall: new Date(),
    };
    await this.cacheService.set(this.getKey(project), value, 60);
  }

  private getKey(project?: string): string {
    return `rate-limit${project ? `:${project}` : ''}`;
  }
}
