import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
// import {addPackageJsonDependency,  NodeDependencyType} from 'schematics-utilities';
// import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import { from } from 'rxjs';
import { listProjects } from '../builders/actions/init';
import { Project } from './types';
import { projectPrompt } from './project-prompt';

const firebaseJson = {
  hosting: {
    public: 'dist/',
    ignore: ['firebase.json', '**/.*', '**/node_modules/**'],
    rewrites: [
      {
        source: '**',
        destination: '/index.html'
      }
    ]
  }
};

const firebaserc = (project: string) => ({
  projects: {
    default: project
  }
});

const stringify = (obj: any) => JSON.stringify(obj, null, 2);

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

    // _context.addTask(new NodePackageInstallTask());

    return from<Tree>(
      listProjects().then((projects: Project[]) => {
        return projectPrompt(projects)
          .then(({project}: any) => {
            overwriteIfExists(tree, 'firebase.json', stringify(firebaseJson));
            overwriteIfExists(tree, '.firebaserc', stringify(firebaserc(project)));
            return tree;
          });
      })
    );
  };
}
