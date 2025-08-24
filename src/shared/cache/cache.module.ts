import { z } from 'zod';
import { Module } from '@nestjs/common';
import { REDIS_CLIENT } from './cache.interface';
import { CacheService } from './cache.service';
import Redis from 'ioredis';
import { CACHE_CONFIG, CacheConfig } from './cache.type';
import { RateLimitService } from './rate-limit.service';

@Module({
  providers: [
    {
      provide: CACHE_CONFIG,
      useFactory(): CacheConfig {
        const env = z
          .object({
            REDIS_HOST: z.string(),
            REDIS_PORT: z.coerce.number().optional().default(6379),
            CACHE_TTL_IN_SEC: z.coerce.number(),
          })
          .parse(process.env);

        const config: CacheConfig = {
          host: env.REDIS_HOST,
          port: Number(env.REDIS_PORT),
          ttl_in_sec: env.CACHE_TTL_IN_SEC,
        };

        return config;
      },
    },
    {
      provide: REDIS_CLIENT,
      useFactory: () => {
        const env = z
          .object({
            REDIS_HOST: z.string(),
            REDIS_PORT: z.coerce.number().optional().default(6379),
          })
          .parse(process.env);

        return new Redis({
          host: env.REDIS_HOST,
          port: env.REDIS_PORT,
        });
      },
    },
    CacheService,
    RateLimitService,
  ],
  exports: [CacheService, RateLimitService],
})
export class RedisModule {}
