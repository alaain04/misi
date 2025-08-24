import { BaseEntity, JustProps, ValueObject } from '@libs/entity';
import { Dependency } from '@shared/dependency';

export type RegistryAuthor = {
  url: string;
  name: string;
  email: string;
};

export class RegistryData extends ValueObject {
  registryId: string;
  keywords: string[];
  author: RegistryAuthor;
  maintainers: number;
  repositoryPath?: string;
  licenses: string[];
  description: string;
  downloads: number;
  createdAt: Date;
  updatedAt: Date;
  repositoryUuid?: string;
  dependency: Dependency;

  static build(data: Partial<JustProps<RegistryData>>): RegistryData {
    return new RegistryData(data);
  }

  setDownloads(downloads: number): void {
    this.downloads = downloads;
  }
}

export class Registry extends BaseEntity<RegistryData> {
  constructor(uuid: string, data: JustProps<RegistryData>) {
    super(uuid, data);
  }
  static build(uuid: string, data: Partial<JustProps<RegistryData>>): Registry {
    return new Registry(uuid, RegistryData.build(data));
  }

}
