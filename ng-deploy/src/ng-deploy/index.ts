import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
// import {addPackageJsonDependency,  NodeDependencyType} from 'schematics-utilities';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';

const firebaseJson = {
  hosting: {
    public: 'dist/',
    ignore: [
      'firebase.json',
      '**/.*',
      '**/node_modules/**'
    ],
    rewrites: [
      {
        source: '**',
        destination: '/index.html'
      }
    ]
  }
};

const overwriteIfExists = (tree: Tree, path: string, content: string) => {
  if (tree.exists(path)) tree.overwrite(path, content);
  else tree.create(path, content);
};


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
    overwriteIfExists(tree, 'firebase.json', JSON.stringify(firebaseJson));
    overwriteIfExists(tree, '.firebaserc', '{}')

    return tree;
  };
}
