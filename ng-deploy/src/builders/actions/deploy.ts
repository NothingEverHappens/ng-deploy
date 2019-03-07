import { BuilderContext } from '@angular-devkit/architect/src/index2';

const tools = require('firebase-tools');

export default async function deploy(context: BuilderContext) {
  try {
    await tools.list();
  } catch (e) {
    context.logger.warn("🚨 You're not logged into Firebase. Logging you in...");
    await tools.login();
  }
  context.logger.info('📦 Building your application...');
  if (!context.target) {
    throw new Error('Cannot execute the build target');
  }
  const run = await context.scheduleTarget({ target: 'build', project: context.target.project, configuration: 'production' });
  await run.result;
  if (!context.target) {
    throw new Error('Cannot execute the build target');
  }
  try {
    const success = await tools.deploy({
      cwd: context.workspaceRoot
    });
    context.logger.info(`🚀 Your application is now available at https://${success.hosting.split('/')[1]}.firebaseapp.com/`);
  } catch (e) {
    context.logger.error(e);
  }
}
