import { Dependency } from '@shared/dependency';

export const MANAGER_PRODUCER = Symbol('MANAGER_PRODUCER');

export interface ManagerProducer {
  send(
    jobUuid: string,
    data: Dependency,
  ): Promise<void>;
}
