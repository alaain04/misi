export class MissingAwsRegionConfigurationError extends Error {
    constructor() {
        super('Missing AWS region configuration');
    }
}

export class MissingAwsEndpointConfigurationError extends Error {
    constructor() {
        super('Missing AWS endpoint configuration');
    }
}
