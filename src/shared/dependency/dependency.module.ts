import { Module } from '@nestjs/common';
import { DependencySqlService } from './infrastructure/adapters';
import { DEPENDENCY_SERVICE } from './domain';

@Module({
  imports: [],
  controllers: [],
  providers: [{ provide: DEPENDENCY_SERVICE, useClass: DependencySqlService }],
  exports: [DEPENDENCY_SERVICE],
})
export class DependencyModule {}
