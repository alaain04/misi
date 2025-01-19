import { APP_MODE } from '@libs/api-utils';
import { ParseArrayPipe } from '@nestjs/common';
import { plainToInstance, Transform, Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  Min,
  validateSync,
} from 'class-validator';

export enum Environment {
  DEV = 'development',
  PRD = 'production',
  STG = 'staging',
  TST = 'testing',
}

export class AppConfig {
  @IsEnum(Environment)
  NODE_ENV: Environment;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(65535)
  PORT: number;

  @IsNotEmpty()
  @Transform(({ value }) => value.split(',') as APP_MODE[])
  APP_MODE: APP_MODE[];

  @IsString()
  @IsNotEmpty()
  QUEUE_DEPENDENCIES: string;

  @IsString()
  @IsNotEmpty()
  QUEUE_JOBS: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(AppConfig, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
