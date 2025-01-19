import { DynamicModule, ForwardReference, Type } from '@nestjs/common';
import { ConditionalModule } from '@nestjs/config';

type ImportableType =
  | Type<unknown>
  | DynamicModule
  | Promise<DynamicModule>
  | ForwardReference<unknown>;

type ConditionalImport = Promise<
  Required<Pick<DynamicModule, 'imports' | 'exports' | 'module'>>
>;

export enum APP_MODE {
  APP_API = 'api',
  APP_MANAGER = 'manager',
  APP_INGESTOR = 'ingestor',
}

export function registerWhen(
  modules: ImportableType[],
  condition: string | ((env: NodeJS.ProcessEnv) => boolean),
): ConditionalImport[] {
  return modules.map((module) =>
    ConditionalModule.registerWhen(module, condition),
  );
}

const shouldRegisterByAppMode = (
  env: NodeJS.ProcessEnv,
  mode: string,
): boolean => {
  return !env.APP_MODE || (env.APP_MODE?.split(',') ?? []).includes(mode);
};

export function registerWhenAppMode(
  modules: ImportableType[],
  mode: APP_MODE,
): ConditionalImport[] {
  return registerWhen(modules, (env) => {
    return shouldRegisterByAppMode(env, mode);
  });
}
