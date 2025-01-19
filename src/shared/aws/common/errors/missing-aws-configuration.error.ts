import { RuntimeError } from '@libs/errors';

export class MissingAwsRegionConfigurationError extends RuntimeError {
  constructor() {
    super('AWS_REGION is not set');
  }
}

export class MissingAwsEndpointConfigurationError extends RuntimeError {
  constructor() {
    super('AWS_ENDPOINT is not set');
  }
}
