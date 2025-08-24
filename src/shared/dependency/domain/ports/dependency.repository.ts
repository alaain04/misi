import { Dependency, DependencyData } from '../entities';

export const DEPENDENCY_SERVICE = Symbol('DEPENDENCY_SERVICE');

export interface DependencyService {
  get(uuid: string): Promise<Dependency>;
  getJobDependencies(uuid: string): Promise<Dependency[]>;
  update(uuid: string, data: Partial<DependencyData>): Promise<void>;
}
