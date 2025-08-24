import { RegistryData, Registry } from '../entities/registry.entity';

export const REGISTRY_DB_SERVICE = Symbol('REGISTRY_DB_SERVICE');

export interface IRegistryDbService {
  get(uuid: string): Promise<Registry | undefined>;
  save(
    dependencyUuid: string,
    repositoryUuid: string,
    registry: Partial<RegistryData>,
  ): Promise<Registry>;
}
