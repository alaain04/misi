import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import { ICacheService, REDIS_CLIENT } from './cache.interface';
import Redis from 'ioredis';
import { CACHE_CONFIG, CacheConfig } from './cache.type';

@Injectable()
export class CacheService implements OnModuleDestroy, ICacheService {
  constructor(
    @Inject(REDIS_CLIENT) private readonly client: Redis,
    @Inject(CACHE_CONFIG) private readonly config: CacheConfig,
  ) {}

  async set(
    key: string,
    value: any,
    ttl_in_sec: number = this.config.ttl_in_sec,
  ): Promise<void> {
    const strValue = JSON.stringify(value);

    await this.client.setex(key, ttl_in_sec, strValue);
  }

  async get<T>(key: string): Promise<T> {
    const value = await this.client.get(key);
    if (!value) return null;

    return JSON.parse(value);
  }

  async del(key: string): Promise<void> {
    await this.client.del(key);
  }

  onModuleDestroy() {
    this.client.quit();
  }
}
