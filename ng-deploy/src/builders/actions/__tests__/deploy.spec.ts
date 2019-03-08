import deploy from '../deploy';
import { FirebaseTools, FirebaseDeployConfig } from '../../../ng-deploy/types';
import { virtualFs, Path, logging, JsonObject, PathFragment } from '@angular-devkit/core';
import { BuilderContext, Target, ScheduleOptions, BuilderRun, } from '@angular-devkit/architect/src/index2';
import { FileBufferLike, HostWatchOptions, HostWatchEvent, FileBuffer } from '@angular-devkit/core/src/virtual-fs/host';
import { Observable, of } from 'rxjs';

let host: virtualFs.Host;
let context: BuilderContext
let firebaseMock: FirebaseTools;

describe('Deploy Angular apps', () => {
  beforeEach(() => initMocks());

  it('should check if the user is authenticated by invoking list', async () => {
    const spy = spyOn(firebaseMock, 'list');
    const spyLogin = spyOn(firebaseMock, 'login');
    try {
      await deploy(firebaseMock, context, host);
    } catch (e) {}
    expect(spy).toHaveBeenCalled();
    expect(spyLogin).not.toHaveBeenCalled();
  });

  it('should invoke login if list rejects', async () => {
    firebaseMock.list = () => Promise.reject();
    const spy = spyOn(firebaseMock, 'list').and.callThrough();
    const spyLogin = spyOn(firebaseMock, 'login');
    try {
      await deploy(firebaseMock, context, host);
    } catch (e) {}
    expect(spy).toHaveBeenCalled();
    expect(spyLogin).toHaveBeenCalled();
  });

  it('should invoke the builder', async () => {
    const spy = spyOn(context, 'scheduleTarget').and.callThrough();
    try {
      await deploy(firebaseMock, context, host);
    } catch (e) {}
    expect(spy).toHaveBeenCalled();
  });
});

const initMocks = () => {
  host = {
    write: (_: Path, __: FileBufferLike): Observable<void> => of(),
    delete: (_: Path): Observable<void> => of(),
    rename: (_: Path, __: Path): Observable<void> => of(),
    watch: (_: Path, __?: HostWatchOptions): Observable<HostWatchEvent> | null => null,
    capabilities: {
      synchronous: true
    },
    read: (_: Path): Observable<FileBuffer> => of(),
    list: (_: Path): Observable<PathFragment[]> => of([]),
    exists: (_: Path): Observable<boolean> => of(true),
    isDirectory: (_: Path): Observable<boolean> => of(true),
    isFile: (_: Path): Observable<boolean> => of(true),
    stat: (_: Path): Observable<null> | null => null
  };

  firebaseMock = {
    login: () => Promise.resolve(),
    list: () => Promise.resolve([]),
    deploy: (_: FirebaseDeployConfig) => Promise.resolve()
  };

  context = {
    target: {
      configuration: 'production',
      project: 'foo',
      target: 'foo'
    },
    builder: {
      builderName: 'mock',
      description: 'mock',
      optionSchema: false
    },
    currentDirectory: 'cwd',
    id: 1,
    logger: new logging.Logger('mock'),
    workspaceRoot: 'cwd',
    getTargetOptions: (_: Target) => Promise.resolve({}),
    reportProgress: (_: number, __?: number, ___?: string) => {},
    reportStatus: (_: string) => {},
    reportRunning: () => {},
    scheduleBuilder: (_: string, __?: JsonObject, ___?: ScheduleOptions) => Promise.resolve({} as BuilderRun),
    scheduleTarget: (_: Target, __?: JsonObject, ___?: ScheduleOptions) => Promise.resolve({} as BuilderRun)
  };
};