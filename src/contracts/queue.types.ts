import { Dependency } from '@shared/dependency';
import { JobDependencyTrace } from '@shared/job-tracker';
import { PackageJsonData } from '@shared/job-tracker/domain/entities/package-json.entities';

export type JobMessage = {
  jobUuid: string;
  packageJson: PackageJsonData;
};

export class DependencyMessage {
  jobUuid: string;
  dependencyUuid: string;
  name: string;
  version: string;

  toDomain(): Dependency {
    return Dependency.build(this.dependencyUuid, {
      name: this.name,
      version: this.version,
    });
  }
}

export class RegistryMessage {
  jobUuid: string;
  dependencyUuid: string;
  repositoryPath: string;
  nextTrace: JobDependencyTrace;
}