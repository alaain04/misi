import { ValueObject } from '@libs/entity';

export class PackageJsonData {
  name: string;
  version: string;
  description: string;
  dependencies: {
    [key: string]: string;
  };
  devDependencies: {
    [key: string]: string;
  };
  scripts: {
    [key: string]: string;
  };

  constructor(data: Partial<PackageJsonData>) {
    Object.assign(this, data);
  }

  static build(data: Partial<PackageJsonData>): PackageJsonData {
    return new PackageJsonData(data);
  }
}

export class PackageJsonLockData extends ValueObject {
  name: string;
  version: string;
  description: string;
  packages: {
    [key: string]: {
      version: string;
      resolved: string;
      integrity: string;
      license: string;
      dependencies: {
        [key: string]: string;
      };
      engines: {
        node: string;
      };
    };
  };
}
