import { z } from 'zod';

export enum Environment {
  DEV = 'development',
  PRD = 'production',
  STG = 'staging',
  TST = 'testing',
}

type QueuesConfig = {
  registries: string;
  dependencies: string;
  jobs: string;
};

const getQueuesConfig = (): QueuesConfig => {
  const env = z
    .object({
      QUEUE_REGISTRIES: z.string(),
      QUEUE_DEPENDENCIES: z.string(),
      QUEUE_JOBS: z.string(),
    })
    .parse(process.env);

  return {
    registries: env.QUEUE_REGISTRIES,
    dependencies: env.QUEUE_DEPENDENCIES,
    jobs: env.QUEUE_JOBS,
  };
};

type ServerConfig = {
  port: number;
  mode: string;
};

const getServerConfig = (): ServerConfig => {
  const env = z
    .object({
      SERVER_PORT: z.coerce.number(),
      SERVER_MODE: z.coerce.string(),
    })
    .parse(process.env);

  return {
    port: env.SERVER_PORT,
    mode: env.SERVER_MODE,
  };
};

type ApiConfig = {
  limit?: {
    maxRatePerSec: number;
  };
  config: {
    baseUrl: string;
    baseUrlExtra?: string;
    token?: string;
  };
};

type ApiIntegrationsConfig = {
  GH: ApiConfig;
  NPM: ApiConfig;
};

const getApiIntegrationsConfig = (): ApiIntegrationsConfig => {
  const env = z
    .object({
      GH_MAX_RATE_PER_SEC: z.coerce.number(),
      GH_BASE_URL: z.string(),
      GH_TOKEN: z.string(),
      NPM_BASE_URL: z.string(),
      NPM_API_BASE_URL: z.string(),
    })
    .parse(process.env);

  return {
    GH: {
      config: {
        baseUrl: env.GH_BASE_URL,
        token: env.GH_TOKEN,
      },
      limit: {
        maxRatePerSec: env.GH_MAX_RATE_PER_SEC,
      },
    },
    NPM: {
      config: {
        baseUrl: env.NPM_BASE_URL,
        baseUrlExtra: env.NPM_API_BASE_URL,
      },
      limit: {
        maxRatePerSec: env.GH_MAX_RATE_PER_SEC,
      },
    },
  };
};

type AwsConfig = {
  region: string;
  endpoint: string;
  environment: Environment;
};

const getAwsConfig = (): AwsConfig => {
  const env = z
    .object({
      AWS_REGION: z.string(),
      AWS_ENDPOINT: z.string(),
      NODE_ENV: z.nativeEnum(Environment),
    })
    .parse(process.env);

  return {
    region: env.AWS_REGION,
    endpoint: env.AWS_ENDPOINT,
    environment: env.NODE_ENV,
  };
};

export type AppConfig = {
  integrations: ApiIntegrationsConfig;
  queues: QueuesConfig;
  server: ServerConfig;
  aws: AwsConfig;
};

export const appConfig = (): AppConfig => ({
  integrations: getApiIntegrationsConfig(),
  queues: getQueuesConfig(),
  server: getServerConfig(),
  aws: getAwsConfig(),
});
