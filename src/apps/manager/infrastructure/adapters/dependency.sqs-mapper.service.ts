import { Dependency } from '@shared/dependency';
import { DependencyMessage } from 'src/contracts/queue.types';

export class DependencyMessageSqsMapper {
  static fromDomain(
    jobUuid: string,
    dependency: Dependency,
  ): DependencyMessage {
    const { uuid } = dependency;
    const data = dependency.getData();

    return {
      jobUuid: uuid,
      dependencyUuid: uuid,
      name: data.name,
      version: data.version,
    };
  }
}
