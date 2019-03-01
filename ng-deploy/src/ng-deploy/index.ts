import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
// import {addPackageJsonDependency,  NodeDependencyType} from 'schematics-utilities';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function ngDeploy(_options: any): Rule {
  return (tree: Tree, _context: SchematicContext) => {

    // TODO(kirjs): Uncomment
    // const ngDeploy = {
    //   type: NodeDependencyType.Dev,
    //   name: 'ng-deploy',
    //   version: '../ng-deploy'
    // };
    //  TODO: Research if there is a better alternative
    // addPackageJsonDependency(tree, ngDeploy);

    _context.addTask(new NodePackageInstallTask());

    return tree;
  };
}
