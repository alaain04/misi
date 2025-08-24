CREATE OR REPLACE PROCEDURE update_job_and_dependency_status(
  in_job_uuid TEXT,
  in_dependency_uuid TEXT
)
LANGUAGE plpgsql
AS $$
DECLARE
  required_traces TEXT[] := ARRAY[
    'REG_METADATA',
    'REP_METADATA',
    'REP_COMMITS',
    'REP_ISSUES',
    'REP_RELEASES',
    'REP_VULNERABILITIES'
  ];
  trace_array TEXT[];
  has_all_traces BOOLEAN;
  has_error BOOLEAN;
  total_finalized INT;
  total_failed INT;
  job_total INT;
BEGIN
  -- Step 1: compute trace array
  SELECT ARRAY_AGG(DISTINCT trace)
  INTO trace_array
  FROM "JOB_DEPENDENCIES"
  WHERE "jobUuid" = in_job_uuid AND "dependencyUuid" = in_dependency_uuid;

  SELECT error IS NOT NULL
  INTO has_error
  FROM "JOB_DEPENDENCIES"
  WHERE "jobUuid" = in_job_uuid AND "dependencyUuid" = in_dependency_uuid;

  has_all_traces := required_traces <@ trace_array;

  -- Step 2: update dependency status
  UPDATE "JOB_DEPENDENCIES"
  SET status = CASE
    WHEN has_error THEN 'FAILED'::"JobDependencyStatus"
    WHEN has_all_traces THEN 'FINISHED'::"JobDependencyStatus"
    ELSE 'RUNNING'::"JobDependencyStatus"
  END,
  "updatedAt" = now()
  WHERE "jobUuid" = in_job_uuid AND "dependencyUuid" = in_dependency_uuid;

  SELECT COUNT(*) 
  INTO total_finalized
  FROM "JOB_DEPENDENCIES"
  WHERE "jobUuid" = in_job_uuid AND status IN ('FINISHED'::"JobDependencyStatus", 'FAILED'::"JobDependencyStatus");

  SELECT COUNT(*)
  INTO total_failed
  FROM "JOB_DEPENDENCIES"
  WHERE "jobUuid" = in_job_uuid AND status = 'FAILED'::"JobDependencyStatus";

  SELECT "totalDependencies"
  INTO job_total
  FROM "JOBS"
  WHERE uuid = in_job_uuid;

  IF job_total IS NOT NULL THEN
    UPDATE "JOBS"
    SET "status" = (CASE
                  WHEN total_finalized = job_total THEN 'FINISHED'::"JobStatus"
                    ELSE 'RUNNING'::"JobStatus"
                  END),
    "downloadedFailed" = total_failed,
    "downloadedSuccessfully" = total_finalized - total_failed,
    "updatedAt" = now()
    WHERE uuid = in_job_uuid;
  END IF;
END;
$$;