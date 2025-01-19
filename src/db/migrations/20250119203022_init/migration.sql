-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('PENDING', 'RUNNING', 'FINISHED', 'FAILED');

-- CreateTable
CREATE TABLE "JOBS" (
    "uuid" TEXT NOT NULL,
    "status" "JobStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "packageMetadata" JSONB NOT NULL,

    CONSTRAINT "JOBS_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "JOB_DEPENDENCIES" (
    "jobUuid" TEXT NOT NULL,
    "dependencyUuid" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "JOB_DEPENDENCIES_pkey" PRIMARY KEY ("jobUuid","dependencyUuid")
);

-- CreateTable
CREATE TABLE "DEPENDENCIES" (
    "uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DEPENDENCIES_pkey" PRIMARY KEY ("uuid")
);

-- CreateIndex
CREATE INDEX "job_uuid_updatedAt_index" ON "JOBS"("uuid", "updatedAt");

-- CreateIndex
CREATE INDEX "dependency_name_version_index" ON "DEPENDENCIES"("name", "version");

-- CreateIndex
CREATE UNIQUE INDEX "DEPENDENCIES_name_version_key" ON "DEPENDENCIES"("name", "version");

-- AddForeignKey
ALTER TABLE "JOB_DEPENDENCIES" ADD CONSTRAINT "JOB_DEPENDENCIES_jobUuid_fkey" FOREIGN KEY ("jobUuid") REFERENCES "JOBS"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JOB_DEPENDENCIES" ADD CONSTRAINT "JOB_DEPENDENCIES_dependencyUuid_fkey" FOREIGN KEY ("dependencyUuid") REFERENCES "DEPENDENCIES"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;
