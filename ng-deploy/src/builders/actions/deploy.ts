import { BuilderContext } from '@angular-devkit/architect/src/index2';
import { join } from 'path';

const tools = require('firebase-tools');

export default function deploy(context: BuilderContext) {
  return tools
    .list()
    .then(() => {
      context.logger.info("You're already logged into Firebase");
    })
    .catch(() => {
      context.logger.info("You're not logged into Firebase. Logging you in...");
      return tools.login();
    })
    .then(() => {
      context.logger.info('Building your application');
      if (!context.target) {
        throw new Error('Cannot execute the build target');
      }
      return context.scheduleTarget({ target: 'build', project: context.target.project, configuration: 'production' })
        .then(res => res.result)
        .then(() => {
          if (!context.target) {
            throw new Error('Cannot execute the build target');
          }
          context.logger.info(join(context.workspaceRoot, 'dist', context.target.project));
          return tools.deploy({
            token: process.env.FIREBASE_TOKEN,
            cwd: context.workspaceRoot
          });
        })
        .then(() => {
          context.logger.info('Successful deployment 🚀');
        })
        .catch(e => {
          console.error(e);
        });
    });
}
