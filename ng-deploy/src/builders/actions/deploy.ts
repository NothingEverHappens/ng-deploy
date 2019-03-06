import { BuilderContext } from '@angular-devkit/architect/src/index2';

const tools = require('firebase-tools');

export default function deploy(context: BuilderContext) {
    return tools.list().then(() => {
        context.logger.info('You\'re already logged into Firebase');
    }).catch(() => {
        context.logger.info('You\'re not logged into Firebase. Logging you in...');
        return tools.login();
    })
    .then(() => {
        context.logger.info('Building your application' + context.workspaceRoot);
        if (!context.target) {
            throw new Error('Cannot execute the build target')
        }
        return context.scheduleTarget({ target: 'build', project: context.target.project });
    })
}
