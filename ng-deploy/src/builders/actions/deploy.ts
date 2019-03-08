import { BuilderContext } from '@angular-devkit/architect/src/index2';
import { virtualFs, experimental, normalize } from '@angular-devkit/core';
import { Stats } from '@angular-devkit/core/src/virtual-fs/host';
import { CoreSchemaRegistry, transforms } from '@angular-devkit/core/src/json/schema';
import { join } from 'path';

const tools = require('firebase-tools');

export default async function deploy(context: BuilderContext, host: virtualFs.Host<Stats>,) {
  
  try {
    await tools.list();
  } catch (e) {
    context.logger.warn("🚨 You're not logged into Firebase. Logging you in...");
    await tools.login();
  }
  if (!context.target) {
    throw new Error('Cannot execute the build target');
  }

  context.logger.info(`📦 Building "${context.target.project}"`);

  const run = await context.scheduleTarget({ target: 'build', project: context.target.project, configuration: 'production' });
  await run.result;
  if (!context.target) {
    throw new Error('Cannot execute the build target');
  }

  const registry = new CoreSchemaRegistry();
  registry.addPostTransform(transforms.addUndefinedDefaults);
  const root = normalize(context.workspaceRoot);
  const workspace = new experimental.workspace.Workspace(root, host)
  await workspace.loadWorkspaceFromHost(normalize('angular.json')).toPromise();
  const project = workspace.getProject(context.target.project)

  try {
    const success = await tools.deploy({ cwd: join(context.workspaceRoot, project.root) });
    context.logger.info(`🚀 Your application is now available at https://${success.hosting.split('/')[1]}.firebaseapp.com/`);
  } catch (e) {
    context.logger.error(e);
  }
}
