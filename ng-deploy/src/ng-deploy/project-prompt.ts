import * as inquirer from 'inquirer';
import { Project } from './types';
const fuzzy = require('fuzzy');

inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'));

// `fuzzy` passes either the original list of projects or an internal object
// which contains the project as a property.
const isProject = (elem: Project | { original: Project }): elem is Project => {
  return (<{ original: Project }>elem).original === undefined;
};

const searchProjects = (projects: Project[]) => {
  return (_: any, input: string) => {
    return Promise.resolve(
      fuzzy
        .filter(input, projects, {
          extract(el: Project) {
            return `${el.id} ${el.name} ${el.permission}`;
          }
        })
        .map((result: Project | { original: Project }) => {
          let original: Project;
          if (isProject(result)) {
            original = result;
          } else {
            original = result.original;
          }
          return { name: `${original.id} (${original.name})`, title: original.name, value: original.id };
        })
    );
  };
};

export const projectPrompt = (projects: Project[]) => {
  return (inquirer as any).prompt({
    type: 'autocomplete',
    name: 'project',
    source: searchProjects(projects),
    message: 'Please select a project:'
  });
};
