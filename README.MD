To run the builder:
```sh
cd ng-deploy
npm install
npm start
```

In other terminal:

```sh
cd sample-app
npm install
npm link ../ng-deploy
ng add ng-deploy --project sample-app
npm i -g @angular-devkit/architect-cli@next
architect sample-app:deploy

## Or to test with the second app.
ng add ng-deploy --project second-app
architect second-app:deploy

```

or to debug 
```
node --inspect-brk $(which architect) sample-app:deploy
node --inspect-brk $(which ng) add ng-deploy --project sample-app
```
