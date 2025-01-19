import { JustProps, ValueObject } from '@libs/entity';

export class PackageData extends ValueObject {
  name: string;
  version: string;
  description?: string;
  author?: string;
  dependencies: Record<string, string>;

  static build(data: Partial<JustProps<PackageData>>): PackageData {
    return new PackageData(data);
  }
}
