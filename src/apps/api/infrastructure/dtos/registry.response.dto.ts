export class RegistryResponseDto {
    uuid: string;
    registryId: string;
    dependencyUuid: string;
    author?: any;
    repositoryPath?: string;
    description?: string;
    keywords: string[];
    downloads?: number;
    licenses: string[];
    maintainers?: number;
    repositoryUuid?: string;
    createdAt: Date;
    updatedAt: Date;

    constructor(data: RegistryResponseDto) {
        Object.assign(this, data);
    }

    static fromPrisma(registry: any): RegistryResponseDto {
        return new RegistryResponseDto({
            uuid: registry.uuid,
            registryId: registry.registryId,
            dependencyUuid: registry.dependencyUuid,
            author: registry.author,
            repositoryPath: registry.repositoryPath,
            description: registry.description,
            keywords: registry.keywords,
            downloads: registry.downloads,
            licenses: registry.licenses,
            maintainers: registry.maintainers,
            repositoryUuid: registry.repositoryUuid,
            createdAt: registry.createdAt,
            updatedAt: registry.updatedAt,
        });
    }
}
