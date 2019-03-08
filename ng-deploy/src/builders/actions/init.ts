const firebase = require('firebase-tools');

export const listProjects = () => {
  return firebase.list().catch(
    /* If list failed, then login and try again. */
    () => firebase.login().then(() => firebase.list()));
};
