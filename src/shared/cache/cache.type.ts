export const CACHE_CONFIG = Symbol('CACHE_CONFIG');

export type CacheConfig = {
  host: string;
  port: number;
  ttl_in_sec: number;
};
