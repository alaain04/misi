import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import { Logger } from '@nestjs/common';
import {
  PackageJsonData,
  PackageJsonLockData,
} from '@shared/job-tracker/domain/entities/package-json.entities';
import { NpmService } from '@apps/manager/domain/ports/npm.os.service';
import { DependencyData } from '@shared/dependency';

export default class NpmOsService implements NpmService {
  private readonly logger = new Logger(NpmOsService.name);
  private tmpFolder: string = '';

  private createTmpDir(packageId: string) {
    this.setTmpFolder(packageId);
    if (!fs.existsSync(this.tmpFolder)) {
      this.logger.debug('Temporal folder created');
      fs.mkdirSync(this.tmpFolder, { recursive: true });
    }
  }

  private deleteTmpDir(packageId: string) {
    this.setTmpFolder(packageId);
    if (fs.existsSync(this.tmpFolder)) {
      fs.rmSync(this.tmpFolder, { recursive: true, force: true });
      this.logger.debug('Temporal folder cleaned up');
    }
  }

  private setTmpFolder(id: string) {
    this.tmpFolder = 'tmp/' + id;
  }

  private savePackageJson(id: string, packageJson: PackageJsonData) {
    this.createTmpDir(id);

    const filePath = path.join(this.tmpFolder, 'package.json');

    const fileString = JSON.stringify(packageJson, null, 2);
    fs.writeFileSync(filePath, fileString);

    this.logger.debug(`Package.json saved in ${this.tmpFolder}`);
  }

  async installDependencies(
    id: string,
    packageJson: PackageJsonData,
  ): Promise<void> {
    this.savePackageJson(id, packageJson);

    // Install dependencies
    try {
      this.logger.debug('Running npm install...');
      execSync('npm install --package-lock-only', {
        stdio: 'inherit',
        cwd: this.tmpFolder,
      });
      this.logger.debug('Dependencies installed successfully!');
    } catch (error) {
      this.logger.error('Error running npm install:', error);
    }
  }

  async extractInstalledDependencies(id: string): Promise<DependencyData[]> {
    const pkgLock = path.join(this.tmpFolder, 'package-lock.json');
    const file = fs.readFileSync(pkgLock);
    const packageJsonLock = JSON.parse(file.toString()) as PackageJsonLockData;
    const dependencies: DependencyData[] = [];

    for (const dep of Object.keys(packageJsonLock.packages)) {
      const matches = dep.match(/node_modules\/(.+)/);

      if (matches?.length) {
        const value = packageJsonLock.packages[dep];

        const dependency = DependencyData.build({
          name: matches[1],
          version: value.version,
        });
        // dependency.nodeEngine = value.engines?.node;
        // dependency.license = value.license;
        // dependency.url = value.resolved.split('-/')[0] + value.version;
        dependencies.push(dependency);
      }
    }

    this.deleteTmpDir(id);
    return dependencies;
  }
}
