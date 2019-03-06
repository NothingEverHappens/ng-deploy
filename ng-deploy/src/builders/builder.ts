import { BuilderContext, BuilderOutput, createBuilder } from '@angular-devkit/architect/src/index2';
// import { Schema as DeploySchema } from './schema';
import deploy from './actions/deploy';

// Call the createBuilder() function to create a builder. This mirrors
// createJobHandler() but add typings specific to Architect Builders.
export default createBuilder<any>(
  (_: any, context: BuilderContext): Promise<BuilderOutput> => {
    // The project root is added to a BuilderContext.
    return deploy(context).then(() => ({ success: true }));
  }
);
