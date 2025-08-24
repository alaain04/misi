import {
  RepositoryCommitData,
  RepositoryIssueData,
  RepositoryReleaseData,
  RepositoryVulnerabilityData,
  RepositoryData,
} from '@apps/repository-processor/domain/entities/repository.entity';
import { JustProps, ValueObject } from '@libs/entity';

type GHUser = {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  user_view_type: string;
  site_admin: boolean;
  date: string;
};

type GHLabel = {
  id: number;
  node_id: string;
  url: string;
  name: string;
  color: string;
  default: boolean;
  description: string;
};

type GHReaction = {
  url: string;
  total_count: number;
  '+1': number;
  '-1': number;
  laugh: number;
  hooray: number;
  confused: number;
  heart: number;
  rocket: number;
  eyes: number;
};

type GHPullRequest = {
  url: string;
  html_url: string;
  diff_url: string;
  patch_url: string;
  merged_at: string;
};

export class GHIssue extends ValueObject {
  url: string;
  repository_url: string;
  labels_url: string;
  comments_url: string;
  events_url: string;
  html_url: string;
  id: number;
  node_id: string;
  number: number;
  title: string;
  user: GHUser;
  labels: GHLabel[];
  state: string;
  locked: boolean;
  assignee: string | GHUser;
  assignees: [];
  milestone: string;
  comments: number;
  created_at: string;
  updated_at: string;
  closed_at: string;
  author_association: string;
  active_lock_reason: string;
  draft: boolean;
  pull_request: GHPullRequest;
  body: string;
  closed_by: string;
  reactions: GHReaction;
  timeline_url: string;
  performed_via_github_app: string;
  state_reason: string;

  static toDomain(data: JustProps<GHIssue>): RepositoryIssueData {
    return new RepositoryIssueData({
      issueId: data.id.toString(),
      number: data.number,
      title: data.title,
      reporter: data.user.login,
      body: data.body,
      state: data.state,
      locked: data.locked,
      assignee: data.assignee,
      comments: data.comments,
      reactions: data.reactions,
      labels: data.labels,
      publishedAt: data.created_at,
      closedAt: data.closed_at,
    });
  }
}

class GHVulnerability {
  package: {
    ecosystem: string;
    name: string;
  };
  vulnerable_version_range: string;
  patched_versions: string;
  vulnerable_functions: object[];
}

export class GHMetadata extends ValueObject {
  node_id: string;
  name: string;
  full_name: string;
  private: boolean;
  owner: GHUser;
  html_url: string;
  description: string;
  fork: boolean;
  url: string;
  forks_url: string;
  keys_url: string;
  collaborators_url: string;
  teams_url: string;
  hooks_url: string;
  issue_events_url: string;
  events_url: string;
  assignees_url: string;
  branches_url: string;
  tags_url: string;
  blobs_url: string;
  git_tags_url: string;
  git_refs_url: string;
  trees_url: string;
  statuses_url: string;
  languages_url: string;
  stargazers_url: string;
  contributors_url: string;
  subscribers_url: string;
  subscription_url: string;
  commits_url: string;
  git_commits_url: string;
  comments_url: string;
  issue_comment_url: string;
  contents_url: string;
  compare_url: string;
  merges_url: string;
  archive_url: string;
  downloads_url: string;
  issues_url: string;
  pulls_url: string;
  milestones_url: string;
  notifications_url: string;
  labels_url: string;
  releases_url: string;
  deployments_url: string;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  git_url: string;
  ssh_url: string;
  clone_url: string;
  svn_url: string;
  homepage: string;
  size: number;
  stargazers_count: number;
  watchers_count: number;
  language: string;
  has_issues: true;
  has_projects: true;
  has_downloads: true;
  has_wiki: boolean;
  has_pages: boolean;
  has_discussions: true;
  forks_count: number;
  mirror_url: null;
  archived: boolean;
  disabled: boolean;
  open_issues_count: number;
  license: {
    key: string;
    name: string;
    spdx_id: string;
    url: string;
    node_id: string;
  };
  allow_forking: true;
  is_template: boolean;
  web_commit_signoff_required: boolean;
  topics: string[];
  visibility: string;
  forks: number;
  open_issues: number;
  watchers: number;
  default_branch: string;
  permissions: {
    admin: boolean;
    maintain: boolean;
    push: boolean;
    triage: boolean;
    pull: true;
  };
  temp_clone_token: string;
  custom_properties: object;
  organization: GHUser;
  network_count: number;
  subscribers_count: number;

  static toDomain(data: JustProps<GHMetadata>): RepositoryData {
    return new RepositoryData({
      name: data.name,
      fullName: data.full_name,
      url: data.url,
      description: data.description,
      size: data.size,
      topics: data.topics,
      language: data.language,
    });
  }
}

export class GHRelease extends ValueObject {
  url: string;
  assets_url: string;
  upload_url: string;
  html_url: string;
  id: number;
  author: GHUser;
  node_id: string;
  tag_name: string;
  target_commitish: string;
  name: string;
  draft: false;
  prerelease: false;
  created_at: string;
  published_at: string;
  assets: any[];
  tarball_url: string;
  zipball_url: string;
  body: string;
  reactions: GHReaction;

  static toDomain(data: JustProps<GHRelease>): RepositoryReleaseData {
    return new RepositoryReleaseData({
      releaseId: data.id.toString(),
      tag: data.tag_name,
      body: data.body,
      publishedAt: data.published_at,
    });
  }
}

export class GHCommit extends ValueObject {
  sha: string;
  node_id: string;
  commit: {
    author: GHUser;
    message: string;
    url: string;
    comment_count: number;
  };
  url: string;
  html_url: string;
  comments_url: string;
  author: GHUser;
  committer: GHUser;

  static toDomain(data: JustProps<GHCommit>): RepositoryCommitData {
    return new RepositoryCommitData({
      commitId: data.sha,
      description: data.commit.message,
      commentsCount: data.commit.comment_count,
      createdAt: data.commit.author.date,
    });
  }
}

export class GHSecurityAdvisory extends ValueObject {
  ghsa_id: string;
  cve_id: string;
  url: string;
  html_url: string;
  summary: string;
  description: string;
  severity: string;
  author: string;
  publisher: GHUser;
  identifiers: object[];
  state: string;
  created_at: string;
  updated_at: string;
  published_at: string;
  closed_at: string;
  withdrawn_at: string;
  submission: string;
  vulnerabilities: GHVulnerability[];

  static toDomain(
    data: JustProps<GHSecurityAdvisory>,
  ): RepositoryVulnerabilityData {
    return new RepositoryVulnerabilityData({
      vulnerabilityId: data.ghsa_id,
      summary: data.summary,
      description: data.description,
      severity: data.severity,
      vulnerabilities: data.vulnerabilities,
      publishedAt: data.published_at,
    });
  }
}
