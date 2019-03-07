const firebase = require('firebase-tools');

export const listProjects = () => {
  return firebase.list().catch(() => firebase.login().then(() => firebase.list()));
};
