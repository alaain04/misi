export class RepositoryReleaseResponseDto {
    releaseId: string;
    repositoryUuid: string;
    tag?: string;
    body?: string;
    publishedAt?: string;
    createdAt: Date;
    updatedAt: Date;

    constructor(data: RepositoryReleaseResponseDto) {
        Object.assign(this, data);
    }

    static fromPrisma(release: any): RepositoryReleaseResponseDto {
        return new RepositoryReleaseResponseDto({
            releaseId: release.releaseId,
            repositoryUuid: release.repositoryUuid,
            tag: release.tag,
            body: release.body,
            publishedAt: release.publishedAt,
            createdAt: release.createdAt,
            updatedAt: release.updatedAt,
        });
    }
}
