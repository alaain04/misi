import { DependencyData } from '@shared/dependency';
import { PackageJsonData } from '@shared/job-tracker/domain/entities/package-json.entities';

export const NPM_OS_SERVICE = Symbol('NPM_OS_SERVICE');

export interface NpmService {
  installDependencies(
    id: string,
    packageJson: Partial<PackageJsonData>,
  ): Promise<void>;
  extractInstalledDependencies(id: string): Promise<DependencyData[]>;
}
