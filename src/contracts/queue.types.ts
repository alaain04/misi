export type JobMessage = {
  jobUuid: string;
};

export type DependencyMessage = {
  jobUuid: string;
  dependencyUuid: string;
  name: string;
  version: string;
};
