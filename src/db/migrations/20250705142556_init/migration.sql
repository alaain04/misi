-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('PENDING', 'RUNNING', 'FINISHED', 'FAILED');

-- CreateTable
CREATE TABLE "JOBS" (
    "uuid" TEXT NOT NULL,
    "status" "JobStatus" NOT NULL,
    "packageJson" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

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

-- CreateTable
CREATE TABLE "REGISTRIES_METADATA" (
    "uuid" TEXT NOT NULL,
    "registryId" TEXT NOT NULL,
    "dependencyUuid" TEXT NOT NULL,
    "author" JSONB,
    "description" TEXT,
    "keywords" TEXT[],
    "downloads" INTEGER,
    "licenses" TEXT[],
    "maintainers" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "repositoryUuid" TEXT,

    CONSTRAINT "REGISTRIES_METADATA_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "REPOSITORIES_METADATA" (
    "uuid" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "name" TEXT,
    "fullName" TEXT,
    "url" TEXT,
    "description" TEXT,
    "size" INTEGER,
    "topics" TEXT[],
    "language" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "REPOSITORIES_METADATA_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "REPOSITORIES_RELEASES" (
    "releaseId" TEXT NOT NULL,
    "repositoryUuid" TEXT NOT NULL,
    "tag" TEXT,
    "body" TEXT,
    "publishedAt" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "REPOSITORIES_RELEASES_pkey" PRIMARY KEY ("releaseId")
);

-- CreateTable
CREATE TABLE "REPOSITORIES_ISSUES" (
    "issueId" TEXT NOT NULL,
    "repositoryUuid" TEXT NOT NULL,
    "number" INTEGER,
    "title" TEXT,
    "reporter" TEXT,
    "body" TEXT,
    "state" TEXT,
    "locked" BOOLEAN,
    "assignee" JSONB,
    "comments" INTEGER,
    "reactions" JSONB,
    "labels" JSONB[],
    "publishedAt" TEXT,
    "closedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "REPOSITORIES_ISSUES_pkey" PRIMARY KEY ("issueId")
);

-- CreateTable
CREATE TABLE "REPOSITORIES_COMMITS" (
    "commitId" TEXT NOT NULL,
    "repositoryUuid" TEXT NOT NULL,
    "description" TEXT,
    "commentsCount" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "REPOSITORIES_COMMITS_pkey" PRIMARY KEY ("commitId")
);

-- CreateTable
CREATE TABLE "REPOSITORIES_VULNERABILITIES" (
    "vulnerabilityId" TEXT NOT NULL,
    "repositoryUuid" TEXT NOT NULL,
    "summary" TEXT,
    "description" TEXT,
    "severity" TEXT,
    "vulnerabilities" JSONB[],
    "publishedAt" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "dependencyUuid" TEXT,

    CONSTRAINT "REPOSITORIES_VULNERABILITIES_pkey" PRIMARY KEY ("vulnerabilityId")
);

-- CreateIndex
CREATE INDEX "job_uuid_updatedAt_index" ON "JOBS"("uuid", "updatedAt");

-- CreateIndex
CREATE INDEX "dependency_name_version_index" ON "DEPENDENCIES"("name", "version");

-- CreateIndex
CREATE UNIQUE INDEX "DEPENDENCIES_name_version_key" ON "DEPENDENCIES"("name", "version");

-- CreateIndex
CREATE UNIQUE INDEX "REGISTRIES_METADATA_dependencyUuid_key" ON "REGISTRIES_METADATA"("dependencyUuid");

-- CreateIndex
CREATE UNIQUE INDEX "REPOSITORIES_METADATA_path_key" ON "REPOSITORIES_METADATA"("path");

-- AddForeignKey
ALTER TABLE "JOB_DEPENDENCIES" ADD CONSTRAINT "JOB_DEPENDENCIES_jobUuid_fkey" FOREIGN KEY ("jobUuid") REFERENCES "JOBS"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JOB_DEPENDENCIES" ADD CONSTRAINT "JOB_DEPENDENCIES_dependencyUuid_fkey" FOREIGN KEY ("dependencyUuid") REFERENCES "DEPENDENCIES"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "REGISTRIES_METADATA" ADD CONSTRAINT "REGISTRIES_METADATA_dependencyUuid_fkey" FOREIGN KEY ("dependencyUuid") REFERENCES "DEPENDENCIES"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "REGISTRIES_METADATA" ADD CONSTRAINT "REGISTRIES_METADATA_repositoryUuid_fkey" FOREIGN KEY ("repositoryUuid") REFERENCES "REPOSITORIES_METADATA"("uuid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "REPOSITORIES_RELEASES" ADD CONSTRAINT "REPOSITORIES_RELEASES_repositoryUuid_fkey" FOREIGN KEY ("repositoryUuid") REFERENCES "REPOSITORIES_METADATA"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "REPOSITORIES_ISSUES" ADD CONSTRAINT "REPOSITORIES_ISSUES_repositoryUuid_fkey" FOREIGN KEY ("repositoryUuid") REFERENCES "REPOSITORIES_METADATA"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "REPOSITORIES_COMMITS" ADD CONSTRAINT "REPOSITORIES_COMMITS_repositoryUuid_fkey" FOREIGN KEY ("repositoryUuid") REFERENCES "REPOSITORIES_METADATA"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "REPOSITORIES_VULNERABILITIES" ADD CONSTRAINT "REPOSITORIES_VULNERABILITIES_repositoryUuid_fkey" FOREIGN KEY ("repositoryUuid") REFERENCES "REPOSITORIES_METADATA"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "REPOSITORIES_VULNERABILITIES" ADD CONSTRAINT "REPOSITORIES_VULNERABILITIES_dependencyUuid_fkey" FOREIGN KEY ("dependencyUuid") REFERENCES "DEPENDENCIES"("uuid") ON DELETE SET NULL ON UPDATE CASCADE;
