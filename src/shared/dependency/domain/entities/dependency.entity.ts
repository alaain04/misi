import { BaseEntity, JustProps, ValueObject } from '@libs/entity';

export class DependencyData extends ValueObject {
  name: string;
  version: string;

  static build(data: JustProps<DependencyData>): DependencyData {
    return new DependencyData(data);
  }

  static fromRecord(data: Record<string, string>): DependencyData[] {
    return Object.entries(data).map(
      ([name, version]) =>
        ({
          name,
          version,
        }) as DependencyData,
    );
  }
}

export class Dependency extends BaseEntity<DependencyData> {
  static build(uuid: string, data: JustProps<DependencyData>): Dependency {
    return new Dependency(uuid, data);
  }

  getName(): string {
    return this.data.name;
  }

  getVersion(): string {
    return this.data.version;
  }

  isValid(): boolean {
    const valid =
      !!this.data.name && !!this.data.version;
    if (!valid) {
      console.error('Invalid dependency:', this.data);
    }
    return valid;
  }
}
