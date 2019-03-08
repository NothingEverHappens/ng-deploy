import { BuilderContext } from '@angular-devkit/architect/src/index2';
import { FirebaseTools } from '../../ng-deploy/types';

export default async function deploy(firebaseTools: FirebaseTools, context: BuilderContext, projectRoot: string) {
  try {
    await firebaseTools.list();
  } catch (e) {
    context.logger.warn("🚨 You're not logged into Firebase. Logging you in...");
    await firebaseTools.login();
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

  try {
    const success = await firebaseTools.deploy({ cwd: projectRoot });
    context.logger.info(`🚀 Your application is now available at https://${success.hosting.split('/')[1]}.firebaseapp.com/`);
  } catch (e) {
    context.logger.error(e);
  }
}
