import { Dependency } from '../entities';

export const DEPENDENCY_SERVICE = Symbol('DEPENDENCY_SERVICE');

export interface DependencyService {
  exists(uuid: string): Promise<boolean>;
  getJobDependencies(uuid: string): Promise<Dependency[]>;
}
