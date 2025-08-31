export class RepositoryIssueResponseDto {
    issueId: string;
    repositoryUuid: string;
    number?: number;
    title?: string;
    reporter?: string;
    body?: string;
    state?: string;
    locked?: boolean;
    assignee?: any;
    comments?: number;
    reactions?: any;
    labels: any[];
    publishedAt?: string;
    closedAt?: Date;
    createdAt: Date;
    updatedAt: Date;

    constructor(data: RepositoryIssueResponseDto) {
        Object.assign(this, data);
    }

    static fromPrisma(issue: any): RepositoryIssueResponseDto {
        return new RepositoryIssueResponseDto({
            issueId: issue.issueId,
            repositoryUuid: issue.repositoryUuid,
            number: issue.number,
            title: issue.title,
            reporter: issue.reporter,
            body: issue.body,
            state: issue.state,
            locked: issue.locked,
            assignee: issue.assignee,
            comments: issue.comments,
            reactions: issue.reactions,
            labels: issue.labels,
            publishedAt: issue.publishedAt,
            closedAt: issue.closedAt,
            createdAt: issue.createdAt,
            updatedAt: issue.updatedAt,
        });
    }
}
