import { RegistryData } from '@apps/registry-processor/domain/entities/registry.entity';
import { JustProps, ValueObject } from '@libs/entity';

export class NpmJsMetadata extends ValueObject {
  name: string;
  version: string;
  keywords: string[];
  author: User;
  _id: string;
  maintainers: User[];
  homepage: string;
  bugs: {
    url: string;
  };
  main: string;
  engines: {
    node: string;
  };
  licenses: License[];
  repository: {
    url: string;
    type: string;
  };
  _npmVersion: string;
  description: string;

  static toDomain(data: JustProps<NpmJsMetadata>): RegistryData {
    const regex = /.+github.com\/(.+)\.git/;
    const match = data.repository.url.match(regex);
    let repositoryPath;

    if (match?.length) {
      repositoryPath = match[1];
    } else {
      repositoryPath = undefined;
    }

    return new RegistryData({
      registryId: data._id,
      description: data.description,
      keywords: data.keywords,
      repositoryPath,
      licenses: data.licenses?.map((l) => l.type) ?? [],
      maintainers: data.maintainers?.length ?? 0,
      author: data.author,
      downloads: 0,
    });
  }
}

type User = {
  url: string;
  name: string;
  email: string;
};

type License = {
  type: string;
};

export class NpmJsDownloads extends ValueObject {
  downloads: number;
  start: string;
  end: string;
  package: string;

  static toDomain(data: JustProps<NpmJsDownloads>): NpmJsDownloads {
    return new NpmJsDownloads(data);
  }
}
