import { RegistryData } from '../entities/registry.entity';

export const REGISTRY_API_SERVICE = Symbol('REGISTRY_API_SERVICE');

export interface IRegistryApiService {
  getMetadata(pkg: string, version: string): Promise<RegistryData | void>;
  getDownloads(name: string): Promise<number>;
}
