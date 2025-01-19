import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ResourceSingleResponse } from '@libs/api-utils/responses/resource-single.response';
import { PackageRequestDto } from './dtos/package.request.dto';
import { GetJobUseCase } from '../application/get-process.use-case';
import { CreateJobUseCase } from '../application/create-process.use-case';
import { JobResponseDto } from './dtos/process.response.dto';
import { JobResponse } from './process-response';

@Controller('jobs')
export class JobController {
  constructor(
    private readonly createJobUseCase: CreateJobUseCase,
    private readonly getJobUseCase: GetJobUseCase,
  ) {}

  @Get(':uuid')
  async getJob(
    @Param('uuid') uuid: string,
  ): Promise<ResourceSingleResponse<JobResponseDto>> {
    const job = await this.getJobUseCase.execute(uuid);

    return new JobResponse(job);
  }

  @Post('/create')
  async createJob(
    @Body() pkg: PackageRequestDto,
  ): Promise<ResourceSingleResponse<JobResponseDto>> {
    const job = await this.createJobUseCase.execute(pkg.toDomain());
    return new JobResponse(job);
  }
}
