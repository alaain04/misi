import { PackageData } from '@apps/api/domain/entities/package.entity';
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

  toDomain(): PackageData {
    return PackageData.build({
      name: this.name,
      version: this.version,
      description: this.description,
      dependencies: this.dependencies,
    });
  }
}
