import { index2 as architect } from '@angular-devkit/architect';
// import { Schema as DeploySchema } from './schema';
import deploy from './actions/deploy';


// Call the createBuilder() function to create a builder. This mirrors
// createJobHandler() but add typings specific to Architect Builders.
export default architect.createBuilder<any>((_, __) => {
    // The project root is added to a BuilderContext.
    deploy();
    return {success: true};
});



