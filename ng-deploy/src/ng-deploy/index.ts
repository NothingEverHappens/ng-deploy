import { Rule, Tree, SchematicsException } from '@angular-devkit/schematics';
import {parseJson, JsonParseMode, experimental, normalize} from '@angular-devkit/core';
// import {addPackageJsonDependency,  NodeDependencyType} from 'schematics-utilities';
// import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import { from } from 'rxjs';
import { listProjects } from '../builders/actions/init';
import { Project } from './types';
import { projectPrompt } from './project-prompt';
import { sep, join } from 'path';

const firebaseJson = (root: string, path: string) => ({
  hosting: {
    public: join(`..${sep}`.repeat(root.split(sep).length - 1), path),
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
    const root = project.root;

    return from<Tree>(
      listProjects().then((projects: Project[]) => {
        return projectPrompt(projects).then(({ project }: any) => {
          overwriteIfExists(tree, join(normalize(root), 'firebase.json'), stringify(firebaseJson(root, outputPath)));
          overwriteIfExists(tree, join(normalize(root), '.firebaserc'), stringify(firebaserc(project)));
          return tree;
        });
      })
    );
  };
}
