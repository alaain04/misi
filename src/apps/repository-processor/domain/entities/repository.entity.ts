import { BaseEntity, JustProps, ValueObject } from '@libs/entity';

export class RepositoryVulnerabilityData extends ValueObject {
  vulnerabilityId: string;
  summary: string;
  description: string;
  severity: string;
  vulnerabilities: object[];
  publishedAt: string;
  createdAt: Date;
  updatedAt: Date;
  repository: Repository;

  static build(
    data: JustProps<RepositoryVulnerabilityData>,
  ): RepositoryVulnerabilityData {
    return new RepositoryVulnerabilityData(data);
  }
}

export class RepositoryReleaseData extends ValueObject {
  releaseId: string;
  tag: string;
  body: string;
  publishedAt: string;
  createdAt: Date;
  updatedAt: Date;
  repository: Repository;

  static build(data: JustProps<RepositoryReleaseData>): RepositoryReleaseData {
    return new RepositoryReleaseData(data);
  }
}

export class RepositoryIssueData extends ValueObject {
  issueId: string;
  number: number;
  title: string;
  reporter: string;
  body: string;
  state: string;
  locked: boolean;
  assignee?: string;
  comments: number;
  reactions?: object;
  labels: object[];
  publishedAt: string;
  closedAt?: string;
  createdAt: Date;
  updatedAt: Date;
  repository: Repository;

  static build(
    data: Partial<JustProps<RepositoryIssueData>>,
  ): RepositoryIssueData {
    return new RepositoryIssueData(data);
  }
}

export class RepositoryCommitData extends ValueObject {
  commitId: string;
  description: string;
  commentsCount: number;
  createdAt: Date;
  updatedAt: Date;
  repository: Repository;

  static build(
    data: Partial<JustProps<RepositoryCommitData>>,
  ): RepositoryCommitData {
    return new RepositoryCommitData(data);
  }
}

export class RepositoryData extends ValueObject {
  path: string;
  name: string;
  fullName: string;
  url: string;
  description: string;
  size: number;
  topics: string[];
  language: string;
  createdAt: Date;
  updatedAt: Date;

  static build(data: JustProps<RepositoryData>): RepositoryData {
    return new RepositoryData(data);
  }
}

export class Repository extends BaseEntity<RepositoryData> {
  constructor(uuid: string, data: JustProps<RepositoryData>) {
    super(uuid, data);
  }
  static build(uuid: string, data: JustProps<RepositoryData>): Repository {
    return new Repository(uuid, data);
  }
}
