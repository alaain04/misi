export class RepositoryResponseDto {
    uuid: string;
    path: string;
    name?: string;
    fullName?: string;
    url?: string;
    description?: string;
    size?: number;
    topics: string[];
    language?: string;
    createdAt: Date;
    updatedAt: Date;

    constructor(data: RepositoryResponseDto) {
        Object.assign(this, data);
    }

    static fromPrisma(repository: any): RepositoryResponseDto {
        return new RepositoryResponseDto({
            uuid: repository.uuid,
            path: repository.path,
            name: repository.name,
            fullName: repository.fullName,
            url: repository.url,
            description: repository.description,
            size: repository.size,
            topics: repository.topics,
            language: repository.language,
            createdAt: repository.createdAt,
            updatedAt: repository.updatedAt,
        });
    }
}
