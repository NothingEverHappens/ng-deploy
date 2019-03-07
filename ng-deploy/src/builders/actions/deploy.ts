import { BuilderContext } from '@angular-devkit/architect/src/index2';

const tools = require('firebase-tools');

export default function deploy(context: BuilderContext) {
  return tools
    .list()
    .catch(() => {
      context.logger.warn("🚨 You're not logged into Firebase. Logging you in...");
      return tools.login();
    })
    .then(() => {
      context.logger.info('📦 Building your application...');
      if (!context.target) {
        throw new Error('Cannot execute the build target');
      }
      return context.scheduleTarget({ target: 'build', project: context.target.project, configuration: 'production' })
        .then(res => res.result)
        .then(() => {
          if (!context.target) {
            throw new Error('Cannot execute the build target');
          }
          return tools.deploy({
            cwd: context.workspaceRoot
          });
        })
        .then((success: {hosting: string}) => {
          context.logger.info(`🚀 Your application is now available at https://${success.hosting.split('/')[1]}.firebaseapp.com/`)
        })
        .catch(e => {
          context.logger.error(e);
        });
    });
}
