import deploy from '../deploy';
import { FirebaseTools, FirebaseDeployConfig } from '../../../ng-deploy/types';
import { logging, JsonObject } from '@angular-devkit/core';
import { BuilderContext, Target, ScheduleOptions, BuilderRun, } from '@angular-devkit/architect/src/index2';

let context: BuilderContext
let firebaseMock: FirebaseTools;

describe('Deploy Angular apps', () => {
  beforeEach(() => initMocks());

  it('should check if the user is authenticated by invoking list', async () => {
    const spy = spyOn(firebaseMock, 'list');
    const spyLogin = spyOn(firebaseMock, 'login');
    await deploy(firebaseMock, context, 'host');
    expect(spy).toHaveBeenCalled();
    expect(spyLogin).not.toHaveBeenCalled();
  });

  it('should invoke login if list rejects', async () => {
    firebaseMock.list = () => Promise.reject();
    const spy = spyOn(firebaseMock, 'list').and.callThrough();
    const spyLogin = spyOn(firebaseMock, 'login');
    await deploy(firebaseMock, context, 'host');
    expect(spy).toHaveBeenCalled();
    expect(spyLogin).toHaveBeenCalled();
  });

  it('should invoke the builder', async () => {
    const spy = spyOn(context, 'scheduleTarget').and.callThrough();
    await deploy(firebaseMock, context, 'host');
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith({
      target: 'build',
      configuration: 'production',
      project: 'foo'
    });
  });

  it('should invoke firebase.deploy', async () => {
    const spy = spyOn(firebaseMock, 'deploy').and.callThrough();
    await deploy(firebaseMock, context, 'host');
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith({
      cwd: 'host',
    });
  });
});

const initMocks = () => {
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