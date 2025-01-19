import { cloneDeep } from 'lodash';
import { JustProps } from './base.value-object';

export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends Record<string, unknown>
    ? DeepReadonly<T[P]>
    : Readonly<T[P]>;
};

export interface IdentityData {
  uuid: string;
}

export abstract class BaseEntity<T> {
  protected constructor(
    public readonly uuid: string,
    protected data: JustProps<T>,
  ) {}

  getData(): JustProps<T> & IdentityData {
    const clone = cloneDeep(this.data);

    return {
      ...clone,
      uuid: this.uuid,
    };
  }
}
