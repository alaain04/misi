import { PackageJsonData } from '@shared/job-tracker/domain/entities/package-json.entities';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class PackageRequestDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  readonly version: string;

  @IsOptional()
  @IsString()
  readonly description?: string;

  @IsOptional()
  @IsString()
  readonly author?: string;

  @IsNotEmpty()
  dependencies: Record<string, string>;

  toDomain(): PackageJsonData {
    return PackageJsonData.build({
      name: this.name,
      version: this.version,
      description: this.description,
      dependencies: this.dependencies,
    });
  }
}
