export const REDIS_CLIENT = Symbol('REDIS_CLIENT');

export interface ICacheService {
  get<T>(key: string): Promise<T>;
  set(ey: string, value: any, ttl?: number): Promise<void>;
  del(ey: string): Promise<void>;
}
