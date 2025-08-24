import { Dependency } from '@shared/dependency';
import { DependencyMessage } from 'src/contracts/queue.types';

export class DependencyMessageSqsMapper {
    static fromDomain(
        jobUuid: string,
        dependency: Dependency,
    ): DependencyMessage {
        const { uuid } = dependency;
        const data = dependency.getData();

        const message = new DependencyMessage();
        message.jobUuid = jobUuid;
        message.dependencyUuid = uuid;
        message.name = data.name;
        message.version = data.version;

        return message;
    }
}
