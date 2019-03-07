import { Rule, Tree, SchematicsException } from '@angular-devkit/schematics';
import {parseJson, JsonParseMode, experimental} from '@angular-devkit/core';
// import {addPackageJsonDependency,  NodeDependencyType} from 'schematics-utilities';
// import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import { from } from 'rxjs';
import { listProjects } from '../builders/actions/init';
import { Project } from './types';
import { projectPrompt } from './project-prompt';

const firebaseJson = (path: string) => ({
  hosting: {
    public: path,
    ignore: ['firebase.json', '**/.*', '**/node_modules/**'],
    rewrites: [
      {
        source: '**',
        destination: '/index.html'
      }
    ]
  }
});

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

interface DeployOptions {
  project: string;
}

function getWorkspace(
  host: Tree,
): { path: string, workspace: experimental.workspace.WorkspaceSchema } {
  const possibleFiles = [ '/angular.json', '/.angular.json' ];
  const path = possibleFiles.filter(path => host.exists(path))[0];

  const configBuffer = host.read(path);
  if (configBuffer === null) {
    throw new SchematicsException(`Could not find (${path})`);
  }
  const content = configBuffer.toString();

  return {
    path,
    workspace: parseJson(
      content,
      JsonParseMode.Loose,
    ) as {} as experimental.workspace.WorkspaceSchema,
  };
}

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function ngDeploy(options: DeployOptions): Rule {
  return (tree: Tree) => {
    if (!options.project) {
      throw new SchematicsException('Option "project" is required.');
    }
    // TODO(kirjs): Uncomment
    // const ngDeploy = {
    //   type: NodeDependencyType.Dev,
    //   name: 'ng-deploy',
    //   version: '../ng-deploy'
    // };
    //  TODO: Research if there is a better alternative
    // addPackageJsonDependency(tree, ngDeploy);

    // _context.addTask(new NodePackageInstallTask());

    const { workspace } = getWorkspace(tree);
    const project = workspace.projects[options.project];
    if (!project) {
      throw new SchematicsException('Project is not defined in this workspace.');
    }

    if (project.projectType !== 'application') {
      throw new SchematicsException(`Deploy requires a project type of "application".`);
    }

    if (!project.architect || !project.architect.build || !project.architect.build.options || !project.architect.build.options.outputPath) {
      throw new SchematicsException(`Cannot read the output path of project "${options.project}"`);
    }

    const outputPath = project.architect.build.options.outputPath;

    return from<Tree>(
      listProjects().then((projects: Project[]) => {
        return projectPrompt(projects).then(({ project }: any) => {
          overwriteIfExists(tree, 'firebase.json', stringify(firebaseJson(outputPath)));
          overwriteIfExists(tree, '.firebaserc', stringify(firebaserc(project)));
          return tree;
        });
      })
    );
  };
}
