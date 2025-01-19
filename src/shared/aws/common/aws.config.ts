import { Agent as Http } from 'http';
import { Agent as Https } from 'https';

import { NodeHttpHandler } from '@smithy/node-http-handler';
import { type AwsConfig } from './aws.types';
import {
  MissingAwsRegionConfigurationError,
  MissingAwsEndpointConfigurationError,
} from './errors/missing-aws-configuration.error';
import { Environment } from 'src/app.config';

const AgentsMap = {
  [Environment.DEV]: Http,
  [Environment.TST]: Http,
  [Environment.STG]: Https,
  [Environment.PRD]: Https,
} as const;

export const awsConfiguration = (): AwsConfig => {
  const region = process.env.AWS_REGION; // us-east-1
  const endpoint = process.env.AWS_ENDPOINT; // http://localhost:4566
  const env = process.env.NODE_ENV; // dev

  if (!region) {
    throw new MissingAwsRegionConfigurationError();
  }

  if (!endpoint) {
    throw new MissingAwsEndpointConfigurationError();
  }

  const agentOptions = { keepAlive: true };
  const agent = new AgentsMap[env](agentOptions);

  return {
    apiVersion: '2012-11-05',
    endpoint,
    requestHandler: new NodeHttpHandler({
      ...(agent instanceof Http ? { httpAgent: agent } : { httpsAgent: agent }),
    }),
    region,
  };
};
