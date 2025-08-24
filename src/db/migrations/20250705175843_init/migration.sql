/*
  Warnings:

  - Added the required column `status` to the `JOB_DEPENDENCIES` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `JOB_DEPENDENCIES` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "JobDependencyTrace" AS ENUM ('REG_METADATA', 'REG_DOWNLOADED', 'REP_METADATA', 'REP_COMMITS', 'REP_ISSUES', 'REP_RELEASES', 'REP_VULNERABILITIES');

-- CreateEnum
CREATE TYPE "JobDependencyStatus" AS ENUM ('RUNNING', 'FINISHED', 'FAILED');

-- AlterTable
ALTER TABLE "JOBS" 
ADD COLUMN     "totalDependencies" INTEGER,
ADD COLUMN     "downloadedFailed" INTEGER,
ADD COLUMN     "downloadedSuccessfully" INTEGER;

-- AlterTable
ALTER TABLE "JOB_DEPENDENCIES" ADD COLUMN     "error" TEXT,
ADD COLUMN     "status" "JobDependencyStatus" NOT NULL,
ADD COLUMN     "trace" "JobDependencyTrace"[] DEFAULT ARRAY[]::"JobDependencyTrace"[],
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
